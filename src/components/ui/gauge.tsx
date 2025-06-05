import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const gaugeVariants = cva(
  'relative flex items-center justify-center overflow-hidden rounded-full',
  {
    variants: {
      variant: {
        default: 'text-foreground',
        success: 'text-green-500',
        warning: 'text-yellow-500',
        destructive: 'text-red-500',
      },
      size: {
        sm: 'h-16 w-16 text-xs',
        md: 'h-24 w-24 text-sm',
        lg: 'h-32 w-32 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

const circleVariants = cva('origin-center -rotate-90', {
  variants: {
    variant: {
      default: 'text-muted',
      success: 'text-green-100',
      warning: 'text-yellow-100',
      destructive: 'text-red-100',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface GaugeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gaugeVariants> {
  value: number;
  min?: number;
  max?: number;
  showValue?: boolean;
  showAnimation?: boolean;
  thickness?: number;
}

export function Gauge({
  className,
  value = 0,
  min = 0,
  max = 100,
  showValue = false,
  showAnimation = true,
  thickness = 8,
  size,
  variant,
  ...props
}: GaugeProps) {
  const radius = 50 - thickness / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        className={cn(gaugeVariants({ size, className }))}
        viewBox="0 0 100 100"
        {...props}
      >
        {/* Background circle */}
        <circle
          className={cn(
            circleVariants({ variant }),
            'transition-colors duration-300'
          )}
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={thickness}
          strokeLinecap="round"
        />
        
        {/* Progress circle */}
        <circle
          className={cn(
            'transition-all duration-1000 ease-out',
            variant === 'success' ? 'text-green-500' :
            variant === 'warning' ? 'text-yellow-500' :
            variant === 'destructive' ? 'text-red-500' : 'text-foreground'
          )}
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
            transition: showAnimation ? 'stroke-dashoffset 1s ease-out' : 'none',
          }}
        />
      </svg>
      
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  );
}
