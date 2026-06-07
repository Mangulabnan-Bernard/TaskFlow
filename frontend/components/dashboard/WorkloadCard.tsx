"use client";

import { useState } from "react";
import { workload } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { WorkloadChart } from "@/components/dashboard/WorkloadChart";
import { BoltIcon, ChevronRightIcon, ExpandIcon } from "@/components/icons";

export function WorkloadCard() {
  const [expanded, setExpanded] = useState(false);
  const toggle = () => setExpanded((e) => !e);

  return (
    <Card
      className="lg:col-span-2"
      title="Workload Distribution"
      action={
        <button
          type="button"
          onClick={toggle}
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse details" : "Expand details"}
          className="focus-ring rounded-md p-1 text-slate-500 transition-colors hover:bg-elevated hover:text-slate-200"
        >
          <ExpandIcon className="size-5" />
        </button>
      }
    >
      <WorkloadChart optimized={workload.optimized} segments={workload.segments} />

      {expanded ? (
        <div className="mt-5 space-y-3 border-t border-line pt-5">
          {workload.segments.map((seg) => (
            <div key={seg.label}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-slate-300">{seg.label}</span>
                <span className="font-semibold text-white tabular-nums">
                  {seg.value}%
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${seg.value}%`, backgroundColor: seg.color }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success">
          <BoltIcon className="size-4" />
        </span>
        <p className="text-sm text-slate-400">{workload.trendNote}</p>
        <button
          type="button"
          onClick={toggle}
          aria-expanded={expanded}
          aria-label={expanded ? "Hide details" : "View details"}
          className="focus-ring ml-auto rounded-md p-1.5 text-slate-500 transition-colors hover:bg-elevated hover:text-slate-200"
        >
          <ChevronRightIcon
            className={cn("size-4 transition-transform", expanded && "rotate-90")}
          />
        </button>
      </div>
    </Card>
  );
}
