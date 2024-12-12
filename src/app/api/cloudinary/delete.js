import { cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req, res) {
  const { public_id } = await req.json();
  try {
    const result = await cloudinary.v2.uploader.destory(public_id, {
      resource_type: "image",
    });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
