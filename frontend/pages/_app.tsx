import type { AppProps } from 'next/app';
import '../styles/globals.css';
import Header from '@/../components/Header';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <Header />
        <main className="py-6">
          <Component {...pageProps} />
        </main>
      </div>
    </div>
  );
}


