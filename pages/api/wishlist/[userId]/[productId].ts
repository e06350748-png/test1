import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, productId } = req.query as { userId: string; productId: string };
  switch (req.method) {
    case 'GET':
      return getSingleWishItem(userId, productId, res);
    case 'DELETE':
      return deleteWishItem(userId, productId, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getSingleWishItem(userId: string, productId: string, res: NextApiResponse) {
  try {
    const wishItem = await prisma.wishlist.findMany({
      where: { userId, productId },
    });
    return res.status(200).json(wishItem);
  } catch (error) {
    return res.status(500).json({ error: 'Error getting wish item' });
  }
}

async function deleteWishItem(userId: string, productId: string, res: NextApiResponse) {
  try {
    await prisma.wishlist.deleteMany({ where: { userId, productId } });
    return res.status(204).end();
  } catch (error) {
    return res.status(500).json({ error: 'Error deleting wish item' });
  }
}
