import express, { Request, Response, type Express } from 'express';
import ws from 'ws';

import cors from 'cors';
import {createExpressMiddleware} from '@trpc/server/adapters/express';
import { t } from "../trpc";
import { mergedRouter } from "../routers";
import { createContext } from '../context';

import { applyWSSHandler } from '@trpc/server/adapters/ws'

import 'dotenv/config';

export class Server {
  app: Express;
  port: number | string;
  t: any;
  appRouter: any;
  wss: any;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.t = t;
    this.appRouter = mergedRouter;

    //middlewares
    this.middlewares();

    //routes
    this.routes();

    //WSS
    this.WSSHandler(this.app);

  }

  middlewares() {
    this.app.use(express.static('public'));
    this.app.use(cors({ origin: 'http://localhost:5173' }));
    this.app.use("/trpc", createExpressMiddleware({ router: this.appRouter, createContext}));
    this.app.use(express.json());
    console.log('Middlewares initialized CORS and JSON');
  }

  routes() {
    this.app.get('/', (req: Request, res: Response) => {
      res.send('GET response from server');
    });
  }

  WSSHandler(server: any){
    
    applyWSSHandler({
      wss: new ws.Server({ server }),
      router: this.appRouter,
      createContext,
    })
  }

  listen() {
    this.app
      .listen(this.port, () => {
        console.log(`Server is running in port ${this.port}`);
      })
      .on('error', (err: Error) => {
        console.log(err);
      });
  }
}
