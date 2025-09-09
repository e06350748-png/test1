import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.query as { query?: string };
  if (!query || query.trim() === '') {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error searching products:', error);
    return res.status(500).json({ error: 'Error searching products' });
  }
}