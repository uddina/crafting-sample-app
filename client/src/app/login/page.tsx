'use client';
import { Heading } from "@biom3/react";
import { useEffect } from "react";

import { usePassportProvider } from "@/context";

export default function Login() {
  const { loginCallback, userInfo } = usePassportProvider();

  useEffect(() => {
    loginCallback();
  }, [loginCallback, userInfo]);

  return <Heading>Logged in</Heading>;
}
