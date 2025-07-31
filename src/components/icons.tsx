import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2a10 10 0 0 0-3.93 19.14" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
      <path d="m16 8-4 4" />
      <path d="m12 12-4 4" />
      <path d="M12 12h.01" />
      <path d="M12 6h.01" />
      <path d="M18 12h.01" />
      <path d="M6 12h.01" />
      <path d="M12 18h.01" />
      <path d="M14.5 4.5s-1-1.5-3-2" />
      <path d="M4.5 9.5s-1.5 1-2 3" />
      <path d="M9.5 19.5s1 1.5 3 2" />
      <path d="M19.5 14.5s1.5-1 2-3" />
    </svg>
  );
}
