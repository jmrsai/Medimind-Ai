import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2a10 10 0 1 0 4.55 18.2" />
      <path d="M12 12v-2a2 2 0 0 1 2-2h2" />
      <path d="M12 12h-2a2 2 0 0 0-2 2v2" />
      <path d="M12 12a2 2 0 0 1-2-2V8" />
      <path d="M12 12a2 2 0 0 0 2 2h2" />
      <path d="M12 8a2 2 0 0 0-2-2H8" />
      <path d="M12 16a2 2 0 0 1 2 2v2" />
      <path d="M10 12a2 2 0 0 0-2-2H6" />
      <path d="M14 12a2 2 0 0 1 2 2v2" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

export function OldLogo(props: SVGProps<SVGSVGElement>) {
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
      <path d="M12 2a10 10 0 1 0 10 10" />
      <path d="m12 12 4 4" />
      <path d="M12 12V2" />
      <path d="m12 12-4 4" />
      <path d="M12 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      <path d="M7 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      <path d="M17 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
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

export function UserMd(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <circle cx="12" cy="12" r="10" />
            <path d="m12 10-2 4 2 4 2-4-2-4Z" />
            <line x1="12" x2="12" y1="10" y2="4" />
            <path d="m12 4 2 2" />
            <path d="m12 4-2 2" />
        </svg>
    )
}
