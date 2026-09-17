const BANDS = [
  "linear-gradient(90deg,#ff8ab4,#ff2d55,#ff7a00,#ffd60a)",
  "linear-gradient(90deg,#ffd60a,#34c759,#00c7be,#32ade6)",
  "linear-gradient(90deg,#32ade6,#5856d6,#af52de,#ff2d78)",
  "linear-gradient(90deg,#c44dff,#ff2d78,#ff3b30,#ff9f0a)",
];

export function RailRule({ i = 0 }: { i?: number; thin?: boolean }) {
  return (
    <div className="-mx-3 my-3" aria-hidden>
      <div className="rail-rule-hair" />
      <div
        className="my-[3px] h-[3px]"
        style={{ backgroundImage: BANDS[i % BANDS.length] }}
      />
      <div className="rail-rule-hair" />
    </div>
  );
}
