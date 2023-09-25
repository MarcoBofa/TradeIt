import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div>
        <div className="flex items-center justify-center text-rose-500 text-3xl mb-4">
          CIAO!
        </div>
        <Link className="text-blue-800 hover:underline" href="/Register">
          Want to Sign up? c:{" "}
        </Link>
      </div>
    </div>
  );
}
