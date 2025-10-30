import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  // basic header to mimic figma top bar (logo + title)
  return (
    <header className="flex items-center justify-between py-5 border-b border-hd-border bg-white/70 backdrop-blur">
      <div className="flex items-center gap-3">
        {/* TODO: replace with exported Figma logo. using text for now */}
        <div className="w-10 h-10 bg-hd-primary text-white rounded grid place-items-center font-bold">
          HD
        </div>
        <Link href="/" className="text-lg font-semibold tracking-tight">BookIt</Link>
      </div>
      <div className="hidden md:flex items-center gap-2">
        <input className="w-72 rounded-md border border-hd-border bg-gray-100 px-3 py-2 text-sm" placeholder="Search experiences" />
        <button className="btn-cta px-4">Search</button>
      </div>
    </header>
  );
}


