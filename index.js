const { ethers } = require("ethers");

const infuraID = "2VOaJ1pdCndLpwmgvN9hsxPxW4L";

const provider = new ethers.providers.JsonRpcProvider(
  `https://mainnet.infura.io.infura.io/v3/${infuraID}`
);

provider
  .getBlockNumber()
  .then((blockNumber) => {
    console.log(blockNumber);
  })
  .catch((error) => {
    console.error(error);
  });
