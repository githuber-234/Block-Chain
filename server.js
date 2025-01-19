const express = require('express');
const bodyParser = require('body-parser');
const { Blockchain, Transaction } = require('./blockchain'); // Import the Blockchain and Transaction classes

const app = express();
const port = 3000;

// Middleware for parsing JSON bodies
app.use(bodyParser.json());

// Initialize the blockchain
const blockchain = new Blockchain();

// Serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Endpoint to retrieve the entire blockchain
app.get('/blockchain', (req, res) => {
    res.json({
        message: 'Current Blockchain',
        blockchain: blockchain.getBlockchain()
    });
});

// Endpoint to add a new transaction
app.post('/add-transaction', (req, res) => {
    const { sender, receiver, amount } = req.body;

    if (!sender || !receiver || !amount) {
        return res.status(400).json({ message: 'Invalid transaction data. Please provide sender, receiver, and amount.' });
    }

    try {
        const newTransaction = new Transaction(sender, receiver, amount);
        blockchain.addTransaction(newTransaction);
        res.json({ message: 'Transaction added to the pool!' });
    } catch (error) {
        res.status(400).json({ message: 'Error adding transaction', error: error.message });
    }
});

// Endpoint to mine a new block
app.post('/mine', (req, res) => {
    blockchain.mineBlock();
    res.json({
        message: 'Block mined successfully!',
        latestBlock: blockchain.getLatestBlock(),
        blockchain: blockchain.getBlockchain()
    });
});

// Endpoint to validate the blockchain
app.get('/validate', (req, res) => {
    const isValid = blockchain.isValid();
    res.json({
        message: isValid ? 'Blockchain is valid.' : 'Blockchain is invalid.',
        isValid
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
