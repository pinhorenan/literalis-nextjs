// File: src/components/svg/Logo.tsx

interface LogoProps {
  className?: string;
  size?: number;
  fillColor?: string;
  strokeColor?: string;
}

export function Logo({
  className,
  size = 60,
}: LogoProps) {;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 110 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g>
        <path
          d="M81.6568 80.0517H107.827C107.827 80.0517 107.827 61.3533 107.827 47.4655C107.827 40.2427 100.929 31.1596 87.7803 31.7947C78.3965 31.5985 67.9054 38.7721 67.6049 47.4655C66.9788 65.58 67.4484 74.6657 67.6049 80.0517H81.6568Z"
          fill="var(--text-primary)"
        />
        <path
          d="M46.5556 1H23.5772V40.5259V80.0517H46.5556V1Z"
          fill="var(--text-primary)"
        />
        <path
          d="M23.5772 1H46.5556V80.0517M23.5772 1V40.5259V80.0517H46.5556M23.5772 1H2V47.4655V106L23.5772 86.0862L46.5556 106V80.0517M67.6049 80.0517C67.4484 74.6657 66.9788 65.58 67.6049 47.4655C67.9054 38.7721 78.3965 31.5985 87.7804 31.7947C100.929 31.1596 107.827 40.2427 107.827 47.4655C107.827 61.3533 107.827 80.0517 107.827 80.0517H81.6568H67.6049ZM67.6049 80.0517H46.5556"
          stroke="var(--text-primary)"
          strokeWidth="0.543715"
        />
      </g>
    </svg>
  );
}
