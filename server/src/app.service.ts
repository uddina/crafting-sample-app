import { Injectable } from '@nestjs/common';
import { CraftResult, Recipe } from './types';
import { v4 as uuidv4 } from 'uuid';
import { ethers } from 'ethers';

const recipeMap: Map<string, Recipe> = new Map<string, Recipe>([
  [
    "1",
    {
      id: 1,
      name: 'Only mint',
      required_inputs: 0,
    },
  ],
  [
    "2",
    {
      id: 2,
      name: 'Burn & Mint',
      required_inputs: 2,
    },
  ],
]);

@Injectable()
export class AppService {
  getRecipes(): Recipe[] {
    return Array.from(recipeMap.values());
  }

  async postCraft(
    playerAddress: `0x${string}`,
    recipeId: number,
    inputs: number[],
  ): Promise<CraftResult> {
    const recipe = recipeMap.get(recipeId.toString());
    if (!recipe) {
      throw new Error('Recipe not found');
    }

    if (recipe.required_inputs !== inputs.length) {
      throw new Error('Incorrect number of inputs');
    }

    const craftId = uuidv4().replace(/-/g, '');
    // const craftId = "ref";
    const reference = ethers.zeroPadBytes(ethers.toUtf8Bytes(craftId), 32) as `0x${string}`;

    let calls = [];
    for (let i = 0; i < inputs.length; i++) {
      calls.push({
        target: process.env.COLLECTION_ADDRESS as `0x${string}`,
        functionSignature: 'burn(uint256)',
        functionArgs: [inputs[i].toString()],
        data: ethers.AbiCoder.defaultAbiCoder().encode(
          ['uint256'],
          [BigInt(inputs[i])],
        ),
      });
    }

    const newTokenId = BigInt(Math.floor(Math.random() * 100000) + 1);
    calls.push({
      target: process.env.COLLECTION_ADDRESS as `0x${string}`,
      functionSignature: 'safeMint(address,uint256)',
      functionArgs: [playerAddress.toString(), newTokenId.toString()],
      data: ethers.AbiCoder.defaultAbiCoder().encode(
        ['address', 'uint256'],
        [playerAddress, newTokenId],
      ),
    });

    const deadline = Math.round((Date.now() + 1000 * 60 * 10) / 1000);

    const payload = {
        multi_caller: {
          address: process.env.MULTICALLER_ADDRESS as `0x${string}`,
          name: process.env.MULTICALLER_NAME as string,
          version: process.env.MULTICALLER_VERSION as string,
        },
        reference_id: craftId,
        calls: calls.map((call) => ({
          target_address: call.target,
          function_signature: call.functionSignature,
          function_args: call.functionArgs,
        })),
        expires_at: (new Date(deadline*1000)).toISOString(),
      }
    const res = await fetch(`${process.env.IMMUTABLE_API_URL}/v1/chains/${process.env.CHAIN_NAME}/crafting/sign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-immutable-api-key": process.env.IMMUTABLE_API_KEY as string,
      },
      body: JSON.stringify(payload),
    });
    const sigData = await res.json();
    console.log(payload);
    console.log(sigData);

    return {
      multicallerAddress: process.env.MULTICALLER_ADDRESS as `0x${string}`,
      multicallSigner: sigData.signer_address,
      reference: reference,
      calls: calls,
      deadline: deadline,
      signature: sigData.signature,
    };
  }
}
