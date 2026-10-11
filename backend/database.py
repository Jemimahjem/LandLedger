"""
LandLedger SQLite Database Layer
Stores land records and transaction references for durability and query speed.
"""

import sqlite3
import os
from typing import List, Dict, Any, Optional

DB_FILE = os.path.join(os.path.dirname(__file__), "landledger.db")

def get_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    # Table for active land records
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS land_records (
        land_id TEXT PRIMARY KEY,
        survey_number TEXT NOT NULL,
        location TEXT NOT NULL,
        district TEXT NOT NULL,
        state TEXT NOT NULL,
        area TEXT NOT NULL,
        land_type TEXT NOT NULL,
        current_owner TEXT NOT NULL,
        initial_owner TEXT NOT NULL,
        registration_date TEXT NOT NULL,
        status TEXT DEFAULT 'Verified',
        block_index INTEGER NOT NULL
    );
    """)

    # Table for transaction logs / transfers
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        block_index INTEGER NOT NULL,
        transaction_type TEXT NOT NULL,
        land_id TEXT NOT NULL,
        previous_owner TEXT,
        new_owner TEXT NOT NULL,
        transfer_type TEXT,
        transfer_notes TEXT,
        timestamp TEXT NOT NULL,
        block_hash TEXT NOT NULL
    );
    """)

    conn.commit()
    conn.close()

def save_land_record(record: Dict[str, Any]):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO land_records (
        land_id, survey_number, location, district, state, area,
        land_type, current_owner, initial_owner, registration_date, status, block_index
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        record["land_id"], record["survey_number"], record["location"],
        record["district"], record["state"], record["area"],
        record["land_type"], record["current_owner"], record.get("initial_owner", record["current_owner"]),
        record["registration_date"], record.get("status", "Verified"), record["block_index"]
    ))
    conn.commit()
    conn.close()

def update_land_owner(land_id: str, new_owner: str, block_index: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE land_records 
    SET current_owner = ?, block_index = ?
    WHERE land_id = ?
    """, (new_owner, block_index, land_id))
    conn.commit()
    conn.close()

def record_transaction(tx: Dict[str, Any]):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO transactions (
        block_index, transaction_type, land_id, previous_owner,
        new_owner, transfer_type, transfer_notes, timestamp, block_hash
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        tx["block_index"], tx["transaction_type"], tx["land_id"],
        tx.get("previous_owner", ""), tx["new_owner"],
        tx.get("transfer_type", ""), tx.get("transfer_notes", ""),
        tx["timestamp"], tx["block_hash"]
    ))
    conn.commit()
    conn.close()

def get_all_records() -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM land_records ORDER BY land_id ASC")
    rows = cursor.fetchall()
    records = [dict(row) for row in rows]
    conn.close()
    return records

def get_record_by_id(land_id: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM land_records WHERE land_id = ?", (land_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def get_transfers_for_land(land_id: str) -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM transactions WHERE land_id = ? ORDER BY id ASC", (land_id,))
    rows = cursor.fetchall()
    records = [dict(row) for row in rows]
    conn.close()
    return records
