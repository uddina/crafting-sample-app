import { usePassportProvider } from "@/app/context";
import { Box, Logo, Heading, Button, EllipsizedText } from "@biom3/react";

export default function SideMenu() {
  const { walletAddress, client } = usePassportProvider();

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
        {walletAddress && (
          <>
            <EllipsizedText text={walletAddress} />
            <Button onClick={client.logout}>Logout</Button>
          </>
        )}
      </Box>
    </Box>
  );
}
