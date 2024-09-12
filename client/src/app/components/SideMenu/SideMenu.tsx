import { usePassportProvider } from "@/app/context";
import { Box, Logo, Heading, Button, EllipsizedText } from "@biom3/react";
import Banners from "./Banners";

export default function SideMenu() {
  const { userInfo, triggerLogin, passportState, walletAddress } = usePassportProvider();

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
        <Logo logo="ImmutableHorizontalLockup" sx={{ maxh: "base.spacing.x10" }} />
        <Heading size="small">Crafting</Heading>
        <Box>
          {!passportState.authenticated && (
            <Button onClick={triggerLogin}>
              <Button.Logo logo="PassportSymbolOutlined" />
              Login with Passport
            </Button>
          )}
          {passportState.authenticated && walletAddress && (
            <>
              <Heading size="xSmall">{userInfo?.email}</Heading>
              <EllipsizedText text={walletAddress} />
            </>
          )}
        </Box>
        <Box sx={{ w: "100%" }}>
          <Banners />
        </Box>
      </Box>
    </Box>
  );
}
