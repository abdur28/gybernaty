import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export async function GET (req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Missing token' });
  }

  try {
    const secret = 'your_jwt_secret'; // Replace with your secret key
    const decoded = jwt.verify(token, secret);
    // Return the token in the response
    res.status(200).json({ access_token: token, token_type: 'Bearer', expires_in: 3600 });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

