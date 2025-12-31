# DR Core Service — Product Requirements (Draft)

Backend service for a small educational workshop/institute to manage **admissions**, **fee collection**, **teacher interactions**, and **attendance**.

## Terminology & Assumptions

- **Session**: one admissions + teaching cycle (e.g., “2026 Intake”). Attendance runs for a fixed length per session (default **20 days**, configurable).
- **Class/Level**: derived from **date of birth** using a configurable mapping table (see “Class Derivation”).
- **Legacy record**: last year’s student/admission record that can be searched to prefill the new admission form.
- **Branch**: a physical branch/campus selected by the frontend and stored on the admission/student.
- **GR Number**: a generated student identifier with a fixed format (see “GR Number”).

## Goals

- **Streamline admissions**: capture accurate student data, reduce duplicates, and support admin verification.
- **Make fee day fast**: quick search and quick “fee paid” confirmation.
- **Enable teacher assessment**: consistent question sets per class and structured rating storage.
- **Track attendance**: daily marking for a fixed session (default **20 days**) and admin reporting.

## Users & Roles

- **Student/Guardian (public)**: submits admission form (no login assumed).
- **Admin**: verifies admissions, manages payments, views dashboards/reports, manages teachers/classes/stops/questions (as configured).
- **Teacher**: scans/looks up student, conducts interaction, records ratings, marks attendance.

## Core Entities (conceptual)

- **Student**: admission record (demographics + contact + documents).
- **Admission**: lifecycle/status of a student’s application for a given session/year.
- **Interaction**: teacher session for a student with question-wise ratings.
- **Attendance**: daily presence/absence for a student in a class for the session.
- **Reference data**: branches, areas, classes/levels, schools, van stops, question bank, session calendar.

## Admissions (Functional Requirements)

- **Legacy prefill (last year data)**:
  - Frontend can search a **last-year table** and select an existing record to prefill the admission form.
  - When an admission is submitted **with a legacy record reference**, the backend must:
    - Copy/persist the submitted values as the new admission/student record (source-of-truth becomes the new record).
    - Set admission status to `VERIFIED` **iff** the legacy record was verified; otherwise create as `UNVERIFIED`.
    - **Keep the same GR Number** as the legacy record.
  - Legacy records must be searchable from the frontend by the same fields as fee-day search (name, father/guardian, phone, school, class) plus GR number where available.

- **Final registration (admin edit + confirm)**:
  - Admin must be able to search **current-year admissions** by:
    - **GR Number** (exact match)
    - **Other parameters** (any combination): name, father/guardian name, phone number, school name, class
  - Admin can open a record and see:
    - all captured fields (filled/unfilled), and whether the record is `VERIFIED` or not
    - uploaded documents (view + replace/re-upload)
  - Admin can edit any field before confirming.
  - Admin can mark **Fee paid** (`isFeePaid` boolean).
  - Backend must reject confirmation if required fields are missing (frontend may also block earlier).
  - All edits and fee-paid changes must be audited.
  - **Slip print / reprint**: handled by frontend (backend only needs to provide the final record data and fee-paid status).

- **Admission form (public)** must capture:
  - **Identity**: student full name, father/guardian name, date of birth
  - **Identity (optional but recommended)**: B-Form/CNIC number (as text), if available
  - **Branch**: branch id/code provided by the frontend (required)
  - **Area**: area id/code selected by the frontend from a dropdown (required; must belong to selected branch)
  - **Gender**: required for GR number generation (Female/Male)
  - **Contact**: phone number (required), optional alternate phone
  - **Address**: free-text address + optional locality fields (city/area)
  - **Education**: current class, last year class, school name
  - **Flags**: van required (boolean), married (boolean), working (boolean)
  - **Van details**: van stop (required if van required is true)
  - **Documents**: identity proof image upload (required), optional student photo
- **Validation rules**:
  - Exactly-one / conditional requirements (e.g., van stop required if van required).
  - Normalize names and phone numbers to improve search.
  - Duplicate detection suggestion on submit (e.g., same phone + name + DOB).
- **Admission status**:
  - `UNVERIFIED` (default on submit)
  - `VERIFIED` (set by admin)
  - Optional: `REJECTED` (with reason), `DUPLICATE_MERGED`
- **Admin verification**:
  - Admin can review submission, documents, and mark as verified/rejected.
  - All verification actions must be **audited** (who/when/what changed).
- **Acceptance criteria (minimum)**:
  - A new submission is created as `UNVERIFIED`.
  - If `vanRequired=true`, then `vanStop` is required; if `vanRequired=false`, `vanStop` must be empty/ignored.
  - Document uploads are stored securely and are not publicly accessible by default.
  - If the submission references a legacy record that is verified, the new admission is created as `VERIFIED`.
  - The submitted `branch` must exist in the branches reference table.
  - The submitted `area` must exist in the areas reference table and be associated with the selected branch.

## Fee Collection (Functional Requirements)

- **Student search (admin)** on fee day must support searching by:
  - name, father/guardian name, phone number, school name, class
  - optional national id / B-Form number if captured
- **Fee paid workflow**:
  - Select student/admission → mark **Fee paid** (`isFeePaid=true`).
  - Optional: store `feePaidAt` and `feePaidByAdminId` for traceability.
- **Fee-day dashboard**:
  - Show counts of verified vs paid per class/level.
  - Class derivation rule must be explicit (see “Class Derivation” below).
- **Acceptance criteria (minimum)**:
  - Marking fee paid is **idempotent** (retries do not create duplicates / double effects).

## Interaction Session (Teacher Assessment) (Functional Requirements)

- After payment, student proceeds to interaction.
- **Teacher view**:
  - Lookup student by searching using GR number or student/admission info.
  - System determines student’s **class/level** and loads a predefined **question set**.
- **Interaction capture**:
  - Each question gets a rating (define scale; e.g., 1–5) + optional notes.
  - Interaction record stores teacher id, timestamp, and computed summary.
- **Student report** generation must include:
  - Question-wise rating table
  - Overall improvement areas (derived rules must be defined; e.g., lowest 3 categories)
  - Optional: printable PDF / shareable link (if needed)
- **Acceptance criteria (minimum)**:
  - A teacher cannot submit an interaction unless a payment exists for the admission (unless explicitly configured otherwise).
  - The question set shown is deterministic for the derived class/level and session.

## Attendance (Functional Requirements)

- Attendance is tracked for a fixed session length (default **20 days**, configurable).
- **Teacher attendance marking**:
  - Mark per class per day: present/absent (optionally late/excused).
  - Prevent duplicate entries for the same student/day.
- **Admin reporting**:
  - Daily summary: present count, absent count, percentage per class.
  - Student history: attendance calendar for the session.
- **Acceptance criteria (minimum)**:
  - A student has at most one attendance record per day per session.
  - Admin can view attendance without being able to alter teacher-submitted records (unless explicitly allowed).

## Class Derivation (Rule Requirement)

- Class/level is derived from date-of-birth by application code at admission creation time.
- The derived class/level is stored on the admission record and used as the single source of truth for:
  - fee-day counts
  - question-set selection
  - attendance grouping

## GR Number

- Each student has a **GR number** with format:
  - `[9221]-[GENDER_BASED]-[AREA_CODE]-[COUNTER]`
  - `GENDER_BASED`: `0` for Female, `1` for Male
  - `AREA_CODE`: populated from an **areas** reference table
  - `COUNTER`: incrementing counter, **minimum 6 digits** (left-padded with zeros if needed)
- **Rules**:
  - For records coming from last year’s table, **keep the same GR number**.
  - For new records (no legacy reference), backend generates the GR number at creation time.
  - GR number must be **unique** across the system.
- **Counter rule**:
  - `COUNTER` is a **global** incrementing counter across all admissions (not per branch/area).
  - Counter is stored as an integer but rendered as **6+ digits** (zero-padded to at least 6).
- **Area rule**:
  - `AREA_CODE` comes from the selected area (chosen explicitly on the frontend).
  - Areas are associated with a branch; backend must validate `area.branchId === admission.branchId`.

## Permissions & Audit (Non-negotiable)

- **Role-based access control**:
  - Public endpoints only for admission submission + status checks (if enabled).
  - Admin endpoints for verification, payments, dashboards, management.
  - Teacher endpoints for interactions and attendance.
- **Audit**:
  - No separate audit-log table is required; rely on standard application logs if needed.

## Non-Functional Requirements

- **Performance**: fee-day search must return results quickly (target p95 < 50ms on typical dataset).
- **Performance measurement**: define dataset size + environment for the 50ms target (e.g., p95 on indexed fields with warm cache).
- **Reliability**: prevent double-updates when marking `isFeePaid` (idempotency).
- **Security**:
  - Protect documents (signed URLs or authenticated download).
  - Rate limit public admission submission; optional CAPTCHA.
- **Observability**: structured logs for key workflows; error tracking for failed uploads/payment marking.

## Out of Scope (for now)

- Online payment gateway integration (unless explicitly required).
- Student self-service portal / login.
- SMS/WhatsApp notifications (can be added later).

## Open Questions (to finalize before build-out)

- What is the **rating scale** and the exact question model (per class, per subject/category)?
- What exact **fee amount(s)** exist (single fee vs by class; discounts; siblings)?
- Do we need **refunds/voids** and strict accounting exports?
- What is the required **search tolerance** (Urdu/English spellings, fuzzy search)?
- Are teacher accounts managed by admin, and do teachers need per-class assignment?
- What is the exact **DOB → class** mapping table for the first launch (ranges + labels)?
