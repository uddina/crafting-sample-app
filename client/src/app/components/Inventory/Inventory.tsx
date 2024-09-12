import { useCollectionItemsQuery } from "@/app/hooks/useQuery";
import { Collection, nftToName } from "@/app/types";
import { usePassportProvider } from "@/app/context";
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
            <Card.Title>{nftToName(nft)}</Card.Title>
            <Card.Caption>{nft.value}</Card.Caption>
            <Card.Description>Token {nft.tokenId}</Card.Description>
          </Card>
        ))}
      </Grid>
    </Box>
  );
}
