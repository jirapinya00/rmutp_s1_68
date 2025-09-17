import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import { encode, decode } from "./service";

const app = new Hono();
const prisma = new PrismaClient();

// POST /profile — เข้ารหัสแล้วเก็บ
app.post("/profile", async (c) => {
  try {
    const body = await c.req.json();

    const encPassword = encode(String(body.password)); // จะโชว์เป็นเข้ารหัสตอน GET
    const encCardId   = encode(String(body.cardId));   // ถอดกลับได้ตอน GET
    const encMobile   = encode(String(body.mobile));   // ถอดกลับได้ตอน GET

    const created = await prisma.profile.create({
      data: {
        username: String(body.username).trim(),
        password: encPassword,
        cardId: encCardId,
        mobile: encMobile,
        status: false,
      },
      select: { id: true, username: true, password: true, cardId: true, mobile: true, status: true },
    });

    return c.json({ message: "create profile completed", data: created }, 201);
  } catch (err: any) {
    if (err?.code === "P2002") return c.json({ error: `Duplicate value on ${err?.meta?.target}` }, 400);
    if (err?.code === "P2000") return c.json({ error: "Value too long for column" }, 400);
    console.error("POST /profile error:", err);
    return c.text("Service Unavailable", 503);
  }
});

// GET /profile — แสดงค่าจริงทุกตัวยกเว้น password (ยัง encode)
app.get("/profile", async (c) => {
  try {
    const rows = await prisma.profile.findMany({
      select: {
        id: true,
        username: true,
        password: true, // ส่งเข้ารหัสออกไป
        cardId: true,   // เก็บ enc:v1:cbc:...
        mobile: true,   // เก็บ enc:v1:cbc:...
        status: true,
      },
    });

    const isToken = (s?: string) =>
      typeof s === "string" && s.startsWith("enc:v1:cbc:") && s.split(":").length === 5;

    const data = rows.map((r) => ({
      id: r.id,
      username: r.username,
      password: r.password,                         // ← ยังเข้ารหัส
      cardId: isToken(r.cardId) ? decode(r.cardId) : r.cardId,   // ← ถอด ถ้าฟอร์แมตรองรับ
      mobile: isToken(r.mobile) ? decode(r.mobile) : r.mobile,   // ← ถอด ถ้าฟอร์แมตรองรับ
      status: r.status,
    }));

    return c.json({ message: "get data completed", data }, 200);
  } catch (err) {
    console.error("GET /profile failed:", err);
    return c.json({ error: "Internal error on /profile", detail: String(err) }, 500);
  }
});

export default app;
