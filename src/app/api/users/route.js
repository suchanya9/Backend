import { NextResponse } from "next/server";

const STARTING_STUDENT_ID = 1001;

// ข้อมูลจำลอง (Mock Database) สำหรับเก็บรายชื่อนักศึกษา
let studentsDatabase = [
  { id: "1", no: 1, fullName: "สมชาย ใจดี", phone: "0812345678", createdAt: new Date().toISOString() },
  { id: "2", no: 2, fullName: "สมหญิง รักเรียน", phone: "0898765432", createdAt: new Date().toISOString() }
];

// ฟังก์ชันสำหรับดึงข้อมูลนักศึกษาทั้งหมด
function getStudents() {
  return studentsDatabase;
}

// ฟังก์ชันสำหรับบันทึกข้อมูลนักศึกษา (จำลอง)
function saveStudents(updatedStudents) {
  studentsDatabase = updatedStudents;
}

//================================================================================
// GET Function 
//================================================================================
export async function GET() {
  try {
    const students = getStudents();
    console.log({ success: true, message: "ดึงข้อมูลผู้ใช้สำเร็จ", status: 200 });
    
    return NextResponse.json(
      {
        success: true,
        message: "ดึงข้อมูลผู้ใช้สำเร็จ",
        data: students,
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
// POST Function 
//================================================================================
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));

    const fullName = String(body.fullName || body.name || "").trim();
    const phone = String(body.phone || body.tel || "").trim();

    if (!fullName) {
      return NextResponse.json(
        { success: false, message: "กรุณาระบุชื่อ-นามสกุล (fullName)" },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { success: false, message: "กรุณาระบุเบอร์โทรศัพท์ (phone)" },
        { status: 400 }
      );
    }

    const students = getStudents();

    // 1. คำนวณเลขที่ (no) ใหม่ (+1 จากเลขที่สูงสุด)
    const maxNo = students.reduce((max, u) => Math.max(max, Number(u.no) || 0), 0);
    const nextNo = maxNo + 1;

    // 2. คำนวณรหัสนักศึกษาใหม่ (+1 จากรหัสสูงสุด)
    let nextStudentId;
    if (students.length === 0) {
      nextStudentId = STARTING_STUDENT_ID;
    } else {
      const maxId = students.reduce((max, u) => {
        try {
          const idNum = Number(u.studentId || u.id || 0);
          return Math.max(max, isNaN(idNum) ? 0 : idNum);
        } catch {
          return max;
        }
      }, 0);
      nextStudentId = maxId + 1;
    }

    // 3. สร้างข้อมูลนักศึกษาใหม่
    const newStudent = {
      id: String(nextStudentId),
      no: nextNo,
      fullName,
      phone,
      createdAt: new Date().toISOString(),
    };

    // 4. บันทึกข้อมูลลงในฐานข้อมูลจำลอง
    saveStudents([...students, newStudent]);

    return NextResponse.json(
      {
        success: true,
        message: "เพิ่มข้อมูลนักศึกษาสำเร็จ",
        data: newStudent,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล", error: error.message },
      { status: 500 }
    );
  }
}