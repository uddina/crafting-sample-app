import { Box, Stack, Heading, FormControl, TextInput, Button } from "@biom3/react";
import { Collection, Recipe } from "@/app/types";
import { useSubmitCraft, useCraftTx, useApprovalQuery, useSetApprovalAllTx } from "@/app/hooks";
import { usePassportProvider } from "@/context";
import { useEffect, useState } from "react";

export default function RecipeBox({
  recipe,
  collection,
}: {
  recipe: Recipe;
  collection: Collection;
}) {
  const { passportState } = usePassportProvider();
  const { submitCraft } = useSubmitCraft();
  const { sendCraftTx } = useCraftTx();
  const { getIsApprovedForAll } = useApprovalQuery();
  const { setApprovalForAll, error: setApprovalErr } = useSetApprovalAllTx();
  const [recipeInputs, setRecipeInputs] = useState<(number | undefined)[]>(Array(recipe.required_inputs).fill(undefined));

  const execute = async (recipe: Recipe) => {
    for (let i = 0; i < recipeInputs.length; i++) {
      if (recipeInputs[i] === undefined) {
        return;
      }
    }
    const res = await submitCraft(recipe.id, recipeInputs as number[]);
    const isApproved = await getIsApprovedForAll({ collection, operator: res.multicallerAddress });
    if (!isApproved) {
      await setApprovalForAll({ collection, operator: res.multicallerAddress });
    }
    await sendCraftTx({
      multicallerAddress: res.multicallerAddress,
      executeArgs: {
        multicallSigner: res.multicallSigner,
        reference: res.reference,
        calls: res.calls,
        deadline: BigInt(res.deadline),
        signature: res.signature,
      }
    });
  };

  const onInputChange = (index: number, value: string) => {
    const newInputs = [...recipeInputs];
    newInputs[index] = parseInt(value);
    setRecipeInputs(newInputs);
  }

  return (
    <Box
      sx={{
        background: "base.color.neutral.800",
        borderRadius: "base.borderRadius.x2",
        borderStyle: "solid",
        borderWidth: "base.border.size.100",
        borderColor: "base.color.accent.1",
        minHeight: "200px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "base.spacing.x4",
        gap: "base.spacing.x4",
      }}
    >
      <Heading size="small">{recipe.name}</Heading>
      <Stack gap="base.spacing.x2">
        {[...Array(recipe.required_inputs)].map((_, i) => (
          <FormControl key={i}>
            <FormControl.Label>Input {i + 1}</FormControl.Label>
            <TextInput placeholder="Token ID" onChange={e => onInputChange(i, e.target.value)} value={recipeInputs[i]} />
          </FormControl>
        ))}
      </Stack>
      <Button
        disabled={!passportState.authenticated}
        onClick={() => {
          execute(recipe);
        }}
      >
        Execute
      </Button>
    </Box>
  );
}
