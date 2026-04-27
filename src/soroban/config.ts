import { getEffectiveNetwork, getNetworkConfig } from "../lib/networkConfig";

export interface SorobanConfig {
  rpcUrl: string;
  networkPassphrase: string;
  contractIds: {
    invoice: string;
  };
}

export function getSorobanConfig(): SorobanConfig {
  // Get the effective network (with override if set in development)
  const network = getEffectiveNetwork('Testnet');
  const config = getNetworkConfig(network);
  
  // Fallback to environment variables if contract ID is not configured
  const invoiceContractId = config.contractIds.invoice || 
    process.env.NEXT_PUBLIC_INVOICE_CONTRACT_ID?.trim();

  if (!invoiceContractId) {
    throw new Error("Invoice contract ID is not configured for network: " + network);
  }

  return {
    rpcUrl: config.rpcUrl,
    networkPassphrase: config.networkPassphrase,
    contractIds: {
      invoice: invoiceContractId,
    },
  };
}