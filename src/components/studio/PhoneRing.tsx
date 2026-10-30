/**
 * Animated handset used beside every "call" label: the handset rings, sound waves rise from the
 * earpiece and two ripples spread outwards. Sized in em so it follows the label; motion stops under
 * prefers-reduced-motion (see .phone-ring in globals.css).
 */
export default function PhoneRing({ className = "" }: Readonly<{ className?: string }>) {
  return (
    <span aria-hidden className={`phone-ring relative mr-[2px] inline-flex h-[1.35em] w-[1.35em] shrink-0 items-center justify-center ${className}`}>
      <svg viewBox="0 0 24 24" className="phone-ring__handset h-[1.05em] w-[1.05em]" fill="currentColor">
        <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.4 11.4 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z" />
      </svg>
      <svg viewBox="0 0 24 24" className="phone-ring__waves absolute inset-0 h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path className="phone-ring__wave" d="M15 3.6a5.6 5.6 0 0 1 5.4 5.4" />
        <path className="phone-ring__wave phone-ring__wave--far" d="M15.4 0.4a8.9 8.9 0 0 1 8.2 8.2" />
      </svg>
    </span>
  );
}
