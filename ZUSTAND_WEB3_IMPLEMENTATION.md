# Web3 State Management with Zustand

This document describes the implementation of global Web3 state management using Zustand in the TradeFlow-Web application.

## Overview

The `useWeb3Store` provides a centralized state management solution for Web3 functionality, eliminating prop drilling and ensuring real-time blockchain data access across all components.

## Features

### 🔄 Wallet Connection
- **connectWallet()**: Connect to Freighter wallet
- **disconnectWallet()**: Disconnect and clear state
- **isConnecting**: Loading state during connection
- **error**: Comprehensive error handling

### 🌐 Network Management
- **switchNetwork()**: Switch between Testnet and Mainnet
- **network**: Current active network
- **NETWORKS**: Predefined network constants

### 💰 Balance Management
- **updateBalances()**: Fetch all token balances from Stellar
- **updateTokenBalance()**: Update specific token balance
- **balances**: Record of all token balances
- **useTokenBalance()**: Hook for specific token balance

### 🎯 Custom Hooks
- **useWalletConnection()**: Wallet-related state and actions
- **useNetwork()**: Network state and switching
- **useBalances()**: Balance state and updates
- **useTokenBalance(tokenCode)**: Specific token balance

## Usage Examples

### Basic Wallet Connection
```typescript
import { useWalletConnection } from '../stores/useWeb3Store';

function WalletButton() {
  const { isConnected, connectWallet, disconnectWallet, isConnecting } = useWalletConnection();

  return (
    <button onClick={isConnected ? disconnectWallet : connectWallet}>
      {isConnecting ? 'Connecting...' : isConnected ? 'Disconnect' : 'Connect Wallet'}
    </button>
  );
}
```

### Network Switching
```typescript
import { useNetwork, NETWORKS } from '../stores/useWeb3Store';

function NetworkSelector() {
  const { network, switchNetwork } = useNetwork();

  return (
    <div>
      <button onClick={() => switchNetwork(NETWORKS.TESTNET)}>
        Testnet
      </button>
      <button onClick={() => switchNetwork(NETWORKS.MAINNET)}>
        Mainnet
      </button>
      <p>Current: {network}</p>
    </div>
  );
}
```

### Balance Display
```typescript
import { useBalances, useTokenBalance } from '../stores/useWeb3Store';

function TokenBalances() {
  const { balances, updateBalances, isLoading } = useBalances();
  const xlmBalance = useTokenBalance('XLM');

  return (
    <div>
      <p>XLM: {xlmBalance.toFixed(7)}</p>
      <button onClick={updateBalances} disabled={isLoading}>
        {isLoading ? 'Updating...' : 'Refresh'}
      </button>
    </div>
  );
}
```

## State Interface

```typescript
interface Web3State {
  // Wallet connection
  walletAddress: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  
  // Network
  network: NetworkType; // 'Testnet' | 'Mainnet'
  
  // Token balances
  balances: Record<string, number>;
  
  // Loading and error states
  isLoading: boolean;
  error: string | null;
}
```

## Actions

### Wallet Actions
- `connectWallet(): Promise<void>` - Connect to Freighter wallet
- `disconnectWallet(): void` - Disconnect and clear state

### Network Actions
- `switchNetwork(network: NetworkType): Promise<void>` - Switch networks

### Balance Actions
- `updateBalances(): Promise<void>` - Fetch all balances
- `updateTokenBalance(tokenCode: string, balance: number): void` - Update specific token

### Utility Actions
- `clearError(): void` - Clear error state
- `setLoading(loading: boolean): void` - Set loading state

## Integration with Existing Code

### Replacing Context Providers
The new Zustand store can replace existing React Context providers:

```typescript
// Before - using Context
const { walletAddress } = useWalletContext();

// After - using Zustand
const { walletAddress } = useWalletConnection();
```

### Migration Strategy
1. **Phase 1**: Add Zustand store alongside existing context
2. **Phase 2**: Gradually migrate components to use Zustand hooks
3. **Phase 3**: Remove old context providers

## Error Handling

The store includes comprehensive error handling:
- Wallet installation checks
- Connection failures
- Network switching errors
- Balance fetching issues

All errors are stored in the `error` state and can be accessed via:
```typescript
const { error, clearError } = useWeb3Store();
```

## Testing

A test component `Web3TestComponent.tsx` is provided to verify all functionality:
- Wallet connection/disconnection
- Network switching
- Balance fetching and display
- Error state handling

## Benefits

1. **No Prop Drilling**: Any component can access Web3 state directly
2. **Real-time Updates**: All components update automatically when state changes
3. **TypeScript Support**: Full type safety with interfaces
4. **Performance**: Selective subscriptions prevent unnecessary re-renders
5. **Developer Experience**: Easy-to-use hooks and clear API

## File Structure

```
src/
├── stores/
│   ├── useWeb3Store.ts     # Main Web3 store
│   └── tokenStore.ts       # Existing token store (can be integrated)
├── components/
│   └── Web3TestComponent.tsx # Testing component
```

## Future Enhancements

1. **Multi-wallet Support**: Add support for other Stellar wallets
2. **Transaction History**: Store and manage transaction history
3. **Persistence**: Add localStorage for wallet preference
4. **Middleware**: Add devtools and persistence middleware
5. **Optimistic Updates**: Implement optimistic balance updates
