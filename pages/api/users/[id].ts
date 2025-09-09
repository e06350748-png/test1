// Next.js API route for single user operations
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import prisma from "@/utils/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (typeof id !== "string") return res.status(400).json({ error: "Invalid id" });
  try {
    switch (req.method) {
      case "GET":
        return await getUser(id, res);
      case "PUT":
        return await updateUser(id, req, res);
      case "DELETE":
        return await deleteUser(id, res);
      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("/api/users/[id] error", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getUser(id: string, res: NextApiResponse) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return res.status(404).json({ error: "User not found" });
  return res.status(200).json(user);
}

async function updateUser(id: string, req: NextApiRequest, res: NextApiResponse) {
  const { email, password, role } = req.body ?? {};
  const hashedPassword = password ? await bcrypt.hash(password, 5) : undefined;
  try {
    const updated = await prisma.user.update({
      where: { id },
      data: { email, password: hashedPassword, role },
    });
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(404).json({ error: "User not found" });
  }
}

async function deleteUser(id: string, res: NextApiResponse) {
  try {
    await prisma.user.delete({ where: { id } });
    return res.status(204).end();
  } catch (error) {
    return res.status(404).json({ error: "User not found" });
  }
}