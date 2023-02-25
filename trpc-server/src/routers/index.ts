import { t } from "../trpc";
import { appRouter } from "./appRouter";
import { userRouter } from "./users";


export const mergedRouter = t.mergeRouters(appRouter, userRouter);