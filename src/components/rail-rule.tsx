export function RailRule(_props?: { i?: number; thin?: boolean }) {
  return (
    <div className="rail-rule" aria-hidden>
      <div className="spec-line" />
      <div className="spec-line spec-line-b" />
    </div>
  );
}
