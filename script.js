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
  // decimals
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
];

const CONTRACT_MT_ADDRESS = "0x2E7DA19698F7184f238c6A1bEA52D2e645965396";
const CONTRACT_SOPH_ADDRESS = "0xC1932768A7453c493861E7D5551164878DEcE3d2";
const CONTRACT_FR_ADDRESS = "0xD8f3c097471B621378D3729e1cC4961aC36A3356";
const CONTRACT_BALD_ADDRESS = "0x622bA4BA3b03C653aFD77ee1d605061C8d69817c";

const contractMT = new web3Client.eth.Contract(minABI, CONTRACT_MT_ADDRESS);
const contractSOPH = new web3Client.eth.Contract(minABI, CONTRACT_SOPH_ADDRESS);
const contractFR = new web3Client.eth.Contract(minABI, CONTRACT_FR_ADDRESS);
const contractBALD = new web3Client.eth.Contract(minABI, CONTRACT_BALD_ADDRESS);

const contractList = [contractMT, contractSOPH, contractFR, contractBALD];

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
  const decimals = await contract.methods.decimals().call();

  const amount = decimalsToUnits(result, decimals);

  console.log(`Balance in ${name}: ${amount} ${symbol}`);
};

const decimalsToUnits = (tokenUnits, decimals) => {
  let decimalsInt = parseInt(decimals);
  let tokenUnit =
    tokenUnits.toString().slice(0, -decimalsInt) +
    "." +
    tokenUnits.toString().slice(-decimalsInt);
  return parseFloat(tokenUnit);
};

const retrieveTokenForLoggedUser = async () => {
  const accountKey = await getAccount();
  contractList.forEach((contract) => getBalance(contract, accountKey));
};

retrieveTokenForLoggedUser();
