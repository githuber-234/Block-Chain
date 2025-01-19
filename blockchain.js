const crypto = require('crypto-js');

class Transaction {
    constructor(sender, receiver, amount) {
        this.sender = sender;
        this.receiver = receiver;
        this.amount = amount;
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return crypto.SHA256(
            this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce
        ).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
    }

    createGenesisBlock() {
        return new Block(Date.now(), [], '0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addTransaction(transaction) {
        if (!transaction.sender || !transaction.receiver) {
            throw new Error('Transaction must include sender and receiver');
        }
        if (transaction.amount <= 0) {
            throw new Error('Transaction amount must be greater than 0');
        }

        this.pendingTransactions.push(transaction);
    }

    mineBlock() {
        const block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        this.chain.push(block);
        this.pendingTransactions = [];
    }

    getBlockchain() {
        return this.chain;
    }

    isValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

module.exports = { Blockchain, Transaction };
