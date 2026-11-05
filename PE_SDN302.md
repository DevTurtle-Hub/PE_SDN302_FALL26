**Practical Exam**

**Subject: SDN302 | Semester: FALL 2026**

## **1\. Overview**

You will build ExpenseTrail, a small web app where each person tracks their own personal expenses: what was spent, how much, on which category, and when — with a few expenses starred as important, and a live summary of spending by category. The project will be built with: a Next.js project (App Router) that exposes its own REST API (Route Handlers), Prisma as the ORM, PostgreSQL hosted on Supabase as the database, your own email/password authentication, and a deployment on Vercel.

This exam describes what the app and its API must do, not how to code them. How you structure the code is up to you, as long as the routes, the visible texts, the data-testid names, and the API request/response shapes in this document are exactly as written — the API is graded by calling it directly, and the web pages are graded with an automated browser, so both must match this spec precisely.

## **2\. The application**

### **2.1 Setup**

*   A Next.js project (App Router, TypeScript) with Tailwind CSS and ShadCN UI (components.json in the project root, at least two ShadCN components actually used).
*   It must build with npm install followed by npm run build using only three environment variables: DATABASE\_URL, DIRECT\_URL and AUTH\_SECRET. No connection string or secret may be written directly in the code.
*   Your package.json build script must run Prisma's client generation before building, e.g. "build": "prisma generate && next build", so a fresh checkout builds without extra manual steps.
*   In your Supabase project: use its PostgreSQL database only (via Prisma). Create one test account for the grader by registering it through your own app's Register page or API before you submit — do not create it directly in Supabase's dashboard, since the grader logs in through your app, not through Supabase.
*   Run your migrations against that Supabase database before you submit (e.g. npx prisma migrate dev, or migrate deploy) and commit the prisma/migrations folder, so the live database already has the right tables when the grader tests your deployed app.

### **2.2 Data (Prisma + Supabase Postgres)**

Design your own Prisma schema in prisma/schema.prisma. Create at least two models, User and Expense, that store everything the app saves. It must have at least the fields below. The field names must be exactly as written (camelCase), because the grader reads and writes them through your API's JSON; you choose the Prisma types, defaults and indexes.

| **Model** | **Field** | **What it holds** |
| --- | --- | --- |
| User | id | a unique id for each user |
| User | email | the user's e-mail, unique |
| User | passwordHash | a bcrypt hash of the password — never the plain password |
| User | createdAt | when the account was created |
| Expense | id | a unique id for each expense |
| Expense | userId | the user the expense belongs to |
| Expense | title | what the expense was for |
| Expense | amount | how much was spent (a positive number, 2 decimal places) |
| Expense | category | one of Food, Transport, Bills, Shopping, Other |
| Expense | note | an optional note, empty by default |
| Expense | starred | true or false, false by default |
| Expense | spentAt | the date the expense happened |
| Expense | createdAt | when the row was added |

**Security rules (enforced in your API code, not only in the UI):**

*   Every /api/expenses\* route requires a valid, logged-in session. With no session, or an invalid/expired one, it returns 401 and touches no data.
*   A user may only read, add, change, or delete their own expenses. The server must derive the owner from the logged-in session — never from a userId or ownerId sent in the request body or query string. A request that sends someone else's id in the body must be ignored, not honored.
*   Build every Prisma query through its query builder (where, data, etc.) — never by concatenating raw SQL strings with user input.
*   Never commit a real DATABASE\_URL, DIRECT\_URL, or AUTH\_SECRET value to the repository, and never log passwords or password hashes.

### **2.3 Authentication**

Implement your own email/password authentication (no NextAuth.js or Supabase Auth required for this exam — a custom API is enough, implementing JWT with your own API). On successful login, your API must set a session as an HttpOnly cookie named session\_token so the grader's automated tests can log in once and reuse the same session for every later request, exactly like a browser would.

**Required auth endpoints:**

*   POST /api/auth/register — body { email, password, confirmPassword }. Creates a new User (password stored only as a bcrypt hash) and returns 201 with { id, email }. Does not log the user in.
*   POST /api/auth/login — body { email, password }. On success, sets the session\_token cookie (HttpOnly) and returns 200 with { id, email }. On a wrong password or unknown email, returns 401 with { error: "Invalid email or password" } and no cookie is set.
*   POST /api/auth/logout — clears the session\_token cookie and returns 200. A later call to GET /api/auth/me must then return 401.
*   GET /api/auth/me — returns 200 with { id, email } for the logged-in user, or 401 with { error: "Unauthorized" } if there is no valid session.

### **2.4 Expense API**

**Required expense endpoints, all requiring a valid session (see Security rules above):**

Every endpoint below returns one expense — or a list of them — shaped exactly like this (field names and types fixed; your own id format is fine):

| {<br>"id": "cls9f2q1e0000...",<br>"title": "Grab to campus",<br>"amount": 45000,<br>"category": "Transport",<br>"note": "Morning class",<br>"starred": false,<br>"spentAt": "2026-10-20",<br>"createdAt": "2026-10-20T08:15:00.000Z"<br>} |
| --- |

All error responses, from any endpoint in this document, are shaped the same way:

| { "error": "<exact message>" } |
| --- |

*   GET /api/expenses — returns only the current user's expenses as a JSON array of the Expense shape above, ordered by spentAt descending (most recent first); ties broken by title, alphabetically, case-insensitive. Accepts optional query parameters that filter the result: ?category= (one of the five categories), ?starred=true, and ?q= (matches title OR note, case-insensitive, surrounding spaces ignored). The parameters combine — every one that is given must match.
*   GET /api/expenses/summary — accepts the same optional category/starred/q query parameters as the list, and returns a summary computed only over the expenses that match them, shaped like this:

| {<br>"count": 5,<br>"starredCount": 2,<br>"totalAmount": 530000,<br>"breakdown": \[<br>{ "category": "Food", "count": 3, "total": 300000 },<br>{ "category": "Transport", "count": 2, "total": 230000 }<br>\]<br>} |
| --- |

*   breakdown has one entry per category present in the matching set, ordered by total amount descending; equal totals are ordered Food, then Transport, then Bills, then Shopping, then Other. With nothing matching, count/starredCount/totalAmount are 0 and breakdown is an empty array.
*   POST /api/expenses — body { title, amount, category, note?, spentAt }. On success returns 201 with the created expense (the shape above, including its id). Validation errors return 400 with the error shape above, using the exact messages from the table in section 2.5. A duplicate (same title, amount and spentAt already saved by this user) returns 409 with { "error": "Duplicate expense: an expense with the same title, amount and date already exists" }.
*   PATCH /api/expenses/:id — body is any subset of { title, amount, category, note, spentAt, starred }; used both for editing a field and for toggling the star. Returns 200 with the updated expense (the shape above). The same validation and duplicate rules as POST apply to any field being changed. An id that does not exist, or belongs to another user, returns 404 with { "error": "Expense not found" } — a user must never be able to tell, from the response, whether a given id exists for someone else.
*   DELETE /api/expenses/:id — deletes the expense if it belongs to the current user and returns 200 with { "success": true }. An id that does not exist, or belongs to another user, returns 404 with { "error": "Expense not found" }.

### **2.5 Pages and what they do**

**Home — / (public)**

*   A header with the app name and, when logged out, a Login button and a Register button. Below it a title (home-title, text ExpenseTrail) and a short description of the app, with at least three feature cards (for example "Track spending", "Sort into categories", "See where it goes").
*   When logged in the header instead shows the user's email, a link to the expenses page and a Logout button. After Logout the header is back to the logged-out version, and a later GET /api/auth/me returns 401.

**Register — /register and Login — /login**

*   Forms with your own messages, not the browser's (add noValidate); nothing is shown before the first submit; an error disappears when its field becomes valid. Register has email, password and confirm password; Login has email and password.
*   With valid input, Register calls POST /api/auth/register and shows form-success (text Registration successful). Login calls POST /api/auth/login and, on success, goes to /expenses. If the API returns an error (duplicate account, wrong password), its message is shown in error-auth.

| **Field** | **When** | **Exact error message** |
| --- | --- | --- |
| Email (both forms) | empty / not a valid e-mail | *   Email is required<br>*   Please enter a valid email address |
| Password (both forms) | empty / fewer than 6 characters (Register only) | *   Password is required<br>*   Password must be at least 6 characters |
| Confirm password (Register) | empty / different from password | *   Confirm password is required<br>*   Passwords do not match |

**Expenses — /expenses (protected)**

*   A visitor who is not logged in is sent to /login. While the app is still finding out whether someone is logged in, nothing from this page is shown (no flash of content, no wrong redirect). A logged-in person sees the page with expenses-page.

**A. Add an expense.**

*   A form (expense-form, noValidate) with: title, amount, category (a list with an empty first choice "Choose category", then Food, Transport, Bills, Shopping, Other), an optional note, and a date. Validation runs on submit; nothing is shown on first load; each message disappears when its field is valid.

| **Field** | **Rule** | **Exact error message** |
| --- | --- | --- |
| Title | empty or spaces only / longer than 80 characters | *   Title is required<br>*   Title must be at most 80 characters |
| Amount | empty or not a number / not a positive number | *   Amount is required<br>*   Amount must be a positive number |
| Category | nothing chosen / not one of the five categories | *   Please choose a category<br>*   Invalid category |
| Date | nothing chosen / a date after today | *   Date is required<br>*   Date cannot be in the future |

*   With valid input the expense is saved through POST /api/expenses, appears in the list at once without reloading the page, the form is cleared, and expense-success shows the text Expense added. If the API returns an error — for example a duplicate — show it in error-expense and do not add anything to the list.

**B. The list.**

*   All the user's expenses as returned by GET /api/expenses (most recent spentAt first, ties by title). Each expense (expense-item) shows its title, amount (formatted with 2 decimal places), category, date, a favorite/star toggle (a button that is "on" for starred expenses) and a Delete button. Toggling the star and Delete call PATCH and DELETE and the item updates at once; after a page refresh the list is exactly the same. When there is nothing to show, display expenses-empty with the text No expenses found instead of the list.

**C. Filters, search and summary.**

*   A category filter (All, or one of the five categories), a "starred only" checkbox, and a search box that keeps only expenses whose title or note contains the typed text (not case-sensitive, surrounding spaces ignored). They combine, and update the list immediately (no button to press) by calling GET /api/expenses and GET /api/expenses/summary again with the matching query parameters. A Clear button resets all three. When an expense stops matching because of a change (for example it is un-starred while "starred only" is on) it disappears from the list at once.
*   The summary always describes the expenses currently shown: expense-count (plain integer), starred-count (plain integer), total-amount (2 decimal places), and category-breakdown with one breakdown-row per category that appears — highest total first (ties: Food, then Transport, then Bills, then Shopping, then Other) — each row showing breakdown-name, breakdown-count and breakdown-total.

### **2.6 Shared state**

*   The expenses are loaded once after login and kept in React Context, so the form, the list, the filters and the summary all use the same data without passing it down as props. After logout (and when another person logs in) the previous person's expenses must disappear from memory and from the screen.

### **2.7 Look and feel**

*   At a phone width of 375 px there is no horizontal scrolling and the form and list are readable; at 1280 px the form and the summary can sit next to the list. Use Tailwind CSS and ShadCN UI (Button, Card, Input, Label … at least two used).

## **3\. Required test hooks (fixed names)**

The exam is graded with an automated browser test for the pages, and a direct HTTP test against your deployed API for section 2.4. Add data-testid="..." with exactly these values and use exactly these routes. Put the attribute on the element that holds the text (messages) or on the input itself.

| **Route** | **Element** | **data-testid** |
| --- | --- | --- |
| / and header | Login / Register buttons (logged out) | btn-login, btn-register |
| header (logged in) | User's e-mail, Logout button, link to /expenses | user-email, btn-logout, link-expenses |
| / | Title | home-title |
| /login | Form, inputs, submit | login-form, login-email, login-password, login-submit |
| /register | Form, inputs, submit | register-form, register-email, register-password, register-confirm-password, register-submit |
| /login, /register | Messages | error-email, error-password, error-confirm-password (Register only), error-auth, form-success (Register only) |
| /expenses | Page container | expenses-page |
| /expenses form | Form, inputs, submit | expense-form, input-title, input-amount, input-category, input-note, input-date, btn-add-expense |
| /expenses form | Messages | error-title, error-amount, error-category, error-date, error-expense, expense-success |
| /expenses list | Container, one row per expense, empty state | expense-list, expense-item, expenses-empty |
| inside expense-item | Parts of one expense | expense-title, expense-amount, expense-category, expense-date, btn-toggle-star (with aria-pressed="true" / "false"), btn-delete-expense |
| /expenses filters | Controls | filter-category (a select, empty value = All), filter-starred (a checkbox), search-input (text), btn-clear-filters |
| /expenses summary | Counts, breakdown | expense-count, starred-count, total-amount, category-breakdown (container), breakdown-row (one per category) containing breakdown-name, breakdown-count, breakdown-total |

_Only render an error or success element when there is a message to show. Texts are compared exactly (case-sensitive). API JSON bodies are compared exactly for the "error" key; extra keys in a success response are ignored._

## **4\. Submission**

Put two files in the same folder and submit that folder (both named with your student code):

*   QE123456.docx — one real Word file (.docx or .doc, not a PDF or a renamed file). Copy this template exactly and write each URL as plain visible text with https://:

| Student Code: QE123456<br>Full Name: Nguyen Van A<br>GitHub Repository URL: https://github.com/username/repo-name<br>Vercel Production URL: https://your-project.vercel.app<br>Test account email: grader.qe123456@example.com<br>Test account password: Test1234! |
| --- |

_Because grading calls your own deployed API, not Supabase directly, do NOT put your DATABASE\_URL, DIRECT\_URL, AUTH\_SECRET, or any Supabase password in the Word file — only set them in Vercel's Environment Variables._

*   QE123456.zip — your source code: package.json at the top level of the zip (not inside an extra folder), your lock file, app/ (or src/), components/, public/, components.json, prisma/schema.prisma, prisma/migrations/, and a .env.example that lists the three variable names without values. Do not include node\_modules, .next, .git, or any .env file with real values.
*   The GitHub repository must be public and contain the same code as the zip (the zip is what is graded). The Vercel link is the production domain (https://<project>.vercel.app) with "Vercel Authentication" turned off — not a dashboard link, a share link or a per-deployment link.
*   The test account must already exist (registered through your own app) and be able to log in. Log in with it once on your deployed site before you submit. The three environment variables must be set in Vercel and the latest code redeployed, with migrations already applied to the Supabase database it points to.

## **5\. Self-check before you submit**

*   Register with a new e-mail works at once; registering the same e-mail again shows the API's message in error-auth.
*   Logged out, opening /expenses sends you to /login; after logging in you land on /expenses, and the header shows your e-mail and Logout.
*   Submitting the empty expense form shows the title, amount, category and date messages; they are not visible when the page loads. A negative amount shows the amount message.
*   Adding an expense shows it at once in the list in the right position; refreshing keeps it; adding the same title+amount+date again shows error-expense and adds nothing.
*   The star toggles aria-pressed and stays after a refresh; with "starred only" on, un-starring an expense removes it from the list.
*   With five expenses in three categories: category filter, starred-only, search, count, starred count, total amount and breakdown change correctly; Clear resets all three.
*   Deleting an expense removes it, also after refreshing; logging in as a different account shows an empty list, not the first account's expenses.
*   Calling your deployed /api/expenses with no cookie returns 401; calling it with the test account's session returns only that account's expenses.
*   npm install && npm run build works in a fresh copy of the unzipped folder with only the three environment variables set.
*   The zip has no node\_modules, .next, .git or .env; the Word file follows the template; both files are named with your student code and are in the same folder.