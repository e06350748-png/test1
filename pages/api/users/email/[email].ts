// Next.js API route to fetch user by email
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query;
  if (typeof email !== "string") {
    return res.status(400).json({ error: "Invalid email" });
  }
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: "User not found" });
  return res.status(200).json(user);
}