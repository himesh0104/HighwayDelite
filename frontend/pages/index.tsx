import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api, ExperienceWithSlots } from '@/lib/api';

export default function HomePage() {
  const [data, setData] = useState<ExperienceWithSlots[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // fetching experiences from backend here 😅
    // keeping it in a simple effect for now, no cache layer
    api.get('/experiences')
      .then((res) => setData(res.data.data))
      .catch(() => setError('failed to load experiences'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Head>
        <title>BookIt | Home</title>
      </Head>

      {/* hero */}
      {/* thought about adding a background image, but this keeps CLS lower */}
      <section className="mb-8 rounded-xl overflow-hidden border border-hd-border">
        <div className="bg-gray-100 px-6 py-6 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Discover your next adventure</h1>
            <p className="mt-1 text-hd-subtle text-sm">Browse curated experiences, pick a slot, and book it ✨</p>
          </div>
          <Link href="/" className="btn-cta px-4 py-2 rounded-md">Search</Link>
        </div>
      </section>

      {loading && <p className="text-gray-600">loading experiences...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((exp, i) => (
          <div key={exp.id} className="card overflow-hidden">
            <div className="relative h-44">
              <Image
                src={exp.imageUrl}
                alt={exp.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={i === 0}
              />
            </div>
            <div className="p-4 space-y-2">
              <h2 className="font-semibold text-lg tracking-tight">{exp.title}</h2>
              <p className="text-sm text-hd-subtle line-clamp-2">{exp.description}</p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-hd-primary font-medium">From ₹{exp.price}</span>
                <Link href={`/experiences/${exp.id}`} className="btn-cta text-sm px-3 py-1.5">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}


