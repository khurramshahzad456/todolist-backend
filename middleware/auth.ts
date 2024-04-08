import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: 'Authorization Token is Required' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: 'Authorization Token is Required' });
    }

    const decoded: jwt.JwtPayload | string = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    if (!decoded) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: 'Authorization Token is Required' });
    }

    req.body.email = (decoded as jwt.JwtPayload).email;
    next();
  } catch (e) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: 'Authorization Token is Required' });
  }
};

export default isAuthenticated;
