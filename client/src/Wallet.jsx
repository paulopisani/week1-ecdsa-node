import server from "./server";

import * as secp from "ethereum-cryptography/secp256k1";
import { toHex } from 'ethereum-cryptography/utils'

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    const address = toHex(secp.secp256k1.getPublicKey(privateKey));
    setAddress(address); 
    if (address) {
      const { 
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }    
    
    /*
    const address = evt.target.value;
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
    */

    /*
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    if (privateKey) {
      const {
        privateKey: 
      }
    }
    */

  }

  return (
    <div className="container wallet">
      <h1>Your Wallet PJP</h1>

      <label>
        Private Address
        <input placeholder="Type an private key, danger here" value={privateKey} onChange={onChange} onBlur={onChange}></input>
      </label>

      <div>
        Address: {address.slice(0, 10)}...
      </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
