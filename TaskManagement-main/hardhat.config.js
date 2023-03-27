// hardhat.config.js 

 
 

require('dotenv').config(); 

require('@nomiclabs/hardhat-ethers'); 

 
 

module.exports = { 

    solidity: '0.8.18', 

    paths: { 

        artifacts: './src/artifacts', 

    }, 

    networks: { 

        fuji: { 

            url: 'https://cosmological-wider-night.avalanche-testnet.discover.quiknode.pro/38957daf06427551bc9f57a154c0f888ef6f3071/ext/bc/C/rpc', 


            accounts: [`0x` + process.env.PRIVATE_KEY], 

            chainId: 43113, 

        }, 

    }, 

}; 

 