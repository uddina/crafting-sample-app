'use client';
import { usePassportProvider } from "@/app/context";
import { Heading } from "@biom3/react";
import { useEffect } from "react";

export default function Login() {
  const { client } = usePassportProvider();

  useEffect(() => {
    client.loginCallback();
  }, []);

  return <Heading>Logged in</Heading>;
}
