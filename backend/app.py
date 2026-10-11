"""
LandLedger Flask REST API Server
Exposes blockchain ledger and land registry endpoints for React frontend or curl.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import time

from blockchain import Blockchain
import database

app = Flask(__name__)
CORS(app)

# Initialize database and blockchain
database.init_db()
blockchain = Blockchain()

def seed_demo_data():
    """Seeds the 5 specified demonstration records and transactions into blockchain & db."""
    global blockchain
    blockchain = Blockchain()
    
    # 1. LAND-1001
    b1 = blockchain.add_block(
        transaction_type="REGISTRATION",
        land_id="LAND-1001",
        survey_number="45/2",
        location="Indiranagar, Bengaluru Urban",
        district="Bengaluru",
        state="Karnataka",
        area="2,400 sq ft",
        land_type="Residential",
        owner="Ravi Kumar",
        timestamp="2021-04-12T10:15:00Z"
    )
    database.save_land_record({
        "land_id": "LAND-1001",
        "survey_number": "45/2",
        "location": "Indiranagar, Bengaluru Urban",
        "district": "Bengaluru",
        "state": "Karnataka",
        "area": "2,400 sq ft",
        "land_type": "Residential",
        "current_owner": "Ravi Kumar",
        "initial_owner": "Ravi Kumar",
        "registration_date": "2021-04-12",
        "status": "Verified",
        "block_index": b1.index
    })
    database.record_transaction({
        "block_index": b1.index,
        "transaction_type": "REGISTRATION",
        "land_id": "LAND-1001",
        "previous_owner": "None (First Title)",
        "new_owner": "Ravi Kumar",
        "transfer_type": "Original Allotment",
        "transfer_notes": "First title deed recorded under Urban Development Authority",
        "timestamp": b1.timestamp,
        "block_hash": b1.hash
    })

    # Transfer of LAND-1001 to Arjun Kumar
    b1_transfer = blockchain.add_block(
        transaction_type="TRANSFER",
        land_id="LAND-1001",
        survey_number="45/2",
        location="Indiranagar, Bengaluru Urban",
        district="Bengaluru",
        state="Karnataka",
        area="2,400 sq ft",
        land_type="Residential",
        owner="Arjun Kumar",
        previous_owner="Ravi Kumar",
        transfer_type="Sale",
        transfer_notes="Sale Deed registered at Sub-Registrar Office, Book-I Vol 412",
        timestamp="2023-08-20T14:30:00Z"
    )
    database.update_land_owner("LAND-1001", "Arjun Kumar", b1_transfer.index)
    database.record_transaction({
        "block_index": b1_transfer.index,
        "transaction_type": "TRANSFER",
        "land_id": "LAND-1001",
        "previous_owner": "Ravi Kumar",
        "new_owner": "Arjun Kumar",
        "transfer_type": "Sale",
        "transfer_notes": "Sale Deed registered at Sub-Registrar Office, Book-I Vol 412",
        "timestamp": b1_transfer.timestamp,
        "block_hash": b1_transfer.hash
    })

    # 2. LAND-1002
    b2 = blockchain.add_block(
        transaction_type="REGISTRATION",
        land_id="LAND-1002",
        survey_number="78/1",
        location="Chamundi Foothills",
        district="Mysuru",
        state="Karnataka",
        area="4.5 Acres",
        land_type="Agricultural",
        owner="Priya Sharma",
        timestamp="2022-01-18T09:40:00Z"
    )
    database.save_land_record({
        "land_id": "LAND-1002",
        "survey_number": "78/1",
        "location": "Chamundi Foothills",
        "district": "Mysuru",
        "state": "Karnataka",
        "area": "4.5 Acres",
        "land_type": "Agricultural",
        "current_owner": "Priya Sharma",
        "initial_owner": "Priya Sharma",
        "registration_date": "2022-01-18",
        "status": "Verified",
        "block_index": b2.index
    })
    database.record_transaction({
        "block_index": b2.index,
        "transaction_type": "REGISTRATION",
        "land_id": "LAND-1002",
        "previous_owner": "None",
        "new_owner": "Priya Sharma",
        "transfer_type": "Inheritance",
        "transfer_notes": "Ancestral partition deed mutated in RTC",
        "timestamp": b2.timestamp,
        "block_hash": b2.hash
    })

    # 3. LAND-1003
    b3 = blockchain.add_block(
        transaction_type="REGISTRATION",
        land_id="LAND-1003",
        survey_number="112/7",
        location="B.H. Road Commercial Corridor",
        district="Tumakuru",
        state="Karnataka",
        area="6,200 sq ft",
        land_type="Commercial",
        owner="Ravi Kumar",
        timestamp="2022-07-05T11:00:00Z"
    )
    database.save_land_record({
        "land_id": "LAND-1003",
        "survey_number": "112/7",
        "location": "B.H. Road Commercial Corridor",
        "district": "Tumakuru",
        "state": "Karnataka",
        "area": "6,200 sq ft",
        "land_type": "Commercial",
        "current_owner": "Ravi Kumar",
        "initial_owner": "Ravi Kumar",
        "registration_date": "2022-07-05",
        "status": "Verified",
        "block_index": b3.index
    })
    database.record_transaction({
        "block_index": b3.index,
        "transaction_type": "REGISTRATION",
        "land_id": "LAND-1003",
        "previous_owner": "None",
        "new_owner": "Ravi Kumar",
        "transfer_type": "Direct Purchase",
        "transfer_notes": "Industrial corridor commercial plot allocation",
        "timestamp": b3.timestamp,
        "block_hash": b3.hash
    })

    # 4. LAND-1004
    b4 = blockchain.add_block(
        transaction_type="REGISTRATION",
        land_id="LAND-1004",
        survey_number="23/4",
        location="Cauvery Basin Farmland",
        district="Mandya",
        state="Karnataka",
        area="8.2 Acres",
        land_type="Agricultural",
        owner="Kiran Rao",
        timestamp="2023-02-14T16:20:00Z"
    )
    database.save_land_record({
        "land_id": "LAND-1004",
        "survey_number": "23/4",
        "location": "Cauvery Basin Farmland",
        "district": "Mandya",
        "state": "Karnataka",
        "area": "8.2 Acres",
        "land_type": "Agricultural",
        "current_owner": "Kiran Rao",
        "initial_owner": "Kiran Rao",
        "registration_date": "2023-02-14",
        "status": "Verified",
        "block_index": b4.index
    })
    database.record_transaction({
        "block_index": b4.index,
        "transaction_type": "REGISTRATION",
        "land_id": "LAND-1004",
        "previous_owner": "None",
        "new_owner": "Kiran Rao",
        "transfer_type": "Original Allotment",
        "transfer_notes": "Agricultural holding title clear of encumbrance",
        "timestamp": b4.timestamp,
        "block_hash": b4.hash
    })

    # 5. LAND-1005
    b5 = blockchain.add_block(
        transaction_type="REGISTRATION",
        land_id="LAND-1005",
        survey_number="91/3",
        location="Peenya Industrial Estate Phase 2",
        district="Bengaluru",
        state="Karnataka",
        area="12,500 sq ft",
        land_type="Industrial",
        owner="Ananya Kumar",
        timestamp="2023-10-01T12:00:00Z"
    )
    database.save_land_record({
        "land_id": "LAND-1005",
        "survey_number": "91/3",
        "location": "Peenya Industrial Estate Phase 2",
        "district": "Bengaluru",
        "state": "Karnataka",
        "area": "12,500 sq ft",
        "land_type": "Industrial",
        "current_owner": "Ananya Kumar",
        "initial_owner": "Ananya Kumar",
        "registration_date": "2023-10-01",
        "status": "Verified",
        "block_index": b5.index
    })
    database.record_transaction({
        "block_index": b5.index,
        "transaction_type": "REGISTRATION",
        "land_id": "LAND-1005",
        "previous_owner": "None",
        "new_owner": "Ananya Kumar",
        "transfer_type": "Allotment",
        "transfer_notes": "State Industrial Area Development Board 99-year leasehold title",
        "timestamp": b5.timestamp,
        "block_hash": b5.hash
    })

# Seed initial demonstration data
seed_demo_data()

@app.route("/api/stats", methods=["GET"])
def get_stats():
    records = database.get_all_records()
    validation = blockchain.validate_chain()
    transfers = [b for b in blockchain.chain if b.transaction_type == "TRANSFER"]
    return jsonify({
        "total_land_records": len(records),
        "active_parcels": len(records),
        "ownership_transfers": len(transfers),
        "verified_records": len(records) if validation["is_valid"] else max(0, len(records) - 1),
        "blockchain_blocks": len(blockchain.chain),
        "chain_integrity": 100 if validation["is_valid"] else 0,
        "is_valid": validation["is_valid"]
    })

@app.route("/api/land-records", methods=["GET"])
def get_land_records():
    return jsonify(database.get_all_records())

@app.route("/api/land-records/<land_id>", methods=["GET"])
def get_land_record(land_id):
    rec = database.get_record_by_id(land_id)
    if not rec:
        return jsonify({"error": "Record not found"}), 404
    return jsonify(rec)

@app.route("/api/transfers/<land_id>", methods=["GET"])
def get_transfers(land_id):
    transfers = database.get_transfers_for_land(land_id)
    return jsonify(transfers)

@app.route("/api/blockchain", methods=["GET"])
def get_blockchain():
    return jsonify({
        "chain": [b.to_dict() for b in blockchain.chain],
        "length": len(blockchain.chain),
        "latest_block": blockchain.get_latest_block().to_dict()
    })

@app.route("/api/blockchain/block/<int:index>", methods=["GET"])
def get_block(index):
    if index < 0 or index >= len(blockchain.chain):
        return jsonify({"error": "Block index out of range"}), 404
    return jsonify(blockchain.chain[index].to_dict())

@app.route("/api/land-records", methods=["POST"])
def register_land():
    data = request.json or {}
    required = ["land_id", "survey_number", "location", "district", "state", "area", "land_type", "owner", "registration_date"]
    for field in required:
        if not data.get(field):
            return jsonify({"error": f"Missing field: {field}"}), 400

    # Add block to real blockchain
    new_block = blockchain.add_block(
        transaction_type="REGISTRATION",
        land_id=data["land_id"],
        survey_number=data["survey_number"],
        location=data["location"],
        district=data["district"],
        state=data["state"],
        area=data["area"],
        land_type=data["land_type"],
        owner=data["owner"],
        transfer_notes=data.get("legal_ref", "Initial land registration deed")
    )

    # Save to SQLite
    rec = {
        "land_id": data["land_id"],
        "survey_number": data["survey_number"],
        "location": data["location"],
        "district": data["district"],
        "state": data["state"],
        "area": data["area"],
        "land_type": data["land_type"],
        "current_owner": data["owner"],
        "initial_owner": data["owner"],
        "registration_date": data["registration_date"],
        "status": "Verified",
        "block_index": new_block.index
    }
    database.save_land_record(rec)
    database.record_transaction({
        "block_index": new_block.index,
        "transaction_type": "REGISTRATION",
        "land_id": data["land_id"],
        "previous_owner": "None",
        "new_owner": data["owner"],
        "transfer_type": "Initial Registration",
        "transfer_notes": data.get("legal_ref", "Registered deed"),
        "timestamp": new_block.timestamp,
        "block_hash": new_block.hash
    })

    return jsonify({
        "message": "Land record successfully committed to blockchain ledger.",
        "block": new_block.to_dict(),
        "record": rec
    }), 201

@app.route("/api/transfer-ownership", methods=["POST"])
def transfer_ownership():
    data = request.json or {}
    land_id = data.get("land_id")
    new_owner = data.get("new_owner")
    transfer_type = data.get("transfer_type", "Sale")
    transfer_notes = data.get("transfer_notes", "")
    transfer_date = data.get("transfer_date") or time.strftime("%Y-%m-%d")

    rec = database.get_record_by_id(land_id)
    if not rec:
        return jsonify({"error": "Land record does not exist"}), 404

    previous_owner = rec["current_owner"]

    new_block = blockchain.add_block(
        transaction_type="TRANSFER",
        land_id=land_id,
        survey_number=rec["survey_number"],
        location=rec["location"],
        district=rec["district"],
        state=rec["state"],
        area=rec["area"],
        land_type=rec["land_type"],
        owner=new_owner,
        previous_owner=previous_owner,
        transfer_type=transfer_type,
        transfer_notes=transfer_notes
    )

    database.update_land_owner(land_id, new_owner, new_block.index)
    database.record_transaction({
        "block_index": new_block.index,
        "transaction_type": "TRANSFER",
        "land_id": land_id,
        "previous_owner": previous_owner,
        "new_owner": new_owner,
        "transfer_type": transfer_type,
        "transfer_notes": transfer_notes,
        "timestamp": new_block.timestamp,
        "block_hash": new_block.hash
    })

    return jsonify({
        "message": "Ownership transfer committed to blockchain.",
        "block": new_block.to_dict(),
        "previous_owner": previous_owner,
        "new_owner": new_owner
    })

@app.route("/api/blockchain/verify", methods=["POST"])
def verify_blockchain():
    result = blockchain.validate_chain()
    return jsonify(result)

@app.route("/api/blockchain/tamper", methods=["POST"])
def simulate_tamper():
    data = request.json or {}
    block_index = int(data.get("block_index", 1))
    fake_owner = data.get("fake_owner", "Malicious Actor")
    try:
        tamper_res = blockchain.simulate_tampering(block_index, fake_owner)
        val = blockchain.validate_chain()
        return jsonify({
            "tamper_info": tamper_res,
            "validation": val
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/api/blockchain/restore", methods=["POST"])
def restore_blockchain():
    success = blockchain.restore_chain()
    val = blockchain.validate_chain()
    return jsonify({
        "restored": success,
        "validation": val
    })

@app.route("/api/blockchain/reset-demo", methods=["POST"])
def reset_demo():
    seed_demo_data()
    return jsonify({
        "message": "Blockchain and demo records reset to default state.",
        "blocks": len(blockchain.chain)
    })

if __name__ == "__main__":
    port = int(os.environ.get("FLASK_PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
