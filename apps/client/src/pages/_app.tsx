import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to client!</title>
      </Head>
      <main className="app" suppressHydrationWarning={true}>
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default CustomApp;
