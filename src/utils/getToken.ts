import jwt from 'jsonwebtoken';

export const getToken = (id: number) => {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET!
  );
};
