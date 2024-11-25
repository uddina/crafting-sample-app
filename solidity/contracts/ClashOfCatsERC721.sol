// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;
import "@imtbl/contracts/contracts/token/erc721/preset/ImmutableERC721.sol";

contract ClashOfCatsERC721 is ImmutableERC721 {
    constructor(
        address owner,
        string memory name,
        string memory symbol,
        string memory baseURI,
        string memory contractURI,
        address operatorAllowlist,
        address royaltyReceiver,
        uint96 feeNumerator
    )
        ImmutableERC721(
            owner,
            name,
            symbol,
            baseURI,
            contractURI,
            operatorAllowlist,
            royaltyReceiver,
            feeNumerator
        )
    {
      // 
    }
}