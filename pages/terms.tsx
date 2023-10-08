"use client";
import Link from "next/link";
import "../app/globals.css";

const terms = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl">Terms</h1>
      <Link
        href="/Register"
        className="text-orange-400 hover:text-orange-600 mt-20 inline-block"
      >
        Back to Sign up
      </Link>
    </div>
  );
};

export default terms;
