const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

//Include ethereum-cryptography ECDSA functions
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const { toHex } = require("ethereum-cryptography/utils"); 
const { bytesToHex } = require("ethereum-cryptography/utils"); 
//import { sha256 } from 'ethereum-cryptography/sha256';
const { sha256 } = require("ethereum-cryptography/sha256");
const secp = require("ethereum-cryptography/secp256k1");

//const { recoverPublicKey } = require('noble-curves');
 

app.use(cors());
app.use(express.json());

const balances = {
  "028ff2aebe4876bbbd2418989f49f4f3eafa5bab16f4063e4e0edb76218888bd81": 100,
  "020eda8fbe362fd6c23ea03a26e5fb32332e9dda68579717480f5cef67f4d83cfa": 50, 
  "021698c0835cc788c020c121ee8226d84f92a58855f683fbce2b9b22ea16bb1289": 75 
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  //TODO: get signature and recover public address 
 
  const { messageData , signatureData } = req.body;

  const data = JSON.parse(messageData); 
  console.log(data);
  const sender = data.sender;
  const amount = data.amount;
  const recipient = data.recipient;
  
  const sing = JSON.parse(signatureData);
  sing.r = BigInt(sing.r);
  sing.s = BigInt(sing.s);
  console.log(sing);
  const signature = new secp.secp256k1.Signature(sing.r , sing.s, sing.recovery);
  
  const recover = signature.recoverPublicKey(keccak256(utf8ToBytes(messageData)));
  console.log('Address:', data.sender);
  console.log('RECOVER:', recover.toHex()); 
  
  //if(data.sender === "028ff2aebe4876bbbd2418989f49f4f3eafa5bab16f4063e4e0edb76218888bd81"){
  if(data.sender === recover.toHex()){
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } else{
    res.status(400).send({ message: "Not same sender" });
  }
  
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
