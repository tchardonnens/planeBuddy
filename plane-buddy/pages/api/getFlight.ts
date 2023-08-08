import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'UserId parameter is required' });
  }

  try {
    // Finding the user based on their userId
    const userWithFlight = await prisma.user.findUnique({
      where: {
        id: parseInt(userId as string, 10) // Convert userId from string to number
      },
      select: {
        userFlights: {
          select: {
            flight: true
          }
        }
      }
    });

    if (!userWithFlight) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!userWithFlight.userFlights || userWithFlight.userFlights.length === 0) {
      return res.status(404).json({ error: 'Flight not found for this user' });
    }

    // Send the flight details to the client
    res.status(200).json(userWithFlight.userFlights[0].flight);

  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  } finally {
    await prisma.$disconnect();
  }
}
