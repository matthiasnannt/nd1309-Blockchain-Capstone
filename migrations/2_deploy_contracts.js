// migrating the appropriate contracts
var Verifier = artifacts.require("./Verifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

module.exports = function (deployer) {
  return deployer
    .deploy(Verifier)
    .then(() => deployer.deploy(SolnSquareVerifier, Verifier.address));
};
