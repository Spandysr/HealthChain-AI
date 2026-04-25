from web3 import Web3
import os
import json
from dotenv import load_dotenv

load_dotenv()

NODE_URL = os.getenv("ETHEREUM_NODE_URL", "http://127.0.0.1:7545")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")

w3 = Web3(Web3.HTTPProvider(NODE_URL))

ABI = [
    {
        "type": "function",
        "name": "setRecord",
        "stateMutability": "nonpayable",
        "inputs": [{"name": "_recordHash", "type": "string"}],
        "outputs": []
    },
    {
        "type": "function",
        "name": "getRecordOwner",
        "stateMutability": "view",
        "inputs": [{"name": "_recordHash", "type": "string"}],
        "outputs": [{"name": "", "type": "address"}]
    },
    {
        "type": "function",
        "name": "verifyRecord",
        "stateMutability": "view",
        "inputs": [
            {"name": "_recordHash", "type": "string"},
            {"name": "_owner", "type": "address"}
        ],
        "outputs": [{"name": "", "type": "bool"}]
    }
]

def get_contract():
    if not CONTRACT_ADDRESS:
        raise ValueError("CONTRACT_ADDRESS not set in .env")
    return w3.eth.contract(address=CONTRACT_ADDRESS, abi=ABI)

async def store_record_hash(hash_str: str):
    if not w3.is_connected():
        raise Exception("Blockchain node not connected")
    
    contract = get_contract()
    accounts = w3.eth.accounts
    if not accounts:
        raise Exception("No accounts available in node")
    
    # In Ganache, we can usually just send from accounts[0]
    tx_hash = contract.functions.setRecord(hash_str).transact({'from': accounts[0]})
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    
    return {
        "transactionHash": receipt.transactionHash.hex(),
        "blockNumber": receipt.blockNumber
    }

async def verify_record_hash(hash_str: str, tx_hash_str: str):
    contract = get_contract()
    accounts = w3.eth.accounts
    
    # 1. Check owner by hash
    owner = contract.functions.getRecordOwner(hash_str).call()
    if owner == '0x0000000000000000000000000000000000000000':
        return False
        
    # 2. Check transaction input
    tx = w3.eth.get_transaction(tx_hash_str)
    if not tx:
        return False
        
    # Simplified check: just verifying the transaction exists and the hash is owned
    return True
