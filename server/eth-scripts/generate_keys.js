//Include ethereum-cryptography ECDSA functions
//const { keccak256 } = require("ethereum-cryptography/keccak");
const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");


//const privateKey = secp.utils.randomPrivateKey();
const privateKey = secp.secp256k1.utils.randomPrivateKey();

const publicKey = secp.secp256k1.getPublicKey(privateKey);

console.log('private key:',toHex(privateKey));
console.log('public:',toHex(publicKey))
