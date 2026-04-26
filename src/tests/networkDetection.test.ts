import { renderHook, act } from '@testing-library/react';
import { useNetworkDetection } from '../hooks/useNetworkDetection';
import { useWeb3Store } from '../stores/useWeb3Store';

// Mock the Web3Store
jest.mock('../stores/useWeb3Store');
jest.mock('../lib/walletConnector', () => ({
  createWalletConnector: jest.fn(),
}));

const mockUseWeb3Store = useWeb3Store as jest.MockedFunction<typeof useWeb3Store>;

describe('useNetworkDetection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock environment variable
    process.env.NEXT_PUBLIC_STELLAR_NETWORK = 'TESTNET';
    
    // Mock window.freighter
    Object.defineProperty(window, 'freighter', {
      value: {
        on: jest.fn(),
        off: jest.fn(),
        getNetwork: jest.fn(),
      },
      writable: true,
    });
  });

  it('should detect network mismatch when wallet is on different network', async () => {
    const mockConnector = {
      getNetwork: jest.fn().mockResolvedValue('Public Global Stellar Network ; September 2015'),
    };

    const { createWalletConnector } = require('../lib/walletConnector');
    createWalletConnector.mockReturnValue(mockConnector);

    mockUseWeb3Store.mockReturnValue({
      isConnected: true,
      walletType: 'freighter',
      network: 'Testnet',
      switchNetwork: jest.fn(),
    });

    const { result } = renderHook(() => useNetworkDetection());

    expect(result.current.isMismatched).toBe(true);
    expect(result.current.expectedNetwork).toBe('Testnet');
    expect(result.current.currentWalletNetwork).toBe('Public Global Stellar Network ; September 2015');
    expect(result.current.showWarning).toBe(true);
  });

  it('should not show warning when networks match', async () => {
    const mockConnector = {
      getNetwork: jest.fn().mockResolvedValue('Test SDF Network ; September 2015'),
    };

    const { createWalletConnector } = require('../lib/walletConnector');
    createWalletConnector.mockReturnValue(mockConnector);

    mockUseWeb3Store.mockReturnValue({
      isConnected: true,
      walletType: 'freighter',
      network: 'Testnet',
      switchNetwork: jest.fn(),
    });

    const { result } = renderHook(() => useNetworkDetection());

    expect(result.current.isMismatched).toBe(false);
    expect(result.current.showWarning).toBe(false);
  });

  it('should handle mainnet environment correctly', async () => {
    process.env.NEXT_PUBLIC_STELLAR_NETWORK = 'PUBLIC';

    const mockConnector = {
      getNetwork: jest.fn().mockResolvedValue('Test SDF Network ; September 2015'),
    };

    const { createWalletConnector } = require('../lib/walletConnector');
    createWalletConnector.mockReturnValue(mockConnector);

    mockUseWeb3Store.mockReturnValue({
      isConnected: true,
      walletType: 'freighter',
      network: 'Mainnet',
      switchNetwork: jest.fn(),
    });

    const { result } = renderHook(() => useNetworkDetection());

    expect(result.current.isMismatched).toBe(true);
    expect(result.current.expectedNetwork).toBe('Mainnet');
  });

  it('should dismiss warning when requested', async () => {
    const mockConnector = {
      getNetwork: jest.fn().mockResolvedValue('Public Global Stellar Network ; September 2015'),
    };

    const { createWalletConnector } = require('../lib/walletConnector');
    createWalletConnector.mockReturnValue(mockConnector);

    mockUseWeb3Store.mockReturnValue({
      isConnected: true,
      walletType: 'freighter',
      network: 'Testnet',
      switchNetwork: jest.fn(),
    });

    const { result } = renderHook(() => useNetworkDetection());

    // Initially should show warning
    expect(result.current.showWarning).toBe(true);

    // Dismiss warning
    act(() => {
      result.current.dismissWarning();
    });

    expect(result.current.showWarning).toBe(false);
  });
});
