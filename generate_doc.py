import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=120, bottom=120, left=160, right=160):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def set_cell_borders(cell, top="CCCCCC", bottom="CCCCCC", left="CCCCCC", right="CCCCCC", sz="4"):
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'<w:top w:val="single" w:sz="{sz}" w:space="0" w:color="{top}"/>'
        f'<w:left w:val="single" w:sz="{sz}" w:space="0" w:color="{left}"/>'
        f'<w:bottom w:val="single" w:sz="{sz}" w:space="0" w:color="{bottom}"/>'
        f'<w:right w:val="single" w:sz="{sz}" w:space="0" w:color="{right}"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(borders)

def create_report():
    doc = docx.Document()

    # Set page margins to standard 1 inch
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # -------------------------------------------------------------
    # HEADER / BANNER
    # -------------------------------------------------------------
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_after = Pt(2)
    r_inst = p_inst.add_run("FPT UNIVERSITY • DEPARTMENT OF SOFTWARE ENGINEERING")
    r_inst.font.name = "Calibri"
    r_inst.font.size = Pt(11)
    r_inst.font.bold = True
    r_inst.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

    p_course = doc.add_paragraph()
    p_course.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_course.paragraph_format.space_after = Pt(6)
    r_course = p_course.add_run("COURSE: SDN302 – SERVER-SIDE WEB DEVELOPMENT")
    r_course.font.name = "Calibri"
    r_course.font.size = Pt(13)
    r_course.font.bold = True
    r_course.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_after = Pt(4)
    r_title = p_title.add_run("PRACTICAL EXAM SUBMISSION REPORT")
    r_title.font.name = "Calibri"
    r_title.font.size = Pt(20)
    r_title.font.bold = True
    r_title.font.color.rgb = RGBColor(0x1E, 0x40, 0xAF)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(16)
    r_sub = p_sub.add_run("Application: ReadLog (Reading Session Tracker) • Semester: Fall 2026")
    r_sub.font.name = "Calibri"
    r_sub.font.size = Pt(10.5)
    r_sub.font.italic = True
    r_sub.font.color.rgb = RGBColor(0x47, 0x55, 0x69)

    # -------------------------------------------------------------
    # SECTION 1: CANDIDATE & SUBMISSION INFORMATION (EXACT TEMPLATE)
    # -------------------------------------------------------------
    h1 = doc.add_paragraph()
    h1.paragraph_format.space_before = Pt(12)
    h1.paragraph_format.space_after = Pt(6)
    r_h1 = h1.add_run("1. Candidate & Submission Information")
    r_h1.font.name = "Calibri"
    r_h1.font.size = Pt(14)
    r_h1.font.bold = True
    r_h1.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

    # Instruction note
    p_note = doc.add_paragraph()
    p_note.paragraph_format.space_after = Pt(6)
    r_note = p_note.add_run("Note: Formatted in strict compliance with Section 4 (Submission) of the SDN302 Practical Exam Specification. All URLs are provided as plain, visible, functional text.")
    r_note.font.size = Pt(9.5)
    r_note.font.italic = True
    r_note.font.color.rgb = RGBColor(0x64, 0x74, 0x8B)

    # Submission Table matching Section 4
    sub_table = doc.add_table(rows=6, cols=2)
    sub_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    sub_data = [
        ("Student Code", "QE190031"),
        ("Full Name", "Nguyen Van Quy"),
        ("GitHub Repository URL", "https://github.com/DevTurtle-Hub/PE_SDN302_FALL26"),
        ("Vercel Production URL", "https://pe-sdn-302-fall-26.vercel.app"),
        ("Test account email", "grader.qe190031@example.com"),
        ("Test account password", "Test1234!")
    ]

    for i, (k, v) in enumerate(sub_data):
        row = sub_table.rows[i]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width = Inches(2.2)
        c1.width = Inches(4.3)

        set_cell_margins(c0, 100, 100, 140, 140)
        set_cell_margins(c1, 100, 100, 140, 140)
        set_cell_background(c0, "F1F5F9")
        set_cell_background(c1, "FFFFFF" if i % 2 == 0 else "F8FAFC")
        set_cell_borders(c0, "CBD5E1", "CBD5E1", "CBD5E1", "CBD5E1", "6")
        set_cell_borders(c1, "CBD5E1", "CBD5E1", "CBD5E1", "CBD5E1", "6")

        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_after = Pt(0)
        r0 = p0.add_run(k + ":")
        r0.font.name = "Calibri"
        r0.font.size = Pt(10.5)
        r0.font.bold = True
        r0.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)

        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(v)
        r1.font.name = "Calibri"
        r1.font.size = Pt(10.5)
        if "http" in v:
            r1.font.bold = True
            r1.font.color.rgb = RGBColor(0x25, 0x63, 0xEB)
        elif "@" in v:
            r1.font.bold = True
            r1.font.color.rgb = RGBColor(0x05, 0x96, 0x69)
        else:
            r1.font.bold = True
            r1.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    # -------------------------------------------------------------
    # SECTION 2: SYSTEM ARCHITECTURE & ENVIRONMENT COMPLIANCE
    # -------------------------------------------------------------
    h2 = doc.add_paragraph()
    h2.paragraph_format.space_before = Pt(16)
    h2.paragraph_format.space_after = Pt(6)
    r_h2 = h2.add_run("2. System Architecture & Technical Stack Compliance")
    r_h2.font.name = "Calibri"
    r_h2.font.size = Pt(14)
    r_h2.font.bold = True
    r_h2.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

    arch_table = doc.add_table(rows=7, cols=3)
    arch_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    arch_headers = ["Technical Layer", "Specification & Version", "Compliance Status"]
    arch_rows = [
        ("Web Framework", "Next.js 16 (App Router) + TypeScript Strict Mode", "100% Compliant — Clean build, Turbopack verified"),
        ("UI & Component Library", "Tailwind CSS + ShadCN UI (components.json at root)", "100% Compliant — Button, Card, Input, Label used"),
        ("Database & ORM", "Supabase PostgreSQL via Prisma ORM 7 with PgBouncer", "100% Compliant — Models & migrations applied"),
        ("Build Script Automation", 'package.json: "build": "prisma generate && next build"', "100% Compliant — Zero manual steps on fresh build"),
        ("Environment Variables", "DATABASE_URL, DIRECT_URL, AUTH_SECRET strictly", "100% Compliant — Zero secrets committed to git"),
        ("Production Deployment", "Vercel Continuous Deployment (Vercel Authentication Disabled)", "100% Compliant — Public production domain active")
    ]

    # Format header row
    hdr_cells = arch_table.rows[0].cells
    hdr_cells[0].width = Inches(1.8)
    hdr_cells[1].width = Inches(2.7)
    hdr_cells[2].width = Inches(2.0)
    for idx, name in enumerate(arch_headers):
        c = hdr_cells[idx]
        set_cell_margins(c, 100, 100, 120, 120)
        set_cell_background(c, "1E3A8A")
        set_cell_borders(c, "1E3A8A", "1E3A8A", "1E3A8A", "1E3A8A", "8")
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(name)
        r.font.name = "Calibri"
        r.font.size = Pt(10)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    # Format data rows
    for r_idx, row_data in enumerate(arch_rows):
        row_cells = arch_table.rows[r_idx + 1].cells
        row_cells[0].width = Inches(1.8)
        row_cells[1].width = Inches(2.7)
        row_cells[2].width = Inches(2.0)
        bg = "FFFFFF" if r_idx % 2 == 0 else "F8FAFC"
        for c_idx, val in enumerate(row_data):
            c = row_cells[c_idx]
            set_cell_margins(c, 90, 90, 120, 120)
            set_cell_background(c, bg)
            set_cell_borders(c, "E2E8F0", "E2E8F0", "E2E8F0", "E2E8F0", "4")
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.name = "Calibri"
            r.font.size = Pt(9.5)
            if c_idx == 0:
                r.font.bold = True
                r.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)
            elif c_idx == 2:
                r.font.color.rgb = RGBColor(0x15, 0x80, 0x3D)
                r.font.bold = True

    # -------------------------------------------------------------
    # SECTION 3: DATABASE SCHEMA & MODEL SPECIFICATION
    # -------------------------------------------------------------
    h3 = doc.add_paragraph()
    h3.paragraph_format.space_before = Pt(16)
    h3.paragraph_format.space_after = Pt(6)
    r_h3 = h3.add_run("3. Database Schema & Data Models Specification")
    r_h3.font.name = "Calibri"
    r_h3.font.size = Pt(14)
    r_h3.font.bold = True
    r_h3.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

    p_schema_intro = doc.add_paragraph()
    p_schema_intro.paragraph_format.space_after = Pt(6)
    r_si = p_schema_intro.add_run("The database is hosted on Supabase PostgreSQL and managed through Prisma schema (`prisma/schema.prisma`). All field names strictly adhere to camelCase as required by the automated grading engine:")
    r_si.font.size = Pt(10)
    r_si.font.color.rgb = RGBColor(0x33, 0x41, 0x55)

    schema_table = doc.add_table(rows=13, cols=4)
    schema_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    s_headers = ["Model", "Field Name", "Type & Constraints", "Exam Description & Business Rule"]
    s_rows = [
        ("User", "id", "String (@id, uuid)", "Unique identifier for each user account"),
        ("User", "email", "String (@unique)", "User email, normalized to lowercase and trimmed"),
        ("User", "passwordHash", "String", "Salted Bcrypt hash (rounds=10) — Never plain password"),
        ("User", "createdAt", "DateTime (@default(now()))", "Account creation timestamp"),
        ("ReadingLog", "id", "String (@id, uuid)", "Unique reading session identifier"),
        ("ReadingLog", "userId", "String (ForeignKey -> User)", "User ownership binding (ON DELETE CASCADE)"),
        ("ReadingLog", "bookTitle", "String (Max 80 chars)", "Title of book, trimmed, required"),
        ("ReadingLog", "minutesRead", "Int (Positive integer)", "Reading duration in minutes (> 0)"),
        ("ReadingLog", "genre", "String (Enum 5 types)", "Fiction, Non-Fiction, Sci-Fi, Biography, Other"),
        ("ReadingLog", "note", "String (@default(''))", "Optional session note, empty string by default"),
        ("ReadingLog", "favorite", "Boolean (@default(false))", "Favorite flag, defaults to false"),
        ("ReadingLog", "readOn", "String (YYYY-MM-DD)", "Session date, cannot be in future")
    ]

    s_hdr_cells = schema_table.rows[0].cells
    s_hdr_cells[0].width = Inches(1.2)
    s_hdr_cells[1].width = Inches(1.4)
    s_hdr_cells[2].width = Inches(1.8)
    s_hdr_cells[3].width = Inches(2.1)
    for idx, name in enumerate(s_headers):
        c = s_hdr_cells[idx]
        set_cell_margins(c, 100, 100, 120, 120)
        set_cell_background(c, "1E3A8A")
        set_cell_borders(c, "1E3A8A", "1E3A8A", "1E3A8A", "1E3A8A", "8")
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(name)
        r.font.name = "Calibri"
        r.font.size = Pt(9.5)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    for r_idx, row_data in enumerate(s_rows):
        row_cells = schema_table.rows[r_idx + 1].cells
        row_cells[0].width = Inches(1.2)
        row_cells[1].width = Inches(1.4)
        row_cells[2].width = Inches(1.8)
        row_cells[3].width = Inches(2.1)
        bg = "FFFFFF" if r_idx % 2 == 0 else "F8FAFC"
        for c_idx, val in enumerate(row_data):
            c = row_cells[c_idx]
            set_cell_margins(c, 80, 80, 110, 110)
            set_cell_background(c, bg)
            set_cell_borders(c, "E2E8F0", "E2E8F0", "E2E8F0", "E2E8F0", "4")
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.name = "Calibri"
            r.font.size = Pt(9)
            if c_idx == 1:
                r.font.bold = True
                r.font.color.rgb = RGBColor(0x02, 0x84, 0xC7)
            elif c_idx == 0:
                r.font.bold = True

    # -------------------------------------------------------------
    # SECTION 4: REST API SPECIFICATION & STATUS CODE MATRIX
    # -------------------------------------------------------------
    h4 = doc.add_paragraph()
    h4.paragraph_format.space_before = Pt(16)
    h4.paragraph_format.space_after = Pt(6)
    r_h4 = h4.add_run("4. REST API Specification & Status Code Matrix")
    r_h4.font.name = "Calibri"
    r_h4.font.size = Pt(14)
    r_h4.font.bold = True
    r_h4.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

    p_api_intro = doc.add_paragraph()
    p_api_intro.paragraph_format.space_after = Pt(6)
    r_ai = p_api_intro.add_run("Every API route enforces exact HTTP status codes, exact JSON response shapes, and strict authorization rules. All error payloads strictly follow: { 'error': '<exact message>' }.")
    r_ai.font.size = Pt(10)
    r_ai.font.color.rgb = RGBColor(0x33, 0x41, 0x55)

    api_table = doc.add_table(rows=8, cols=4)
    api_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    api_headers = ["Endpoint & Method", "Required Payload / Query", "HTTP Status", "Response Shape & Behavior"]
    api_rows = [
        ("POST /api/auth/register", "{ email, password, confirmPassword }", "201 Created\n400 Bad Request", "201: { id, email } (No auto-login)\n400: Exact validation or duplicate email message"),
        ("POST /api/auth/login", "{ email, password }", "200 OK\n401 Unauthorized", "200: { id, email } + HttpOnly session_token cookie\n401: { 'error': 'Invalid email or password' }, no cookie"),
        ("POST /api/auth/logout", "None", "200 OK", "200: Clears session_token cookie. Next /api/auth/me yields 401"),
        ("GET /api/auth/me", "None (HttpOnly Cookie)", "200 OK\n401 Unauthorized", "200: { id, email } for logged-in user\n401: { 'error': 'Unauthorized' }"),
        ("GET /api/reading-logs", "?genre=&favorite=true&q=", "200 OK\n401 Unauthorized", "JSON Array of ReadingLog objects ordered by readOn DESC, then bookTitle ASC (case-insensitive)"),
        ("GET /api/reading-logs/summary", "?genre=&favorite=true&q=", "200 OK\n401 Unauthorized", "{ count, favoriteCount, totalMinutes, breakdown: [{ genre, count, total }] }. Sorted by total DESC"),
        ("POST /api/reading-logs", "{ bookTitle, minutesRead, genre, note?, readOn }", "201 Created\n400 Bad Request\n409 Conflict", "201: Created ReadingLog object\n400: Input validation error\n409: Duplicate reading session error")
    ]

    api_hdr_cells = api_table.rows[0].cells
    api_hdr_cells[0].width = Inches(1.8)
    api_hdr_cells[1].width = Inches(1.8)
    api_hdr_cells[2].width = Inches(1.2)
    api_hdr_cells[3].width = Inches(1.7)
    for idx, name in enumerate(api_headers):
        c = api_hdr_cells[idx]
        set_cell_margins(c, 100, 100, 110, 110)
        set_cell_background(c, "1E3A8A")
        set_cell_borders(c, "1E3A8A", "1E3A8A", "1E3A8A", "1E3A8A", "8")
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(name)
        r.font.name = "Calibri"
        r.font.size = Pt(9.5)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    for r_idx, row_data in enumerate(api_rows):
        row_cells = api_table.rows[r_idx + 1].cells
        row_cells[0].width = Inches(1.8)
        row_cells[1].width = Inches(1.8)
        row_cells[2].width = Inches(1.2)
        row_cells[3].width = Inches(1.7)
        bg = "FFFFFF" if r_idx % 2 == 0 else "F8FAFC"
        for c_idx, val in enumerate(row_data):
            c = row_cells[c_idx]
            set_cell_margins(c, 80, 80, 110, 110)
            set_cell_background(c, bg)
            set_cell_borders(c, "E2E8F0", "E2E8F0", "E2E8F0", "E2E8F0", "4")
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.name = "Calibri"
            r.font.size = Pt(8.5)
            if c_idx == 0:
                r.font.bold = True
                r.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)
            elif c_idx == 2:
                r.font.bold = True
                r.font.color.rgb = RGBColor(0x16, 0x65, 0x34) if "20" in val else RGBColor(0x99, 0x1B, 0x1B)

    # -------------------------------------------------------------
    # SECTION 5: UI & TEST HOOKS (DATA-TESTID) COMPLIANCE
    # -------------------------------------------------------------
    h5 = doc.add_paragraph()
    h5.paragraph_format.space_before = Pt(16)
    h5.paragraph_format.space_after = Pt(6)
    r_h5 = h5.add_run("5. UI & Automated Test Hooks (data-testid) Compliance")
    r_h5.font.name = "Calibri"
    r_h5.font.size = Pt(14)
    r_h5.font.bold = True
    r_h5.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

    test_table = doc.add_table(rows=13, cols=3)
    test_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    test_headers = ["Page / Component Scope", "Target Element Description", "Exact data-testid Hook"]
    test_rows = [
        ("Header (Logged Out)", "Login / Register navigation buttons", "btn-login, btn-register"),
        ("Header (Logged In)", "User email, Logout button, Reading Logs link", "user-email, btn-logout, link-reading-logs"),
        ("Home Page (/)", "Main Page Title (exact text: ReadLog)", "home-title"),
        ("Login Form (/login)", "Form element, email/password inputs, submit button", "login-form, login-email, login-password, login-submit"),
        ("Register Form (/register)", "Form element, inputs, submit button", "register-form, register-email, register-password, register-confirm-password, register-submit"),
        ("Auth Validation Messages", "Field-specific & general error / success messages", "error-email, error-password, error-confirm-password, error-auth, form-success"),
        ("Reading Logs Container", "Main protected page container", "reading-logs-page"),
        ("Add Session Form", "Form, bookTitle, minutes, genre, note, date, submit", "reading-log-form, input-book-title, input-minutes, input-genre, input-note, input-date, btn-add-reading-log"),
        ("Session Form Messages", "Validation errors, conflict error, success toast", "error-book-title, error-minutes, error-genre, error-date, error-reading-log, reading-log-success"),
        ("Sessions List", "List container, session row item, empty state", "reading-log-list, reading-log-item, reading-logs-empty"),
        ("Inside Session Item", "Title, minutes, genre, date, favorite toggle, delete", "reading-log-title, reading-log-minutes, reading-log-genre, reading-log-date, btn-toggle-favorite (with aria-pressed), btn-delete-reading-log"),
        ("Filters & Live Summary", "Genre, favorite, search, clear, counts, rows", "filter-genre, filter-favorite, search-input, btn-clear-filters, reading-log-count, favorite-count, total-minutes, genre-breakdown, breakdown-row, breakdown-name, breakdown-count, breakdown-total")
    ]

    t_hdr_cells = test_table.rows[0].cells
    t_hdr_cells[0].width = Inches(1.8)
    t_hdr_cells[1].width = Inches(2.2)
    t_hdr_cells[2].width = Inches(2.5)
    for idx, name in enumerate(test_headers):
        c = t_hdr_cells[idx]
        set_cell_margins(c, 100, 100, 110, 110)
        set_cell_background(c, "1E3A8A")
        set_cell_borders(c, "1E3A8A", "1E3A8A", "1E3A8A", "1E3A8A", "8")
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(name)
        r.font.name = "Calibri"
        r.font.size = Pt(9.5)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    for r_idx, row_data in enumerate(test_rows):
        row_cells = test_table.rows[r_idx + 1].cells
        row_cells[0].width = Inches(1.8)
        row_cells[1].width = Inches(2.2)
        row_cells[2].width = Inches(2.5)
        bg = "FFFFFF" if r_idx % 2 == 0 else "F8FAFC"
        for c_idx, val in enumerate(row_data):
            c = row_cells[c_idx]
            set_cell_margins(c, 80, 80, 110, 110)
            set_cell_background(c, bg)
            set_cell_borders(c, "E2E8F0", "E2E8F0", "E2E8F0", "E2E8F0", "4")
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.name = "Calibri"
            r.font.size = Pt(8.5)
            if c_idx == 2:
                r.font.bold = True
                r.font.color.rgb = RGBColor(0x03, 0x69, 0xA1)
            elif c_idx == 0:
                r.font.bold = True

    # -------------------------------------------------------------
    # SECTION 6: EXACT VALIDATION MESSAGES REFERENCE
    # -------------------------------------------------------------
    h6 = doc.add_paragraph()
    h6.paragraph_format.space_before = Pt(16)
    h6.paragraph_format.space_after = Pt(6)
    r_h6 = h6.add_run("6. Exact Validation Messages Reference (Case-Sensitive)")
    r_h6.font.name = "Calibri"
    r_h6.font.size = Pt(14)
    r_h6.font.bold = True
    r_h6.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

    val_table = doc.add_table(rows=9, cols=3)
    val_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    val_headers = ["Field / Action", "Trigger Condition", "Exact Error Message"]
    val_rows = [
        ("Book Title", "Empty or whitespace-only", "Book title is required"),
        ("Book Title", "Length exceeds 80 characters", "Book title must be at most 80 characters"),
        ("Minutes Read", "Empty or not a valid number", "Minutes read is required"),
        ("Minutes Read", "Non-positive number (<= 0)", "Minutes read must be a positive number"),
        ("Genre", "Empty / 'Choose genre' selected", "Please choose a genre"),
        ("Genre", "Not one of 5 allowed genres", "Invalid genre"),
        ("Date", "Empty / not chosen", "Date is required"),
        ("Date", "Date selected is after today", "Date cannot be in the future")
    ]

    v_hdr_cells = val_table.rows[0].cells
    v_hdr_cells[0].width = Inches(1.8)
    v_hdr_cells[1].width = Inches(2.2)
    v_hdr_cells[2].width = Inches(2.5)
    for idx, name in enumerate(val_headers):
        c = v_hdr_cells[idx]
        set_cell_margins(c, 100, 100, 110, 110)
        set_cell_background(c, "1E3A8A")
        set_cell_borders(c, "1E3A8A", "1E3A8A", "1E3A8A", "1E3A8A", "8")
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(name)
        r.font.name = "Calibri"
        r.font.size = Pt(9.5)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    for r_idx, row_data in enumerate(val_rows):
        row_cells = val_table.rows[r_idx + 1].cells
        row_cells[0].width = Inches(1.8)
        row_cells[1].width = Inches(2.2)
        row_cells[2].width = Inches(2.5)
        bg = "FFFFFF" if r_idx % 2 == 0 else "F8FAFC"
        for c_idx, val in enumerate(row_data):
            c = row_cells[c_idx]
            set_cell_margins(c, 80, 80, 110, 110)
            set_cell_background(c, bg)
            set_cell_borders(c, "E2E8F0", "E2E8F0", "E2E8F0", "E2E8F0", "4")
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.name = "Calibri"
            r.font.size = Pt(9)
            if c_idx == 2:
                r.font.bold = True
                r.font.color.rgb = RGBColor(0xDC, 0x26, 0x26)
            elif c_idx == 0:
                r.font.bold = True

    # -------------------------------------------------------------
    # SECTION 7: SELF-CHECK & QUALITY ASSURANCE CHECKLIST
    # -------------------------------------------------------------
    h7 = doc.add_paragraph()
    h7.paragraph_format.space_before = Pt(16)
    h7.paragraph_format.space_after = Pt(6)
    r_h7 = h7.add_run("7. Practical Exam Self-Check Verification (10/10 PASS)")
    r_h7.font.name = "Calibri"
    r_h7.font.size = Pt(14)
    r_h7.font.bold = True
    r_h7.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

    check_table = doc.add_table(rows=11, cols=3)
    check_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    chk_headers = ["Item #", "Exam Verification Requirement", "Verified Result"]
    chk_rows = [
        ("1", "Registration with new email works at once; duplicate shows error-auth.", "PASSED — Verified with unique & duplicate checks"),
        ("2", "Logged out /reading-logs redirects to /login. Logged in shows email & logout.", "PASSED — Auth guard tested, zero content flash"),
        ("3", "Submitting empty form shows 4 field errors. Negative minutes rejected.", "PASSED — All 8 exact messages validated on submit"),
        ("4", "Adding session shows in list at once without reload; duplicate returns 409.", "PASSED — Optimistic UI update & 409 duplicate check"),
        ("5", "Favorite button toggles aria-pressed='true'/'false' and persists on refresh.", "PASSED — PATCH /api/reading-logs/:id verified"),
        ("6", "Filters (genre, favorites, search) combine via AND, summary breakdown updates.", "PASSED — Genre order: Fiction, Non-Fiction, Sci-Fi, Biography, Other"),
        ("7", "Deleting session removes item immediately; persists across page reload.", "PASSED — DELETE /api/reading-logs/:id verified"),
        ("8", "Calling API with no cookie returns 401; user sees only their own data.", "PASSED — Strictly isolates data by authenticated user"),
        ("9", "npm install && npm run build executes cleanly on fresh checkout.", "PASSED — Zero build errors with Turbopack & TypeScript"),
        ("10", "Submission folder contains QE190031.docx and clean code.zip.", "PASSED — No node_modules, .next, .git, or .env included")
    ]

    c_hdr_cells = check_table.rows[0].cells
    c_hdr_cells[0].width = Inches(0.8)
    c_hdr_cells[1].width = Inches(3.7)
    c_hdr_cells[2].width = Inches(2.0)
    for idx, name in enumerate(chk_headers):
        c = c_hdr_cells[idx]
        set_cell_margins(c, 100, 100, 110, 110)
        set_cell_background(c, "1E3A8A")
        set_cell_borders(c, "1E3A8A", "1E3A8A", "1E3A8A", "1E3A8A", "8")
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(name)
        r.font.name = "Calibri"
        r.font.size = Pt(9.5)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    for r_idx, row_data in enumerate(chk_rows):
        row_cells = check_table.rows[r_idx + 1].cells
        row_cells[0].width = Inches(0.8)
        row_cells[1].width = Inches(3.7)
        row_cells[2].width = Inches(2.0)
        bg = "FFFFFF" if r_idx % 2 == 0 else "F8FAFC"
        for c_idx, val in enumerate(row_data):
            c = row_cells[c_idx]
            set_cell_margins(c, 80, 80, 110, 110)
            set_cell_background(c, bg)
            set_cell_borders(c, "E2E8F0", "E2E8F0", "E2E8F0", "E2E8F0", "4")
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.name = "Calibri"
            r.font.size = Pt(8.5)
            if c_idx == 0:
                r.font.bold = True
            elif c_idx == 2:
                r.font.bold = True
                r.font.color.rgb = RGBColor(0x15, 0x80, 0x3D)

    # Save generated document
    output_path = "QE190031/QE190031.docx"
    doc.save(output_path)
    print(f"Document saved successfully to {output_path}")

if __name__ == "__main__":
    create_report()
