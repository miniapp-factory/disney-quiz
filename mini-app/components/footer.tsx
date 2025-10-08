"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="flex place-content-center pb-4">
      <span>
        Developed by{" "}
        <Link href="https://openxai.org" target="_blank">
          OpenxAI
        </Link>
      </span>
    </footer>
  );
}
