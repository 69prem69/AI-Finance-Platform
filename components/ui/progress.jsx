"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

function Progress({ className, value, indicatorClassName, ...props }) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
        className
      )}
      style={{
        border: "1px solid black", // ✅ always visible border
        boxSizing: "border-box",
        position: "relative",
      }}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "h-full transition-all rounded-full",
          indicatorClassName // ✅ keeps your color class (green/red/yellow)
        )}
        style={{
          width: `${value || 0}%`, // ✅ actual progress width
          transform: "none",
        }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
