"use client";
import { signIn } from "next-auth/react";
import React, { useRef } from "react";
import { authOptions } from "@/app/auth";

const LoginPage = () => {

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