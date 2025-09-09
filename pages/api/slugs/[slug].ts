import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { slug } = req.query as { slug: string };
  try {
    const products = await prisma.product.findMany({
      where: { slug },
      include: { category: true },
    });

    const product = products[0];
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return res.status(500).json({ error: 'Error fetching product' });
  }
}