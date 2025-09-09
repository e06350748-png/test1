// Next.js API route for listing and creating categories
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case "GET":
        return await getAllCategories(res);
      case "POST":
        return await createCategory(req, res);
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("/api/category error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getAllCategories(res: NextApiResponse) {
  const categories = await prisma.category.findMany({});
  return res.status(200).json(categories);
}

async function createCategory(req: NextApiRequest, res: NextApiResponse) {
  const { name, icon } = req.body ?? {};
  if (!name) {
    return res.status(400).json({ error: "'name' is required" });
  }
  const category = await prisma.category.create({
    data: {
      name,
      icon: icon ?? null,
    },
  });
  return res.status(201).json(category);
}