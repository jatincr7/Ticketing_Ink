const hre = require("hardhat");

async function main() {
  // Deploying TaskManagement contract
  const TaskManagement = await hre.ethers.getContractFactory("TaskManagement");
  const taskManagement = await TaskManagement.deploy();

  await taskManagement.deployed();

  console.log("TaskManagement contract deployed to:", taskManagement.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
