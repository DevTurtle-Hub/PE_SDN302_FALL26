# PE_SDN302_FALL26 - Fullstack Next.js Template

Hệ thống mẫu Fullstack hoàn chỉnh được cài đặt sẵn theo yêu cầu:

- **Frontend:** Next.js App Router (`src/app/page.tsx`, `src/app/layout.tsx`)
- **Ngôn ngữ:** TypeScript (`tsconfig.json`, `src/types/`)
- **CSS:** Tailwind CSS v4 (`src/app/globals.css`)
- **UI:** ShadCN UI (`src/components/ui/` gồm Button, Card, Input, Badge, v.v.)
- **Backend:** Next.js Route Handlers (`src/app/api/`)

---

## 🚀 Khởi chạy dự án

Cài đặt package (nếu chưa):
```bash
npm install
```

Chạy máy chủ phát triển (Development Server):
```bash
npm run dev
```

Mở trình duyệt tại: [http://localhost:3000](http://localhost:3000)

Kiểm tra bản build sản phẩm:
```bash
npm run build
npm run start
```

---

## 📁 Cấu trúc thư mục

```text
PE_SDN302_FALL26/
├── src/
│   ├── app/
│   │   ├── api/                   # Backend Route Handlers
│   │   │   ├── health/
│   │   │   │   └── route.ts       # GET /api/health
│   │   │   └── items/
│   │   │       ├── route.ts       # GET & POST /api/items
│   │   │       └── [id]/
│   │   │           └── route.ts   # GET, PUT, DELETE /api/items/[id]
│   │   ├── favicon.ico
│   │   ├── globals.css            # Tailwind CSS v4 imports & theme variables
│   │   ├── layout.tsx             # Root Layout
│   │   └── page.tsx               # Trang chủ demo Frontend + tích hợp API
│   ├── components/
│   │   └── ui/                    # ShadCN UI Components
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       └── input.tsx
│   ├── lib/
│   │   ├── items-store.ts         # In-memory service / store mẫu
│   │   └── utils.ts               # Helper class names (cn)
│   └── types/
│       └── item.ts                # TypeScript interfaces (Item, ApiResponse)
├── components.json                # Cấu hình ShadCN UI CLI
├── next.config.ts                 # Cấu hình Next.js
├── package.json
├── README.md
└── tsconfig.json                  # Cấu hình TypeScript
```

---

## 🔌 Danh sách API Endpoints (Route Handlers)

| Phương thức | Endpoint | Mô tả |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Kiểm tra tình trạng hoạt động của API server |
| `GET` | `/api/items` | Lấy danh sách items (hỗ trợ `?search=` và `?category=`) |
| `POST` | `/api/items` | Thêm mới item (Body: `{ name, category, status }`) |
| `GET` | `/api/items/:id` | Lấy chi tiết item theo ID |
| `PUT` | `/api/items/:id` | Cập nhật item theo ID |
| `DELETE` | `/api/items/:id` | Xóa item theo ID |

---

## 🎨 Thêm component ShadCN UI mới

Bạn có thể dễ dàng bổ sung thêm các component từ ShadCN UI qua lệnh:
```bash
npx shadcn@latest add <component-name>
# Ví dụ: npx shadcn@latest add dialog dropdown-menu table
```
