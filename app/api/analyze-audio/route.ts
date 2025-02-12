import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    // Parse the incoming form data from Next.js request
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Create new FormData to forward the file to the FastAPI backend
    const forwardFormData = new FormData();
    forwardFormData.append("file", file);

    // Send the file to the FastAPI backend
    const response = await axios.post(
      "http://localhost:8000/analyze-audio/",
      forwardFormData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error("Error in Next.js API route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
