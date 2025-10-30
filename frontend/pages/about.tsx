import Head from 'next/head';

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>BookIt | About</title>
      </Head>
      <section className="prose max-w-3xl">
        <h1>About</h1>
        <p>
          Scenic routes, trained guides, and safety briefing. Minimum age 10. We curate small-group
          experiences with certified guides. Safety first with gear included. Helmet and life jackets
          along with an expert will accompany in each activity.
        </p>
        <p>
          Times and dates shown are in IST (GMT +5:30). Availability is live and may change as slots
          get booked.
        </p>
      </section>
    </>
  );
}
