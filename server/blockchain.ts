import crypto from 'crypto';
import { Block, LandRecord, OwnershipEvent, ChainValidationResult, ChainBlockVerification, LedgerStats } from '../src/types';

export function computeBlockHash(params: {
  index: number;
  timestamp: string;
  transactionType: string;
  landId: string;
  surveyNumber: string;
  location: string;
  district: string;
  state: string;
  area: string;
  landType: string;
  owner: string;
  previousHash: string;
  previousOwner?: string;
  transferType?: string;
  transferNotes?: string;
}): string {
  const payload = {
    area: params.area,
    district: params.district,
    index: params.index,
    land_id: params.landId,
    land_type: params.landType,
    location: params.location,
    owner: params.owner,
    previous_hash: params.previousHash,
    previous_owner: params.previousOwner || '',
    state: params.state,
    survey_number: params.surveyNumber,
    timestamp: params.timestamp,
    transaction_type: params.transactionType,
    transfer_notes: params.transferNotes || '',
    transfer_type: params.transferType || ''
  };
  const jsonStr = JSON.stringify(payload);
  return crypto.createHash('sha256').update(jsonStr).digest('hex');
}

export class BlockchainService {
  private chain: Block[] = [];
  private records: Map<string, LandRecord> = new Map();
  private transactions: OwnershipEvent[] = [];
  private backupChain: Block[] | null = null;
  private backupRecords: Map<string, LandRecord> | null = null;
  private verificationCount = 12;

  constructor() {
    this.initDemoData();
  }

  public initGenesisBlock(): Block {
    const genesisParams = {
      index: 0,
      timestamp: '2024-01-01T00:00:00Z',
      transactionType: 'GENESIS' as const,
      landId: 'GENESIS-0',
      surveyNumber: '00/0',
      location: 'LandLedger Trust Node',
      district: 'Central Repository',
      state: 'National Ledger',
      area: '0',
      landType: 'Registry Root',
      owner: 'LandLedger Protocol',
      previousHash: '0'
    };
    const hash = computeBlockHash(genesisParams);
    const genesisBlock: Block = {
      ...genesisParams,
      dataSummary: 'LandLedger Blockchain Initialized',
      hash
    };
    this.chain = [genesisBlock];
    return genesisBlock;
  }

  public getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  public getChain(): Block[] {
    return [...this.chain];
  }

  public getBlockByIndex(index: number): Block | null {
    if (index < 0 || index >= this.chain.length) return null;
    return this.chain[index];
  }

  public getAllRecords(): LandRecord[] {
    return Array.from(this.records.values());
  }

  public getRecordById(landId: string): LandRecord | null {
    return this.records.get(landId) || null;
  }

  public getTransfersForLand(landId: string): OwnershipEvent[] {
    return this.transactions.filter(t => t.landId === landId);
  }

  public addBlock(data: {
    transactionType: 'REGISTRATION' | 'TRANSFER';
    landId: string;
    surveyNumber: string;
    location: string;
    district: string;
    state: string;
    area: string;
    landType: any;
    owner: string;
    previousOwner?: string;
    transferType?: string;
    transferNotes?: string;
    timestamp?: string;
  }): Block {
    const prevBlock = this.getLatestBlock();
    const timestamp = data.timestamp || new Date().toISOString();
    const index = this.chain.length;

    const hash = computeBlockHash({
      index,
      timestamp,
      transactionType: data.transactionType,
      landId: data.landId,
      surveyNumber: data.surveyNumber,
      location: data.location,
      district: data.district,
      state: data.state,
      area: data.area,
      landType: data.landType,
      owner: data.owner,
      previousHash: prevBlock.hash,
      previousOwner: data.previousOwner,
      transferType: data.transferType,
      transferNotes: data.transferNotes
    });

    const block: Block = {
      index,
      timestamp,
      transactionType: data.transactionType,
      landId: data.landId,
      surveyNumber: data.surveyNumber,
      location: data.location,
      district: data.district,
      state: data.state,
      area: data.area,
      landType: data.landType,
      owner: data.owner,
      previousOwner: data.previousOwner,
      transferType: data.transferType,
      transferNotes: data.transferNotes,
      dataSummary: `${data.transactionType} - ${data.landId} (${data.owner})`,
      previousHash: prevBlock.hash,
      hash
    };

    this.chain.push(block);
    return block;
  }

  public registerLand(data: {
    landId: string;
    surveyNumber: string;
    location: string;
    district: string;
    state: string;
    area: string;
    landType: any;
    owner: string;
    registrationDate: string;
    transferNotes?: string;
  }): { block: Block; record: LandRecord } {
    const block = this.addBlock({
      transactionType: 'REGISTRATION',
      landId: data.landId,
      surveyNumber: data.surveyNumber,
      location: data.location,
      district: data.district,
      state: data.state,
      area: data.area,
      landType: data.landType,
      owner: data.owner,
      transferNotes: data.transferNotes || 'First title registered on LandLedger'
    });

    const record: LandRecord = {
      landId: data.landId,
      surveyNumber: data.surveyNumber,
      location: data.location,
      district: data.district,
      state: data.state,
      area: data.area,
      landType: data.landType,
      currentOwner: data.owner,
      initialOwner: data.owner,
      registrationDate: data.registrationDate,
      status: 'Verified',
      blockIndex: block.index,
      blockHash: block.hash
    };

    this.records.set(data.landId, record);

    this.transactions.push({
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      blockIndex: block.index,
      timestamp: block.timestamp,
      date: data.registrationDate,
      year: new Date(data.registrationDate).getFullYear().toString() || '2024',
      transactionType: 'REGISTRATION',
      landId: data.landId,
      previousOwner: 'None (First Title)',
      newOwner: data.owner,
      transferType: 'Original Registration',
      transferNotes: data.transferNotes || 'Initial title registration committed to blockchain',
      blockHash: block.hash
    });

    return { block, record };
  }

  public transferOwnership(data: {
    landId: string;
    newOwner: string;
    transferType?: string;
    transferNotes?: string;
    transferDate?: string;
  }): { block: Block; record: LandRecord; previousOwner: string } {
    const existing = this.records.get(data.landId);
    if (!existing) {
      throw new Error(`Land record '${data.landId}' not found`);
    }

    const previousOwner = existing.currentOwner;
    const block = this.addBlock({
      transactionType: 'TRANSFER',
      landId: existing.landId,
      surveyNumber: existing.surveyNumber,
      location: existing.location,
      district: existing.district,
      state: existing.state,
      area: existing.area,
      landType: existing.landType,
      owner: data.newOwner,
      previousOwner: previousOwner,
      transferType: data.transferType || 'Sale',
      transferNotes: data.transferNotes || 'Legally attested title conveyance'
    });

    existing.currentOwner = data.newOwner;
    existing.blockIndex = block.index;
    existing.blockHash = block.hash;
    existing.status = 'Verified';

    const tDate = data.transferDate || new Date().toISOString().split('T')[0];
    this.transactions.push({
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      blockIndex: block.index,
      timestamp: block.timestamp,
      date: tDate,
      year: new Date(tDate).getFullYear().toString() || '2026',
      transactionType: 'TRANSFER',
      landId: existing.landId,
      previousOwner,
      newOwner: data.newOwner,
      transferType: data.transferType || 'Sale',
      transferNotes: data.transferNotes || 'Title transferred',
      blockHash: block.hash
    });

    return { block, record: existing, previousOwner };
  }

  public validateChain(): ChainValidationResult {
    this.verificationCount++;
    const details: ChainBlockVerification[] = [];
    let isValid = true;
    let tamperedIndex: number | null = null;
    let message = 'All recorded blocks are internally consistent.';

    for (let i = 0; i < this.chain.length; i++) {
      const current = this.chain[i];
      const recalculatedHash = computeBlockHash({
        index: current.index,
        timestamp: current.timestamp,
        transactionType: current.transactionType,
        landId: current.landId,
        surveyNumber: current.surveyNumber,
        location: current.location,
        district: current.district,
        state: current.state,
        area: current.area,
        landType: current.landType,
        owner: current.owner,
        previousHash: current.previousHash,
        previousOwner: current.previousOwner,
        transferType: current.transferType,
        transferNotes: current.transferNotes
      });

      const hashValid = recalculatedHash === current.hash;
      let linkValid = true;

      if (i > 0) {
        const prev = this.chain[i - 1];
        linkValid = current.previousHash === prev.hash;
      }

      const blockValid = hashValid && linkValid;

      if (!blockValid && isValid) {
        isValid = false;
        tamperedIndex = i;
        if (!hashValid) {
          message = `Block #${i} data has been compromised! Content hash mismatch detected.`;
        } else if (!linkValid) {
          message = `Block #${i} cryptographic link broken! Previous hash does not match Block #${i - 1}.`;
        }
      }

      details.push({
        block_index: current.index,
        stored_hash: current.hash,
        calculated_hash: recalculatedHash,
        stored_previous_hash: current.previousHash,
        actual_previous_hash: i > 0 ? this.chain[i - 1].hash : '0',
        valid: blockValid,
        hash_valid: hashValid,
        link_valid: linkValid
      });
    }

    return {
      is_valid: isValid,
      total_blocks: this.chain.length,
      verified_blocks: details.filter(d => d.valid).length,
      tampered_block_index: tamperedIndex,
      message,
      details
    };
  }

  public simulateTampering(blockIndex: number, fakeOwner: string): {
    tamperedBlockIndex: number;
    modifiedOwner: string;
    originalOwner: string;
    storedHash: string;
    recalculatedHash: string;
  } {
    if (blockIndex <= 0 || blockIndex >= this.chain.length) {
      throw new Error('Cannot tamper with Genesis block or non-existent index');
    }

    // Save pristine backup if not already saved
    if (!this.backupChain) {
      this.backupChain = JSON.parse(JSON.stringify(this.chain));
      this.backupRecords = new Map(JSON.parse(JSON.stringify(Array.from(this.records.entries()))));
    }

    const block = this.chain[blockIndex];
    const originalOwner = block.owner;
    block.owner = fakeOwner;
    block.isTampered = true;
    block.dataSummary = `${block.transactionType} - ${block.landId} (TAMPERED: ${fakeOwner})`;

    // Also update record if matching
    const rec = this.records.get(block.landId);
    if (rec) {
      rec.currentOwner = fakeOwner;
      rec.status = 'Compromised';
    }

    const recalculatedHash = computeBlockHash({
      index: block.index,
      timestamp: block.timestamp,
      transactionType: block.transactionType,
      landId: block.landId,
      surveyNumber: block.surveyNumber,
      location: block.location,
      district: block.district,
      state: block.state,
      area: block.area,
      landType: block.landType,
      owner: block.owner,
      previousHash: block.previousHash,
      previousOwner: block.previousOwner,
      transferType: block.transferType,
      transferNotes: block.transferNotes
    });

    return {
      tamperedBlockIndex: blockIndex,
      modifiedOwner: fakeOwner,
      originalOwner,
      storedHash: block.hash,
      recalculatedHash
    };
  }

  public restoreChain(): boolean {
    if (this.backupChain && this.backupRecords) {
      this.chain = JSON.parse(JSON.stringify(this.backupChain));
      this.records = new Map(JSON.parse(JSON.stringify(Array.from(this.backupRecords.entries()))));
      this.backupChain = null;
      this.backupRecords = null;

      // Ensure tampered flags are cleared
      for (const b of this.chain) {
        delete b.isTampered;
      }
      for (const rec of this.records.values()) {
        rec.status = 'Verified';
      }
      return true;
    }
    return false;
  }

  public getStats(): LedgerStats {
    const val = this.validateChain();
    const transfers = this.chain.filter(b => b.transactionType === 'TRANSFER').length;
    return {
      total_land_records: this.records.size,
      active_parcels: this.records.size,
      ownership_transfers: transfers,
      verified_records: val.is_valid ? this.records.size : Math.max(0, this.records.size - 1),
      blockchain_blocks: this.chain.length,
      chain_integrity: val.is_valid ? 100 : Math.round((val.verified_blocks / val.total_blocks) * 100),
      is_valid: val.is_valid
    };
  }

  public initDemoData() {
    this.chain = [];
    this.records.clear();
    this.transactions = [];
    this.backupChain = null;
    this.backupRecords = null;

    this.initGenesisBlock();

    // 1. LAND-1001 (Residential, Bengaluru)
    const b1 = this.addBlock({
      transactionType: 'REGISTRATION',
      landId: 'LAND-1001',
      surveyNumber: '45/2',
      location: 'Indiranagar 12th Main',
      district: 'Bengaluru Urban',
      state: 'Karnataka',
      area: '2,400 sq ft',
      landType: 'Residential',
      owner: 'Ravi Kumar',
      timestamp: '2021-04-12T10:15:00Z',
      transferNotes: 'Original Title Deed No. 104/2021 recorded at BDA'
    });

    this.records.set('LAND-1001', {
      landId: 'LAND-1001',
      surveyNumber: '45/2',
      location: 'Indiranagar 12th Main',
      district: 'Bengaluru Urban',
      state: 'Karnataka',
      area: '2,400 sq ft',
      landType: 'Residential',
      currentOwner: 'Ravi Kumar',
      initialOwner: 'Ravi Kumar',
      registrationDate: '2021-04-12',
      status: 'Verified',
      blockIndex: b1.index,
      blockHash: b1.hash,
      coordinates: { x: 10, y: 10, width: 38, height: 28 }
    });

    this.transactions.push({
      id: 'tx-1001-reg',
      blockIndex: b1.index,
      timestamp: b1.timestamp,
      date: '2021-04-12',
      year: '2021',
      transactionType: 'REGISTRATION',
      landId: 'LAND-1001',
      previousOwner: 'None (First Title)',
      newOwner: 'Ravi Kumar',
      transferType: 'Initial Registration',
      transferNotes: 'First title deed recorded under Urban Development Authority',
      blockHash: b1.hash
    });

    // Transfer of LAND-1001 to Arjun Kumar
    const b1_tx = this.addBlock({
      transactionType: 'TRANSFER',
      landId: 'LAND-1001',
      surveyNumber: '45/2',
      location: 'Indiranagar 12th Main',
      district: 'Bengaluru Urban',
      state: 'Karnataka',
      area: '2,400 sq ft',
      landType: 'Residential',
      owner: 'Arjun Kumar',
      previousOwner: 'Ravi Kumar',
      transferType: 'Sale',
      transferNotes: 'Sale Deed registered at Sub-Registrar Office, Book-I Vol 412',
      timestamp: '2023-08-20T14:30:00Z'
    });

    const r1 = this.records.get('LAND-1001')!;
    r1.currentOwner = 'Arjun Kumar';
    r1.blockIndex = b1_tx.index;
    r1.blockHash = b1_tx.hash;

    this.transactions.push({
      id: 'tx-1001-tr1',
      blockIndex: b1_tx.index,
      timestamp: b1_tx.timestamp,
      date: '2023-08-20',
      year: '2023',
      transactionType: 'TRANSFER',
      landId: 'LAND-1001',
      previousOwner: 'Ravi Kumar',
      newOwner: 'Arjun Kumar',
      transferType: 'Sale',
      transferNotes: 'Sale Deed registered at Sub-Registrar Office, Book-I Vol 412',
      blockHash: b1_tx.hash
    });

    // 2. LAND-1002 (Agricultural, Mysuru)
    const b2 = this.addBlock({
      transactionType: 'REGISTRATION',
      landId: 'LAND-1002',
      surveyNumber: '78/1',
      location: 'Chamundi Foothills',
      district: 'Mysuru',
      state: 'Karnataka',
      area: '4.5 Acres',
      landType: 'Agricultural',
      owner: 'Priya Sharma',
      timestamp: '2022-01-18T09:40:00Z',
      transferNotes: 'Ancestral partition deed mutated in RTC Khata'
    });

    this.records.set('LAND-1002', {
      landId: 'LAND-1002',
      surveyNumber: '78/1',
      location: 'Chamundi Foothills',
      district: 'Mysuru',
      state: 'Karnataka',
      area: '4.5 Acres',
      landType: 'Agricultural',
      currentOwner: 'Priya Sharma',
      initialOwner: 'Priya Sharma',
      registrationDate: '2022-01-18',
      status: 'Verified',
      blockIndex: b2.index,
      blockHash: b2.hash,
      coordinates: { x: 52, y: 10, width: 44, height: 28 }
    });

    this.transactions.push({
      id: 'tx-1002-reg',
      blockIndex: b2.index,
      timestamp: b2.timestamp,
      date: '2022-01-18',
      year: '2022',
      transactionType: 'REGISTRATION',
      landId: 'LAND-1002',
      previousOwner: 'None',
      newOwner: 'Priya Sharma',
      transferType: 'Inheritance',
      transferNotes: 'Ancestral agricultural holding deed mutated into RTC',
      blockHash: b2.hash
    });

    // 3. LAND-1003 (Commercial, Tumakuru)
    const b3 = this.addBlock({
      transactionType: 'REGISTRATION',
      landId: 'LAND-1003',
      surveyNumber: '112/7',
      location: 'B.H. Road Commercial Corridor',
      district: 'Tumakuru',
      state: 'Karnataka',
      area: '6,200 sq ft',
      landType: 'Commercial',
      owner: 'Ravi Kumar',
      timestamp: '2022-07-05T11:00:00Z',
      transferNotes: 'Commercial sector allotment clear title'
    });

    this.records.set('LAND-1003', {
      landId: 'LAND-1003',
      surveyNumber: '112/7',
      location: 'B.H. Road Commercial Corridor',
      district: 'Tumakuru',
      state: 'Karnataka',
      area: '6,200 sq ft',
      landType: 'Commercial',
      currentOwner: 'Ravi Kumar',
      initialOwner: 'Ravi Kumar',
      registrationDate: '2022-07-05',
      status: 'Verified',
      blockIndex: b3.index,
      blockHash: b3.hash,
      coordinates: { x: 10, y: 44, width: 42, height: 26 }
    });

    this.transactions.push({
      id: 'tx-1003-reg',
      blockIndex: b3.index,
      timestamp: b3.timestamp,
      date: '2022-07-05',
      year: '2022',
      transactionType: 'REGISTRATION',
      landId: 'LAND-1003',
      previousOwner: 'None',
      newOwner: 'Ravi Kumar',
      transferType: 'Direct Purchase',
      transferNotes: 'Industrial corridor commercial plot allocation',
      blockHash: b3.hash
    });

    // 4. LAND-1004 (Agricultural, Mandya)
    const b4 = this.addBlock({
      transactionType: 'REGISTRATION',
      landId: 'LAND-1004',
      surveyNumber: '23/4',
      location: 'Cauvery Basin Farmland',
      district: 'Mandya',
      state: 'Karnataka',
      area: '8.2 Acres',
      landType: 'Agricultural',
      owner: 'Kiran Rao',
      timestamp: '2023-02-14T16:20:00Z',
      transferNotes: 'Irrigated agricultural land title'
    });

    this.records.set('LAND-1004', {
      landId: 'LAND-1004',
      surveyNumber: '23/4',
      location: 'Cauvery Basin Farmland',
      district: 'Mandya',
      state: 'Karnataka',
      area: '8.2 Acres',
      landType: 'Agricultural',
      currentOwner: 'Kiran Rao',
      initialOwner: 'Kiran Rao',
      registrationDate: '2023-02-14',
      status: 'Verified',
      blockIndex: b4.index,
      blockHash: b4.hash,
      coordinates: { x: 56, y: 44, width: 40, height: 26 }
    });

    this.transactions.push({
      id: 'tx-1004-reg',
      blockIndex: b4.index,
      timestamp: b4.timestamp,
      date: '2023-02-14',
      year: '2023',
      transactionType: 'REGISTRATION',
      landId: 'LAND-1004',
      previousOwner: 'None',
      newOwner: 'Kiran Rao',
      transferType: 'Original Allotment',
      transferNotes: 'Agricultural holding title clear of encumbrance',
      blockHash: b4.hash
    });

    // 5. LAND-1005 (Industrial, Bengaluru)
    const b5 = this.addBlock({
      transactionType: 'REGISTRATION',
      landId: 'LAND-1005',
      surveyNumber: '91/3',
      location: 'Peenya Industrial Estate Phase 2',
      district: 'Bengaluru Urban',
      state: 'Karnataka',
      area: '12,500 sq ft',
      landType: 'Industrial',
      owner: 'Ananya Kumar',
      timestamp: '2023-10-01T12:00:00Z',
      transferNotes: 'KIADB 99-year leasehold converted to absolute title'
    });

    this.records.set('LAND-1005', {
      landId: 'LAND-1005',
      surveyNumber: '91/3',
      location: 'Peenya Industrial Estate Phase 2',
      district: 'Bengaluru Urban',
      state: 'Karnataka',
      area: '12,500 sq ft',
      landType: 'Industrial',
      currentOwner: 'Ananya Kumar',
      initialOwner: 'Ananya Kumar',
      registrationDate: '2023-10-01',
      status: 'Verified',
      blockIndex: b5.index,
      blockHash: b5.hash,
      coordinates: { x: 10, y: 74, width: 86, height: 22 }
    });

    this.transactions.push({
      id: 'tx-1005-reg',
      blockIndex: b5.index,
      timestamp: b5.timestamp,
      date: '2023-10-01',
      year: '2023',
      transactionType: 'REGISTRATION',
      landId: 'LAND-1005',
      previousOwner: 'None',
      newOwner: 'Ananya Kumar',
      transferType: 'Allotment',
      transferNotes: 'State Industrial Area Development Board title registered',
      blockHash: b5.hash
    });
  }
}

export const blockchainService = new BlockchainService();
