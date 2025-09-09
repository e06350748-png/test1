import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getAllWishlist(req, res);
    case 'POST':
      return createWishItem(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getAllWishlist(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const wishlist = await prisma.wishlist.findMany({
      include: {
        product: true,
      },
    });
    return res.status(200).json(wishlist);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching wishlist' });
  }
}

async function createWishItem(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId, productId } = req.body as { userId: string; productId: string };
    if (!userId || !productId) {
      return res.status(400).json({ error: 'userId and productId are required' });
    }
    const wishItem = await prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
    });
    return res.status(201).json(wishItem);
  } catch (error) {
    console.error('Error creating wish item:', error);
    return res.status(500).json({ error: 'Error creating wish item' });
  }
}