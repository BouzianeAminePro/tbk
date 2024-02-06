import { AppProps } from 'next/app';
import Head from 'next/head';
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import './styles.css';
import { ThemeProvider } from '@org/shared';

function CustomApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 60000,
      },
    },
    queryCache: new QueryCache(),
    mutationCache: new MutationCache(),
  });

  return (
    <>
      <Head>
        <title>TBK - Trading by kabla</title>
      </Head>
      <main className="app" suppressHydrationWarning={true}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="h-screen w-full flex items-center justify-center">
            <QueryClientProvider client={queryClient}>
              <Component {...pageProps} />
            </QueryClientProvider>
          </div>
        </ThemeProvider>
      </main>
    </>
  );
}

export default CustomApp;
