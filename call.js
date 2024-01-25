const { Web3 } = require("web3");

var ETHEREUM_NETWORK = "sepolia";
var INFURA_API_KEY = "d8843ae7c7ea4c8d97abc7bdf08a5186";
var SIGNER_PRIVATE_KEY = "7e28bf90916100b66825657f68b02d8e19e2e21503a3a96971596ec9e142db50";
var DEMO_CONTRACT = '0x8D5a64216Df78D2826C29167Bc59810C284ae655';

// Loading the contract ABI
// (the results of a previous compilation step)
const fs = require("fs");
const { abi } = JSON.parse(fs.readFileSync("Demo.json"));

async function main() {
  // Configuring the connection to an Ethereum node
  const network = ETHEREUM_NETWORK;
  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      `https://${network}.infura.io/v3/${INFURA_API_KEY}`,
    ),
  );
  // Creating a signing account from a private key
  const signer = web3.eth.accounts.privateKeyToAccount(
    "0x" + SIGNER_PRIVATE_KEY
  );
  web3.eth.accounts.wallet.add(signer);
  // Creating a Contract instance
  const contract = new web3.eth.Contract(
    abi,
    // Replace this with the address of your deployed contract
    DEMO_CONTRACT,
  );
  // Issuing a transaction that calls the `echo` method
  const method_abi = contract.methods.echo("Hello, world!").encodeABI();
  const tx = {
    from: signer.address,
    to: contract.options.address,
    data: method_abi,
    value: '0',
    gasPrice: '100000000000',
  };
  const gas_estimate = await web3.eth.estimateGas(tx);
  tx.gas = gas_estimate;
  const signedTx = await web3.eth.accounts.signTransaction(tx, signer.privateKey);
  console.log("Raw transaction data: " + ( signedTx).rawTransaction);
  // Sending the transaction to the network
  const receipt = await web3.eth
    .sendSignedTransaction(signedTx.rawTransaction)
    .once("transactionHash", (txhash) => {
      console.log(`Mining transaction ...`);
      console.log(`https://${network}.etherscan.io/tx/${txhash}`);
    });
  // The transaction is now on chain!
  console.log(`Mined in block ${receipt.blockNumber}`);
}
main();