import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

const web3 = new Web3(process.env.ETHEREUM_NODE_URL || 'http://127.0.0.1:7545');
const contractABI: AbiItem[] = [
    {
        type: 'function',
        name: 'setRecord',
        stateMutability: 'nonpayable',
        inputs: [{ name: '_recordHash', type: 'string' }],
        outputs: []
    },
    {
        type: 'function',
        name: 'getRecordOwner',
        stateMutability: 'view',
        inputs: [{ name: '_recordHash', type: 'string' }],
        outputs: [{ name: '', type: 'address' }]
    },
    {
        type: 'function',
        name: 'verifyRecord',
        stateMutability: 'view',
        inputs: [
            { name: '_recordHash', type: 'string' },
            { name: '_owner', type: 'address' }
        ],
        outputs: [{ name: '', type: 'bool' }]
    }
];
const contractAddress = process.env.CONTRACT_ADDRESS || ''; // Add your contract address

const getContract = () => {
    if (!contractAddress) {
        throw new Error("CONTRACT_ADDRESS environment variable not set.");
    }
    return new web3.eth.Contract(contractABI, contractAddress);
};

export const blockchainService = {
    storeRecordHash: async (hash: string): Promise<{ transactionHash: string, blockNumber: number }> => {
        const contract = getContract();
        const accounts = await web3.eth.getAccounts();
        const gasEstimate = await contract.methods.setRecord(hash).estimateGas({ from: accounts[0] });
        const gas = Number(gasEstimate);
        
        const receipt = await contract.methods.setRecord(hash).send({ from: accounts[0], gas: gas.toString() });
        const blockNumber = typeof receipt.blockNumber === 'bigint'
            ? Number(receipt.blockNumber)
            : Number(receipt.blockNumber ?? 0);

        return {
            transactionHash: receipt.transactionHash,
            blockNumber
        };
    },

    verifyRecordHash: async (hash: string, transactionHash: string): Promise<boolean> => {
        const contract = getContract();
        const accounts = await web3.eth.getAccounts();
        
        // Fetch the record from the blockchain using the hash as a key
        const storedHashOwner = String(await contract.methods.getRecordOwner(hash).call({ from: accounts[0] }));

        if (storedHashOwner.toLowerCase() === '0x0000000000000000000000000000000000000000') {
            return false; // Hash not found on the blockchain
        }

        // Additionally, you can verify against the transaction if needed, but getting the owner is a direct check.
        const tx = await web3.eth.getTransaction(transactionHash);
        if (!tx?.input) {
            return false;
        }
        const inputData = contract.methods.setRecord(hash).encodeABI().toLowerCase();
        
        // This check is a bit complex and might not be fully reliable if other data is in the transaction.
        // The primary verification should be fetching the record by its hash.
        return tx.input.toLowerCase() === inputData;
    }
};
