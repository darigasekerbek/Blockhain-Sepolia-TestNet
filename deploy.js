const { Web3 } = require("web3");
var ETHEREUM_NETWORK = "sepolia";
var INFURA_API_KEY = "d8843ae7c7ea4c8d97abc7bdf08a5186";
var SIGNER_PRIVATE_KEY = "7e28bf90916100b66825657f68b02d8e19e2e21503a3a96971596ec9e142db50";

var DEMO_CONTRACT = '0x8D5a64216Df78D2826C29167Bc59810C284ae655';

// Loading the contract ABI and Bytecode
// (the results of a previous compilation step)
const fs = require("fs");
const { abi, bytecode } = JSON.parse(fs.readFileSync("Demo.json"));
async function main() {
  // Configuring the connection to an Ethereum node
  const network = ETHEREUM_NETWORK;
  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      `https://${network}.infura.io/v3/${INFURA_API_KEY}`
    )
  );
  // Creating a signing account from a private key
  const signer = web3.eth.accounts.privateKeyToAccount(
    '0x' + SIGNER_PRIVATE_KEY
  );
  web3.eth.accounts.wallet.add(signer);
  // Using the signing account to deploy the contract
  const contract = new web3.eth.Contract(abi);
//   contract.options.data = bytecode;
console.log(1);
  const deployTx = contract.deploy({data: bytecode});
  console.log(2);
  const deployedContract = await deployTx
    .send({
      from: signer.address,
      gas: 3000000
    })
    .once("transactionHash", (txhash) => {
        console.log(3);
      console.log(`Mining deployment transaction ...`);
      console.log(`https://${network}.≈.io/tx/${txhash}`);
    });
  // The contract is now deployed on chain!
  console.log(`Contract deployed at ${deployedContract.options.address}`);
  console.log(
    `Add DEMO_CONTRACT to the.env file to store the contract address: ${deployedContract.options.address}`,
  );
}

main();
