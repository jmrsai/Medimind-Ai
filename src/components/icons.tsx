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

export function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      {...props}
    >
      <title>Google</title>
      <path
        fill="#4285F4"
        d="M21.35 11.1H12.18v2.8h4.94c-.2 1.5-1.7 4.3-4.94 4.3-3 0-5.4-2.4-5.4-5.4s2.4-5.4 5.4-5.4c1.7 0 2.8.7 3.4 1.3l2.1-2.1C16.95 4.2 14.75 3 12.18 3c-4.9 0-8.9 4-8.9 8.9s4 8.9 8.9 8.9c5.2 0 8.5-3.6 8.5-8.6 0-.6-.1-1.2-.2-1.8z"
      />
    </svg>
  );
}
