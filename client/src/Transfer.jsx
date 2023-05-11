import { useState } from "react";
import server from "./server";
//PJP import ethereum functions
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex } from 'ethereum-cryptography/utils';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { utf8ToBytes } from 'ethereum-cryptography/utils';
import { sha256 } from 'ethereum-cryptography/sha256';

/**
 * Function that receive one HEXADICIMAL in String format and return Uint8Array that represent private key
 * 
 * @param {*} hexString 
 * @returns uint8Array 
 */
function hexStringToUint8Array(hexString) {
  const hexArray = hexString.match(/.{1,2}/g); // split the hex string into an array of hex pairs
  const uint8Array = new Uint8Array(hexArray.map((x) => parseInt(x, 16)));
  return uint8Array;
}

let signatureData;

function Transfer({ address, setAddress, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [dataToSend, setDataToSend] = useState({});
  let [signature, setSignature] = useState(null);

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) { 
    evt.preventDefault();  

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        messageData: JSON.stringify(dataToSend),
       signatureData: JSON.stringify(signatureData)
      // signatureData: signature
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
      alert(ex);
    }
  }

  function onChange(evt){
    setAddress(address);
    console.log('ADDRESS ***********************', address);
    dataToSend.sender = address;
    setDataToSend({ sender: address, amount: parseInt(sendAmount), recipient: recipient });
    
//    console.log('dataToSend::::::', dataToSend);

    const uint8ArrayPrivateKey = hexStringToUint8Array(privateKey);

//    console.log('Private @@@@@@@@@@@@@@@@', privateKey);

    console.log('JSON.stringify(dataToSend)11111111111111', JSON.stringify(dataToSend));

    signatureData =  secp.secp256k1.sign(keccak256(utf8ToBytes(JSON.stringify(dataToSend))), uint8ArrayPrivateKey).addRecoveryBit(1);
    signatureData.r = BigInt(signatureData.r).toString();
    signatureData.s = BigInt(signatureData.s).toString();
    signatureData.recovery = signatureData.recovery;
     
 
    //const signatureData =  secp.secp256k1.sign(keccak256(utf8ToBytes(JSON.stringify(dataToSend))), hexPriv);
    signature = JSON.stringify(signatureData)
    setSignature(JSON.stringify(signatureData));  
    console.log('signature***********************************************', signature);
   // console.log('JSON.stringify(signatureData)', JSON.stringify(signatureData));

   // console.log('JSON.stringify(dataToSend)222222222222222', JSON.stringify(dataToSend));
  }

  return (
    <form className="container transfer" onSubmit={transfer} onBlur={onChange} onChange={onChange}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)} 
        ></input>
      </label>
      
      
      

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
