// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HealthRecord {
    // Mapping from a record hash to the address of the owner
    mapping(string => address) private recordOwners;
    
    // Event to log when a record is set
    event RecordSet(address indexed owner, string recordHash);

    /**
     * @dev Sets or updates a health record hash for the message sender.
     * @param _recordHash The SHA-256 hash of the health record.
     */
    function setRecord(string memory _recordHash) public {
        require(bytes(_recordHash).length > 0, "Record hash cannot be empty.");
        recordOwners[_recordHash] = msg.sender;
        emit RecordSet(msg.sender, _recordHash);
    }

    /**
     * @dev Retrieves the owner of a given health record hash.
     * @param _recordHash The SHA-256 hash of the health record.
     * @return The address of the owner, or the zero address if not found.
     */
    function getRecordOwner(string memory _recordHash) public view returns (address) {
        return recordOwners[_recordHash];
    }

    /**
     * @dev Verifies if a record hash belongs to a specific owner.
     * @param _recordHash The SHA-256 hash of the health record.
     * @param _owner The address to verify against.
     * @return True if the hash belongs to the owner, false otherwise.
     */
    function verifyRecord(string memory _recordHash, address _owner) public view returns (bool) {
        return recordOwners[_recordHash] == _owner;
    }
}
