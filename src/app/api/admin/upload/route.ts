import { mkdir, writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import { randomBytes } from "crypto";

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const VIDEO_TYPES = new Set(["video/mp4", "video/webm"]);
const IMAGE_MAX = 4 * 1024 * 1024;
const VIDEO_MAX = 50 * 1024 * 1024;

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const isImage = IMAGE_TYPES.has(file.type);
  const isVideo = VIDEO_TYPES.has(file.type);
  if (!isImage && !isVideo) {
    return NextResponse.json({ error: "Unsupported type" }, { status: 400 });
  }

  const max = isVideo ? VIDEO_MAX : IMAGE_MAX;
  if (file.size > max) {
    return NextResponse.json({ error: "File too large" }, { status: 400 });
  }

  const rawExt = file.type.split("/")[1] ?? "bin";
  const ext = rawExt === "jpeg" ? "jpg" : rawExt;
  const name = `${randomBytes(12).toString("hex")}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, name), buffer);

  return NextResponse.json({ url: `/uploads/${name}`, kind: isVideo ? "video" : "image" });
}
