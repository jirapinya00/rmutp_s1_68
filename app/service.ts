// app/service.ts
import crypto from "crypto";

const secretKey = process.env.SECRET_KEY ?? "default_secret_key";

// ทำ key 32 bytes สำหรับ AES-256
const key = crypto.createHash("sha256").update(secretKey).digest().subarray(0, 32);

// (ถ้าจะ debug) แสดงความยาว key
console.log(`key length: ${key.length} bytes`); // 32

/** เข้ารหัส → สตริงรูปแบบ enc:v1:gcm:<iv_b64>:<ct_b64>:<tag_b64> */
export function encode(plain: string): string {
  const iv = crypto.randomBytes(12); // 12 bytes สำหรับ GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const ct = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return `enc:v1:gcm:${iv.toString("base64")}:${ct.toString("base64")}:${tag.toString("base64")}`;
}

/** ถอดรหัสจากสตริงที่ encode() สร้าง */
export function decode(token: string): string {
  const parts = token.split(":");
  if (parts.length !== 6 || parts[0] !== "enc" || parts[1] !== "v1" || parts[2] !== "gcm") {
    throw new Error("Invalid encrypted token format");
  }

  const iv  = Buffer.from(parts[3], "base64");
  const ct  = Buffer.from(parts[4], "base64");
  const tag = Buffer.from(parts[5], "base64");

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const pt = Buffer.concat([decipher.update(ct), decipher.final()]);
  return pt.toString("utf8");
}
