// Next.js API route for single product operations
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (typeof id !== "string") return res.status(400).json({ error: "Invalid id" });

  try {
    switch (req.method) {
      case "GET":
        return await getProductById(id, res);
      case "PUT":
        return await updateProduct(id, req, res);
      case "DELETE":
        return await deleteProduct(id, res);
      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("/api/products/[id] error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getProductById(id: string, res: NextApiResponse) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!product) return res.status(404).json({ error: "Product not found" });
  return res.status(200).json(product);
}

async function updateProduct(id: string, req: NextApiRequest, res: NextApiResponse) {
  const data = req.body;
  try {
    const updated = await prisma.product.update({ where: { id }, data });
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(404).json({ error: "Product not found" });
  }
}

async function deleteProduct(id: string, res: NextApiResponse) {
  // Check FK constraint similar to Express impl
  const related = await prisma.customer_order_product.findMany({ where: { productId: id } });
  if (related.length > 0) {
    return res.status(400).json({ error: "Cannot delete product because of foreign key constraint." });
  }
  try {
    await prisma.product.delete({ where: { id } });
    return res.status(204).end();
  } catch (error) {
    return res.status(404).json({ error: "Product not found" });
  }
}