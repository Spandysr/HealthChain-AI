import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle, XCircle, Copy, Search, FileText, Loader2, AlertCircle } from 'lucide-react';
import medicalRecordsImage from '@/assets/medical-records.jpg';

interface MedicalRecord {
  id: number;
  patient_id: number;
  patient_name?: string;
  report: string;
  report_hash: string;
  blockchain_tx_hash: string;
  blockchain_block_number: number;
  verification_status: 'pending' | 'verified' | 'failed';
  created_at: string;
}

export function BlockchainRecords() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [verifying, setVerifying] = useState<number | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/records');
      if (!response.ok) {
        throw new Error(`Failed to fetch records (HTTP ${response.status})`);
      }
      const data = await response.json();
      setRecords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleRecordSaved = () => {
      fetchRecords();
    };

    fetchRecords();
    window.addEventListener('healthchain-record-saved', handleRecordSaved);

    return () => {
      window.removeEventListener('healthchain-record-saved', handleRecordSaved);
    };
  }, []);

  const filteredRecords = records.filter(r =>
    (r.patient_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.patient_id.toString().includes(searchQuery.toLowerCase()) ||
    r.id.toString().includes(searchQuery.toLowerCase()) ||
    r.report.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVerify = async (recordId: number) => {
    setVerifying(recordId);
    try {
      const response = await fetch('/api/records/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordId }),
      });
      if (!response.ok) {
        throw new Error('Verification failed');
      }
      const result = await response.json();
      // Update the record in the list
      setRecords(prevRecords => prevRecords.map(r => r.id === recordId ? { ...r, verification_status: result.verification_status } : r));
      if (selectedRecord?.id === recordId) {
        setSelectedRecord(prev => prev ? { ...prev, verification_status: result.verification_status } : null);
      }
    } catch (err) {
      // Handle error notification
      console.error(err);
    } finally {
      setVerifying(null);
    }
  };

  const copyHash = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section id="records" className="py-24 px-6 lg:px-12 bg-background transition-colors duration-700">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }} className="text-center mb-8">
          <p className="text-sm font-semibold text-blockchain-purple uppercase tracking-wider mb-3">Blockchain Security</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Tamper-Proof Medical Records
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Every medical record is hashed using SHA-256 and stored on an Ethereum-compatible blockchain via smart contracts.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="relative rounded-2xl overflow-hidden mb-12 shadow-lg"
        >
          <img src={medicalRecordsImage} alt="Secure medical records on digital tablet with blockchain verification" loading="lazy" width={800} height={600} className="w-full h-32 sm:h-44 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-blockchain-purple/80 to-blockchain-indigo/60 flex items-center justify-center">
            <div className="text-center text-white">
              <Shield className="w-10 h-10 mx-auto mb-2 opacity-90" />
              <p className="font-display font-bold text-xl sm:text-2xl">Blockchain-Verified Records</p>
              <p className="text-sm opacity-80">SHA-256 • Smart Contracts • Ethereum Network</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by patient ID, record ID, or report content..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
          />
        </motion.div>

        {loading && <div className="text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>}
        {error && (
          <div className="text-center text-destructive space-y-3">
            <AlertCircle className="w-8 h-8 mx-auto" />
            <p>{error}</p>
            <button
              onClick={fetchRecords}
              className="inline-flex items-center px-4 py-2 rounded-lg border border-destructive/40 text-destructive hover:bg-destructive/10 transition-colors"
            >
              Retry loading records
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              <AnimatePresence>
                {filteredRecords.map((rec, i) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    whileHover={{ x: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}
                    onClick={() => setSelectedRecord(rec)}
                    className={`bg-card border rounded-xl p-5 cursor-pointer transition-all duration-400 ${
                      selectedRecord?.id === rec.id ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <motion.div whileHover={{ rotate: 5 }} className="w-10 h-10 rounded-lg bg-blockchain-purple/10 flex items-center justify-center shrink-0 mt-0.5">
                          <FileText className="w-5 h-5 text-blockchain-purple" />
                        </motion.div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-foreground">{rec.patient_name || `Patient ${rec.patient_id}`}</h4>
                            <span className="text-xs text-muted-foreground">Record #{rec.id}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">Patient ID: {rec.patient_id}</p>
                          <p className="text-sm text-muted-foreground mt-0.5 truncate">Report: {rec.report.substring(0, 50)}...</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span>{new Date(rec.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {rec.verification_status === 'verified' ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-healthcare-green bg-healthcare-green/10 px-2.5 py-1 rounded-full">
                            <CheckCircle className="w-3.5 h-3.5" /> Verified
                          </span>
                        ) : rec.verification_status === 'failed' ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-healthcare-red bg-healthcare-red/10 px-2.5 py-1 rounded-full">
                            <XCircle className="w-3.5 h-3.5" /> Failed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-healthcare-amber bg-healthcare-amber/10 px-2.5 py-1 rounded-full">
                            <XCircle className="w-3.5 h-3.5" /> Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="lg:col-span-1">
              <AnimatePresence mode="wait">
                {selectedRecord ? (
                  <motion.div key={selectedRecord.id} initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }} className="bg-card border border-border rounded-xl p-6 sticky top-24 transition-colors duration-500">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blockchain-purple" />
                      Blockchain Details
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Record Hash (SHA-256)</p>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted text-foreground px-2 py-1.5 rounded-md font-mono break-all flex-1 transition-colors duration-300">
                            {selectedRecord.report_hash.slice(0, 20)}...{selectedRecord.report_hash.slice(-8)}
                          </code>
                          <button onClick={() => copyHash(selectedRecord.report_hash, 'hash')} className="shrink-0 p-1.5 hover:bg-muted rounded-md transition-colors duration-300">
                            <Copy className={`w-4 h-4 transition-colors duration-300 ${copied === 'hash' ? 'text-healthcare-green' : 'text-muted-foreground'}`} />
                          </button>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Transaction Hash</p>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted text-foreground px-2 py-1.5 rounded-md font-mono break-all flex-1 transition-colors duration-300">
                            {selectedRecord.blockchain_tx_hash.slice(0, 20)}...{selectedRecord.blockchain_tx_hash.slice(-8)}
                          </code>
                          <button onClick={() => copyHash(selectedRecord.blockchain_tx_hash, 'tx')} className="shrink-0 p-1.5 hover:bg-muted rounded-md transition-colors duration-300">
                            <Copy className={`w-4 h-4 transition-colors duration-300 ${copied === 'tx' ? 'text-healthcare-green' : 'text-muted-foreground'}`} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Block #</p>
                          <p className="text-sm font-mono font-semibold text-foreground">{selectedRecord.blockchain_block_number.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Network</p>
                          <p className="text-sm font-semibold text-foreground">Ethereum (Local)</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Verification Status</p>
                        {selectedRecord.verification_status === 'verified' ? (
                          <div className="flex items-center gap-2 bg-healthcare-green/10 text-healthcare-green px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300">
                            <CheckCircle className="w-4 h-4" />
                            Hash matches — Record authentic
                          </div>
                        ) : selectedRecord.verification_status === 'failed' ? (
                           <div className="flex items-center gap-2 bg-healthcare-red/10 text-healthcare-red px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300">
                            <XCircle className="w-4 h-4" />
                            Verification Failed
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 bg-healthcare-amber/10 text-healthcare-amber px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300">
                            <XCircle className="w-4 h-4" />
                            Verification pending
                          </div>
                        )}
                      </div>

                      <motion.button
                        onClick={() => handleVerify(selectedRecord.id)}
                        disabled={verifying === selectedRecord.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-blockchain-purple text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {verifying === selectedRecord.id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Verifying on Blockchain...
                          </>
                        ) : (
                          <>
                            <Shield className="w-4 h-4" />
                            Re-verify Record
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card border border-border rounded-xl p-8 text-center transition-colors duration-500">
                    <Shield className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Select a record to view blockchain verification details</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
