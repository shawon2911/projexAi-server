// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// export interface AuthRequest extends Request {
//   user?: {
//     id: string;
//     role: string;
//   };
// }

// export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
//   let token: string | undefined;

//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     token = req.headers.authorization.split(' ')[1];
//   }

//   if (!token) {
//     res.status(401).json({ message: 'Not authorized, token missing' });
//     return;
//   }

//   try {
//     const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_key';
//     const decoded = jwt.verify(token, jwtSecret) as { id: string; role: string };
    
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Not authorized, invalid token' });
//   }
// };



import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123') as any;

      // Ensure req.user gets normalized id/id string
      req.user = {
        _id: decoded.id || decoded._id || decoded.userId,
        id: decoded.id || decoded._id || decoded.userId
      };

      return next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'User authentication failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'User authentication failed' });
  }
};