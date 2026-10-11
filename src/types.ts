/**
 * Core Type Definitions for LANDLEDGER
 * Enterprise Blockchain Land Record Management & Cadastral Registry Platform
 */

export type LandType = 'Residential' | 'Agricultural' | 'Commercial' | 'Industrial';

export type TransactionType = 'GENESIS' | 'REGISTRATION' | 'TRANSFER';

export type TransferType = 'Sale' | 'Gift' | 'Inheritance' | 'Other' | 'Original Allotment' | 'Direct Purchase';

export interface Block {
  index: number;
  timestamp: string;
  transactionType: TransactionType;
  landId: string;
  surveyNumber: string;
  location: string;
  district: string;
  state: string;
  area: string;
  landType: LandType | string;
  owner: string;
  previousOwner?: string;
  transferType?: TransferType | string;
  transferNotes?: string;
  dataSummary: string;
  previousHash: string;
  hash: string;
  isTampered?: boolean;
}

export interface LandRecord {
  landId: string;
  surveyNumber: string;
  location: string;
  district: string;
  state: string;
  area: string;
  landType: LandType;
  currentOwner: string;
  initialOwner: string;
  registrationDate: string;
  status: 'Verified' | 'Pending' | 'Compromised';
  blockIndex: number;
  blockHash?: string;
  coordinates?: {
    x: number;
    y: number;
    width: number;
    height: number;
    colSpan?: number;
  };
}

export interface OwnershipEvent {
  id: string;
  blockIndex: number;
  timestamp: string;
  date: string;
  year: string;
  transactionType: TransactionType;
  landId: string;
  previousOwner?: string;
  newOwner: string;
  transferType?: string;
  transferNotes?: string;
  blockHash: string;
}

export interface ChainBlockVerification {
  block_index: number;
  stored_hash: string;
  calculated_hash: string;
  stored_previous_hash: string;
  actual_previous_hash: string;
  valid: boolean;
  hash_valid: boolean;
  link_valid: boolean;
}

export interface ChainValidationResult {
  is_valid: boolean;
  total_blocks: number;
  verified_blocks: number;
  tampered_block_index: number | null;
  message: string;
  details: ChainBlockVerification[];
}

export interface LedgerStats {
  total_land_records: number;
  active_parcels: number;
  ownership_transfers: number;
  verified_records: number;
  blockchain_blocks: number;
  chain_integrity: number;
  is_valid: boolean;
}

export interface ActivityFeedItem {
  id: string;
  type: 'registration' | 'transfer' | 'verification' | 'tamper' | 'restore';
  title: string;
  description: string;
  timestamp: string;
  relativeTime: string;
  landId?: string;
  blockIndex?: number;
}
