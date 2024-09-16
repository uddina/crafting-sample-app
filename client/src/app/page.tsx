"use client";

import { Box, Heading } from "@biom3/react";
import Recipes from "./components/Recipes/Recipes";
import Inventory from "./components/Inventory/Inventory";
import { useCollectionQuery } from "./hooks";
import Layout from "@/app/components/Layout/Layout";

export default function Home() {
  const { data: collection, error, isLoading } = useCollectionQuery();

  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "base.spacing.x8",
          padding: "base.spacing.x8",
        }}
      >
        {isLoading && <Heading size="xSmall">Loading Collection...</Heading>}
        {error && <Heading size="xSmall">Error: {error.message}</Heading>}
        {collection && (
          <>
            <Recipes collection={collection} />
            <Inventory collection={collection} />
          </>
        )}
      </Box>
    </Layout>
  );
}
