const CaptureTheEtherTest = artifacts.require("CaptureTheEtherTest");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("CaptureTheEtherTest", function (accounts) {
  const [alice, bob, chuck, david] = accounts;
  console.log(`alice: ${alice}`);
  console.log(`bob: ${bob}`);
  console.log(`chuck: ${chuck}`);
  console.log(`david: ${david}`);

  it("should assert true", async function () {
    await CaptureTheEtherTest.deployed();
    return assert.isTrue(true);
  });
});
