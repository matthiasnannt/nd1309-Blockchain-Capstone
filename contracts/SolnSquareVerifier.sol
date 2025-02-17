pragma solidity >=0.5.0 <0.6.0;

import './ERC721Mintable.sol';

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
import "./Verifier.sol";

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is RealEstateToken {
    Verifier public verifier;

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 index;
        address owner;
    }

    // TODO define an array of the above struct
    Solution[] private solutions;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) private solutionMapping;


    // TODO Create an event to emit when a solution is added
    event SolutionAdded(uint256 index, address owner);

    // constructor
    constructor (address verifierAddress) public {
        verifier = Verifier(verifierAddress);
    }

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(uint256 index, address owner, bytes32 key) public returns(bool) {
        solutionMapping[key] = Solution(index, owner);
        emit SolutionAdded(index, owner);
        return true;
    }


    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSupply
    function mintVerified(address to, uint256 tokenId, uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) public returns(bool) {
        bytes32 key = keccak256(abi.encodePacked(a, b, c, input));

        require(solutionMapping[key].owner == address(0), "solution must be unique (not used before)");
        require(verifier.verifyTx(a,b, c, input), "solution must be unique (not used before)");

        super.mint(to, tokenId);
        addSolution(tokenId, to, key);
        return true;
    }
}




  


























