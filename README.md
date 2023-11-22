# How to run tests

First run the normal version of fhEVM with `pnpm fhevm:start` then copy the default setup file locally with : 

```shell
docker cp fhevm:/config/setup.sh .
```
Then kill the default fhEVM docker instance, and edit the `setup.sh` : set the gasLimit to 100M instead of 10M by editing the value of : 
```
cat $HOME_EVMOSD/config/genesis.json | jq '.consensus_params["block"]["max_gas"]
```
The run the custom fhEVM instance with the new custom gas limit :
```
docker run -i -v $PWD/setup.sh:/config/setup.sh -p 8545:8545 --rm --name fhevm ghcr.io/zama-ai/evmos-dev-node:v0.1.10
```

Finally use the faucet (after setting a .env, see .env.example) and run the hardhat test :

```shell
pnpm fhevm:faucet
pnpm test
```
