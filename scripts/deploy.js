const main = async () => {
    const domainContractFactory = await hre.ethers.getContractFactory(
        'Domains'
    );
    const domainContract = await domainContractFactory.deploy('lc');
    await domainContract.deployed();

    console.log('Contract deployed to:', domainContract.address);

    let txn = await domainContract.register('ogb', {
        value: hre.ethers.utils.parseEther('0.077'),
    });
    await txn.wait();
    console.log('Minted domain: ogb.lc, xferring contract 1 ether');

    const domainOwnerAddress = await domainContract.getAddress('ogb');
    console.log('Owner of domain ogb:', domainOwnerAddress);

    txn = await domainContract.setFavouriteFood('ogb', 'durian');
    await txn.wait();
    console.log('Set favourite food of ogb to durian');

    const balance = await hre.ethers.provider.getBalance(
        domainContract.address
    );
    console.log(
        'LCNS Contract balance: :',
        hre.ethers.utils.formatEther(balance)
    );
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();
