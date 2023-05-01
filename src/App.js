import abi from './Pokemon.json';
import { ethers } from "ethers";
import './App.css';
import React, { useEffect, useState } from "react";
import { pikachuData } from './pikachuData.js';
import Pikachu from './PikachuIMG.svg';
import { raichuData } from './raichuData.js';
import Raichu from './RaichuIMG.svg';
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
        
    let button = document.querySelector('.buttonPikachu');
    button.disabled = true;

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

        setGetPikachuUpdate("A Pikachu is sent to your wallet, please wait...")
        try {
          const getPikachuCall = await Pokemon.mint(pikachuData,"Pikachu");
          await getPikachuCall.wait();
          setGetPikachuUpdate("Minted");
          alert("You received a pikachu!");
          button.disabled = false;
        } catch (error) {
          setGetPikachuUpdate("Not minted");
          button.disabled = false;
        }

      } 

    }catch (error) {
      console.log(error);
      button.disabled = false;
    }
  }

  async function evolveYourPikachu(){
    
    let button = document.querySelector('.buttonRaichu');
    button.disabled = true;

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
          button.disabled = false;
        } catch (error) {
          setEvolveUpdate("Your Pikachu hasn't evloved");
          alert("Your Pikachu hasn't evloved");
          button.disabled = false;
        }

      } 

    }catch (error) {
      console.log(error);
      button.disabled = false;
    }
  }

  return (
    <div className="App">

      {!defaultAccount && (
        <div className='Header'>
          <button className='buttonConnect' onClick={connectwalletHandler}>Connect your Wallet</button>
        </div>
      )}

      <div className='pokemon_logo_container'>
        <img className='imgPokemonLogo' src={Logo} alt="Pokémon Logo" />
      </div>
      
      <p className='title'>Welcome pokémon trainer!</p>
      <br></br>
      {!defaultAccount && (
        <p className='requirement'>You have to connect your wallet</p>
      )}
      <br></br>
      {defaultAccount && (
        <div className='pokemon_explication_container'>
          
          <p>You can get a Pikachu NFT and evolve him to get a Raichu NFT instead. This NFT are deployed on Polygon Mumbai testnet network and the metadata are stored on-chain.</p>
          <p>See your Pokemon NFT on <a rel="noopener noreferrer" target="_blank" href='https://testnets.opensea.io/'>Opensea testnet.</a></p>
          <p>You can retrieve the tokenId of your NFT in his name after the #.</p>
          <p>Once evolve, your Raichu can't go back and be a Pikachu!</p>
          <p>To see your Raichu on Opensea testnet, you need to click on refresh metadata on your Pikachu.</p>
          
        </div>
      )}


      {defaultAccount && (
        <div className='pokemon_action_container'>
          
          <div className='pokemon_container'>
            <div className='pokemon_img_container'>
              <img alt="Pikachu" src={Pikachu}></img>
            </div>
            <button className='buttonPikachu' onClick={getPikachu}>Get a Pikachu</button>
            {getPikachuUpdate}
          </div>

          <div className='pokemon_container'>
            <div className='pokemon_img_container'>
              <img alt="Raichu" src={Raichu}></img>
            </div>
            <form className='evolveContainer'>
              <div className='tokenIdContainer'>
                <label>Token Id of your Pikachu</label>
                <input className='tokenIdInput' id="tokenId" type="number" placeholder="tokenId" onChange={onTokenIdChange} required/>
              </div>
              <button className='buttonRaichu' type="button" onClick={evolveYourPikachu}>Evolve your Pikachu</button>
            </form>
            {evolveUpdate}
          </div>

        </div>
      )}
    </div>
  );
}

export default App;
