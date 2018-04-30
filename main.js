const SHA256 = require('crypto-js/sha256')

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

}

class Block {
    constructor(timeStamp, transactions, previousHash=''){

        
        this.timeStamp = timeStamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
      return SHA256(this.index + this.previousHash + this.timeStamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined: " + this.hash);
    }

}

class BlockChain {
    constructor(){
        this.chain=[this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock(){
        return new Block("01/01/2001", "Demo Genesis Block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1]; 
    }

    minePendingTranssactions(minigRewardAddress){
        let block = new Block (Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log("Block ssuccessfully mined!!");
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, minigRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for (const block of this.chain){
            for (const trans of block.transactions){
                if (trans.fromAddress == address){
                    balance -= trans.amount;
                }
                if (trans.toAddress ==  address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
            
            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }

        return true;
    }
}

let CoolCoin = new BlockChain();


CoolCoin.createTransaction(new Transaction('address1' , 'address2', 100));
CoolCoin.createTransaction(new Transaction('address2', 'address1', 50));



console.log('\n Starting mining');
CoolCoin.minePendingTranssactions('MyCoolAddress');
console.log('\n Balance of cool me: ', CoolCoin.getBalanceOfAddress('MyCoolAddress'));

console.log('\n Starting mining again');
CoolCoin.minePendingTranssactions('MyCoolAddress');
console.log('\n Balance of cool me: ', CoolCoin.getBalanceOfAddress('MyCoolAddress'));

console.log('\n Balance of address1: ', CoolCoin.getBalanceOfAddress('address1'));
console.log('\n Balance of address2: ', CoolCoin.getBalanceOfAddress('address2'));