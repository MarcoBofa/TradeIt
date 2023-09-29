import "../app/globals.css";
import Image from "next/image";

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-orange-500 text-3xl">Login</h1>
      <Image
        className="rounded-3xl mb-5"
        src="/bn.png"
        alt="Description of Image"
        width={2000}
        height={2000}
      />
    </div>
  );
};

export default Login;
