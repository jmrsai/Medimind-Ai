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
        <path d="M12 2a2.83 2.83 0 0 0-2 5 4.24 4.24 0 0 0-4 4.24c0 1.76 1.25 3.19 3 3.63V15a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-.13a3.25 3.25 0 0 0 3-3.63A4.24 4.24 0 0 0 14 7a2.83 2.83 0 0 0-2-5Z" />
        <path d="M12 2v2" />
        <path d="M17 4.25a7.22 7.22 0 0 1 2.25 2.25" />
        <path d="M19.5 10a7.22 7.22 0 0 1-2.25 5.75" />
        <path d="M22 12h-2" />
        <path d="M19.5 14.25a7.22 7.22 0 0 1-5.75 5.75" />
        <path d="M12 22v-2" />
        <path d="M10.25 19.5a7.22 7.22_0 0 1-5.75-5.75" />
        <path d="M7 17a7.22 7.22 0 0 1-2.25-2.25" />
        <path d="M2 12h2" />
        <path d="M4.5 10A7.22 7.22 0 0 1 6.75 4.25" />
        <path d="M7 7a2.83 2.83 0 0 0 5-2.83" />
        <path d="M17 7a2.83 2.83 0 0 0-5-2.83" />
        <path d="M15.5 12a3.5 3.5 0 0 0-3.5-3.5" />
        <path d="M8.5 12a3.5 3.5 0 0 0 3.5-3.5" />
        <path d="M12 15.5a3.5 3.5 0 0 0 3.5-3.5" />
        <path d="M12 15.5a3.5 3.5 0 0 1-3.5-3.5" />
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
