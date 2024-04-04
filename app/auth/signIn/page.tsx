"use client";
import { signIn } from "next-auth/react";
import React, { useRef } from "react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const LoginPage = () => {
  const userName = useRef("");
  const pass = useRef("");

  const onSubmit = async () => {
    const result = await signIn("credentials", {
      username: userName.current,
      password: pass.current,
      redirect: true,
      callbackUrl: "/",
    });
  };
  return (
    <>
      {Object.values(authOptions.providers).map((provider) => (
        <div key={provider.name}>
          <button onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </>
  )
};

export default LoginPage;