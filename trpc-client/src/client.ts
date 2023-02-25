import {
  createTRPCProxyClient,
  createWSClient,
  httpBatchLink,
  loggerLink,
  splitLink,
  wsLink,
} from '@trpc/client';
import { AppRouter } from '../../trpc-server/src/main';

const wsClient = createWSClient({
  url: 'ws://localhost:3001/trpc',
});

const client = createTRPCProxyClient<AppRouter>({
  links: [
    splitLink({
      condition: (op) => {
        return op.type === 'subscription';
      },
      true: wsLink({
        client: wsClient,
      }),
      false: httpBatchLink({
        url: 'http://localhost:3001/trpc',
      }),
    }),
    // wsLink({
    //   client: wsClient
    // }),
    // loggerLink(),
    // httpBatchLink({
    //   url: 'http://localhost:3001/trpc',
    //   //customer headers example
    //   headers: { Authorization: 'Bearer 123' },
    // }),
  ],
});

export async function main() {
  document.addEventListener('click', async () => {
    client.update.mutate({ userId: '1', name: 'Benito' })
  });

 const connection =  client.onUpdate.subscribe(undefined, {
    onData: (id) => {
      console.log('updated', id);
    },
  });

  wsClient.close();
}
