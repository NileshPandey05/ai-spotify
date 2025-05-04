import { NextApiRequest, NextApiResponse } from 'next'
import {jwtDecode} from 'jwt-decode'

type TokenPayload = {
  id: string
  email: string
  username?: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token // Access the HttpOnly cookie

  if (!token) {
    return res.status(401).json({ message: 'No token found' })
  }

  try {
    const decoded = jwtDecode<TokenPayload>(token)
    return res.status(200).json({
      id: decoded.id,
      email: decoded.email,
      username: decoded.username || decoded.email.split('@')[0],
    })
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}