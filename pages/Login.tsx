import React, { useState } from "react";
import Link from "next/link";
import "../app/globals.css";
import InputField from "@/app/components/InputField";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import ToasterProvider from "@/app/components/Providers/ToasterProvider";
import { IFormInput } from "@/types";

interface IFormLogin {
  email: string;
  password: string;
}
const Login: React.FC = () => {
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

  const onSubmit = (data: IFormLogin) => {
    console.log(data);
    reset();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white relative">
      <ToasterProvider />
      <svg
        className="absolute w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path d="M0,0 C50,-10 20,70 0,100 L0,0 Z" fill="#1E90FF" />
      </svg>

      <svg
        className="absolute w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path d="M100,100 C60,90 90,30 100,0 L100,100 Z" fill="#1E90FF" />
      </svg>

      <svg
        className="absolute"
        style={{ top: "30%", right: "37%", transform: "translate(50%, -50%)" }}
        viewBox="0 0 100 100"
        width="100"
        height="100"
      >
        <circle cx="50" cy="50" r="50" fill="#1E90FF" />
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
            className="text-orange-400 hover:text-orange-600 mt-5 inline-block"
          >
            ← Need to Register?
          </Link>
          <Link
            href="/"
            className="text-orange-400 hover:text-orange-600 mt-5 inline-block"
          >
            Forgot your password? →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
