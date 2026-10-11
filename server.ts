import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { blockchainService } from './server/blockchain';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory activity log with live demo entries
  const activities: Array<{
    id: string;
    type: 'registration' | 'transfer' | 'verification' | 'tamper' | 'restore';
    title: string;
    description: string;
    timestamp: string;
    relativeTime: string;
    landId?: string;
    blockIndex?: number;
  }> = [
    {
      id: 'act-1',
      type: 'registration',
      title: 'Land LAND-1005 registered',
      description: 'Industrial parcel registered to Ananya Kumar in Peenya, Bengaluru.',
      timestamp: new Date(Date.now() - 21 * 60 * 1000).toISOString(),
      relativeTime: '21 minutes ago',
      landId: 'LAND-1005',
      blockIndex: 5
    },
    {
      id: 'act-2',
      type: 'verification',
      title: 'Blockchain verification completed',
      description: 'System performed cryptographic audit: all SHA-256 blocks verified.',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      relativeTime: '15 minutes ago'
    },
    {
      id: 'act-3',
      type: 'transfer',
      title: 'Ownership transferred for LAND-1001',
      description: 'Conveyance executed from Ravi Kumar to Arjun Kumar.',
      timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      relativeTime: '8 minutes ago',
      landId: 'LAND-1001',
      blockIndex: 2
    },
    {
      id: 'act-4',
      type: 'registration',
      title: 'Land LAND-1004 registered',
      description: 'Agricultural parcel registered to Kiran Rao in Mandya.',
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      relativeTime: '2 minutes ago',
      landId: 'LAND-1004',
      blockIndex: 4
    }
  ];

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'LANDLEDGER Blockchain Engine' });
  });

  app.get('/api/stats', (req, res) => {
    try {
      const stats = blockchainService.getStats();
      res.json(stats);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/land-records', (req, res) => {
    try {
      const records = blockchainService.getAllRecords();
      res.json(records);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/land-records/:landId', (req, res) => {
    try {
      const record = blockchainService.getRecordById(req.params.landId);
      if (!record) {
        return res.status(404).json({ error: 'Land record not found' });
      }
      res.json(record);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/transfers/:landId', (req, res) => {
    try {
      const transfers = blockchainService.getTransfersForLand(req.params.landId);
      res.json(transfers);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/blockchain', (req, res) => {
    try {
      const chain = blockchainService.getChain();
      const latestBlock = blockchainService.getLatestBlock();
      res.json({
        chain,
        length: chain.length,
        latestBlock
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/blockchain/block/:index', (req, res) => {
    try {
      const index = parseInt(req.params.index, 10);
      const block = blockchainService.getBlockByIndex(index);
      if (!block) {
        return res.status(404).json({ error: 'Block not found' });
      }
      res.json(block);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/land-records', (req, res) => {
    try {
      const {
        landId,
        surveyNumber,
        location,
        district,
        state,
        area,
        landType,
        owner,
        registrationDate,
        transferNotes
      } = req.body;

      if (!landId || !surveyNumber || !location || !district || !state || !area || !landType || !owner) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      // Check if landId exists
      if (blockchainService.getRecordById(landId)) {
        return res.status(400).json({ error: `Land ID '${landId}' is already registered on the blockchain.` });
      }

      const result = blockchainService.registerLand({
        landId,
        surveyNumber,
        location,
        district,
        state,
        area,
        landType,
        owner,
        registrationDate: registrationDate || new Date().toISOString().split('T')[0],
        transferNotes
      });

      activities.unshift({
        id: `act-${Date.now()}`,
        type: 'registration',
        title: `Land ${landId} registered`,
        description: `Parcel committed to ledger by ${owner} in ${location}.`,
        timestamp: new Date().toISOString(),
        relativeTime: 'Just now',
        landId,
        blockIndex: result.block.index
      });

      res.status(201).json({
        message: 'Land record successfully registered on blockchain.',
        block: result.block,
        record: result.record
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/transfer-ownership', (req, res) => {
    try {
      const { landId, newOwner, transferType, transferNotes, transferDate } = req.body;

      if (!landId || !newOwner) {
        return res.status(400).json({ error: 'Land ID and New Owner are required' });
      }

      const result = blockchainService.transferOwnership({
        landId,
        newOwner,
        transferType,
        transferNotes,
        transferDate
      });

      activities.unshift({
        id: `act-${Date.now()}`,
        type: 'transfer',
        title: `Ownership transferred for ${landId}`,
        description: `Transferred from ${result.previousOwner} to ${newOwner} (${transferType || 'Sale'}).`,
        timestamp: new Date().toISOString(),
        relativeTime: 'Just now',
        landId,
        blockIndex: result.block.index
      });

      res.json({
        message: 'Ownership transfer committed to blockchain.',
        block: result.block,
        record: result.record,
        previousOwner: result.previousOwner,
        newOwner
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/blockchain/verify', (req, res) => {
    try {
      const validation = blockchainService.validateChain();
      activities.unshift({
        id: `act-${Date.now()}`,
        type: 'verification',
        title: 'Blockchain verification completed',
        description: validation.is_valid
          ? `Verified ${validation.total_blocks} blocks. 100% hash integrity intact.`
          : `Audit completed: tampering detected at Block #${validation.tampered_block_index}.`,
        timestamp: new Date().toISOString(),
        relativeTime: 'Just now'
      });
      res.json(validation);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/blockchain/tamper', (req, res) => {
    try {
      const { blockIndex, fakeOwner } = req.body;
      const targetIndex = typeof blockIndex === 'number' ? blockIndex : 1;
      const owner = fakeOwner || 'Malicious Imposter';

      const tamperResult = blockchainService.simulateTampering(targetIndex, owner);
      const validation = blockchainService.validateChain();

      activities.unshift({
        id: `act-${Date.now()}`,
        type: 'tamper',
        title: `Tampering simulated on Block #${targetIndex}`,
        description: `Unauthorized owner modification injected into Block #${targetIndex}. Cryptographic integrity broken.`,
        timestamp: new Date().toISOString(),
        relativeTime: 'Just now',
        blockIndex: targetIndex
      });

      res.json({
        tamperResult,
        validation
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post('/api/blockchain/restore', (req, res) => {
    try {
      const restored = blockchainService.restoreChain();
      const validation = blockchainService.validateChain();

      activities.unshift({
        id: `act-${Date.now()}`,
        type: 'restore',
        title: 'Chain restored successfully',
        description: 'Ledger state restored from pristine cryptographic state. All hashes valid.',
        timestamp: new Date().toISOString(),
        relativeTime: 'Just now'
      });

      res.json({
        restored,
        validation,
        message: 'Chain restored successfully. Hashes valid and record integrity verified.'
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  const handleLedgerSync = (req: express.Request, res: express.Response) => {
    try {
      blockchainService.initDemoData();
      const stats = blockchainService.getStats();
      activities.unshift({
        id: `act-${Date.now()}`,
        type: 'restore',
        title: 'Ledger State Synchronized',
        description: 'Synchronized cadastral registry records and confirmed genesis chain integrity.',
        timestamp: new Date().toISOString(),
        relativeTime: 'Just now'
      });
      res.json({ message: 'Ledger state synchronized successfully', stats });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  app.post('/api/blockchain/reset-demo', handleLedgerSync);
  app.post('/api/blockchain/sync-state', handleLedgerSync);

  app.get('/api/activities', (req, res) => {
    res.json(activities.slice(0, 15));
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LANDLEDGER server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
