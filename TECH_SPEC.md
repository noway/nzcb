# NZ COVID Badge

An ERC721 collection gated by [NZ COVID Passes](https://github.com/minhealthnz/nzcovidpass-spec).

## Goals

NZ COVID Badge balances the following goals:

- Verify that the user has a valid NZ COVID Pass
- Only allow 1 NZ COVID Badge per person
- Don't let NZ COVID Pass leak
- Don't let user identity leak
- Protect user from MEV

## Verification of an NZ COVID Pass

An NZ COVID Pass is valid if:
- Signature is valid and signed by NZ Ministry of Health
- Pass is not expired

In order to verify the signature, the full pass is not needed. Merely the SHA256 hash of the `ToBeSigned` value is sufficient.

We verify that the signature is valid by computing `SHA256(ToBeSigned)` inside the circuit and then running the `EllipticCurve.validateSignature` function on the result in the Solidity `mint` function. This way, we know the hash belongs to the pass the user holds, even though we don't know the full pass itself.

## One NZ COVID Badge per person

In order to prevent the user from having multiple NZ COVID Badges, we limit the number of NZ COVID Badge to 1 per blinded nullifier hash (aka `nullifierHashPart`). We define blinded nullifier hash as:

```javascript
credentialSubject = `${givenName},${familyName},${dob}`
nullifierHashPart = SHA512(credentialSubject)[0:256]
```

In the smart contract, we only allow `nullifierHashPart` to be used once (i.e., after minting the `nullifierHashPart` is considred 'spent')

## Not letting NZ COVID Pass leak

Since we're only sending the `ToBeSigned` value, `r` and `s` to the contract, it's not possible for an attacker to reconstruct the full pass. For the  full pass, the attacker will need to also have the credential subject (that is only passed to the contract as a blinded nullifier hash), `exp`, `nbf` as well as the `cti` (CWT ID). While `exp` value is passed to the contract as plain text, and `nbf` value is trivially derived, the `cti` (CWT ID) value is never revealed. Therefore, the attacker will need to fully reverse the blinded nullifier hash as well as guess the `cti` (which is a 16-byte random string issued by NZ Ministry of Health) to reconstruct the full pass. If we assume that an attacker already guessed the credential subject and that they have equipment which can generate 100 TH/s, they will need 14 billion years to guess the full pass.

## Not letting user identity leak

An important property of `nullifierHashPart` is that it's blinded. Since we only output 256 bits of nullifier hash, it means that by spending 1 blinded nullifier hash, we spend 2<sup>256</sup> nullifiers. While the entropy of nullifier (`${givenName},${familyName},${dob}`) is low, the entropy of a blinded nullifier hash is high since a blinded nullifier hash will match not just 1 identity, but up to 2<sup>256</sup> identities. This makes it especially hard for an attacker to perform a brute force attack on the pre-image (`${givenName},${familyName},${dob}`) of a blinded nullifier hash.

## MEV protection
User specifies the address they would like to receive their NZ COVID Badge at as an input signal to the circuit (the pass-through `data`). This way, an MEV searcher would not be able to front-run user's transaction, since they would also need a full pass to compute the zero knowledge proof and set a different address.

## Pseudocode of the circuit
- Circuit takes in `ToBeSigned` value, pass-through `data`
- Parses `ToBeSigned` as CBOR
- Finds `exp` (expiration date) value of the pass
- Finds `vc` map in it (verified credential)
- Jumps to the position of `credentialSubject` which is assumed to be at the position of `vc` + 171
- Gets `givenName`, `familyName` and `dob` out of `credetialSubject`
- Constructs the nullifier in the form of `${givenName},${familyName},${dob}`
- Hashes the nullifier as sha512 to get the `nullifierHash`
- Gets the first 256 bits of the nullifierHash to get the blinded nullifierHash (aka `nullifierHashPart`)
- Takes sha256 hash of `ToBeSigned` value to get the `toBeSignedHash`
- Exports `nullifierHashPart`, `toBeSignedHash`, `exp` as well as `data` which is pass-through data

You can find the javascript version of the circuit in `nzcpCircom.ts` (`getNZCPPubIdentity` function) in the Dapp repo.