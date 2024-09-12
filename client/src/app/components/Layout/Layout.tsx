import { Box } from "@biom3/react";
import SideMenu from "../SideMenu/SideMenu";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
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
      </Box>
    </Box>
  );
}
