export default function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[0.75rem] font-normal tracking-[0.22em] uppercase text-rose-deep">
      {children}
    </p>
  );
}
