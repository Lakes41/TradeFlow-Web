import React, { useState, useMemo } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface Token {
  symbol: string;
  name: string;
  address: string;
  logo?: string;
}

interface TokenSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: Token[];
  onSelect: (token: Token) => void;
}

export const TokenSelectModal: React.FC<TokenSelectModalProps> = ({ isOpen, onClose, tokens, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [agreedToRisks, setAgreedToRisks] = useState(false);

  const filteredTokens = useMemo(() => {
    return tokens.filter(t => 
      t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.address.toLowerCase() === searchQuery.toLowerCase()
    );
  }, [tokens, searchQuery]);

  const isStellarAddress = searchQuery.length === 56;
  const showImportUI = isStellarAddress && filteredTokens.length === 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Content - Mobile: Bottom Sheet | Desktop: Centered Modal (#93) */}
      <div className="relative w-full rounded-t-2xl bg-white shadow-2xl transition-all sm:max-w-md sm:rounded-2xl pb-safe">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Select a Token</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
              <X size={20} />
            </button>
          </div>

          <input
            type="text"
            placeholder="Search name or paste address"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            {showImportUI ? (
              /* Import Token UI (#96) */
              <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-sm font-medium text-gray-600">
                    {searchQuery.substring(0, 6)}...{searchQuery.substring(50)}
                  </span>
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                    Unknown Asset
                  </span>
                </div>
                
                <div className="flex gap-2 mb-4">
                  <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm font-bold text-red-600 leading-tight">
                    Warning: This token is unverified. Always verify the contract address before trading.
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-red-300 text-red-600 focus:ring-red-500"
                      checked={agreedToRisks}
                      onChange={(e) => setAgreedToRisks(e.target.checked)}
                    />
                    <span className="text-xs text-gray-700">
                      I understand the risks of trading unverified tokens.
                    </span>
                  </label>

                  <button
                    disabled={!agreedToRisks}
                    className="w-full rounded-xl bg-red-600 py-3 font-bold text-white transition-opacity disabled:opacity-50"
                    onClick={() => onSelect({ symbol: 'UNKNOWN', name: 'Imported Asset', address: searchQuery })}
                  >
                    Import
                  </button>
                </div>
              </div>
            ) : (
              /* Default List */
              <div className="space-y-1">
                {filteredTokens.map((token) => (
                  <button
                    key={token.address}
                    onClick={() => onSelect(token)}
                    className="flex w-full items-center gap-3 rounded-xl p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-full bg-gray-200" />
                    <div className="text-left">
                      <div className="font-bold text-gray-900">{token.symbol}</div>
                      <div className="text-xs text-gray-500">{token.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};