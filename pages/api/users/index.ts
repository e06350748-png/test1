// Next.js API route for listing all users and creating a user
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import prisma from "@/utils/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case "GET":
        return await getAllUsers(res);
      case "POST":
        return await createUser(req, res);
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("/api/users error", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getAllUsers(res: NextApiResponse) {
  const users = await prisma.user.findMany({});
  return res.status(200).json(users);
}

async function createUser(req: NextApiRequest, res: NextApiResponse) {
  const { email, password, role } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  const hashedPassword = await bcrypt.hash(password, 5);
  try {
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role },
    });
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ error: "Error creating user" });
  }
}