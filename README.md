# LANDLEDGER — Sovereign Blockchain Cadastral & Land Registry

[![Live Working Demo](https://img.shields.io/badge/🌐_Live_Demo-Launch_Application-00c853?style=for-the-badge&logo=google-chrome&logoColor=white)](https://ais-pre-wzjrwotqcwi3pt2a3hs7x6-614781592914.asia-east1.run.app)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg?style=for-the-badge)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node / Express](https://img.shields.io/badge/Node-Express_Fullstack-green?style=for-the-badge&logo=node.js&logoColor=white)](https://expressjs.com/)
[![Python 3](https://img.shields.io/badge/Python-Blockchain_Engine-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)

> **Every parcel. One trusted history.**  
> A high-assurance, tamper-evident land record governance platform powered by cryptographic SHA-256 blockchain verification and digital cadastral mapping.

---

## 🚀 Live Working Demo

Experience the full enterprise application live in your browser — no setup or installation required:

### 👉 **[https://ais-pre-wzjrwotqcwi3pt2a3hs7x6-614781592914.asia-east1.run.app](https://ais-pre-wzjrwotqcwi3pt2a3hs7x6-614781592914.asia-east1.run.app)**

*Alternate Mirror / Development URL:*  
🔗 [https://ais-dev-wzjrwotqcwi3pt2a3hs7x6-614781592914.asia-east1.run.app](https://ais-dev-wzjrwotqcwi3pt2a3hs7x6-614781592914.asia-east1.run.app)

### What you can test directly in the Live Demo:
1. **Cadastral Registration**: Register new real-world parcels with ULPIN IDs, survey coordinates, property types, and initial titleholders.
2. **Title Conveyance Engine**: Transfer parcel ownership with instantaneous cryptographic block sealing and conveyance deed tracking.
3. **Ledger Explorer**: Deep-inspect Block headers, timestamps, canonical payloads, previous hashes, and cryptographic signatures.
4. **Interactive GIS Parcel Map**: Explore surveyed land boundaries, zoning types, and geographic locations with live status indicators.
5. **Security & Forensics Tamper Audit**: Simulate unauthorized database tampering on historical blocks to observe the cryptographic avalanche effect and instant validation cascade breakdown.
6. **State Synchronization**: Re-sync with authoritative registry nodes and auto-remediate corrupted ledger states.

---

## 📋 Table of Contents
- [Live Working Demo](#-live-working-demo)
- [Why LANDLEDGER?](#-why-landledger)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started & Local Setup](#-getting-started--local-setup)
- [API Reference](#-api-reference)
- [Python Blockchain Engine](#-python-blockchain-engine)
- [GitHub Repository & Deployment](#-github-repository--deployment)
- [License](#-license)

---

## 🛡️ Why LANDLEDGER?

Conventional land governance relies on centralized, mutable databases or paper registries vulnerable to:
- **Title Fraud & Duplicate Sales**: Malicious actors selling the same parcel to multiple buyers.
- **Clandestine Database Alterations**: Corrupt insiders modifying titleholder names or survey boundary records.
- **Lost Chains of Custody**: Lack of an auditable, non-repudiable history of ownership deeds.

**LANDLEDGER solves this deterministically**:
- **SHA-256 Payload Hashes**: Every registration and transfer creates a cryptographic digest of the exact record data.
- **Previous-Hash Linkage**: Each block is cryptographically tethered to the previous block hash (`previousHash`).
- **Avalanche Effect**: Altering even a single character in a deed retroactively changes the hash, breaking all subsequent block links immediately and flagging fraud.
- **Genesis Root of Trust**: All records branch deterministically from Genesis Block #0.

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| **Official Cadastre Registry** | Issues unique Land IDs (e.g., `LAND-1001`), records survey coordinates, acreage, and zoning classifications. |
| **Cryptographic Block Sealing** | Canonical JSON payload serialization hashed with SHA-256 for non-repudiation. |
| **Ownership Conveyance** | Legally auditable transfers linking buyer, seller, deed reference, and stamp consideration. |
| **Cadastral GIS Map** | Interactive parcel grid and coordinate visualization displaying active boundaries and legal encumbrances. |
| **Ledger Explorer** | Full blockchain browser with block search, payload inspector, and previous/current hash linkage. |
| **Security & Forensics Lab** | Attack-simulation suite to test unauthorized payload edits, proving blockchain tamper detection in real-time. |
| **Instant Chain Auditing** | Autonomous validator verifying 100% of blocks in milliseconds with block-by-block diagnostics. |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       LANDLEDGER UI                         │
│   (React 19 + TypeScript + Tailwind CSS v4 + Lucide Icons)   │
└──────────────────────────────┬──────────────────────────────┘
                               │ JSON REST API
┌──────────────────────────────▼──────────────────────────────┐
│                    FULL-STACK BACKEND                       │
│    (Express Server + tsx Runtime / Python Blockchain Engine)│
├─────────────────────────────────────────────────────────────┤
│  • Genesis Block Initializer (#0)                            │
│  • Cryptographic SHA-256 Hashing Pipeline                   │
│  • Canonical Payload Serializer                             │
│  • Dynamic Title Conveyance & State Indexer                 │
│  • Real-Time Chain Validator & Tamper Audit Suite           │
└─────────────────────────────────────────────────────────────┘
```

---

## 💻 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide React
- **Full-stack Backend**: Express, Node.js, `tsx`
- **Alternative Engine**: Python 3 (`Flask`, `hashlib`, `unittest`)
- **Cryptography**: SHA-256 (Secure Hash Algorithm 256-bit)
- **Tooling**: Vite 8, esbuild, TypeScript 7

---

## 🛠️ Getting Started & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)
- *(Optional)* [Python 3.10+](https://www.python.org/) for the standalone Python blockchain engine

### 1. Clone the Repository
```bash
git clone https://github.com/Jemimahjem/landledger.git
cd landledger
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
The full-stack application will boot at **`http://localhost:3000`** with Vite HMR and Express API routes enabled.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/blockchain` | Returns complete blockchain with all verified blocks |
| `GET` | `/api/blockchain/stats` | Returns ledger statistics (total blocks, parcels, transfers, chain validity) |
| `GET` | `/api/blockchain/verify` | Runs full cryptographic audit on all blocks and returns verification status |
| `GET` | `/api/records` | Lists all active land parcel records with current titleholders |
| `GET` | `/api/records/:landId` | Fetches specific parcel details and its provenance history |
| `POST` | `/api/blockchain/register` | Registers a new parcel and commits a new block to the blockchain |
| `POST` | `/api/blockchain/transfer` | Executes a title transfer and commits a new conveyance block |
| `POST` | `/api/blockchain/tamper` | *(Forensics)* Simulates unauthorized tampering on a specific block |
| `POST` | `/api/blockchain/sync-state`| Synchronizes ledger state with authoritative registry nodes |
| `GET` | `/api/activities` | Fetches latest cadastral activities and conveyance logs |

---

## 🐍 Python Blockchain Engine

A standalone, pure-Python reference implementation is located in the `backend/` directory:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run blockchain test suite
python3 test_blockchain.py

# Run Flask microservice
python3 app.py
```

---

## 📦 GitHub Repository & Deployment

To sync or push to your personal GitHub repository:

```bash
# Initialize git if not already present
git init
git add .
git commit -m "feat: complete LANDLEDGER sovereign blockchain land registry"
git branch -M main

# Add your personal repository
git remote add origin https://github.com/Jemimahjem/landledger.git

# Push to GitHub
git push -u origin main
```

> **Direct Live Link**: [https://ais-pre-wzjrwotqcwi3pt2a3hs7x6-614781592914.asia-east1.run.app](https://ais-pre-wzjrwotqcwi3pt2a3hs7x6-614781592914.asia-east1.run.app)

---

## 📄 License

This project is licensed under the Apache License 2.0. See the `LICENSE` file for details.
