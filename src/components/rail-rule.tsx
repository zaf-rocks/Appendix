export function RailRule({ i = 0 }: { i?: number; thin?: boolean }) {
  const a = -((i * 2.7) % 17);
  const b = -((i * 4.1 + 3.4) % 17);
  const c = -((i * 1.9 + 7.8) % 17);
  return (
    <div className="rail-rule" aria-hidden>
      <div className="spec-line spec-line-thin" style={{ animationDelay: `${a}s` }} />
      <div className="spec-line spec-line-fat" style={{ animationDelay: `${b}s` }} />
      <div className="spec-line spec-line-thin" style={{ animationDelay: `${c}s` }} />
    </div>
  );
}
