import {Sdk} from '@unique-nft/sdk'
import {ethers} from 'hardhat'
import {KeyringProvider} from '@unique-nft/accounts/keyring'
import {
  UniqueFungibleFactory,
  UniqueFungible,
  CollectionHelpersFactory,
} from '@unique-nft/solidity-interfaces'
import {Address} from '@unique-nft/utils/address'

const baseUrl = 'https://rest.unique.network/opal/v1'
// dummy account created only for this test
const mnemonic = 'solar float siege poverty catch resource uncle verify kitchen cactus frog skill'
const substrateMirror = '5DVgiNh1Go8ESa18xEirA4uV3zpra59awPGQjJTmCrqYMNtM'
const myEthAddress = '0xb4d6A98aa8CD5396069c2818Adf4ae1A0384b43a'

async function main() {
  const account = await KeyringProvider.fromMnemonic(mnemonic)
  const address = account.instance.address

  const sdk = new Sdk({
    baseUrl,
    signer: account,
  })

  const collectionResult = await sdk.fungible.createCollection.submitWaitResult({
    address,
    name: 'Yuriy Fungible',
    description: 'Fungible collection for testing',
    tokenPrefix: 'FTYU',
    decimals: 30,
  })

  if (collectionResult.error) {
    console.log(`Collection was not created. Error: ${collectionResult.error}`)
    process.exit()
  } else {
    console.log(`The collection was created: id = ${collectionResult.parsed?.collectionId}`)
  }
  const collectionId = collectionResult.parsed?.collectionId
  if (!collectionId) {
    throw new Error('Invalid collectionId');
  }

  /* const tokenResult = await sdk.fungible.addTokens.submitWaitResult({
    address,
    // @ts-ignore
    collectionId,
    amount: 30,
    recipient: address,
  })

  if (tokenResult.error) {
    console.log(`Token was not created. Error: ${tokenResult.error}`)
    process.exit()
  } else {
    console.log(
      // amount - undefined
      `The ${tokenResult.parsed?.amount} tokens were created in collection # ${tokenResult.parsed?.collectionId}`
    )
  } */

  const provider = ethers.provider
  const privateKey = process.env.PRIVATE_KEY as string;

  const wallet = new ethers.Wallet(privateKey, provider)

  /*
  await sdk.collections.addAdmin.submitWaitResult({
    collectionId,
    address,
    newAdmin: Address.mirror.ethereumToSubstrate(wallet.address),
  })
   */
  const transferResult = await sdk.collections.transfer.submitWaitResult({
    collectionId,
    address, // address instead of from:
    to: Address.mirror.ethereumToSubstrate(wallet.address),
  })
  console.log(
      `Collection # ${transferResult.parsed?.collectionId} was transferred to the ${transferResult.parsed?.owner} address.`
  )

  const collection = await UniqueFungibleFactory(collectionId, wallet, ethers)

  const gasPriceResult = await sdk.stateQuery.execute({endpoint: 'rpc', module:'eth', method: 'gasPrice'});

  const txMintToken = await (await collection.mint(wallet.address, 50, {
    gasLimit: 10_000_000,
    gasPrice: gasPriceResult.json,
  })).wait()
  console.log('txMintToken', txMintToken)
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
