import { create } from 'zustand';

export interface SignatureState {
  // State
  isSigning: boolean;
  signingMessage: string;
  transactionDetails: {
    networkFee?: string;
    contractAddress?: string;
    amount?: string;
    fromToken?: string;
    toToken?: string;
  } | null;
  
  // Actions
  startSigning: (message?: string, details?: SignatureState['transactionDetails']) => void;
  stopSigning: () => void;
  updateMessage: (message: string) => void;
  setTransactionDetails: (details: SignatureState['transactionDetails']) => void;
}

export const useSignatureStore = create<SignatureState>((set) => ({
  // Initial state
  isSigning: false,
  signingMessage: 'Please sign the transaction in your wallet.',
  transactionDetails: null,

  // Actions
  startSigning: (message = 'Please sign the transaction in your wallet.', details = null) => {
    set({
      isSigning: true,
      signingMessage: message,
      transactionDetails: details,
    });
  },

  stopSigning: () => {
    set({
      isSigning: false,
      signingMessage: 'Please sign the transaction in your wallet.',
      transactionDetails: null,
    });
  },

  updateMessage: (message: string) => {
    set({ signingMessage: message });
  },

  setTransactionDetails: (details) => {
    set({ transactionDetails: details });
  },
}));

// Selector hooks for common use cases
export const useIsSigning = () => useSignatureStore((state) => state.isSigning);
export const useSigningMessage = () => useSignatureStore((state) => state.signingMessage);
export const useTransactionDetails = () => useSignatureStore((state) => state.transactionDetails);
export const useSigningActions = () => useSignatureStore((state) => ({
  startSigning: state.startSigning,
  stopSigning: state.stopSigning,
  updateMessage: state.updateMessage,
  setTransactionDetails: state.setTransactionDetails,
}));
