// ../node_modules/
import { Contract, SorobanRpc, TransactionBuilder, Networks, BASE_FEE, Keypair, nativeToScVal } from '../node_modules/@stellar/stellar-sdk';
import config from '../config.json';// assert {type: "json"};

let kP     = Keypair.fromSecret(config.SECRET_KEY),
    rpcUrl = 'https://soroban-testnet.stellar.org',
    caller = kP.publicKey(), 
    fxn    = 'register',
    params = {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET
    };

const provider      = new SorobanRpc.Server(rpcUrl, { allowHttp: true }),
      sourceAccount = await provider.getAccount(caller);

async function invoke(publicKey) {
    /**build transaction */
    let contract  = new Contract(config.CONTRACT_ID),
        buildTx   = new TransactionBuilder(sourceAccount, params)
            .addOperation(contract.call(fxn, ...toType(publicKey||config.PUBLIC_KEY, 'address')))
            .setTimeout(30)
            .build(),
        prepareTx = await provider.prepareTransaction(buildTx);

    // console.log('::XDR::', prepareTx.toXDR()),
    prepareTx.sign(kP);
    try {
      let sendTx = await provider.sendTransaction(prepareTx).catch(err=>err)
      if(sendTx.errorResult) throw new Error('Unable to send Tx');
      if (sendTx.status === "PENDING") {
        let txResponse = await provider.getTransaction(sendTx.hash);
        while(txResponse.status==="NOT_FOUND") {
            txResponse = await provider.getTransaction(sendTx.hash);
            await new Promise(resolve=>setTimeout(resolve, 100));
        }
        if(txResponse.status==="SUCCESS") {
            let res = txResponse.returnValue;
            console.log('::RESPONSE::', res._value[0])
        }
      }
    } catch (error) {
    
    }
}

console.log(toType(config.PUBLIC_KEY, 'address'), Networks.TESTNET);

function toType(value, type) {
    return [nativeToScVal(value, { type })]
}

export default invoke

