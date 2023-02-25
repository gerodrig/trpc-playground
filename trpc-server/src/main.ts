import { Server } from './models/server';
import { mergedRouter } from './routers';

const server = new Server();

server.listen();

export type AppRouter = typeof mergedRouter;