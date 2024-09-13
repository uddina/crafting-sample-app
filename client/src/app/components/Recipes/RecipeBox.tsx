import {
  Box,
  Heading,
  Button,
  Icon,
  MenuItem,
  Stack,
  LoadingOverlay,
} from '@biom3/react';
import { Collection, nftToName, Recipe } from '@/app/types';
import {
  useSubmitCraft,
  useCraftTx,
  useApprovalQuery,
  useSetApprovalAllTx,
} from '@/app/hooks';
import { usePassportProvider, useMessageProvider } from '@/app/context';
import { useState } from 'react';

export default function RecipeBox({
  recipe,
  collection,
}: {
  recipe: Recipe;
  collection: Collection;
}) {
  const { submitCraft } = useSubmitCraft();
  const { sendCraftTx } = useCraftTx();
  const { getIsApprovedForAll } = useApprovalQuery();
  const { setApprovalForAll } = useSetApprovalAllTx();
  const [isLoading, setIsLoading] = useState(false);
  const { addMessage } = useMessageProvider();

  const execute = async (recipe: Recipe) => {
    try {
      setIsLoading(true);
      const res = await submitCraft(recipe.id);

      const isApproved = await getIsApprovedForAll({
        collection,
        operator: res.multicallerAddress,
      });

      if (!isApproved) {
        await setApprovalForAll({
          collection,
          operator: res.multicallerAddress,
        });
      }

      await sendCraftTx({
        multicallerAddress: res.multicallerAddress,
        executeArgs: {
          multicallSigner: res.multicallSigner,
          reference: res.reference,
          calls: res.calls,
          deadline: BigInt(res.deadline),
          signature: res.signature,
        },
      });
      addMessage({
        status: 'success',
        message: 'Crafting succeeded!',
      });
    } catch (e: any) {
      console.error(e);
      addMessage({
        status: 'fatal',
        message: 'Crafting failed! View console for more details.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        background: 'base.color.neutral.800',
        borderRadius: 'base.borderRadius.x2',
        borderStyle: 'solid',
        borderWidth: 'base.border.size.100',
        borderColor: 'base.color.accent.1',
        minHeight: '150px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'base.spacing.x4',
        gap: 'base.spacing.x4',
      }}
    >
      <Heading size="small">{recipe.name}</Heading>
      <Box
        sx={{
          display: 'flex',
          direction: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          {recipe.inputs.length > 0 ? (
            <Stack>
              {recipe.inputs.map((input) => (
                <MenuItem key={input.tokenId} emphasized size="small">
                  <MenuItem.Label>{nftToName(input)}</MenuItem.Label>
                  <MenuItem.Caption>{input.value}</MenuItem.Caption>
                </MenuItem>
              ))}
            </Stack>
          ) : (
            <MenuItem emphasized size="small">
              <MenuItem.Label>No Inputs</MenuItem.Label>
            </MenuItem>
          )}
        </Box>
        <Box sx={{ alignContent: 'center' }}>
          <Icon icon="ArrowForward" sx={{ width: 'base.icon.size.300' }} />
        </Box>
        <Box>
          {recipe.outputs.length > 0 ? (
            <Stack>
              {recipe.outputs.map((output) => (
                <MenuItem key={output.tokenId} emphasized size="small">
                  <MenuItem.Label>{nftToName(output)}</MenuItem.Label>
                  <MenuItem.Caption>{output.value}</MenuItem.Caption>
                </MenuItem>
              ))}
            </Stack>
          ) : (
            <MenuItem emphasized size="small">
              <MenuItem.Label>No Outputs</MenuItem.Label>
            </MenuItem>
          )}
        </Box>
      </Box>
      <Button
        onClick={() => {
          execute(recipe);
        }}
      >
        Execute
      </Button>
      <LoadingOverlay visible={isLoading}>
        <LoadingOverlay.Content>
          <LoadingOverlay.Content.LoopingText
            text={['Sending crafting transaction', recipe.name]}
            textDuration={1000}
          />
        </LoadingOverlay.Content>
      </LoadingOverlay>
    </Box>
  );
}
