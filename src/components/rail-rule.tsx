import { useId } from "react";

export function RailRule({ i = 0 }: { i?: number; thin?: boolean }) {
  const salt = useId().split("").reduce((n, c) => n + c.charCodeAt(0), 0);
  const durs = [70 + ((i * 13 + salt) % 34), 54 + ((i * 9 + salt * 3) % 28)];
  const delays = [
    -((salt * 0.41 + i * 2.7) % durs[0]),
    -((salt * 0.83 + i * 5.3 + 9) % durs[1]),
  ];
  const dirs: Array<"normal" | "reverse"> =
    (salt + i) % 2 === 0 ? ["normal", "reverse"] : ["reverse", "normal"];
  return (
    <div className="rail-rule" aria-hidden>
      {(["spec-line-thin", "spec-line-fat"] as const).map((cls, n) => (
        <div
          key={n}
          className={`spec-line ${cls}`}
          style={{
            animationDuration: `${durs[n]}s`,
            animationDelay: `${delays[n]}s`,
            animationDirection: dirs[n],
          }}
        />
      ))}
    </div>
  );
}