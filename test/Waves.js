const { expect } = require("chai");

describe("Waves", function () {

    let deployer;
    let user;
    let user2;
    let Waves;
    let oneOfWaves;

    beforeEach(async function () {
        [deployer, user, user2] = await ethers.getSigners();
        Waves = await ethers.deployContract("Waves");
        oneOfWaves = ethers.parseUnits("1", await Waves.decimals());
    })

    describe("Deployment", function () {
        it("Should have the right constant values", async function () {
            expect(await Waves.name()).to.equal("Waves");
            expect(await Waves.symbol()).to.equal("WAV");
            expect(await Waves.decimals()).to.equal(9);
            expect(await Waves.totalSupply()).to.equal(2_000_000_000_000_000);
        })

        it("Should send the total supply to the contract deployer", async function () {
            expect(await Waves.balanceOf(deployer.address)).to.equal(await Waves.totalSupply());
        })

        it("Should emit a Transfer event", async function () {
            await expect(Waves.deploymentTransaction())
                .to.emit(Waves, "Transfer")
                .withArgs(ethers.ZeroAddress, deployer.address, await Waves.totalSupply());
        })
    })

    describe("balanceOf", function () {
        it("Should return the deployer balance value", async function () {
            expect(await Waves.balanceOf(deployer.address)).to.equal(await Waves.totalSupply());
        })

        it("Should return the user balance value", async function () {
            expect(await Waves.balanceOf(user.address)).to.equal(0);
        })
    })

    describe("balanceOf", function () {
        it("Should return the deployer balance value", async function () {
            expect(await Waves.balanceOf(deployer.address)).to.equal(await Waves.totalSupply());
        })

        it("Should return the user balance value", async function () {
            expect(await Waves.balanceOf(user.address)).to.equal(0);
        })
    })

    describe("approve", function () {
        it("Should approve give user value allowance to deployer balance", async function () {
            await Waves.approve(user.address, oneOfWaves);
            expect(await Waves.allowance(deployer.address, user.address)).to.equal(oneOfWaves);
        })

        it("Should approve emit an Approval event", async function () {
            await expect(Waves.approve(user.address, oneOfWaves))
                .to.emit(Waves, "Approval")
                .withArgs(deployer.address, user.address, oneOfWaves);
        })
    })

    describe("allowance", function () {
        it("Should return the user allowance value on deployer balance", async function () {
            await Waves.approve(user.address, oneOfWaves);
            expect(await Waves.allowance(deployer.address, user.address)).to.equal(oneOfWaves);
        })

        it("Should return the deployer allowance value on user balance", async function () {
            expect(await Waves.allowance(user.address, deployer.address)).to.equal(0);
        })
    })

    describe("transfer", function () {
        it("Should transfer from deployer balance to user balance", async function () {
            await Waves.transfer(user.address, oneOfWaves);
            expect(await Waves.balanceOf(deployer.address)).to.equal(await Waves.totalSupply() - oneOfWaves);
            expect(await Waves.balanceOf(user.address)).to.equal(oneOfWaves);
        })
        
        it("Should transfer emit a Transfer event", async function () {
            await expect(Waves.transfer(user.address, oneOfWaves))
                .to.emit(Waves, "Transfer")
                .withArgs(deployer.address, user.address, oneOfWaves);
        })

        it("Should revert if the user tries to transfer to the zero address", async function () {
            await expect(Waves.transfer(ethers.ZeroAddress, oneOfWaves)).to.be.revertedWith("Address zero");
            expect(await Waves.balanceOf(deployer.address)).to.equal(await Waves.totalSupply());
        })

        it("Should revert for insufficient balance amount", async function () {
            await expect(Waves.transfer(user.address, await Waves.totalSupply() + oneOfWaves)).to.be.reverted;
            expect(await Waves.balanceOf(deployer.address)).to.equal(await Waves.totalSupply());
            expect(await Waves.balanceOf(user.address)).to.equal(0);
        })
    })

    describe("transferFrom", function () {
        it("Should transfer from deployer balance to user2 balance initiated by user", async function () {
            await Waves.approve(user.address, oneOfWaves);
            await Waves.connect(user).transferFrom(deployer.address, user2.address, oneOfWaves);
            expect(await Waves.balanceOf(deployer.address)).to.equal(await Waves.totalSupply() - oneOfWaves);
            expect(await Waves.balanceOf(user.address)).to.equal(0);
            expect(await Waves.balanceOf(user2.address)).to.equal(oneOfWaves);
        })

        it("Should transfer from deployer balance to user2 balance initiated by user revert for insufficient allowance", async function () {
            await Waves.approve(user.address, oneOfWaves);
            await expect(Waves.connect(user).transferFrom(deployer.address, user2.address, oneOfWaves + oneOfWaves)).to.be.reverted;
            expect(await Waves.balanceOf(deployer.address)).to.equal(await Waves.totalSupply());
            expect(await Waves.balanceOf(user.address)).to.equal(0);
            expect(await Waves.balanceOf(user2.address)).to.equal(0);
        })

        it("Should transfer from deployer balance to zero address balance initiated by user revert", async function () {
            await Waves.approve(user.address, oneOfWaves);
            await expect(Waves.connect(user).transferFrom(deployer.address, ethers.ZeroAddress, oneOfWaves + oneOfWaves)).to.be.revertedWith("Address zero");
            expect(await Waves.balanceOf(deployer.address)).to.equal(await Waves.totalSupply());
            expect(await Waves.balanceOf(user.address)).to.equal(0);
            expect(await Waves.balanceOf(user2.address)).to.equal(0);
        })

        it("Should transfer from deployer balance to user2 balance initiated by user emit a Transfer event", async function () {
            await Waves.approve(user.address, oneOfWaves);
            await expect(Waves.connect(user).transferFrom(deployer.address, user2.address, oneOfWaves))
                .to.emit(Waves, "Transfer")
                .withArgs(deployer.address, user2.address, oneOfWaves);
        })

    })
})

