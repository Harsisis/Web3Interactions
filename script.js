const endpointUrl =
  "https://frosty-holy-forest.matic-testnet.quiknode.pro/b4faa107e42ea7b0500ad05192d8022970e298f0/";
const httpProvider = new Web3.providers.HttpProvider(endpointUrl);
const web3Client = new Web3(httpProvider);

const minABI = [
  // balanceOf
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  // name
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
  // symbol
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
];
const CONTRACT_MT_ADDRESS = "0x2E7DA19698F7184f238c6A1bEA52D2e645965396";
const CONTRACT_SOPH_ADDRESS = "0xC1932768A7453c493861E7D5551164878DEcE3d2";

const contractMT = new web3Client.eth.Contract(minABI, CONTRACT_MT_ADDRESS);
const contractSOPH = new web3Client.eth.Contract(minABI, CONTRACT_SOPH_ADDRESS);

const contractList = [contractMT, contractSOPH];

const MMSDK = new MetaMaskSDK.MetaMaskSDK();

setTimeout(() => {
  const ethereum = MMSDK.getProvider(); // You can also access via window.ethereum

  ethereum.request({ method: "eth_requestAccounts" });
}, 0);

const getAccount = async () => {
  const accounts = await window.ethereum
    .request({ method: "eth_requestAccounts" })
    .catch((err) => {
      if (err.code === 4001) {
        console.log("Please connect to MetaMask.");
      } else {
        console.error(err);
      }
    });
  const account = accounts[0];
  console.log(account);
  return account;
};

const getBalance = async (contract, wallet) => {
  const result = await contract.methods.balanceOf(wallet).call();
  const name = await contract.methods.name().call();
  const symbol = await contract.methods.symbol().call();

  console.log(`Balance in ${name}: ${result} ${symbol}`);
};

const retrieveTokenForLoggedUser = async () => {
  const accountKey = await getAccount();
  contractList.forEach((contract) => getBalance(contract, accountKey));
};

retrieveTokenForLoggedUser();
