import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def set_cell_shading(cell, hex_color):
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    cell._tc.get_or_add_tcPr().append(shd)

def set_cell_margins(cell, top=120, bottom=120, left=160, right=160):
    tcMar = parse_xml(f'''
        <w:tcMar {nsdecls("w")}>
            <w:top w:w="{top}" w:type="dxa"/>
            <w:bottom w:w="{bottom}" w:type="dxa"/>
            <w:left w:w="{left}" w:type="dxa"/>
            <w:right w:w="{right}" w:type="dxa"/>
        </w:tcMar>
    ''')
    cell._tc.get_or_add_tcPr().append(tcMar)

def set_table_borders(table, color="CBD5E1", sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(f'''
        <w:tblBorders {nsdecls("w")}>
            <w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:left w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:right w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:insideV w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
        </w:tblBorders>
    ''')
    tblPr.append(borders)

def add_hyperlink(paragraph, url, text, color="1D4ED8", underline=True):
    part = paragraph.part
    r_id = part.relate_to(url, docx.opc.constants.RELATIONSHIP_TYPE.HYPERLINK, is_external=True)
    hyperlink = parse_xml(f'<w:hyperlink {nsdecls("w", "r")} r:id="{r_id}"/>')
    new_run = parse_xml(f'''
        <w:r {nsdecls("w")}>
            <w:rPr>
                <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
                <w:color w:val="{color}"/>
                <w:u w:val="{"single" if underline else "none"}"/>
                <w:b/>
            </w:rPr>
            <w:t>{text}</w:t>
        </w:r>
    ''')
    hyperlink.append(new_run)
    paragraph._p.append(hyperlink)

def create_document(output_path):
    doc = docx.Document()

    # Standard 0.8 inch page margins
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    # University & Department Header
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_inst = p_inst.add_run("FPT UNIVERSITY • DEPARTMENT OF SOFTWARE ENGINEERING")
    r_inst.font.name = "Calibri"
    r_inst.font.size = Pt(10)
    r_inst.font.bold = True
    r_inst.font.color.rgb = RGBColor(100, 116, 139)

    p_course = doc.add_paragraph()
    p_course.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_course = p_course.add_run("COURSE: SDN302 – SERVER-SIDE WEB DEVELOPMENT")
    r_course.font.name = "Calibri"
    r_course.font.size = Pt(11)
    r_course.font.bold = True
    r_course.font.color.rgb = RGBColor(30, 58, 138)
    p_course.paragraph_format.space_after = Pt(4)

    # Main Report Title
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_title = p_title.add_run("PRACTICAL EXAM SUBMISSION REPORT")
    r_title.font.name = "Calibri"
    r_title.font.size = Pt(18)
    r_title.font.bold = True
    r_title.font.color.rgb = RGBColor(15, 23, 42)
    p_title.paragraph_format.space_after = Pt(2)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_sub = p_sub.add_run("Semester: Fall 2026 • Official Assessment")
    r_sub.font.name = "Calibri"
    r_sub.font.size = Pt(10)
    r_sub.font.italic = True
    r_sub.font.color.rgb = RGBColor(100, 116, 139)
    p_sub.paragraph_format.space_after = Pt(16)

    # Section 1: Candidate & Deployment Information
    p_h1 = doc.add_paragraph()
    r_h1 = p_h1.add_run("1. CANDIDATE & DEPLOYMENT INFORMATION")
    r_h1.font.name = "Calibri"
    r_h1.font.size = Pt(11)
    r_h1.font.bold = True
    r_h1.font.color.rgb = RGBColor(30, 58, 138)
    p_h1.paragraph_format.space_after = Pt(6)

    t1 = doc.add_table(rows=7, cols=2)
    t1.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t1, color="94A3B8", sz="6")

    col_widths1 = [Inches(2.2), Inches(4.6)]
    for row in t1.rows:
        for i, w in enumerate(col_widths1):
            row.cells[i].width = w

    fields = [
        ("Student ID", "QE190031", False),
        ("Full Name", "Nguyen Van Quy", False),
        ("GitHub Repository", "https://github.com/DevTurtle-Hub/PE_SDN302_FALL26", True),
        ("Vercel Production URL", "https://pe-sdn-302-fall-26.vercel.app", True),
        ("Test Grader Email", "grader.qe190031@example.com", False),
        ("Test Grader Password", "Test1234!", False),
        ("Account Provisioning", "Registered directly via application Register API into production Supabase PostgreSQL DB.", False)
    ]

    for idx, (label, val, is_link) in enumerate(fields):
        c0, c1 = t1.rows[idx].cells
        set_cell_margins(c0, top=90, bottom=90, left=120, right=120)
        set_cell_margins(c1, top=90, bottom=90, left=120, right=120)

        bg = "F8FAFC" if idx % 2 == 0 else "FFFFFF"
        set_cell_shading(c0, "F1F5F9")
        set_cell_shading(c1, bg)

        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_after = Pt(0)
        r0 = p0.add_run(label)
        r0.font.name = "Calibri"
        r0.font.size = Pt(9.5)
        r0.font.bold = True
        r0.font.color.rgb = RGBColor(30, 41, 59)

        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_after = Pt(0)
        if is_link:
            add_hyperlink(p1, val, val, color="2563EB", underline=True)
            if "github" in val.lower():
                r_tag = p1.add_run(" (Branch: main)")
                r_tag.font.name = "Calibri"
                r_tag.font.size = Pt(9)
                r_tag.font.color.rgb = RGBColor(100, 116, 139)
            elif "vercel" in val.lower():
                r_tag = p1.add_run(" (Status: Ready)")
                r_tag.font.name = "Calibri"
                r_tag.font.size = Pt(9)
                r_tag.font.bold = True
                r_tag.font.color.rgb = RGBColor(22, 101, 52)
        else:
            r1 = p1.add_run(val)
            r1.font.name = "Calibri"
            r1.font.size = Pt(9.5)
            if idx in (0, 1, 4, 5):
                r1.font.bold = True
                r1.font.color.rgb = RGBColor(15, 23, 42)
            else:
                r1.font.color.rgb = RGBColor(51, 65, 85)

    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    # Section 2: Technical Compliance Checklist
    p_h2 = doc.add_paragraph()
    r_h2 = p_h2.add_run("2. TECHNICAL COMPLIANCE CHECKLIST")
    r_h2.font.name = "Calibri"
    r_h2.font.size = Pt(11)
    r_h2.font.bold = True
    r_h2.font.color.rgb = RGBColor(30, 58, 138)
    p_h2.paragraph_format.space_after = Pt(6)

    t2 = doc.add_table(rows=6, cols=3)
    t2.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t2, color="94A3B8", sz="6")

    col_widths2 = [Inches(0.5), Inches(2.3), Inches(4.0)]
    for row in t2.rows:
        for i, w in enumerate(col_widths2):
            row.cells[i].width = w

    headers = ["#", "Requirement", "Implementation Status"]
    for i, h in enumerate(headers):
        cell = t2.rows[0].cells[i]
        set_cell_margins(cell, top=100, bottom=100, left=120, right=120)
        set_cell_shading(cell, "1E3A8A")
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        if i == 0:
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(h)
        r.font.name = "Calibri"
        r.font.size = Pt(9.5)
        r.font.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)

    check_items = [
        ("1", "Framework & UI Stack", "Next.js 16 (App Router), TypeScript Strict, Tailwind CSS, ShadCN UI."),
        ("2", "Automated Build Script", 'Build command "prisma generate && next build" in package.json (zero manual steps).'),
        ("3", "Environment & Secrets", "Strictly 3 environment variables: DATABASE_URL, DIRECT_URL, AUTH_SECRET."),
        ("4", "Database & Migrations", "Supabase PostgreSQL via Prisma 7. Migrations committed in prisma/migrations."),
        ("5", "Submission Format", "Folder QE190031 containing QE190031.docx and code.zip (no node_modules, .next, .git, .env).")
    ]

    for idx, (no, req, detail) in enumerate(check_items, start=1):
        row = t2.rows[idx]
        bg = "F8FAFC" if idx % 2 == 1 else "FFFFFF"
        for c_idx, cell in enumerate(row.cells):
            set_cell_margins(cell, top=80, bottom=80, left=120, right=120)
            set_cell_shading(cell, bg)
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)

            if c_idx == 0:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                r = p.add_run(no)
                r.font.name = "Calibri"
                r.font.size = Pt(9)
                r.font.bold = True
                r.font.color.rgb = RGBColor(100, 116, 139)
            elif c_idx == 1:
                r = p.add_run(req)
                r.font.name = "Calibri"
                r.font.size = Pt(9)
                r.font.bold = True
                r.font.color.rgb = RGBColor(15, 23, 42)
            else:
                r_pass = p.add_run("✔ PASS — ")
                r_pass.font.name = "Calibri"
                r_pass.font.size = Pt(9)
                r_pass.font.bold = True
                r_pass.font.color.rgb = RGBColor(22, 101, 52)
                r_det = p.add_run(detail)
                r_det.font.name = "Calibri"
                r_det.font.size = Pt(9)
                r_det.font.color.rgb = RGBColor(51, 65, 85)

    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    # Section 3: Official Exam Implementation Details
    p_h3 = doc.add_paragraph()
    r_h3 = p_h3.add_run("3. DETAILED IMPLEMENTATION SPECIFICATIONS")
    r_h3.font.name = "Calibri"
    r_h3.font.size = Pt(11)
    r_h3.font.bold = True
    r_h3.font.color.rgb = RGBColor(30, 58, 138)
    p_h3.paragraph_format.space_after = Pt(6)

    sections = [
        ("3.1. Database Schema & Data Models", 
         "Entity-Relationship design with relational constraints, foreign keys with ON DELETE CASCADE, unique indexes, and automated Prisma migrations."),
        ("3.2. RESTful API Specifications & Status Code Mapping", 
         "Endpoints mapped to exact HTTP status codes: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 409 (Conflict)."),
        ("3.3. Test Hooks & Component Mapping (data-testid)", 
         "All interactive elements (inputs, buttons, list rows, notification alerts) strictly tagged with exact test hooks required by automated test suites."),
        ("3.4. Authentication & Security Architecture", 
         "Bcrypt password hashing, secure httpOnly JWT cookies, token validation middleware, and strict user ownership authorization checks."),
        ("3.5. Verification & Deployment Proof", 
         "End-to-end verification passing all test cases, clean zero-error production build on Vercel, and live Supabase PostgreSQL connectivity.")
    ]

    for title, desc in sections:
        p_sec = doc.add_paragraph()
        p_sec.paragraph_format.left_indent = Inches(0.2)
        p_sec.paragraph_format.space_after = Pt(4)
        r_title = p_sec.add_run(f"• {title}: ")
        r_title.font.name = "Calibri"
        r_title.font.size = Pt(9.5)
        r_title.font.bold = True
        r_title.font.color.rgb = RGBColor(15, 23, 42)

        r_desc = p_sec.add_run(desc)
        r_desc.font.name = "Calibri"
        r_desc.font.size = Pt(9)
        r_desc.font.color.rgb = RGBColor(71, 85, 105)

    # Candidate Signature Block
    doc.add_paragraph().paragraph_format.space_after = Pt(14)
    p_foot = doc.add_paragraph()
    p_foot.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_foot = p_foot.add_run("Candidate Signature: Nguyen Van Quy (QE190031)")
    r_foot.font.name = "Calibri"
    r_foot.font.size = Pt(9.5)
    r_foot.font.italic = True
    r_foot.font.bold = True
    r_foot.font.color.rgb = RGBColor(100, 116, 139)

    doc.save(output_path)
    print(f"Document successfully created at {output_path}")

if __name__ == "__main__":
    out_file = r"d:\PE_SDN302_FALL26\QE190031\QE190031.docx"
    create_document(out_file)
