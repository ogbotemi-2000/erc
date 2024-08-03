// import * as ethers from 'ethers';

// import { Token } from '@uniswap/sdk-core'
// import { Pool, Position, nearestUsableTick } from '@uniswap/v3-sdk'
// import * as UniswapPool  from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json" assert {type:"json"}
// import * as abi from '@uniswap/v3-periphery/artifacts/contracts/interfaces/INonfungiblePositionManager.sol/INonfungiblePositionManager.json' assert {type:"json"}
// import * as ERC20ABI from './abi.json' assert {type:"json"}
// import config from './config.json' assert {type:"json"}

// const { abi:IUniswapV3PoolABI } = UniswapPool
// const INonfungiblePositionManagerABI = abi

const { ethers } = require('ethers')

const { Token } = require('@uniswap/sdk-core')
const { Pool, Position, nearestUsableTick } = require('@uniswap/v3-sdk')
const { abi: IUniswapV3PoolABI }  = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json")
const { abi: INonfungiblePositionManagerABI } = require('@uniswap/v3-periphery/artifacts/contracts/interfaces/INonfungiblePositionManager.sol/INonfungiblePositionManager.json')
const ERC20ABI = require('./abi.json')
const config = require('./config')


const INFURA_URL_TESTNET = config.INFURA_URL_TESTNET
const WALLET_ADDRESS = config.WALLET_ADDRESS
const WALLET_SECRET = config.WALLET_SECRET
const LIQUIDITY_FRACTION = '0.3'

const poolAddress = "0x287b0e934ed0439e2a7b1d5f0fc25ea2c24b64f7" // UNI/WETH on Sepolia
//"0x4D7C363DED4B3b4e1F954494d2Bc3955e49699cC" // UNI/WETH on Ropsten
const positionManagerAddress = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88" // NonfungiblePositionManager

const provider = new ethers.providers.JsonRpcProvider(INFURA_URL_TESTNET)

const name0 = 'Wrapped Ether'
const symbol0 = 'WETH'
const decimals0 = 18
const address0 = '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14'

const name1 = 'Uniswap Token'
const symbol1 = 'UNI'
const decimals1 = 18
const address1 = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984' //or this if it fails; 0x5210B8385Efc8aE9619b4cC7aC84259f20966b58,  UNI Contract Addr on Sepolia

const chainId = 11155111 // Sepolia
const WethToken = new Token(chainId, address0, decimals0, symbol0, name0)
const UniToken = new Token(chainId, address1, decimals1, symbol1, name1)

const nonfungiblePositionManagerContract = new ethers.Contract(
  positionManagerAddress,
  INonfungiblePositionManagerABI,
  provider
)
const poolContract = new ethers.Contract(
  poolAddress,
  IUniswapV3PoolABI,
  provider
)

async function getPoolData(poolContract) {
  const [tickSpacing, fee, liquidity, slot0] = await Promise.all([
    poolContract.tickSpacing(),
    poolContract.fee(),
    poolContract.liquidity(),
    poolContract.slot0(),
  ])

  return {
    tickSpacing: tickSpacing,
    fee: fee,
    liquidity: liquidity,
    sqrtPriceX96: slot0[0],
    tick: slot0[1],
  }
}


async function main() {
  const poolData = await getPoolData(poolContract)

  const WETH_UNI_POOL = new Pool(
    WethToken,
    UniToken,
    poolData.fee,
    poolData.sqrtPriceX96.toString(),
    poolData.liquidity.toString(),
    poolData.tick
  )

  const position = new Position({
    pool: WETH_UNI_POOL,
    liquidity: ethers.utils.parseUnits(LIQUIDITY_FRACTION, 18),
    /* dynamically determine the ticks lower and upper bounds */
    tickLower: nearestUsableTick(poolData.tick, poolData.tickSpacing) - poolData.tickSpacing * 2,
    tickUpper: nearestUsableTick(poolData.tick, poolData.tickSpacing) + poolData.tickSpacing * 2,
  })

  const wallet = new ethers.Wallet(WALLET_SECRET)
  const connectedWallet = wallet.connect(provider)
  const approvalAmount = ethers.utils.parseUnits('10', 18).toString()

  const tokenContract0 = new ethers.Contract(address0, ERC20ABI, provider)
  await tokenContract0.connect(connectedWallet).approve(
    positionManagerAddress,
    approvalAmount
  )
  const tokenContract1 = new ethers.Contract(address1, ERC20ABI, provider)
  await tokenContract1.connect(connectedWallet).approve(
    positionManagerAddress,
    approvalAmount
  )

  const { amount0: amount0Desired, amount1: amount1Desired} = position.mintAmounts

  const params = {
    token0: address0,
    token1: address1,
    fee: poolData.fee,
    tickLower: nearestUsableTick(poolData.tick, poolData.tickSpacing) - poolData.tickSpacing * 2,
    tickUpper: nearestUsableTick(poolData.tick, poolData.tickSpacing) + poolData.tickSpacing * 2,
    amount0Desired: amount0Desired.toString(),
    amount1Desired: amount1Desired.toString(),
    amount0Min: amount0Desired.toString(),
    amount1Min: amount1Desired.toString(),
    recipient: WALLET_ADDRESS,
    deadline: Math.floor(Date.now() / 1000) + (60 * 10)
  }

  nonfungiblePositionManagerContract.connect(connectedWallet).mint(
    params,
    { gasLimit: ethers.utils.hexlify(1000000) }
  ).then((res) => {
    console.log(res)
  })
}

// main()
getPoolData(poolContract).then(data=>{
    console.log('::POOL DATA::', data, data.liquidity.toString(), data.fee)
})