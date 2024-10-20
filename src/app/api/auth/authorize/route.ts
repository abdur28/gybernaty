import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const secret = 'your_jwt_secret';

export async function GET (req: NextApiRequest, res: NextApiResponse) {
    // const { address } = req.query;

    // if (!address) {
    //   return res.status(400).json({ error: 'Missing required parameters' });
    // }
  
    // Generate JWT token
    const payload = {
      sub: 1,
      name: "John Doe",
      email: "p6zPn@example.com",
      groups: ["user"],
    };
  
    const options = {
      expiresIn: '1h',
      issuer: 'gyber-social-platform',
    };
  
    const token = jwt.sign(payload, secret, options);

    // Send token in the header
    // res.setHeader('Authorization', `Bearer ${token}`);
    console.log(token)

    const redirect_uri = 'http://13.60.232.198:50/login/ab051f10-5af1-430a-b364-78e2a3e05946/callback';
  
    // Redirect back to Wiki.js
    res.redirect(redirect_uri);
}

