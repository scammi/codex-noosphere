export default () => ({
  port: parseInt(process.env.PORT!, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT!, 10) || 5432,
  },
  ipfs: {
    pinataJWT: process.env.PINATA_JWT,
    pinataGateway: process.env.PINATA_GATEWAY,
  },
  blockchain: {
    rpcUrl: process.env.RPC_URL,
    contractAddress: process.env.CONTRACT_ADDRESS,
    relayerApiKey: process.env.GELATO_RELAY_API_KEY,
  },
});
