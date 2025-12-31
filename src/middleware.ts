import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAtMs: number;
  retryAfterSeconds?: number;
};

// NOTE: This is an in-memory, per-runtime-instance fixed-window rate limiter.
// It is effective for basic abuse protection but is NOT globally consistent across multiple instances.
const rateLimitStore: Map<string, { count: number; resetAtMs: number }> =
  // @ts-expect-error - store on global to preserve across hot reloads / module reloads
  (globalThis.__DR_RATE_LIMIT_STORE__ as Map<string, { count: number; resetAtMs: number }>) ?? new Map();

// @ts-expect-error - store on global to preserve across hot reloads / module reloads
globalThis.__DR_RATE_LIMIT_STORE__ = rateLimitStore;

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for can be a comma-separated list. Client IP is usually first.
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return 'unknown';
}

function rateLimitFixedWindow(opts: { key: string; limit: number; windowMs: number; nowMs: number }): RateLimitResult {
  const { key, limit, windowMs, nowMs } = opts;
  const existing = rateLimitStore.get(key);

  if (!existing || nowMs >= existing.resetAtMs) {
    const resetAtMs = nowMs + windowMs;
    rateLimitStore.set(key, { count: 1, resetAtMs });
    return {
      allowed: true,
      limit,
      remaining: Math.max(0, limit - 1),
      resetAtMs,
    };
  }

  const nextCount = existing.count + 1;
  existing.count = nextCount;
  rateLimitStore.set(key, existing);

  const remaining = Math.max(0, limit - nextCount);
  if (nextCount > limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAtMs - nowMs) / 1000));
    return {
      allowed: false,
      limit,
      remaining: 0,
      resetAtMs: existing.resetAtMs,
      retryAfterSeconds,
    };
  }

  return {
    allowed: true,
    limit,
    remaining,
    resetAtMs: existing.resetAtMs,
  };
}

function withRateLimitHeaders(
  response: NextResponse,
  info: Pick<RateLimitResult, 'limit' | 'remaining' | 'resetAtMs'>,
) {
  response.headers.set('X-RateLimit-Limit', String(info.limit));
  response.headers.set('X-RateLimit-Remaining', String(info.remaining));
  response.headers.set('X-RateLimit-Reset', String(Math.floor(info.resetAtMs / 1000)));
  return response;
}

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Skip rate limiting for static-ish endpoints (some are already excluded by matcher)
  const isSkippablePath =
    path.startsWith('/_next') || path === '/favicon.ico' || path === '/robots.txt' || path === '/sitemap.xml';

  // Apply rate limiting (Edge Middleware)
  if (!isSkippablePath) {
    const nowMs = Date.now();
    const ip = getClientIp(request);

    // Different limits for API vs pages; tune via env vars if needed.
    const isApi = path.startsWith('/api/');
    const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);
    const limit = isApi ? Number(process.env.RATE_LIMIT_API_MAX ?? 60) : Number(process.env.RATE_LIMIT_PAGE_MAX ?? 240);

    const bucketKey = `${ip}:${isApi ? 'api' : 'page'}`;
    const info = rateLimitFixedWindow({
      key: bucketKey,
      limit,
      windowMs,
      nowMs,
    });

    if (!info.allowed) {
      if (isApi) {
        const res = NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
        res.headers.set('Retry-After', String(info.retryAfterSeconds ?? 60));
        return withRateLimitHeaders(res, info);
      }

      const res = new NextResponse('Too Many Requests', { status: 429 });
      res.headers.set('Retry-After', String(info.retryAfterSeconds ?? 60));
      return withRateLimitHeaders(res, info);
    }
  }

  // This is a public-facing application (no login required).
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
