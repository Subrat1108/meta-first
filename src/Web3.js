// Contract address : 0xE3b07796A40cD418472d2071aB2f5816377C828A
import abi from './abi/abi.json' assert { type: 'json' };

const blockchain = new Promise((resolve, reject) => {
  //Check if metamask is not available
  if (typeof window.ethereum === 'undefined') {
    reject('Metamask is required!');
  }

  //Instantiate web3
  let web3 = new Web3(window.ethereum);
  let contract = new web3.eth.Contract(
    abi,
    '0xE3b07796A40cD418472d2071aB2f5816377C828A'
  );

  //Get my metamask address
  web3.eth.requestAccounts().then(accounts => {
    console.log('My account => ', accounts[0]);
  });

  //Get current supply of NFT Tokens
  web3.eth.requestAccounts().then(accounts => {
    // use call() since its a view function
    contract.methods
      .totalSupply()
      .call({ from: accounts[0] })
      .then(supply => {
        console.log('Total current supply of Tokens => ', supply);
      });
  });

  //Get max supply of the tokens
  web3.eth.requestAccounts().then(accounts => {
    contract.methods
      .maxSupply()
      .call({ from: accounts[0] })
      .then(maxSupply => {
        console.log('Max supply of tokens : ', maxSupply);
      });
  });

  //Get my buildings made in the metaverse
  web3.eth.requestAccounts().then(accounts => {
    contract.methods
      .getOwnerBuildings()
      .call({ from: accounts[0] })
      .then(buildings => {
        console.log('My buildings : ', buildings);
      });
  });

  //Get all buildings made in the metaverse
  web3.eth.requestAccounts().then(accounts => {
    contract.methods
      .totalSupply()
      .call({ from: accounts[0] })
      .then(totalSupply => {
        contract.methods
          .getBuildings()
          .call({ from: accounts[0] })
          .then(buildings => {
            console.log('Supply: ', totalSupply, ' buildings: ', buildings);
            resolve({ totalSupply, buildings });
          });
      });
  });
});

export default blockchain;
