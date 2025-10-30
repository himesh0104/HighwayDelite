import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';
import Header from '@/../components/Header';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <Head>
          <link
            rel="icon"
            href={
              'data:image/svg+xml,' +
              encodeURIComponent(
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#facc15"/><text x="50%" y="54%" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" fill="#111">HD</text></svg>'
              )
            }
          />
        </Head>
        <Header />
        <main className="py-6">
          <Component {...pageProps} />
        </main>
      </div>
    </div>
  );
}


