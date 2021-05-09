import { Request, Response } from 'express';
export interface MainContext {
  req: Request;
  res: Response;
}
