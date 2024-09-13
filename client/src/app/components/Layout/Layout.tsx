import { Body, Box, LoadingOverlay } from "@biom3/react";
import Banners from "./Banners";
import SideMenu from "../SideMenu/SideMenu";
import { usePassportProvider } from "@/app/context";
import { useEffect } from "react";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { walletAddress, login } = usePassportProvider();

  useEffect(() => {
    if (!walletAddress) {
      login();
    }
  }, [login, walletAddress]);

  return (
    <Box
      sx={{
        height: "100%",
      }}
    >
      <Box
        sx={{
          d: "flex",
          flexDirection: ["column", "row"],
          position: "auto",
          h: "100%",
          overflowY: "auto",
        }}
      >
        <SideMenu />
        <Box>{children}</Box>
        <Box sx={{
          padding: "base.spacing.x4",
        }}><Banners /></Box>
        <LoadingOverlay visible={!walletAddress}>
          <LoadingOverlay.Content>
            <Body>Signing in with Passport</Body>
          </LoadingOverlay.Content>
        </LoadingOverlay>
      </Box>
    </Box>
  );
}
