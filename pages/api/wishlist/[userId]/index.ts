import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query as { userId: string };
  switch (req.method) {
    case 'GET':
      return getAllWishlistByUserId(userId, res);
    case 'DELETE':
      return deleteAllWishlistByUserId(userId, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getAllWishlistByUserId(userId: string, res: NextApiResponse) {
  try {
    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: { product: true },
    });
    return res.status(200).json(wishlist);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching wishlist' });
  }
}

async function deleteAllWishlistByUserId(userId: string, res: NextApiResponse) {
  try {
    await prisma.wishlist.deleteMany({ where: { userId } });
    return res.status(204).end();
  } catch (error) {
    return res.status(500).json({ error: 'Error deleting wishlist' });
  }
}