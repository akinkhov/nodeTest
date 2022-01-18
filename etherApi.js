import axios from 'axios';

const API_KEY = 'PHJFEETZUKY4E67VJ7N5URY63AV3W5ZWPZ'
const blocksCount = 100;  
const setRequest = async (url) => {
    let temp = await new Promise((resolve) => {
        setTimeout(async () => {
            let data = (await axios.get(url)).data;
            resolve(data);
        });
    })
    return temp;
}

const getLastBlock = async () => {
    const url = `https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=${API_KEY}`
    let data = await setRequest(url);
    return data;
}

const getTransactions = async (blockNumber) => {
    const url = `https://api.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&tag=${blockNumber}&boolean=true&apikey=${API_KEY}`
    let data = await setRequest(url);
    return data;
}

const countDif = (mass, transactions) => {
    transactions.forEach(item => {
        if (mass.hasOwnProperty(item.to)) {
            mass[item.to] += +item.value;
        } else {
            mass[item.to] = +item.value;
        }
        if (mass.hasOwnProperty(item.from)) {
            mass[item.from] += -item.value;
        } else {
            mass[item.from] = -item.value;
        }
    });
}

const mostChangedBalance = async (blocksCount) => {
    const mass = {};
    
    const blockNumData = await getLastBlock();

    let blockNum = blockNumData.result;
    
    let allTransactions = [];
    for (let i = 1; i <= blocksCount; i++) {
        const transactionPromise = await getTransactions(blockNum);
        allTransactions.push(transactionPromise);
    }

    allTransactions.forEach((block) => {
        countDif(mass, block.result.transactions);
    })

   
    let maxDifference, maxDifferenceAddress;
    for (let i in mass) {
        if (maxDifference == undefined) {
            maxDifference = mass[i];
            maxDifferenceAddress = i;
        } else {
            if (maxDifference < Math.abs(mass[i])) {
                maxDifference = Math.abs(mass[i]);
                maxDifferenceAddress = i;
            }
        }
    }
    return {
        address: maxDifferenceAddress
    }
}

export { mostChangedBalance }