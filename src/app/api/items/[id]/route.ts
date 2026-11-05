import { NextRequest, NextResponse } from "next/server";
import { itemsStore } from "@/lib/items-store";
import { ApiResponse, Item } from "@/types/item";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/items/[id]
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const item = itemsStore.getById(id);

    if (!item) {
      return NextResponse.json(
        { success: false, error: `Không tìm thấy mục với ID: ${id}` },
        { status: 404 }
      );
    }

    const response: ApiResponse<Item> = {
      success: true,
      data: item,
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

// PUT /api/items/[id]
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = itemsStore.update(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: `Không tìm thấy mục với ID: ${id}` },
        { status: 404 }
      );
    }

    const response: ApiResponse<Item> = {
      success: true,
      message: "Cập nhật thành công",
      data: updated,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Lỗi xử lý yêu cầu",
      },
      { status: 400 }
    );
  }
}

// DELETE /api/items/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const deleted = itemsStore.delete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: `Không tìm thấy mục với ID: ${id}` },
        { status: 404 }
      );
    }

    const response: ApiResponse = {
      success: true,
      message: `Đã xóa thành công mục ID: ${id}`,
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

