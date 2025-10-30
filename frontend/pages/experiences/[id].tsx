import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { api, ExperienceWithSlots, Slot } from '@/lib/api';

export default function ExperienceDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [exp, setExp] = useState<ExperienceWithSlots | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (!id) return;
    api.get(`/experiences/${id}`)
      .then((res) => setExp(res.data.data))
      .catch(() => setError('failed to load experience'))
      .finally(() => setLoading(false));
  }, [id]);

  const availableSlots: Slot[] = useMemo(() => {
    if (!exp) return [] as Slot[];
    // show only not booked slots
    return exp.slots.filter((s) => !s.booked && s.capacity > 0);
  }, [exp]);

  const dateKeys = useMemo(() => {
    const set = new Set<string>();
    for (const s of availableSlots) {
      const d = new Date(s.dateTime);
      const key = d.toISOString().slice(0, 10);
      set.add(key);
    }
    return Array.from(set).sort();
  }, [availableSlots]);

  useEffect(() => {
    if (!selectedDate && dateKeys.length > 0) {
      setSelectedDate(dateKeys[0]);
    }
  }, [dateKeys, selectedDate]);

  const slotsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [] as Slot[];
    return availableSlots.filter((s) => new Date(s.dateTime).toISOString().slice(0, 10) === selectedDate);
  }, [availableSlots, selectedDate]);

  const formatDate = (iso: string) => new Date(iso).toLocaleString();

  return (
    <>
      <Head>
        <title>BookIt | Details</title>
      </Head>
      {loading && <p className="text-gray-600">loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {exp && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative h-72 md:h-[420px]">
              <Image
                src={exp.imageUrl}
                alt={exp.title}
                fill
                className="object-cover rounded-xl"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 66vw, 66vw"
                priority
              />
            </div>
            <div className="mt-6">
              <h1 className="text-2xl font-semibold tracking-tight">{exp.title}</h1>
              <p className="mt-2 text-hd-subtle max-w-3xl">{exp.description}</p>

              <div className="mt-6">
                <h3 className="font-medium mb-2">Choose date</h3>
                <div className="flex flex-wrap gap-2">
                  {dateKeys.length === 0 ? (
                    <span className="text-sm text-red-600">no dates available</span>
                  ) : (
                    dateKeys.map((key) => {
                      const label = new Date(key).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                      const active = selectedDate === key;
                      return (
                        <button key={key} onClick={() => { setSelectedDate(key); setSelectedSlot(null); }} className={`chip ${active ? 'bg-amber-50 border-amber-300' : ''}`}>
                          {label}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-2">Choose time</h3>
                <div className="flex flex-wrap gap-2">
                  {slotsForSelectedDate.length === 0 ? (
                    <span className="text-sm text-red-600">sold out right now 😭</span>
                  ) : (
                    slotsForSelectedDate.slice(0,6).map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSlot(s.id)}
                        className={`chip ${selectedSlot===s.id ? 'bg-amber-50 border-amber-300' : ''}`}
                      >
                        {new Date(s.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </button>
                    ))
                  )}
                </div>
                <p className="mt-2 text-xs text-hd-subtle">All times are in IST (GMT +5:30)</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="surface p-5">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span>Starts at</span><span>₹{exp.price}</span></div>
                <div className="flex justify-between items-center">
                  <span>Quantity</span>
                  <div className="inline-flex items-center gap-2 text-sm text-hd-subtle">
                    <button className="chip px-2" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>–</button>
                    <span>{quantity}</span>
                    <button className="chip px-2" onClick={() => setQuantity((q) => Math.min(10, q + 1))}>+</button>
                  </div>
                </div>
                <div className="flex justify-between"><span>Subtotal</span><span>₹{exp.price}</span></div>
                <div className="flex justify-between"><span>Taxes</span><span>₹59</span></div>
                <hr className="my-2 border-hd-border" />
                <div className="flex justify-between font-semibold"><span>Total</span><span>₹{Math.max(0, exp.price * quantity - 41)}</span></div>
                <button
                  className="btn-cta w-full mt-2 disabled:opacity-50"
                  disabled={!selectedSlot}
                  onClick={() => {
                    if (!selectedSlot) return;
                    router.push(`/checkout?experienceId=${exp.id}&slotId=${selectedSlot}&quantity=${quantity}`);
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


