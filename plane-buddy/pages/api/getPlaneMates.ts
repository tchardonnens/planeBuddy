import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    // Find all flights associated with the user
    const userFlights = await prisma.userFlight.findMany({
      where: { userId: Number(userId) },
    });

    let planeMates: any[] = [];

    // For each flight, find all the users associated with it
    for (const uf of userFlights) {
      const mates = await prisma.userFlight.findMany({
        where: { flightId: uf.flightId, NOT: { userId: Number(userId) } },
        include: { user: true }
      });

      planeMates = [...planeMates, ...mates.map(mate => mate.user)];
    }

    res.status(200).json(planeMates);
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
    res.status(500).json({ success: false, message: errorMessage });
  }
  finally {
    await prisma.$disconnect();
  }
}
