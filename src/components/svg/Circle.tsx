// File: src/components/decor/Circle.tsx

export function CircleVector({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 300 300" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <circle
        cx="150"
        cy="150"
        r="140"
        fill="var(--color-accent)"
        opacity="0.2"
      />
    </svg>
  );
}

export function GradientCircleVector({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 300"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <radialGradient id="circleGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.05" />
        </radialGradient>
      </defs>
      <circle
        cx="150"
        cy="150"
        r="140"
        fill="url(#circleGradient)"
      />
    </svg>
  );
}
