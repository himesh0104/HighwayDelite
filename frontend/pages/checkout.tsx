import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { api, Experience } from '@/lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { experienceId, slotId, quantity } = router.query;

  const [experience, setExperience] = useState<Experience | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [validating, setValidating] = useState(false);
  const [promoInfo, setPromoInfo] = useState<{ type: 'PERCENT' | 'FLAT'; amount: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!experienceId) return;
    // get base experience price (for summary)
    api.get(`/experiences/${experienceId}`).then((res) => setExperience(res.data.data));
  }, [experienceId]);

  const qty = Number(quantity || 1); // carrying quantity via query to keep things simple
  const totalPrice = (() => {
    if (!experience) return 0;
    const base = experience.price * (Number.isFinite(qty) && qty > 0 ? qty : 1); // probably should memo this later
    if (!promoInfo) return base;
    if (promoInfo.type === 'PERCENT') {
      return Math.max(0, base - Math.round((base * promoInfo.amount) / 100));
    }
    return Math.max(0, base - promoInfo.amount);
  })();

  const validatePromo = async () => {
    setValidating(true);
    setError('');
    try {
      const res = await api.post('/promo/validate', { code: promoCode.trim() }); // quick POST, no debounce
      if (res.data.valid) setPromoInfo(res.data.data);
      else {
        setPromoInfo(null);
        setError('invalid promo code');
      }
    } catch {
      setError('failed to validate code');
    } finally {
      setValidating(false);
    }
  };

  const book = async () => {
    // handle booking form
    setSubmitting(true);
    setError('');
    try {
      if (!name || !email) {
        setError('name and email required');
        setSubmitting(false);
        return;
      }
      const res = await api.post('/bookings', {
        experienceId: String(experienceId),
        slotId: String(slotId),
        quantity: qty,
        name,
        email,
        promoCode: promoCode || undefined,
      }); // hoping backend returns id in data 🙂
      router.push(`/result?status=success&bookingId=${res.data.data.id}`);
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'failed to book';
      router.push(`/result?status=failure&message=${encodeURIComponent(msg)}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>BookIt | Checkout</title>
      </Head>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="surface p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm">Full name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border border-hd-border bg-white px-3 py-2" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full rounded-md border border-hd-border bg-white px-3 py-2" placeholder="Your name" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm">Promo code</label>
              <div className="flex gap-2">
                <input value={promoCode} onChange={(e) => setPromoCode(e.target.value)} className="flex-1 rounded-md border border-hd-border bg-white px-3 py-2" placeholder="SAVE10 or FLAT100" />
                <button onClick={validatePromo} disabled={validating || !promoCode.trim()} className="px-4 py-2 rounded-md bg-gray-900 text-white disabled:opacity-50">
                  {validating ? '...' : 'Apply'}
                </button>
              </div>
              <label className="mt-2 inline-flex items-center text-sm text-hd-subtle">
                <input type="checkbox" className="mr-2" /> I agree to the terms and safety policy
              </label>
              {promoInfo && <p className="text-green-700 text-sm">applied: {promoInfo.type === 'PERCENT' ? `${promoInfo.amount}%` : `₹${promoInfo.amount}`}</p>}
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
          </div>
          <div className="mt-4">
            <button onClick={book} disabled={submitting || !experienceId || !slotId} className="btn-cta px-4 py-2 rounded-md disabled:opacity-50">
              {submitting ? 'Booking...' : 'Pay and Confirm'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="surface p-5 h-fit">
            <h3 className="font-medium mb-3">Order summary</h3>
          {!experience ? (
            <p className="text-sm text-gray-600">loading experience...</p>
          ) : (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Experience</span>
                <span>{experience.title}</span>
              </div>
              <div className="flex justify-between">
                <span>Quantity</span>
                <span>{Number.isFinite(qty) && qty > 0 ? qty : 1}</span>
              </div>
              <div className="flex justify-between">
                <span>Base price</span>
                <span>₹{experience.price * (Number.isFinite(qty) && qty > 0 ? qty : 1)}</span>
              </div>
              {promoInfo && (
                <div className="flex justify-between text-green-700">
                  <span>Discount</span>
                  <span>
                    -{promoInfo.type === 'PERCENT' ? `${promoInfo.amount}%` : `₹${promoInfo.amount}`}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t pt-2 font-semibold">
                <span>Total</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </>
  );
}


