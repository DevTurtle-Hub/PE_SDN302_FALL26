import { NextRequest, NextResponse } from "next/server";
import { itemsStore } from "@/lib/items-store";
import { ApiResponse, Item } from "@/types/item";

// GET /api/items?search=...&category=...
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;

    const data = itemsStore.getAll(query, category);

    const response: ApiResponse<Item[]> = {
      success: true,
      data,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

// POST /api/items
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, status } = body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: "Tên mục (name) là bắt buộc và không được để trống.",
        },
        { status: 400 }
      );
    }

    const newItem = itemsStore.create({
      name: name.trim(),
      category: category?.trim() || "Chung",
      status: status === "inactive" ? "inactive" : "active",
    });

    const response: ApiResponse<Item> = {
      success: true,
      message: "Tạo mục mới thành công",
      data: newItem,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Định dạng JSON không hợp lệ",
      },
      { status: 400 }
    );
  }
}

