import { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import { group } from "console";

const secret = process.env.JWT_SECRET || "secret";

export async function GET (req: NextApiRequest, res: NextApiResponse) {
    // Extract the token from the Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(400).json({ error: 'Missing token' });
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;

    // Return the user information
    res.status(200).json({
      id: decoded.sub,
      displayName: decoded.name,
      email: decoded.email,
      groups: decoded.groups
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}


