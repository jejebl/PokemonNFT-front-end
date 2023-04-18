import abi from './Pokemon.json';
import { ethers } from "ethers";
import './App.css';
import React, { useEffect, useState } from "react";
import { pikachuData } from './pikachuData.js';
import { raichuData } from './raichuData.js';
import Logo from './Pokémon_logo.png';

function App() {

  // Contract Address & ABI
  const contractAddress = "0xc6501e25E85c07dAa9547d40912cd5f584B98367";
  const contractABI = abi.abi;

  const [tokenId, setTokenId] = useState();
  const [defaultAccount, setDefaultAccount] = useState(false);
  let provider;
  let signer;
  const [getPikachuUpdate, setGetPikachuUpdate] = useState("");
  const [evolveUpdate, setEvolveUpdate] = useState("");

  const onTokenIdChange = (event) => {
    setTokenId(event.target.value);
  }

  //Check on refresh if the user is connected to MetaMask
  useEffect(() => {
    async function look(){
      let provider = new ethers.providers.Web3Provider(window.ethereum);

      const addresses = await provider.listAccounts(); 
      // it doesn't create metamask popup
      if (addresses.length) {
        // permission already granted so request account address from metamask
        setDefaultAccount(true);
      } else {
        setDefaultAccount(false);
      }
    }
    look();
  })

  //Function to connect the user with MetaMask
  async function connectwalletHandler() {
    if (typeof window.ethereum == 'undefined') {
        alert("Please install Metamask !")
    }

    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    if (provider!=null) {
      setDefaultAccount(true);
    } else {
      setDefaultAccount(false);
    }
  }

  async function getPikachu(){
    try {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      signer = provider.getSigner()

      if (provider!=null) {
        const Pokemon = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log(Pokemon);
        setGetPikachuUpdate("A Pikachu is sent to your wallet, please wait...")
        try {
          const getPikachuCall = await Pokemon.mint(pikachuData,"Pikachu");
          await getPikachuCall.wait();
          setGetPikachuUpdate("Minted");
          alert("You received a pikachu!");
        } catch (error) {
          setGetPikachuUpdate("Not minted");
        }

      } 

    }catch (error) {
      console.log(error);
    }
  }

  async function evolveYourPikachu(){
    try {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      signer = provider.getSigner()

      if (provider!=null) {
        const Pokemon = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        setEvolveUpdate("Your Pikachu is evolving, please wait...")
        try {
          const pikachuEvolve = await Pokemon.evolve(Number(tokenId), raichuData,"Raichu");
          await pikachuEvolve.wait();
          setEvolveUpdate("Your Pikachu has evolve into Raichu");
          alert("Your Pikachu has evolve into Raichu");
        } catch (error) {
          setEvolveUpdate("Your Pikachu hasn't evloved");
          alert("Your Pikachu hasn't evloved");
        }

      } 

    }catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="App">

      {!defaultAccount && (
        <div className='Header'>
          <button className='buttonConnect' onClick={connectwalletHandler}>Connect your Wallet</button>
        </div>
      )}

      
      <img className='imgPokemonLogo' src={Logo} alt="Pokémon Logo" />
      
      <p className='title'>Welcome pokémon trainer!</p>
      <br></br>
      {!defaultAccount && (
        <p className='requirement'>You have to connect your wallet</p>
      )}
      <br></br>
      {defaultAccount && (
        <p className='requirement'>You can get a Pikachu NFT here:</p>
      )}
      <br></br><br></br>

      {defaultAccount && (
        <button className='buttonGetPikachu' onClick={getPikachu}>Get a Pikachu</button>
      )}
      <br></br>
      {getPikachuUpdate}

      <br></br><br></br><br></br>
      {defaultAccount && (
        <a rel="noopener noreferrer" target="_blank" href='https://jejebl.github.io/NFTExplorerMumbai/'>See your Pokémon here</a>
      )}
      <br></br><br></br><br></br><br></br>

      {defaultAccount && (
        <form className='evolveContainer'>
          <p className='evolveTitle'>You can evolve your Pikachu NFT here:</p>
          <br /><br />
          <div className='tokenIdContainer'>
            <label>Token Id of your Pikachu</label>
            <input className='tokenIdInput' id="tokenId" type="number" placeholder="tokenId" onChange={onTokenIdChange} required/>
          </div>
          <br /><br />
          <button className='buttonEvolve' type="button" onClick={evolveYourPikachu}>Evolve your Pikachu</button>
        </form>
      )}
      <br /><br />
      {evolveUpdate}



    </div>
  );
}

export default App;
