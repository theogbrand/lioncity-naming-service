const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const domainContractFactory = await hre.ethers.getContractFactory(
        'Domains'
    );
    const domainContract = await domainContractFactory.deploy('lc');
    await domainContract.deployed();
    console.log('Contract deployed to:', domainContract.address);

    let txn = await domainContract.register('sg', {
        value: hre.ethers.utils.parseEther('777'),
    });
    await txn.wait();

    const balance = await hre.ethers.provider.getBalance(
        domainContract.address
    );
    console.log('Contract balance: :', hre.ethers.utils.formatEther(balance));

    try {
        txn = await domainContract.connect(randomPerson).withdraw();
        await txn.wait();
    } catch (error) {
        console.log('random person could not rob contract');
        console.log(error);
    }

    // Let's look in their wallet so we can compare later
    let ownerBalance = await hre.ethers.provider.getBalance(owner.address);
    console.log(
        'Balance of owner before withdrawal:',
        hre.ethers.utils.formatEther(ownerBalance)
    );

    // withdraw
    txn = await domainContract.connect(owner).withdraw();
    await txn.wait();

    // Fetch balance of contract & owner
    const contractBalance = await hre.ethers.provider.getBalance(
        domainContract.address
    );
    ownerBalance = await hre.ethers.provider.getBalance(owner.address);

    console.log(
        'Contract balance after withdrawal:',
        hre.ethers.utils.formatEther(contractBalance)
    );
    console.log(
        'Balance of owner after withdrawal:',
        hre.ethers.utils.formatEther(ownerBalance)
    );

    // const domainOwnerAddress = await domainContract.getAddress('ogb');
    // console.log('Owner of domain ogb:', domainOwnerAddress);

    // txn = await domainContract.setFavouriteFood('ogb', 'durian');
    // await txn.wait();
    // console.log('Set favourite food of ogb to durian');

    // const favFood = await domainContract.getFavouriteFood('ogb');
    // console.log('fav food of ogb: %s', favFood);
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
