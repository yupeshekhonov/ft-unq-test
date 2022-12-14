import {Sdk} from '@unique-nft/sdk'
import {KeyringProvider} from '@unique-nft/accounts/keyring'

const baseUrl = 'https://rest.unique.network/opal/v1'
const mnemonic = 'solar float siege poverty catch resource uncle verify kitchen cactus frog skill'
const substrateMirror = '5DVgiNh1Go8ESa18xEirA4uV3zpra59awPGQjJTmCrqYMNtM'

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

  const tokenResult = await sdk.fungible.addTokens.submitWaitResult({
    address,
    collectionId: 65,
    amount: 30,
    recipient: address,
  })

  if (tokenResult.error) {
    console.log(`Token was not created. Error: ${tokenResult.error}`)
    process.exit()
  } else {
    console.log(
      // amount - empty
      `The ${tokenResult.parsed?.amount} tokens were created in collection # ${tokenResult.parsed?.collectionId}`
    )
  }

  const transferResult = await sdk.collections.transfer.submitWaitResult({
    collectionId: 65,
    address, // address instead of from:
    to: substrateMirror,
  })
  // owner - empty
  console.log(
    `Collection # ${transferResult.parsed?.collectionId} was transferred to the ${transferResult.parsed?.owner} address.`
  )
}

main()
