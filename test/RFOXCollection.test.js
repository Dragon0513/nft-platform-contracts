require('@ethersproject/bignumber');
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

  it('should get and set URI for minted tokens', async () => {
    for (let tokenId = 0; tokenId < 10; tokenId++) {
      const hash = `QmYSrTKu4GQoKSH17wn5SsCVEaEQMwxDRsTfwrzD43HWR${tokenId}`;
      await contract.safeMint(owner.address, hash);
      expect(await contract.tokenURI(tokenId)).to.equal(`ipfs://${hash}`);

      const updatedHash = `QmYSrTKu4GQoKSH17wn5SsCVEaEQMwxDRsTfwrzD43HWR-new${tokenId}`;
      await contract.setTokenURI(tokenId, updatedHash);
      expect(await contract.tokenURI(tokenId)).to.equal(`ipfs://${updatedHash}`);
    }
  });

  it('should fail if token URI is empty when minting', async () => {
    await expect(
      contract.safeMint('0xB9cD322bbC641B93e9A9F4262283Fd30C44c35d9', '')
    ).to.be.revertedWith('RFOXCOllection: `tokenURI_` is empty');
  });

  it('should fail if someone else than the NFT owner tries to set the token URI', async () => {
    const nextTokenId = (await contract.totalSupply()).toNumber();
    await contract.safeMint(owner.address, 'hash-here');
    await expect(
      contract.connect(otherSigner).setTokenURI(nextTokenId, 'QmYSrTKu4GQoKSH17wn5SsCVEaEQMwxDRsTfwrzD43HWR')
    ).to.be.revertedWith('RFOXCollection: `setTokenURI` caller is not owner nor approved');
  });

  it('should fail if token URI is empty', async () => {
    const nextTokenId = (await contract.totalSupply()).toNumber();
    await contract.safeMint(owner.address, 'hash-here');
    await expect(
      contract.setTokenURI(nextTokenId, '')
    ).to.be.revertedWith('RFOXCOllection: `tokenURI_` is empty');
  });

  it('should allow `proxyForOwner` to make transfers', async () => {
    const n = (await contract.totalSupply()).toNumber();
    for (let i = 0; i < 5; i++) {
      const hash = `QmYSrTKu4GQoKSH17wn5SsCVEaEQMwxDRsTfwrzD43HWR${i}q`;
      await contract.connect(owner).safeMint(owner.address, hash);

      const tokenId = n + i;
      expect(await contract.tokenURI(tokenId)).to.equal(`ipfs://${hash}`);

      expect(await contract.connect(owner).ownerOf(tokenId)).to.equal(owner.address);
      await contract.connect(proxyForOwner).transferFrom(owner.address, receiverSigner.address, tokenId);
      expect(await contract.ownerOf(tokenId)).to.equal(receiverSigner.address);
    }
  });

  it('should fail if someone else than the owner tries to mint a token', async () => {
    await expect(
      contract.connect(otherSigner).safeMint('0xB9cD322bbC641B93e9A9F4262283Fd30C44c35d9', 'QmYSrTKu4GQoKSH17wn5SsCVEaEQMwxDRsTfwrzD43HWR')
    ).to.be.revertedWith('Ownable: caller is not the owner');
  });

});
