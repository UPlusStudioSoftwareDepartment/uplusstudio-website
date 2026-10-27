"use client";

interface Appointment {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  message: string;
}

const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const DAYS = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

function dateParts(date: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(date);
  if (!m) return { day: "—", monthYear: date, weekday: "" };
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  return {
    day: String(d).padStart(2, "0"),
    monthYear: `${MONTHS[mo - 1]} ${y}`,
    weekday: DAYS[new Date(Date.UTC(y, mo - 1, d)).getUTCDay()],
  };
}

export function Pass({ appointment, reference, status }: Readonly<{ appointment: Appointment; reference: string; status: string }>) {
  const { day, monthYear, weekday } = dateParts(appointment.date);
  return (
    <div className="relative mx-auto w-full max-w-[440px] overflow-hidden rounded-[14px] border border-line bg-[#141413] text-bone shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)]">
      <div className="px-8 pt-10 text-center">
        <p className="font-serif text-[64px] font-bold leading-none">U+</p>
        <p className="mt-3 text-[11px] font-bold tracking-[0.55em] text-bone/70">STUDIO</p>
        <div className="mt-6 h-px bg-bone/25" />
        <p className="mt-5 text-[10px] font-bold tracking-[0.3em] text-bone/60">RANDEVU KARTI</p>
        <span className="mt-3 inline-block rounded-full border border-clay px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-clay">{status}</span>
      </div>
      <dl className="space-y-6 px-9 pt-8">
        <div>
          <dt className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-bone/50">Misafir</dt>
          <dd className="mt-2 font-serif text-[28px] font-bold leading-tight">{appointment.name}</dd>
        </div>
        <div>
          <dt className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-bone/50">Hizmet</dt>
          <dd className="mt-2 font-serif text-[20px] font-bold text-clay">{appointment.service}</dd>
        </div>
        <div className="grid grid-cols-[1.4fr_1fr] gap-3">
          <div className="overflow-hidden rounded-[10px] border border-bone/15 bg-paper-2">
            <div className="h-1 bg-clay" />
            <div className="p-4">
              <dt className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-bone/50">Tarih</dt>
              <dd className="mt-2 flex items-center gap-3">
                <span className="font-serif text-[44px] font-bold leading-[0.9]">{day}</span>
                <span className="border-l border-bone/15 pl-3">
                  <span className="block font-serif text-[16px] italic leading-tight">{monthYear}</span>
                  <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-clay">{weekday}</span>
                </span>
              </dd>
            </div>
          </div>
          <div className="overflow-hidden rounded-[10px] border border-bone/15 bg-paper-2">
            <div className="h-1 bg-bone/35" />
            <div className="p-4">
              <dt className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-bone/50">Saat</dt>
              <dd className="mt-2 font-serif text-[34px] font-bold leading-none">{appointment.time}</dd>
              <dd className="mt-2 font-mono text-[9.5px] uppercase tracking-[0.12em] text-mute">1 saat · İncek</dd>
            </div>
          </div>
        </div>
      </dl>
      <div className="relative mt-8 flex items-center">
        <span className="-ml-3.5 h-7 w-7 rounded-full bg-night" aria-hidden />
        <span className="mx-2 h-0 flex-1 border-t-2 border-dashed border-white/20" aria-hidden />
        <span className="-mr-3.5 h-7 w-7 rounded-full bg-night" aria-hidden />
      </div>
      <div className="flex items-center justify-between px-9 pb-9 pt-6">
        <span className="flex h-9 items-stretch gap-[2px]" aria-hidden>
          {Array.from({ length: 34 }, (_, i) => (
            <span key={i} className={i % 2 === 0 ? "bg-bone" : "bg-transparent"} style={{ width: ((i * 7 + reference.charCodeAt(i % reference.length || 0)) % 3) + 1 }} />
          ))}
        </span>
        <span className="text-right">
          <span className="block font-mono text-[11px] font-bold text-bone/65">UP-{reference}</span>
          <span className="mt-1 block text-[8.5px] font-bold tracking-[0.14em] text-bone/45">U+ STUDIO · ANKARA</span>
        </span>
      </div>
    </div>
  );
}
