// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export type Data = {
  data: Array<{
    id: number;
    name: `player-${number}`;
    location: 'seoul' | 'busan';
    success: number;
    fail: number;
  }>;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const playerCount = Math.max(3, Math.round(Math.random() * 16));

  const players = Array
    .from({ length: playerCount })
    .map((_, index) => {
      const isSeoul = !!Math.round(Math.random());
      return {
        id: index,
        name: `player-${index + 1}`,
        location: isSeoul ? 'seoul' : 'busan',
        success: 3,
        fail: 0,
      } as const
    })

  res.status(200).json({ data: players });
}
