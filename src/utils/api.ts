import { Block, LandRecord, OwnershipEvent, ChainValidationResult, LedgerStats, ActivityFeedItem } from '../types';

export const api = {
  async getStats(): Promise<LedgerStats> {
    const res = await fetch('/api/stats');
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  async getLandRecords(): Promise<LandRecord[]> {
    const res = await fetch('/api/land-records');
    if (!res.ok) throw new Error('Failed to fetch land records');
    return res.json();
  },

  async getLandRecord(id: string): Promise<LandRecord> {
    const res = await fetch(`/api/land-records/${id}`);
    if (!res.ok) throw new Error('Failed to fetch land record');
    return res.json();
  },

  async getTransfers(landId: string): Promise<OwnershipEvent[]> {
    const res = await fetch(`/api/transfers/${landId}`);
    if (!res.ok) throw new Error('Failed to fetch transfers');
    return res.json();
  },

  async getBlockchain(): Promise<{ chain: Block[]; length: number; latestBlock: Block }> {
    const res = await fetch('/api/blockchain');
    if (!res.ok) throw new Error('Failed to fetch blockchain');
    return res.json();
  },

  async getBlock(index: number): Promise<Block> {
    const res = await fetch(`/api/blockchain/block/${index}`);
    if (!res.ok) throw new Error('Failed to fetch block');
    return res.json();
  },

  async registerLand(data: {
    landId: string;
    surveyNumber: string;
    location: string;
    district: string;
    state: string;
    area: string;
    landType: string;
    owner: string;
    registrationDate: string;
    transferNotes?: string;
  }): Promise<{ message: string; block: Block; record: LandRecord }> {
    const res = await fetch('/api/land-records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to register land');
    }
    return res.json();
  },

  async transferOwnership(data: {
    landId: string;
    newOwner: string;
    transferType?: string;
    transferNotes?: string;
    transferDate?: string;
  }): Promise<{ message: string; block: Block; record: LandRecord; previousOwner: string; newOwner: string }> {
    const res = await fetch('/api/transfer-ownership', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to transfer ownership');
    }
    return res.json();
  },

  async verifyChain(): Promise<ChainValidationResult> {
    const res = await fetch('/api/blockchain/verify', {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to verify blockchain');
    return res.json();
  },

  async tamperChain(blockIndex: number, fakeOwner: string): Promise<{
    tamperResult: {
      tamperedBlockIndex: number;
      modifiedOwner: string;
      originalOwner: string;
      storedHash: string;
      recalculatedHash: string;
    };
    validation: ChainValidationResult;
  }> {
    const res = await fetch('/api/blockchain/tamper', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blockIndex, fakeOwner })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to simulate tampering');
    }
    return res.json();
  },

  async restoreChain(): Promise<{
    restored: boolean;
    validation: ChainValidationResult;
    message: string;
  }> {
    const res = await fetch('/api/blockchain/restore', {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to restore blockchain');
    return res.json();
  },

  async resetDemoData(): Promise<{ message: string; stats: LedgerStats }> {
    const res = await fetch('/api/blockchain/sync-state', {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to synchronize ledger state');
    return res.json();
  },

  async syncLedgerState(): Promise<{ message: string; stats: LedgerStats }> {
    return this.resetDemoData();
  },

  async getActivities(): Promise<ActivityFeedItem[]> {
    const res = await fetch('/api/activities');
    if (!res.ok) throw new Error('Failed to fetch activity feed');
    return res.json();
  }
};
