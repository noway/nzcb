# NZCOVIDBadge

An ERC721 collection gated by NZ COVID Passes.

## Privacy

NZCOVIDBadge balances the following goals:

- Verify that the user has a valid NZCP
- Allow only 1 NZCOVIDBadge per NZCP
- Don't let NZ COVID Pass leak
- Don't let user identity leak

### Verification of NZCP

A NZ COVID Pass is valid if:
- Signature is valid and signed by NZ Ministry of Health
- Pass is not expired

In order to verify the signature, the full pass is not actually needed. Merely the SHA256 hash of the `ToBeSigned` value is sufficient.

We verify that the signature is valid by passing `toBeSignedHash=SHA256(ToBeSigned)` into `mint` function calldata through nzcp-circom packed signals.

### One NZCOVIDBadge per NZCP

In order to prevent the user from having multiple NZCOVIDBadge, we limit the number of NZCOVIDBadge to 1 per credential subject hash. We define credential subject hash as

```javascript
credSubj = `${givenName},${familyName},${dob}`
credSubjHash = SHA256(credSubj)
```

You might notice that credSubjHash is susceptible to brute force attacks on the pre-image. Since there only are so many latinized givenName, familyName and dob combinations, having `credSubjHash` published as calldata might cause the users to get their identity revealed. The problem is exhaustarbated if an attacker already knows user's givenName and familyName and merely needs to guess the dob.

If multiple users to use the `mint` function, their credSubjHash would be published on blockchain as calldata. An attacker could then use hash table/rainbow table attack where they generate a table for some combinations of` credSubj` and compare it against all available `credSubjHash`s and thus reveal some or all users' identity.


### ZK SNARK verification key generation
powersOfTau28_hez_final_22.ptau from https://github.com/iden3/snarkjs#7-prepare-phase-2 was used to generate the ZK SNARK verification key. Blake2b hash is 0d64f63dba1a6f11139df765cb690da69d9b2f469a1ddd0de5e4aa628abb28f787f04c6a5fb84a235ec5ea7f41d0548746653ecab0559add658a83502d1cb21b

you can verify that the key matches by running `make plonk` and then comparing the `nzcp_example_final.zkey` or `nzcp_live_final.zkey`