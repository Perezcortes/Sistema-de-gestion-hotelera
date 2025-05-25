import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id_usuario: number;
        username: string;
        // agregar más campos que uses
      };
    }
  }
}
