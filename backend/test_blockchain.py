"""
Test suite for LandLedger blockchain logic.
Verifies Genesis block, addition, SHA-256 calculation, previous-hash linkage,
tampering simulation, and restoration.
"""

from blockchain import Blockchain

def test_blockchain():
    bc = Blockchain()
    print("✓ Genesis block created successfully.")
    print(f"  Genesis Hash: {bc.chain[0].hash[:16]}... (Prev: {bc.chain[0].previous_hash})")

    # Add block 1: Registration
    b1 = bc.add_block(
        transaction_type="REGISTRATION",
        land_id="LAND-1001",
        survey_number="45/2",
        location="Bengaluru Urban",
        district="Bengaluru",
        state="Karnataka",
        area="2,400 sq ft",
        land_type="Residential",
        owner="Arjun Kumar"
    )
    print(f"✓ Block 1 added: {b1.land_id} -> {b1.owner}")
    print(f"  Hash: {b1.hash[:16]}... (Prev: {b1.previous_hash[:16]}...)")

    # Add block 2: Ownership Transfer
    b2 = bc.add_block(
        transaction_type="TRANSFER",
        land_id="LAND-1001",
        survey_number="45/2",
        location="Bengaluru Urban",
        district="Bengaluru",
        state="Karnataka",
        area="2,400 sq ft",
        land_type="Residential",
        owner="Priya Sharma",
        previous_owner="Arjun Kumar",
        transfer_type="Sale",
        transfer_notes="Registered sale deed No. 8921"
    )
    print(f"✓ Block 2 added: Transfer to {b2.owner}")

    # Validate intact chain
    val1 = bc.validate_chain()
    assert val1["is_valid"] is True, "Intact chain should be valid"
    print(f"✓ Chain validation passed (Total blocks: {val1['total_blocks']})")

    # Simulate tampering on Block 1
    tamper_info = bc.simulate_tampering(1, "Malicious Actor")
    print(f"✓ Tampering simulated on Block 1: owner set to '{tamper_info['modified_owner']}'")

    val2 = bc.validate_chain()
    assert val2["is_valid"] is False, "Tampered chain must be detected as invalid!"
    print(f"✓ Tamper detection confirmed! {val2['message']}")

    # Restore chain
    restored = bc.restore_chain()
    assert restored is True, "Chain should restore from backup"
    val3 = bc.validate_chain()
    assert val3["is_valid"] is True, "Restored chain must be valid!"
    print("✓ Chain restoration verified! All hashes and linkages valid.")

if __name__ == "__main__":
    test_blockchain()
