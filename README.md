# How to run the integration tests

First, create a `.env` file (see `.env.example`) in the root of the project and a fill the `MNEMONIC` variable
correctly. If you need to generate a new mnemonic, you can use [this site](https://iancoleman.io/bip39/).

Then install the dependencies using :

```
pnpm install
```

Then run the fhEVM with :

```
pnpm fhevm:start
```

Finally run the tests in a new terminal window with :

```
pnpm fhevm:faucet
pnpm test
```