import React, { useState } from "react";
import Link from "next/link";
import "../app/globals.css";
import InputField from "@/app/components/InputField";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import ToasterProvider from "@/app/components/Providers/ToasterProvider";
import { IFormInput, ModalForm } from "@/types";
import RecoverPassModal from "@/app/components/recoverPassModal";
import { signIn } from "next-auth/react";
import { Single_Day } from "next/font/google";
import { useRouter } from "next/navigation";

interface IFormLogin {
  email?: string;
  password?: string;
}

const Login: React.FC = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<IFormLogin>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const onSubmit = async (data: IFormLogin) => {
    console.log(data);

    try {
      const callback = await signIn("credentials", {
        ...data,
        redirect: false,
      });
      console.log(callback);

      if (callback?.ok) {
        toast.success("Logged in!");
        router.push("/");
      } else if (callback?.error) {
        toast.error(callback.error);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      reset();
    }
  };

  const handleModalSubmit = (data: ModalForm) => {
    // Handle modal form submission
    console.log(data);
    setIsModalOpen(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white relative">
      <ToasterProvider />
      <svg
        className="absolute w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id="gradient1" cx="50%" cy="50%" r="60%">
            <stop offset="10%" style={{ stopColor: "#ffac12" }} />
            <stop offset="90%" style={{ stopColor: "#F97316" }} />
          </radialGradient>
        </defs>
        <path d="M0,0 C50,-10 20,70 0,100 L0,0 Z" fill="url(#gradient1)" />
      </svg>

      <svg
        className="absolute w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id="gradient2" cx="50%" cy="50%" r="60%">
            <stop offset="10%" style={{ stopColor: "#ffac12" }} />
            <stop offset="90%" style={{ stopColor: "#F97316" }} />
          </radialGradient>
        </defs>
        <path
          d="M100,100 C60,90 90,30 100,0 L100,100 Z"
          fill="url(#gradient2)"
        />
      </svg>

      <svg
        className="absolute"
        style={{ top: "30%", right: "37%", transform: "translate(50%, -50%)" }}
        viewBox="0 0 100 100"
        width="100"
        height="100"
      >
        <defs>
          <radialGradient id="gradient3" cx="50%" cy="50%" r="50%">
            <stop offset="10%" style={{ stopColor: "#ffac12" }} />
            <stop offset="90%" style={{ stopColor: "#6225fa" }} />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill="url(#gradient3)" />
      </svg>

      <div className="p-8 bg-white rounded-lg shadow-top max-w-md w-full relative z-10">
        <h1 className="text-orange-500 text-3xl mb-4">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <InputField
              label="email"
              type="email"
              register={register}
              watch={watch}
              required
            />
          </div>
          <div className="mb-4">
            <InputField
              label="password"
              type="password"
              register={register}
              watch={watch}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 text-white bg-orange-500 rounded-md hover:bg-orange-600"
          >
            Login
          </button>
        </form>
        <div className="flex justify-between mb-1">
          <Link
            href="/Register"
            className="text-blue-500 hover:text-blue-700 mt-7 inline-block"
          >
            ← Need to Register?
          </Link>
          <a
            href="#"
            onClick={handleOpenModal}
            className="text-blue-500 hover:text-blue-700 mt-7 inline-block"
          >
            Forgot your password? →
          </a>
        </div>
      </div>
      <RecoverPassModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        submitData={handleModalSubmit}
      />
    </div>
  );
};

export default Login;
