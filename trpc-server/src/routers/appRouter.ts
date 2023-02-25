import { adminProcedure, t } from '../trpc';

export const appRouter = t.router({
  sayHi: t.procedure.query(() => {
    return 'Saying Hi from TRPC!';
  }),
  logToServer: t.procedure
    .input((v: unknown) => {
      if (typeof v === 'string') return v;

      throw new Error('Invalid input: Expected string');
    })
    .mutation((req: any) => {
      console.log(`Client says: ${req.input}`);
      return true;
    }),
  // users: userRouter
  secretData: adminProcedure.query(({ ctx }) => {
    return `Secret data for user ${ctx.user.id}`;
  }),
});
