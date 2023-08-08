// pages/api/saveUser.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const {
    email, username, instagramHandle,
    twitterHandle, messengerHandle, wechatHandle
  } = req.body;

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        username, instagramHandle, twitterHandle,
        messengerHandle, wechatHandle
      },
      create: {
        email, username, instagramHandle,
        twitterHandle, messengerHandle, wechatHandle
      },
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  } finally {
    await prisma.$disconnect();
  }
}
