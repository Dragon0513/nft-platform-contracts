const pinataSDK = require('@pinata/sdk');
const fs = require('fs');

const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

pinata.testAuthentication().then((result) => {
    //handle successful authentication here
    console.log(result);
}).catch((err) => {
    //handle error here
    console.log(err);
});

// const readableStreamForFile = fs.createReadStream('./metadata-api/images/output/1.png');
// const readableStreamForFile = fs.createReadStream('./metadata-api/test-metadata.json');
const readableStreamForFile = fs.createReadStream('./metadata-api/cc.json');
const options = {
    pinataMetadata: {
        name: 'MyCustomName',
        keyvalues: {
            customKey: 'customValue',
            customKey2: 'customValue2'
        }
    },
    pinataOptions: {
        cidVersion: 0
    }
};

pinata.pinFileToIPFS(readableStreamForFile, options).then((result) => {
    //handle results here
    console.log(result);
}).catch((err) => {
    //handle error here
    console.log(err);
});
