import {
  Contract,
  TransactionBuilder,
  scValToNative,
  nativeToScVal,
  Account,
} from "soroban-client";
import { getSorobanClient } from "../client";
import { getSorobanConfig } from "../config";
import { signTransaction, waitForTransaction } from "@/lib/stellar";

export interface Invoice {
  id: string;
  amount: bigint;
  issuer: string;
  recipient: string;
  status: string;
  createdAt: number;
}

export interface MintInvoiceParams {
  invoiceId: string;
  amount: bigint;
  recipient: string;
  callerPublicKey: string;
}

export interface RepayInvoiceParams {
  invoiceId: string;
  callerPublicKey: string;
}

/**
 * Parses a Soroban simulation error into a human-readable message.
 * Handles out-of-gas, resource limit, and contract assertion errors.
 */
function parseSimulationError(error: unknown): string {
  const msg = String(error);
  if (msg.includes("ExceededLimit") || msg.includes("resource")) {
    return "Transaction exceeds Soroban resource limits. Try reducing the operation size.";
  }
  if (msg.includes("InsufficientFee") || msg.includes("fee")) {
    return "Insufficient fee for this transaction. The network requires a higher fee.";
  }
  if (msg.includes("ContractError") || msg.includes("assert")) {
    return `Contract assertion failed: ${msg}`;
  }
  return `Simulation failed: ${msg}`;
}

export async function getInvoice(invoiceId: string): Promise<Invoice> {
  const client = getSorobanClient();
  const { contractIds, networkPassphrase } = getSorobanConfig();
  const contract = new Contract(contractIds.invoice);

  const args = [nativeToScVal(invoiceId, { type: "string" })];

  const result = await client.simulateTransaction(
    new TransactionBuilder(
      new Account("GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN", "0"),
      { fee: "100", networkPassphrase }
    )
      .addOperation(contract.call("get_invoice", ...args))
      .setTimeout(30)
      .build()
  );

  if ("error" in result) {
    throw new Error(parseSimulationError((result as any).error));
  }

  const returnVal = (result as any).result?.retval;
  if (!returnVal) throw new Error("No return value from get_invoice.");

  const native = scValToNative(returnVal) as any;

  return {
    id: native.id ?? invoiceId,
    amount: BigInt(native.amount ?? 0),
    issuer: native.issuer ?? "",
    recipient: native.recipient ?? "",
    status: native.status ?? "unknown",
    createdAt: Number(native.created_at ?? 0),
  };
}

export async function mintInvoice(params: MintInvoiceParams): Promise<string> {
  const { invoiceId, amount, recipient, callerPublicKey } = params;
  const client = getSorobanClient();
  const { contractIds, networkPassphrase } = getSorobanConfig();
  const contract = new Contract(contractIds.invoice);

  const account = await client.getAccount(callerPublicKey);

  const args = [
    nativeToScVal(invoiceId, { type: "string" }),
    nativeToScVal(amount, { type: "i128" }),
    nativeToScVal(recipient, { type: "address" }),
  ];

  // Build with a conservative base fee; simulation will provide the real fee.
  const tx = new TransactionBuilder(account, {
    fee: "1000",
    networkPassphrase,
  })
    .addOperation(contract.call("mint_invoice", ...args))
    .setTimeout(60)
    .build();

  // --- Issue #190: Simulate first and extract the required fee ---
  const simResult = await client.simulateTransaction(tx);
  if ("error" in simResult) {
    // Surface a clear, actionable error before ever prompting the wallet.
    throw new Error(parseSimulationError((simResult as any).error));
  }

  // prepareTransaction injects the fee and resource config from simulation.
  const preparedTx = await client.prepareTransaction(tx, networkPassphrase);
  const xdr = preparedTx.toXDR();

  // --- Issue #189: Trigger Freighter signing prompt ---
  const signedXdr = await signTransaction(xdr, {
    address: callerPublicKey,
    networkPassphrase,
  });

  const { hash } = await client.sendTransaction(
    TransactionBuilder.fromXDR(signedXdr, networkPassphrase)
  );

  // Poll until the transaction is included in a ledger.
  return await waitForTransaction(hash);
}

/**
 * Issue #194: Repay a mature invoice loan.
 * Calls the `repay` function on the Soroban contract.
 */
export async function repayInvoice(params: RepayInvoiceParams): Promise<string> {
  const { invoiceId, callerPublicKey } = params;
  const client = getSorobanClient();
  const { contractIds, networkPassphrase } = getSorobanConfig();
  const contract = new Contract(contractIds.invoice);

  const account = await client.getAccount(callerPublicKey);

  const args = [nativeToScVal(invoiceId, { type: "string" })];

  const tx = new TransactionBuilder(account, {
    fee: "1000",
    networkPassphrase,
  })
    .addOperation(contract.call("repay", ...args))
    .setTimeout(60)
    .build();

  // Simulate first to catch resource/fee errors before prompting the wallet.
  const simResult = await client.simulateTransaction(tx);
  if ("error" in simResult) {
    throw new Error(parseSimulationError((simResult as any).error));
  }

  const preparedTx = await client.prepareTransaction(tx, networkPassphrase);
  const xdr = preparedTx.toXDR();

  const signedXdr = await signTransaction(xdr, {
    address: callerPublicKey,
    networkPassphrase,
  });

  const { hash } = await client.sendTransaction(
    TransactionBuilder.fromXDR(signedXdr, networkPassphrase)
  );

  return await waitForTransaction(hash);
}
