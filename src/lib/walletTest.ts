// Simple test file to verify wallet connector functionality
import { createWalletConnector, FREIGHTER_ID, XBULL_ID, ALBEDO_ID } from './walletConnector';

// Test that wallet connectors can be created for each wallet type
export function testWalletConnectors() {
  try {
    const freighterConnector = createWalletConnector(FREIGHTER_ID);
    const xbullConnector = createWalletConnector(XBULL_ID);
    const albedoConnector = createWalletConnector(ALBEDO_ID);
    
    console.log('✓ Wallet connectors created successfully');
    console.log('✓ Freighter connector:', freighterConnector.getWalletType());
    console.log('✓ xBull connector:', xbullConnector.getWalletType());
    console.log('✓ Albedo connector:', albedoConnector.getWalletType());
    
    return true;
  } catch (error) {
    console.error('✗ Wallet connector test failed:', error);
    return false;
  }
}

// Test utility functions
export function testWalletUtilities() {
  try {
    const { getWalletDisplayName, getWalletDescription, getWalletIcon, getWalletBgColor } = require('./walletConnector');
    
    const wallets = [FREIGHTER_ID, XBULL_ID, ALBEDO_ID];
    
    for (const walletId of wallets) {
      console.log(`✓ ${walletId}:`);
      console.log(`  - Name: ${getWalletDisplayName(walletId)}`);
      console.log(`  - Description: ${getWalletDescription(walletId)}`);
      console.log(`  - Icon: ${getWalletIcon(walletId)}`);
      console.log(`  - BG Color: ${getWalletBgColor(walletId)}`);
    }
    
    return true;
  } catch (error) {
    console.error('✗ Wallet utilities test failed:', error);
    return false;
  }
}
