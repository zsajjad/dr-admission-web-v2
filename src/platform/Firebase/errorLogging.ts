import { trackException } from '@/platform/Firebase/client';

let initialized = false;
let isEmitting = false;

function safeStringify(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value instanceof Error) return `${value.name}: ${value.message}\n${value.stack ?? ''}`.trim();
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function clamp(input: string, maxLen = 1000): string {
  if (input.length <= maxLen) return input;
  return `${input.slice(0, maxLen)}…`;
}

async function emitException(description: string, fatal = false): Promise<void> {
  if (isEmitting) return;
  isEmitting = true;
  try {
    await trackException(clamp(description), fatal);
  } finally {
    isEmitting = false;
  }
}

export function initFirebaseErrorLogging(): void {
  if (initialized) return;
  if (typeof window === 'undefined') return;
  initialized = true;

  const originalConsoleError = console.error.bind(console);
  console.error = (...args: unknown[]) => {
    try {
      void emitException(
        args
          .map((a) => safeStringify(a))
          .filter(Boolean)
          .join(' '),
        false,
      );
    } catch {
      // ignore
    }
    originalConsoleError(...args);
  };

  window.addEventListener('error', (event) => {
    const err = event.error as unknown;
    const description =
      err instanceof Error
        ? safeStringify(err)
        : `[window.error] ${event.message} (${event.filename}:${event.lineno}:${event.colno})`;
    void emitException(description, true);
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = (event as PromiseRejectionEvent).reason as unknown;
    const description = `[unhandledrejection] ${safeStringify(reason)}`;
    void emitException(description, true);
  });
}
