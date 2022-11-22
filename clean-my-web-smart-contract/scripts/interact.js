// const hre = require("hardhat");
// const { expect } = require("chai");

// async function main() {
//     const Greeter = await ethers.getContractFactory("Greeter");
//     const greeter = await Greeter.attach(
//         "0x5194d9D83B669a57F11A84c87D6eEFdb5E2eDeF0" // The deployed contract address
//     );  

//     expect(await greeter.greet()).to.equal("Hello, Hardhat!");
//     console.log(await greeter.greet());

//     const setGreetingTx = await greeter.setGreeting("Hola, mundo!");
//     // wait until the transaction is mined
//     await setGreetingTx.wait();
    
//     expect(await greeter.greet()).to.equal("Hola, mundo!");
//     console.log(await greeter.greet());
//   }
  
//   // We recommend this pattern to be able to use async/await everywhere
//   // and properly handle errors.
//   main()
//     .then(() => process.exit(0))
//     .catch((error) => {
//       console.error(error);
//       process.exit(1);
//     });