// components/ui/slider.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ className, value, onValueChange, min = 0, max = 100, step = 1, disabled = false, ...props }, ref) => {
    const percentage = ((value[0] - min) / (max - min)) * 100;

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value);
      onValueChange?.([newValue]);
    };

    return (
      <div
        ref={ref}
        className={cn("relative flex w-full touch-none select-none items-center", className)}
        {...props}
      >
        <div className="relative w-full h-2">
          <div className="absolute h-2 w-full rounded-full bg-gray-100" />
          <div
            className="absolute h-2 rounded-full bg-blue-500"
            style={{ width: `${percentage}%` }}
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value[0]}
            onChange={handleSliderChange}
            disabled={disabled}
            className="absolute w-full h-2 opacity-0 cursor-pointer"
          />
          <div
            className="absolute w-4 h-4 rounded-full bg-white border-2 border-blue-500 -translate-y-1/2 top-1/2"
            style={{ left: `${percentage}%`, transform: `translateX(-50%) translateY(-50%)` }}
          />
        </div>
      </div>
    );
  }
);
Slider.displayName = "Slider";

export { Slider };