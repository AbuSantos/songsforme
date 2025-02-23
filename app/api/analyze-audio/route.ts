import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file) {
      console.error("No file found in the form data");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log("File received:", file);

    const forwardFormData = new FormData();
    forwardFormData.append("file", file);

    // Forward the file to the FastAPI backend
    const response = await axios.post(
      "http://localhost:8000/analyze-audio/",
      forwardFormData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    console.log("Response from FastAPI:", response.data);
    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error("Error in API route POST /api/analyze-audio:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
