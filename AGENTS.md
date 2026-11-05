<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# PRACTICAL EXAM (PE) RULES & VERCEL CONTINUOUS DEPLOYMENT

## 1. VERCEL CD: CODE ĐẾN ĐÂU PUSH & CẬP NHẬT VERCEL ĐẾN ĐÓ
- **Quy trình bắt buộc sau mỗi tính năng / sửa lỗi:**
  1. Kiểm tra build sạch sẽ (`npm run build`).
  2. Tự động commit với commit message rõ ràng (ví dụ: `feat(auth): add register and login endpoints`, `fix(expenses): fix duplicate status code 409`).
  3. Push trực tiếp lên nhánh `main` (`git push origin main`) để Vercel tự động kích hoạt deploy bản mới nhất ngay lập tức.
  4. Thông báo cho người dùng trạng thái commit và link Vercel tương ứng.
- **Bảo mật tuyệt đối:** KHÔNG BAO GIỜ commit file `.env` hoặc để lộ `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET` lên GitHub. Luôn giữ `.env` trong `.gitignore`.

## 2. QUY CHUẨN CODE SẠCH (ZERO-BUILD-ERROR TRÊN VERCEL)
- **TypeScript Strict Compliance:**
  - Tuyệt đối không dùng `any` bừa bãi; định nghĩa interface/type rõ ràng cho Request body, Response body, Database Models và Component Props.
  - Đảm bảo `tsc --noEmit` hoàn toàn không có lỗi trước khi push.
- **Prisma & Serverless Database Optimization:**
  - `package.json` script `build` phải luôn là: `"prisma generate && next build"`.
  - Luôn import Prisma từ singleton (`src/lib/prisma.ts`), không tạo instance `new PrismaClient()` mới ở từng file để tránh cạn kiệt Connection Pool trên Supabase.
  - Prisma CLI (migrations) dùng kết nối trực tiếp `DIRECT_URL` (port 5432), còn app runtime dùng pooled connection `DATABASE_URL` (port 6543, pgbouncer=true).
- **Next.js App Router Standards:**
  - Khai báo `'use client'` ở ngay dòng đầu tiên của tất cả các components có dùng hooks (`useState`, `useEffect`, `useContext`, v.v.) hoặc event handlers (`onClick`, `onSubmit`).
  - Tuyệt đối không import các thư viện server-only (`bcrypt`, `jsonwebtoken`, `prisma`) vào Client Components.
  - Các Route Handlers (`/api/...`) có tương tác database hoặc cookies phải khai báo `export const dynamic = 'force-dynamic'` khi cần thiết để tránh lỗi static generation lúc build trên Vercel.
  - Luôn bọc logic API trong khối `try/catch` và trả về đúng format JSON: `{ "error": "<thông điệp lỗi chuẩn>" }`.

## 3. CHÍNH XÁC 100% SPEC ĐỀ THI (TEST HOOKS & STATUS CODES)
- **Mã HTTP Status Code chuẩn:**
  - `200`: Lấy dữ liệu thành công / Cập nhật / Xóa / Login thành công.
  - `201`: Tạo mới thành công (Register, Add Expense).
  - `400`: Lỗi validate dữ liệu đầu vào.
  - `401`: Chưa đăng nhập / token hết hạn / sai email hoặc mật khẩu.
  - `404`: Không tìm thấy dữ liệu (hoặc dữ liệu của người khác).
  - `409`: Trùng lặp dữ liệu (Duplicate expense / Duplicate email).
- **Test Hooks:**
  - Tất cả các thuộc tính `data-testid` phải chính xác từng ký tự hoa thường, dấu gạch nối theo đúng tài liệu đề thi.
  - Các thông điệp hiển thị và so sánh text (case-sensitive) phải trùng khớp 100% với đề thi.

## 4. QUY TRÌNH NỘP BÀI TỰ ĐỘNG
- Luôn sẵn sàng thư mục nộp bài chuẩn `MSSV` (ví dụ: `QE190031`) gồm:
  - File Word `MSSV.docx` với đầy đủ thông tin: Mã SV, Họ tên, Link GitHub public, Link Vercel Production, Test account email/password.
  - Thư mục `code` chứa source code sạch (không có `node_modules`, `.next`, `.git`, `.env`).
- Khi người dùng yêu cầu đóng gói hoặc chuẩn bị nộp bài, kích hoạt script `export-submission.ps1` để đồng bộ bài nộp nhanh chóng và chính xác.

