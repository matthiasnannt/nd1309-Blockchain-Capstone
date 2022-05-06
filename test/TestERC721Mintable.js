var RealEstateToken = artifacts.require("RealEstateToken");

contract("TestERC721Mintable", (accounts) => {
  const account_one = accounts[0];
  const account_two = accounts[1];

  describe("match erc721 spec", function () {
    beforeEach(async function () {
      this.contract = await RealEstateToken.new({ from: account_one });

      // TODO: mint multiple tokens
      await this.contract.mint(account_one, 0, { from: account_one });
      await this.contract.mint(account_one, 1, { from: account_one });
      await this.contract.mint(account_two, 2, { from: account_one });
      await this.contract.mint(account_two, 3, { from: account_one });
      await this.contract.mint(account_two, 4, { from: account_one });
    });

    it("should return total supply", async function () {
      const totalSupply = await this.contract.totalSupply.call();
      assert.equal(totalSupply, 5, "Total Supply is wrong");
    });

    it("should get token balance", async function () {
      const balance = await this.contract.balanceOf(account_one);
      assert.equal(balance, 2, "Balance is wrong");
    });

    // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
    it("should return token uri", async function () {
      const tokenURI = await this.contract.tokenURI(1);
      assert.equal(
        tokenURI,
        "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1",
        "TokenURI is wrong"
      );
    });

    it("should transfer token from one owner to another", async function () {
      await this.contract.transferFrom(account_one, account_two, 0);
      const owner = await this.contract.ownerOf(0);
      assert.equal(owner, account_two, "Transfer didn't work");
    });
  });

  describe("have ownership properties", function () {
    beforeEach(async function () {
      this.contract = await RealEstateToken.new({ from: account_one });
    });

    it("should fail when minting when address is not contract owner", async function () {
      let error = null;
      try {
        await this.contract.mint(account_one, 10, { from: account_two });
      } catch (err) {
        error = err;
      }
      expect(error).to.be.an("Error");
      const errorMessage =
        "Returned error: VM Exception while processing transaction: revert Only contract owner is allowed to do this action -- Reason given: Only contract owner is allowed to do this action.";
      if (errorMessage) {
        expect(error.message).to.equal(errorMessage);
      }
    });

    it("should return contract owner", async function () {
      const owner = await this.contract.getOwner.call();
      assert.equal(owner, account_one, "Owner is wrong");
    });
  });
});
