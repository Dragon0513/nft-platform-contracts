const { BigNumber } = require('@ethersproject/bignumber');
const { expect } = require('chai');

describe("RFOXCollection Contract", () => {
  const CONTRACT_URI = 'ipfs://QmYSrTKu4GQoKSH17wn5SsCVEaEQMwxDRsTfwrzD43HWRD';

  let owner;
  let otherSigner;
  let receiverSigner;
  let proxyForOwner;

  let proxy;
  let contract;

  before(async () => {
    [owner, otherSigner, receiverSigner, proxyForOwner] = await ethers.getSigners();

    const MockProxyRegistry = await ethers.getContractFactory("MockProxyRegistry");
    proxy = await MockProxyRegistry.deploy();
    await proxy.setProxy(owner.address, proxyForOwner.address);

    const RFOXCollection = await ethers.getContractFactory("RFOXCollection");
    contract = await RFOXCollection.deploy(CONTRACT_URI, 'RFOX Test Collection', 'TST', proxy.address);
  });

  it('should set the constructor args to the supplied value', async () => {
    expect(await contract.contractURI()).to.equal(CONTRACT_URI);
    expect(await contract.name()).to.equal('RFOX Test Collection');
    expect(await contract.symbol()).to.equal('TST');
  });

  it('should get URI for minted tokens', async () => {
    for (let i = 0; i < 10; i++) {
      const hash = `QmYSrTKu4GQoKSH17wn5SsCVEaEQMwxDRsTfwrzD43HWR${i}`;
      await contract.safeMint(owner.address, hash);
      expect(await contract.tokenURI(i)).to.equal(`ipfs://${hash}`);
    }
  });

  it('should allow `proxyForOwner` to make transfers', async () => {
    const n = (await contract.totalSupply()).toNumber();
    for (let i = 0; i < 5; i++) {
      const hash = `QmYSrTKu4GQoKSH17wn5SsCVEaEQMwxDRsTfwrzD43HWR${i}q`;
      await contract.connect(owner).safeMint(owner.address, hash);

      expect(await contract.tokenURI(n + i)).to.equal(`ipfs://${hash}`);
    }

    const tokenId = n;
    expect(await contract.connect(owner).ownerOf(tokenId)).to.equal(owner.address);
    await contract.connect(proxyForOwner).transferFrom(owner.address, receiverSigner.address, tokenId);
    expect(await contract.ownerOf(tokenId)).to.equal(receiverSigner.address);
  });

  it('should fail if someone else than the owner tries to mint a token', async () => {
    await expect(
      contract.connect(otherSigner).safeMint('0xB9cD322bbC641B93e9A9F4262283Fd30C44c35d9', 'QmYSrTKu4GQoKSH17wn5SsCVEaEQMwxDRsTfwrzD43HWR')
    ).to.be.revertedWith('Ownable: caller is not the owner');
  });

});
