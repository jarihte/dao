const { ethers } = require("hardhat");
// We import Chai to use its asserting functions here.
const { expect } = require("chai");
const cb = require("../tools/createBytes");
const pb = require("../tools/parseBytes");

// `describe` is a Mocha function that allows you to organize your tests. It's
// not actually needed, but having your tests organized makes debugging them
// easier. All Mocha functions are available in the global scope.

// `describe` receives the name of a section of your test suite, and a callback.
// The callback must define the tests of that section. This callback can't be
// an async function.
describe("DAO contract", function () {
  // Mocha has four functions that let you hook into the the test runner's
  // lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.

  // They're very useful to setup the environment for tests, and to clean it
  // up after they run.

  // A common pattern is to declare some variables, and assign them in the
  // `before` and `beforeEach` callbacks.

  let Dao;
  let dao;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let addr4;
  let addr5;
  let addr6;
  let pitch;
  let proposal1;
  let proposal2;
  let proposal3;
  let pitch_string;
  let proposal1_string;
  let proposal2_string;
  let proposal3_string;

  before(async function () {
    // Get the ContractFactory and Signers here.
    Dao = await ethers.getContractFactory("Ballot");
    [owner, addr1, addr2, addr3, addr4, addr5, addr6] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", owner.address);

    // To deploy our contract, we just have to call Dao.deploy() and await
    // for it to be deployed(), which happens once its transaction has been
    // mined.
    pitch_string = "Time for an important decision";
    pitch = cb.createBytes(pitch_string);
    console.log("Pitch:", pitch_string);
    console.log("  bytes32:", pitch);

    proposal1_string = "this is the option 1";
    proposal1 = cb.createBytes(proposal1_string);
    console.log("Proposal 1:", proposal1_string);
    console.log("  bytes32:", proposal1);

    proposal2_string = "option 2 is another choice";
    proposal2 = cb.createBytes(proposal2_string);
    console.log("Proposal 2:", proposal2_string);
    console.log("  bytes32:", proposal2);

    proposal3_string = "la réponse C";
    proposal3 = cb.createBytes(proposal3_string);
    console.log("Proposal 3:", proposal3_string);
    console.log("  bytes32:", proposal3);

    dao = await Dao.deploy("0x0CCD818D400D97760C1102EB99BE664F4cD0B26F", pitch, [proposal1, proposal2, proposal3]);
    await dao.deployed();

    console.log("DAO deployed to:", dao.address);
  });

  // Badge ownership
  //       id0  id1
  // addr1   1    0
  // addr2   1    1
  // addr3   1    0
  // addr4   1    0
  // addr5   1    0
  // addr6   0    1

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.

    // If the callback function is async, Mocha will `await` it.
    it("Should set the right owner", async function () {
      // Expect receives a value, and wraps it in an Assertion object. These
      // objects have a lot of utility methods to assert values.

      // This test expects the owner variable stored in the contract to be equal
      // to our Signer's owner.
      expect(await dao.chairperson()).to.equal(owner.address);
    });
  });

  describe("Votes", function () {
    it("Should delegate to other accounts", async function () {
      // Delegate
      // 1->2
      await dao.connect(addr1).delegate(addr2.address);
      // 3->1->2
      await dao.connect(addr3).delegate(addr1.address);

      // // Check the 3 accounts
      // expect(await dao.voters[addr1.address].weight()).to.equal(0);
      // expect(await dao.voters[addr2.address].weight()).to.equal(3);
      // expect(await dao.voters[addr3.address].weight()).to.equal(0);
    });

    it("Should show voter status", async function () {
      // getVoterStatus
      const voted1 = await dao.getVoterStatus(addr1.address);
      const voted2 = await dao.getVoterStatus(addr2.address);
      const voted3 = await dao.getVoterStatus(addr3.address);
      const voted4 = await dao.getVoterStatus(addr4.address);
      const voted5 = await dao.getVoterStatus(addr5.address);
      const voted6 = await dao.getVoterStatus(addr6.address);

      console.log("Has voted?:");
      console.log("  1:", voted1);
      console.log("  2:", voted2);
      console.log("  3:", voted3);
      console.log("  4:", voted4);
      console.log("  5:", voted5);
      console.log("  6:", voted6);

      // Check the voter status
      expect(voted1).to.true;
      expect(voted2).to.false;
      expect(voted3).to.true;
      expect(voted4).to.false;
      expect(voted5).to.false;
      expect(voted6).to.false;
    });

    it("Should show weight", async function () {
      // getVoterWeight
      const weight1 = await dao.getVoterWeight(addr1.address);
      const weight2 = await dao.getVoterWeight(addr2.address);
      const weight3 = await dao.getVoterWeight(addr3.address);
      const weight4 = await dao.getVoterWeight(addr4.address);
      const weight5 = await dao.getVoterWeight(addr5.address);
      const weight6 = await dao.getVoterWeight(addr6.address);

      console.log("Weights:");
      console.log("  1:", weight1);
      console.log("  2:", weight2);
      console.log("  3:", weight3);
      console.log("  4:", weight4);
      console.log("  5:", weight5);
      console.log("  6:", weight6);

      // Check the weights
      expect(weight1).to.equal(5);
      // expect(weight2).to.equal(25);
      expect(weight3).to.equal(5);
      expect(weight4).to.equal(5);
      expect(weight5).to.equal(5);
      // expect(weight6).to.equal(10);
    });

    it("Should vote", async function () {
      // Vote
      await dao.connect(addr2).vote(1);
      await dao.connect(addr4).vote(0);
      await dao.connect(addr5).vote(2);
      // await dao.connect(addr6).vote(1);

      // getVotedProposal
      const vote1 = await dao.getVotedProposal(addr1.address);
      const vote2 = await dao.getVotedProposal(addr2.address);
      const vote3 = await dao.getVotedProposal(addr3.address);
      const vote4 = await dao.getVotedProposal(addr4.address);
      const vote5 = await dao.getVotedProposal(addr5.address);
      // const vote6 = await dao.getVotedProposal(addr6.address);

      console.log("Has voted for the proposal:");
      console.log("  1:", vote1);
      console.log("  2:", vote2);
      console.log("  3:", vote3);
      console.log("  4:", vote4);
      console.log("  5:", vote5);
      // console.log("  6:", vote6);

      // Check the 6 accounts
      expect(vote1).to.equal(1);
      expect(vote2).to.equal(1);
      expect(vote3).to.equal(1);
      expect(vote4).to.equal(0);
      expect(vote5).to.equal(2);
      // expect(vote6).to.equal(1);
    });

    it("Should show the winning proposal", async function () {
      /// Get the winning proposal
      const winningProposal = await dao.winningProposal();
      const winnerName = await dao.winnerName();

      console.log("Winning proposal:", winnerName);
      console.log("  index:", winningProposal);
      console.log("  string:", pb.parseBytes(winnerName));
      console.log("  voterCount:", await dao.getProposalVoterCount(winningProposal));
      console.log("  voteCount:",  await dao.getProposalVoteCount(winningProposal));

      // Check the vote result
      // expect(winningProposal).to.equal(1);
      // expect(winnerName).to.equal(proposal2);
      // expect(pb.parseBytes(winnerName)).to.equal(proposal2_string);
    });
  });
});
