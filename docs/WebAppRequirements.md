# DR Admissions Web

A Next.js web application for students and parents to submit admission applications to the educational workshop/institute. This is a **public-facing** application with no login required.

## Terminology

- **Session**: One admissions cycle (e.g., "2026 Intake")
- **Legacy record**: Last year's student/admission record that can be searched to prefill the new admission form
- **Branch**: A physical branch/campus that must be selected for the admission
- **Area**: A locality/zone within a branch (determines part of GR number)
- **GR Number**: Generated student identifier with format `[9221]-[GENDER]-[AREA_CODE]-[COUNTER]`
- **Class/Level**: Derived automatically from date of birth using a backend mapping table

---

## User Flow

### Step 1: Landing Page

Before starting the admission process, the user must complete a **CAPTCHA** challenge (bot protection).

Once CAPTCHA is successfully completed, user is asked: **"Did you participate in the previous year's admission process?"**

#### If No (New Applicant)

- Redirect to application form with no pre-filled data

#### If Yes (Returning Applicant)

User selects one of three legacy search options:

1. **Scan QR Code**
   - Opens QR code scanner page
   - On successful scan, calls legacy search API
   - Redirects to application form with encrypted GR number in query params

2. **Enter GR Number**
   - Opens GR number input page
   - On submission, calls legacy search API
   - Redirects to application form with encrypted GR number in query params

3. **Search by Phone Number**
   - Opens phone number input page
   - On submission, calls legacy search API
   - Shows list of matching students to select from
   - Redirects to application form with encrypted GR number in query params

> **Note**: Legacy records are searchable by: name, father/guardian name, phone number, school name, class, and GR number.

---

## Application Form

The form is pre-filled with legacy data if an encrypted GR number is present in query params.

### Form Sections

#### 1. Branch & Location (Required)

| Field  | Type     | Required | Notes                                                                                         |
| ------ | -------- | -------- | --------------------------------------------------------------------------------------------- |
| Branch | Dropdown | Yes      | Select from available branches                                                                |
| Area   | Dropdown | Yes      | Filtered by selected branch; determines AREA_CODE in GR number; also used to filter Van Stops |

#### 2. Personal Information

| Field                | Type                | Required    | Editable (Pre-filled) | Notes                             |
| -------------------- | ------------------- | ----------- | --------------------- | --------------------------------- |
| Student Full Name    | Text                | Yes         | Yes                   | Normalized for search             |
| Father/Guardian Name | Text                | Yes         | Yes                   | Normalized for search             |
| Date of Birth        | Date Picker         | Yes         | **No**                | Used to derive class/level        |
| Gender               | Radio (Male/Female) | Yes         | **No**                | Required for GR number generation |
| B-Form/CNIC Number   | Text                | Recommended | Yes                   | As text, optional but recommended |

#### 3. Contact Information

| Field           | Type | Required | Editable (Pre-filled) | Notes                       |
| --------------- | ---- | -------- | --------------------- | --------------------------- |
| Phone Number    | Text | Yes      | **No**                | Primary contact, normalized |
| Alternate Phone | Text | No       | Yes                   | Optional secondary contact  |

#### 4. Address Information

| Field         | Type     | Required | Notes                    |
| ------------- | -------- | -------- | ------------------------ |
| Address       | Textarea | Yes      | Free-text address        |
| Locality/City | Text     | No       | Optional locality fields |

#### 5. Education Information

| Field                        | Type         | Required    | Notes                                                         |
| ---------------------------- | ------------ | ----------- | ------------------------------------------------------------- |
| Is School going to continue? | Yes/No       | Yes         | Controls whether School Class is shown                        |
| School Class                 | Dropdown     | Conditional | Shown + required only if “Is School going to continue?” = Yes |
| Last Year Class              | Dropdown     | No          | Class in previous admission cycle                             |
| School Name                  | Autocomplete | Yes         | Can add new school if not in list                             |

#### 6. Additional Flags

| Field        | Type     | Required    | Notes                                                                                       |
| ------------ | -------- | ----------- | ------------------------------------------------------------------------------------------- |
| Van Required | Yes/No   | Yes         | If yes, van stop becomes required                                                           |
| Van Stop     | Dropdown | Conditional | Required if Van Required = Yes; **options are filtered by selected Area**; hidden otherwise |
| Married      | Yes/No   | No          | Optional flag                                                                               |
| Working      | Yes/No   | No          | Optional flag                                                                               |

#### 7. Documents

| Field          | Type        | Required | Editable (Pre-filled) | Notes                               |
| -------------- | ----------- | -------- | --------------------- | ----------------------------------- |
| Identity Proof | File Upload | Yes\*    | **No**                | B-Form/Birth Certificate/CNIC image |
| Student Photo  | File Upload | No       | Yes                   | Optional student photograph         |

> \*Identity Proof is required for new applications. For pre-filled forms (legacy), document is already on record.

#### 8. Previous Participation (Read-only for Pre-filled)

| Field                               | Type     | Required    | Editable (Pre-filled) | Notes                           |
| ----------------------------------- | -------- | ----------- | --------------------- | ------------------------------- |
| Participated in previous admission? | Yes/No   | Yes         | **No**                | Auto-set based on legacy lookup |
| Previous participation class        | Dropdown | Conditional | **No**                | Only if participated = Yes      |

---

## Validation Rules

### Required Fields

- Branch, Area, Student Name, Father/Guardian Name, Date of Birth, Gender
- Phone Number, Address, School Name
- Van Required flag
- Identity Proof document (for new applications only)

### Conditional Requirements

- **Van Stop**: Required if Van Required = Yes; must be empty/ignored if Van Required = No. Van Stop selection requires Area (since stops are area-specific).
- **School Class**: Required if “Is School going to continue?” = Yes; hidden/omitted if No
- **Previous participation class**: Required if Participated in previous admission = Yes

### Data Normalization

- Names are normalized (trimmed, standardized casing) to improve search accuracy
- Phone numbers are normalized to a consistent format

### Input Language (English Only)

- All user-editable text inputs must be filled in **English** only.
- The UI must **reject non-English characters** (e.g., Urdu/Arabic script) in these fields and show a clear validation message.
- Applies to (at minimum): **Student Full Name**, **Father/Guardian Name**, **Address**, **Locality/City**, **School Name** (when adding a new school), and any other free-text fields.
- Allowed characters:
  - Letters: **A–Z / a–z**
  - Digits: **0–9** (e.g., phone numbers, B-Form/CNIC)
  - Common separators/punctuation: spaces, `-`, `.`, `,`, `/`, `(`, `)`

### Duplicate Detection

- On submit, system checks for potential duplicates using: same phone + name + DOB
- If potential duplicate found, user is warned but can proceed

---

## Submission

### On Successful Submit

1. Application is created with status:
   - `VERIFIED` — if legacy record was already verified
   - `UNVERIFIED` — for all other cases (new or unverified legacy)

2. For legacy applications: **Same GR number is retained**

3. For new applications: **GR number is generated by backend**

4. User is redirected to **Success Page** displaying:
   - Confirmation message
   - Generated/retained GR Number
   - Summary of submitted application
   - Instructions for next steps (fee payment, etc.)

### Error Handling

- Display clear validation errors inline
- Network errors show retry option
- Rate limiting errors show appropriate message

---

## Security Considerations

- **Rate Limiting (Next.js Middleware)**: Rate limiting is enforced at the Next.js layer (Edge `middleware`) to reduce abuse before requests hit backend services. Requests that exceed limits return **HTTP 429** with `Retry-After` and `X-RateLimit-*` headers.
- **CAPTCHA (Required)**: User must pass CAPTCHA **before starting** the admission process (before legacy search or application form). The frontend should include the captcha token with requests to public endpoints as required by the backend.
- **Document Security**: Uploaded documents are stored securely, not publicly accessible
- **No Authentication**: This is a public form; no login required

---

## Accessibility (UI)

The public admission UI must be accessible and usable for keyboard-only users and screen reader users. Target **WCAG 2.1 AA** as the baseline.

### Core Requirements

- **Keyboard navigation**:
  - All interactive elements must be reachable and operable via keyboard (Tab/Shift+Tab/Enter/Space/Arrow keys where relevant).
  - Visible focus indicator must be present and not removed.
- **Labels and instructions**:
  - Every input (including selects/autocomplete, date picker, file uploads) must have a programmatic label.
  - Required/conditional requirements (e.g., Van Stop, School Class) must be announced clearly in helper text and validation messages.
- **Validation and errors**:
  - Errors must be shown inline and in a summary region that is screen-reader discoverable (e.g., `aria-live`).
  - Error messages must be specific (what is wrong + how to fix) and tied to the field.
- **Color and contrast**:
  - Do not rely on color alone to convey state (required, error, disabled).
  - Text and UI controls must meet WCAG AA contrast requirements.
- **Focus management**:
  - On route changes / step transitions, move focus to the page title or first actionable element.
  - After submit with errors, move focus to the error summary (and allow quick navigation to fields).
- **CAPTCHA accessibility**:
  - CAPTCHA step must provide an accessible flow (keyboard operable, screen reader compatible, and/or an accessible alternative per the chosen provider).
- **Language & direction**:
  - App must set correct `lang` attribute for the document.
  - If Urdu/RTL UI is supported, ensure direction (`dir`) changes do not break layout, focus order, or screen reader reading order.
- **Motion**:
  - Respect `prefers-reduced-motion` for animations (especially Lottie).

---

## Technical Notes

### Frontend Implementation Guidelines

- **Generated API hooks (required)**:
  - All API hooks/functions are **generated** under `src/providers/` (see `src/providers/service/*`) and **must be used** for data fetching/mutations (React Query).
  - Do not hand-roll new API clients for admissions flows unless the OpenAPI spec is missing an endpoint (in that case, update spec + re-generate).
- **Forms (required)**:
  - Use **Formik** for form state management and submission.
  - Use **Yup** for validation schemas (including conditional rules like Van Stop / School Class and English-only input constraints).
- **UI components (required)**:
  - Use **MUI** inputs/components for all form controls (TextField, Select, Autocomplete, Date Picker, RadioGroup, etc.).
  - Wire errors/accessibility correctly: set `error`, `helperText`, and ensure label associations align with the Accessibility section.

### API Hooks Required

| Hook                 | Purpose                                                                             |
| -------------------- | ----------------------------------------------------------------------------------- |
| `useGetBranches`     | Fetch available branches                                                            |
| `useGetAreas`        | Fetch areas filtered by branch                                                      |
| `useGetSchools`      | Fetch/search schools for autocomplete                                               |
| `useGetVanStops`     | Fetch van stops **filtered by Area** (and implicitly by Branch via the chosen Area) |
| `useLegacySearch`    | Search legacy records by GR/phone/name                                              |
| `useSubmitAdmission` | Submit new admission application                                                    |

### Form State

- Use query params to pass encrypted GR number between pages
- Pre-filled fields from legacy data should be clearly indicated in UI
- Non-editable fields should be visually distinct (disabled/read-only styling)
- If the user changes **Branch** or **Area**, dependent selections must be reset (e.g., **Van Stop** should be cleared and re-selected for the new Area).

### Class Derivation

- Class/level is **not** selected by user for admission grouping
- Backend derives class from date of birth using a configured mapping table
- The derived class is used for fee-day counts, question-set selection, and attendance grouping

---

## Out of Scope

This web app handles **public admission submission only**. The following are handled by other applications:

- Admin verification and approval
- Fee collection and payment marking
- Teacher interactions and assessments
- Attendance tracking
- Dashboard and reporting
- Student self-service portal
