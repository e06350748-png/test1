// Next.js API route for single category actions
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    switch (req.method) {
      case "GET":
        return await getCategory(id, res);
      case "PUT":
        return await updateCategory(id, req, res);
      case "DELETE":
        return await deleteCategory(id, res);
      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("/api/category/[id] error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getCategory(id: string, res: NextApiResponse) {
  const category = await prisma.category.findUnique({
    where: { id },
  });
  if (!category) return res.status(404).json({ error: "Category not found" });
  return res.status(200).json(category);
}

async function updateCategory(id: string, req: NextApiRequest, res: NextApiResponse) {
  const { name, icon } = req.body ?? {};
  try {
    const updated = await prisma.category.update({
      where: { id },
      data: { name, icon },
    });
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(404).json({ error: "Category not found" });
  }
}

async function deleteCategory(id: string, res: NextApiResponse) {
  try {
    await prisma.category.delete({ where: { id } });
    return res.status(204).end();
  } catch (error) {
    return res.status(404).json({ error: "Category not found" });
  }
}