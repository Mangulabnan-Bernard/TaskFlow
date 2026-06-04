import type { WorkloadSegment } from "@/lib/data";

interface WorkloadChartProps {
  optimized: number;
  segments: WorkloadSegment[];
}

const SIZE = 140;
const STROKE = 12;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 10; // visual gap between arcs, in px along the circumference

export function WorkloadChart({ optimized, segments }: WorkloadChartProps) {
  // Each arc starts where the previous ones ended (prefix sum, computed purely
  // so there's no render-time mutation).
  const arcLength = (value: number) => (value / 100) * CIRCUMFERENCE;
  const arcs = segments.map((seg, i) => ({
    color: seg.color,
    dash: Math.max(arcLength(seg.value) - GAP, 0),
    offset: segments
      .slice(0, i)
      .reduce((sum, prev) => sum + arcLength(prev.value), 0),
  }));

  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          role="img"
          aria-label={`Workload distribution: ${segments
            .map((s) => `${s.label} ${s.value}%`)
            .join(", ")}`}
        >
          <g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="var(--color-line)"
              strokeWidth={STROKE}
            />
            {arcs.map((arc, i) => (
              <circle
                key={i}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke={arc.color}
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={`${arc.dash} ${CIRCUMFERENCE - arc.dash}`}
                strokeDashoffset={-arc.offset}
              />
            ))}
          </g>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white tabular-nums">
            {optimized}%
          </span>
          <span className="label-eyebrow text-slate-500">Optimized</span>
        </div>
      </div>

      <ul className="flex-1 space-y-3">
        {segments.map((seg) => (
          <li key={seg.label} className="flex items-center gap-3 text-sm">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: seg.color }}
            />
            <span className="text-slate-300">{seg.label}</span>
            <span className="ml-auto font-semibold text-white tabular-nums">
              {seg.value}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
