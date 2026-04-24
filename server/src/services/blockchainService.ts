import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import HealthRecord from '../contracts/HealthRecord.json';

const web3 = new Web3(process.env.ETHEREUM_NODE_URL || 'http://127.0.0.1:7545');
const contractABI = HealthRecord.abi as AbiItem[];
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
        const gas = await contract.methods.setRecord(hash).estimateGas({ from: accounts[0] });
        
        const receipt = await contract.methods.setRecord(hash).send({ from: accounts[0], gas });

        return {
            transactionHash: receipt.transactionHash,
            blockNumber: receipt.blockNumber
        };
    },

    verifyRecordHash: async (hash: string, transactionHash: string): Promise<boolean> => {
        const contract = getContract();
        const accounts = await web3.eth.getAccounts();
        
        // Fetch the record from the blockchain using the hash as a key
        const storedHashOwner = await contract.methods.getRecordOwner(hash).call({ from: accounts[0] });

        if (storedHashOwner === '0x0000000000000000000000000000000000000000') {
            return false; // Hash not found on the blockchain
        }

        // Additionally, you can verify against the transaction if needed, but getting the owner is a direct check.
        const tx = await web3.eth.getTransaction(transactionHash);
        const inputData = '0x' + contract.methods.setRecord(hash).encodeABI().slice(10); // remove function selector
        
        // This check is a bit complex and might not be fully reliable if other data is in the transaction.
        // The primary verification should be fetching the record by its hash.
        return tx.input.includes(hash);
    }
};
