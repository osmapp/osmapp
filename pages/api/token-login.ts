import type { NextApiRequest, NextApiResponse } from 'next';
import { serverFetchOsmUser } from '../../src/services/osmApiAuthServer';

// TODO upgrade Nextjs and use export async function POST(request: NextRequest) {
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { osmAccessToken } = req.cookies;
    const user = await serverFetchOsmUser({ osmAccessToken });

    res.status(200).json({ user });
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    res.status(err.code ?? 400).send(String(err));
  }
};
