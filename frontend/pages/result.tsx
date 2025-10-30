import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function ResultPage() {
  const router = useRouter();
  const { status, message, bookingId } = router.query;

  const success = status === 'success'; // kinda hacky but works fine here

  return (
    <>
      <Head>
        <title>BookIt | Result</title>
      </Head>
      <div className="text-center py-24">
        {success ? (
          <>
            <div className="mx-auto mb-6 h-14 w-14 rounded-full bg-green-100 grid place-items-center">
              <span className="text-2xl">✓</span>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">Booking Confirmed</h2>
            <p className="mt-2 text-hd-subtle">Ref ID: <span className="font-mono">{bookingId}</span></p>
          </>
        ) : (
          <>
            <div className="mx-auto mb-6 h-14 w-14 rounded-full bg-red-100 grid place-items-center">
              <span className="text-2xl">!</span>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">Booking Failed</h2>
            {/* showing backend error message if provided (might be ugly sometimes) */}
            <p className="mt-2 text-hd-subtle">{message || 'Something went wrong'}</p>
          </>
        )}

        <div className="mt-8">
          <Link href="/" className="btn-cta px-4 py-2">Back to Home</Link>
        </div>
      </div>
    </>
  );
}


