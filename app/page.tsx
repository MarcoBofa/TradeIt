import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center text-orange-500 text-3xl mb-4">
        CIAO!
        <div className="flex items-center justify-center text-orange-300 text-1xl mt-1">
          This is my very simple (temporary) Tech Stack
        </div>
      </div>
      <Image
        className="rounded-3xl mb-5"
        src="/excalidraw.jpg"
        alt="Description of Image"
        width={1000}
        height={1000}
      />
      <div className="flex flex-row items-center justify-center space-x-10">
        <Link className="text-blue-600 hover:underline mb-4" href="/Register">
          Want to try the Sign up?
        </Link>
        <Link className="text-blue-600 hover:underline mb-4" href="/Login">
          Or you prefer to Login? c:
        </Link>
      </div>
    </div>
  );
}
