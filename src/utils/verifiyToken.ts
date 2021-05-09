import jwt from 'jsonwebtoken';
import { Request } from 'express';
import { User } from '../entity/User';
export const verifyToken = async (req: Request) => {
  if (!req.headers.authorization) throw new Error('Not token provided');
  let token = req.headers.authorization;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (typeof decoded === 'string') throw new Error(decoded);
    const user = await User.findOne(decoded.id);
    if(!user) throw new Error("Admin account not found")
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};
