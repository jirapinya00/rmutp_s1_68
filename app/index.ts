import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";  

const app = new Hono();
const prisma = new PrismaClient();

app.get("/", (c) => c.text("Hello World"));

app.get("/about", (c) => {
  return c.json({ message: "Jirapinya" });
});

app.get("/profile", async (c) => {               
  const profile = await prisma.profile.findMany(); 
  return c.json(profile);
});

export default app;
