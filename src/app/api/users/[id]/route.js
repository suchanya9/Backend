import { NextResponse } from "next/server";

//================================================================================
// GET By ID Function (/src/app/api/users/[id]/route.js)
//================================================================================
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    console.log({ success: true, message: `ดึงข้อมูลผู้คนที่ ${id} ใช้สำเร็จ`, status: 200 });

    return NextResponse.json(
      {
        success: true,
        message: `ดึงข้อมูลผู้คนที่ ${id} ใช้สำเร็จ`,
        data: { id },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

//================================================================================
// PUT By ID Function (/src/app/api/users/[id]/route.js)
//================================================================================
export async function PUT(request, { params }) {
  try {
    const { id } = await params;

    // รับข้อมูลที่ส่งมาทาง Request Body สำหรับอัปเดต
    const body = await request.json().catch(() => ({}));
    const fullName = String(body.fullName || body.name || "").trim();
    const phone = String(body.phone || body.tel || "").trim();

    // ตรวจสอบว่ามีข้อมูลส่งมาแก้ไขหรือไม่
    if (!fullName && !phone) {
      return NextResponse.json(
        { success: false, message: "กรุณาระบุข้อมูลที่ต้องการอัปเดต (fullName หรือ phone)" },
        { status: 400 }
      );
    }

    console.log({ success: true, message: `อัปเดตข้อมูลผู้คนที่ ${id} ใช้สำเร็จ`, status: 200 });

    return NextResponse.json(
      {
        success: true,
        message: `อัปเดตข้อมูลผู้คนที่ ${id} ใช้สำเร็จ`,
        data: {
          id,
          fullName: fullName || "ข้อมูลเดิม",
          phone: phone || "ข้อมูลเดิม",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

//================================================================================
// DELETE By ID Function (/src/app/api/users/[id]/route.js)
//================================================================================
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    console.log({ success: true, message: `ลบข้อมูลผู้คนที่ ${id} ใช้สำเร็จ`, status: 200 });

    return NextResponse.json(
      {
        success: true,
        message: `ลบข้อมูลผู้คนที่ ${id} ใช้สำเร็จ`,
        data: { id },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}