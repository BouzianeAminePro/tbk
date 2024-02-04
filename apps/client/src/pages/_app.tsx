import { AppProps } from 'next/app';
import Head from 'next/head';

import './styles.css';
import { ThemeProvider } from '../../../../shared/src/components/ui/theme-provider';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to client!</title>
      </Head>
      <main className="app" suppressHydrationWarning={true}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <div className="bg-slate-200 h-screen w-full flex items-center justify-center">
            <Component {...pageProps} />
          </div>
        </ThemeProvider>
      </main>
    </>
  );
}

export default CustomApp;
