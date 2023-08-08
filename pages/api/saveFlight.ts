// pages/api/addFlight.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const {
    flightNumber,
    departureTime,
    departureAirport,
    arrivalTime,
    arrivalAirport,
    userId
  } = req.body;

  try {
    // Check if flight with the given flightNumber already exists
    let flight = await prisma.flight.findFirst({
      where: { flightNumber }
    });

    // If flight doesn't exist, create a new one
    if (!flight) {
      flight = await prisma.flight.create({
        data: {
          flightNumber,
          departureTime: new Date(departureTime),
          departureAirport,
          arrivalTime: new Date(arrivalTime),
          arrivalAirport
        }
      });
    }

    // Check if the UserFlight relationship already exists
    const userFlight = await prisma.userFlight.findFirst({
      where: {
        userId: userId,
        flightId: flight.id
      }
    });

    // If UserFlight doesn't exist, create a new relationship
    if (!userFlight) {
      await prisma.userFlight.create({
        data: {
          userId: userId,
          flightId: flight.id
        }
      });
    }

    res.status(200).json({ success: true, flight });
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
    res.status(500).json({ success: false, message: errorMessage });
  }
  finally {
    await prisma.$disconnect();
  }
}
