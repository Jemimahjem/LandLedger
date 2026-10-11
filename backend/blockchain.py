"""
LandLedger - Academic Blockchain Core Module
Demonstrating real-world land record management with SHA-256 tamper-evident chaining.
"""

import hashlib
import json
import time
from typing import List, Dict, Any, Optional, Tuple


class Block:
    def __init__(
        self,
        index: int,
        timestamp: str,
        transaction_type: str,
        land_id: str,
        survey_number: str,
        location: str,
        district: str,
        state: str,
        area: str,
        land_type: str,
        owner: str,
        previous_hash: str,
        previous_owner: Optional[str] = None,
        transfer_type: Optional[str] = None,
        transfer_notes: Optional[str] = None,
        data_summary: Optional[str] = None,
        hash: Optional[str] = None,
        hash_val: Optional[str] = None
    ):
        self.index = index
        self.timestamp = timestamp
        self.transaction_type = transaction_type
        self.land_id = land_id
        self.survey_number = survey_number
        self.location = location
        self.district = district
        self.state = state
        self.area = area
        self.land_type = land_type
        self.owner = owner
        self.previous_owner = previous_owner or ""
        self.transfer_type = transfer_type or ""
        self.transfer_notes = transfer_notes or ""
        self.data_summary = data_summary or f"{transaction_type} for {land_id}"
        self.previous_hash = previous_hash
        self.hash = hash or hash_val if (hash or hash_val) else self.calculate_hash()

    def get_hashable_payload(self) -> str:
        """
        Creates a deterministic string representation of the block contents
        for cryptographic SHA-256 hashing.
        """
        payload = {
            "index": self.index,
            "timestamp": self.timestamp,
            "transaction_type": self.transaction_type,
            "land_id": self.land_id,
            "survey_number": self.survey_number,
            "location": self.location,
            "district": self.district,
            "state": self.state,
            "area": self.area,
            "land_type": self.land_type,
            "owner": self.owner,
            "previous_owner": self.previous_owner,
            "transfer_type": self.transfer_type,
            "transfer_notes": self.transfer_notes,
            "previous_hash": self.previous_hash
        }
        return json.dumps(payload, sort_keys=True)

    def calculate_hash(self) -> str:
        """
        Calculates the SHA-256 hash of the block contents.
        """
        payload_str = self.get_hashable_payload()
        return hashlib.sha256(payload_str.encode('utf-8')).hexdigest()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "index": self.index,
            "timestamp": self.timestamp,
            "transaction_type": self.transaction_type,
            "land_id": self.land_id,
            "survey_number": self.survey_number,
            "location": self.location,
            "district": self.district,
            "state": self.state,
            "area": self.area,
            "land_type": self.land_type,
            "owner": self.owner,
            "previous_owner": self.previous_owner,
            "transfer_type": self.transfer_type,
            "transfer_notes": self.transfer_notes,
            "data_summary": self.data_summary,
            "previous_hash": self.previous_hash,
            "hash": self.hash
        }


class Blockchain:
    def __init__(self):
        self.chain: List[Block] = []
        self.backup_chain: Optional[List[Block]] = None
        self.create_genesis_block()

    def create_genesis_block(self) -> Block:
        """
        Creates Block 0: The Genesis Block with previous_hash set to '0'.
        Anchors the trust root of the LandLedger blockchain.
        """
        genesis = Block(
            index=0,
            timestamp="2024-01-01T00:00:00Z",
            transaction_type="GENESIS",
            land_id="GENESIS-0",
            survey_number="00/0",
            location="Land Registry Genesis Node",
            district="National Repository",
            state="Central Ledger",
            area="0",
            land_type="Registry Root",
            owner="LandLedger Protocol",
            previous_hash="0",
            data_summary="LandLedger Blockchain Initialized"
        )
        self.chain = [genesis]
        return genesis

    def get_latest_block(self) -> Block:
        return self.chain[-1]

    def add_block(
        self,
        transaction_type: str,
        land_id: str,
        survey_number: str,
        location: str,
        district: str,
        state: str,
        area: str,
        land_type: str,
        owner: str,
        previous_owner: Optional[str] = None,
        transfer_type: Optional[str] = None,
        transfer_notes: Optional[str] = None,
        timestamp: Optional[str] = None
    ) -> Block:
        """
        Appends a new block referencing the previous block's SHA-256 hash.
        """
        previous_block = self.get_latest_block()
        ts = timestamp or time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        new_block = Block(
            index=len(self.chain),
            timestamp=ts,
            transaction_type=transaction_type,
            land_id=land_id,
            survey_number=survey_number,
            location=location,
            district=district,
            state=state,
            area=area,
            land_type=land_type,
            owner=owner,
            previous_hash=previous_block.hash,
            previous_owner=previous_owner,
            transfer_type=transfer_type,
            transfer_notes=transfer_notes,
            data_summary=f"{transaction_type} - {land_id} ({owner})"
        )
        self.chain.append(new_block)
        return new_block

    def validate_chain(self) -> Dict[str, Any]:
        """
        Validates the entire blockchain cryptographically:
        1. Recalculates the SHA-256 hash of every block and asserts equality with stored hash.
        2. Asserts that block[i].previous_hash == block[i-1].hash.
        """
        details = []
        is_valid = True
        tampered_index = None
        error_message = "All recorded blocks are internally consistent."

        for i in range(len(self.chain)):
            current = self.chain[i]
            recalculated_hash = current.calculate_hash()
            hash_valid = (recalculated_hash == current.hash)
            link_valid = True

            if i > 0:
                prev = self.chain[i - 1]
                link_valid = (current.previous_hash == prev.hash)

            block_ok = hash_valid and link_valid

            if not block_ok and is_valid:
                is_valid = False
                tampered_index = i
                if not hash_valid:
                    error_message = f"Block #{i} data has been tampered with! Stored hash does not match recalculation."
                elif not link_valid:
                    error_message = f"Block #{i} previous hash broken! Does not link to Block #{i-1} hash."

            details.append({
                "block_index": current.index,
                "stored_hash": current.hash,
                "calculated_hash": recalculated_hash,
                "stored_previous_hash": current.previous_hash,
                "actual_previous_hash": self.chain[i - 1].hash if i > 0 else "0",
                "valid": block_ok,
                "hash_valid": hash_valid,
                "link_valid": link_valid
            })

        return {
            "is_valid": is_valid,
            "total_blocks": len(self.chain),
            "verified_blocks": sum(1 for d in details if d["valid"]),
            "tampered_block_index": tampered_index,
            "message": error_message,
            "details": details
        }

    def simulate_tampering(self, block_index: int, fake_owner: str) -> Dict[str, Any]:
        """
        Demonstrates tampering: modifies block contents in-place without recalculating
        subsequent cryptographic hashes.
        """
        if block_index <= 0 or block_index >= len(self.chain):
            raise ValueError("Cannot tamper with Genesis block or non-existent index")

        # Save backup if not already saved
        if self.backup_chain is None:
            self.backup_chain = [
                Block(**b.to_dict(), hash_val=b.hash) for b in self.chain
            ]

        target_block = self.chain[block_index]
        target_block.owner = fake_owner
        target_block.data_summary = f"{target_block.transaction_type} - {target_block.land_id} (TAMPERED: {fake_owner})"

        return {
            "tampered_block_index": block_index,
            "modified_owner": fake_owner,
            "stored_hash": target_block.hash,
            "expected_hash": target_block.calculate_hash()
        }

    def restore_chain(self) -> bool:
        """
        Restores chain to pristine state prior to tampering.
        """
        if self.backup_chain is not None:
            self.chain = self.backup_chain
            self.backup_chain = None
            return True
        return False
