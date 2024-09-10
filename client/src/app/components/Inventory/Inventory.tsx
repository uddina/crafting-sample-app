import { useCollectionItemsQuery } from "@/app/hooks/useQuery";
import { Collection } from "@/app/types";
import { usePassportProvider } from "@/context";
import { Box, Card, Grid, Heading } from "@biom3/react";

export default function Inventory({ collection }: { collection: Collection }) {
  const { walletAddress } = usePassportProvider();
  const { data, error, isLoading } = useCollectionItemsQuery({
    owner: walletAddress ? walletAddress as `0x${string}` : undefined,
    collection: collection.address,
  });

  if (isLoading) {
    return <Heading size="xSmall">Loading...</Heading>;
  } else if (error) {
    return <Heading size="xSmall">Error: {error.message}</Heading>;
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "base.spacing.x4",
        width: "450px",
      }}
    >
      <Heading>Inventory</Heading>
      <Heading size="xSmall">Collection: {collection.address}</Heading>
      <Grid>
        {data?.map((nft) => (
          <Card key={nft.tokenId}>
            <Card.Title>{nft.tokenId}</Card.Title>
            <Card.Caption>Token ID</Card.Caption>
          </Card>
        ))}
      </Grid>
    </Box>
  );
}
