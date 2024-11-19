import { usePassportProvider } from "@/app/context";
import {
  Box,
  Logo,
  Heading,
  Button,
  EllipsizedText,
  LoadingOverlay,
  Body,
} from "@biom3/react";
import { useState } from "react";

export default function SideMenu() {
  const { ready, authenticated, userProfile, walletAddress, logout } =
    usePassportProvider();
  const [loadingMessage, setLoadingMessage] = useState<
    "Logging out" | undefined
  >();

  const onLogout = async () => {
    try {
      setLoadingMessage("Logging out");
      await logout();
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMessage(undefined);
    }
  };

  return (
    <Box
      sx={{
        w: "100%",
        maxw: "350px",
        h: "100%",
        top: [null, null, "0px"],
        pos: "sticky",
        d: "flex",
        background: "var(--on-dark-base-color-neutrals-800, #1F1F1F)",
        flexDirection: "column",
        transitionProperty: "transform",
        transitionDuration: "base.animation.fast.cssDuration",
        transitionTimingFunction: "base.animation.fast.cssEasing",
        overflow: "auto",
        boxShadow: "base.shadow.200",
        borderTopRightRadius: "base.borderRadius.x8",
        zIndex: 2,
      }}
      rc={<aside />}
    >
      <Box
        sx={{
          marginTop: "base.spacing.x4",
          padding: "base.spacing.x4",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          gap: "base.spacing.x4",
        }}
      >
        {/* <Logo
          logo="ImmutableHorizontalLockup"
          sx={{ maxh: "base.spacing.x10" }}
        /> */}
        <img
          src="https://www.dalarnia.com/assets/imgs/home/dar-logo.png"
          alt="DAR Logo"
        />
        <Heading size="medium">DALARNIA LEGENDS</Heading>
        <br />
        {ready && authenticated && walletAddress && (
          <>
            {userProfile?.email && (
              <Heading size="xSmall">{userProfile?.email}</Heading>
            )}
            <EllipsizedText text={walletAddress} />
            <Button onClick={onLogout}>Logout</Button>
          </>
        )}
      </Box>
      <LoadingOverlay visible={!!loadingMessage}>
        <LoadingOverlay.Content>
          <Body>{loadingMessage}</Body>
        </LoadingOverlay.Content>
      </LoadingOverlay>
    </Box>
  );
}
