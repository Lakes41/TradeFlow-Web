import { Server } from "soroban-client";
import { getSorobanConfig } from "./config";

let _client: Server | null = null;
let _currentRpcUrl: string | null = null;

export function getSorobanClient(): Server {
  const { rpcUrl } = getSorobanConfig();
  
  // Clear cache if RPC URL has changed (network switch)
  if (_currentRpcUrl && _currentRpcUrl !== rpcUrl) {
    _client = null;
  }
  
  if (!_client) {
    _client = new Server(rpcUrl, { allowHttp: rpcUrl.startsWith("http://") });
    _currentRpcUrl = rpcUrl;
  }
  
  return _client;
}

// Function to clear the client cache (useful for network switching)
export function clearSorobanClientCache(): void {
  _client = null;
  _currentRpcUrl = null;
}