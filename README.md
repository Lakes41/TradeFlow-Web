# TradeFlow-Web: Stellar Native RWA Dashboard

The frontend interface for the TradeFlow protocol, enabling decentralized invoice factoring and RWA lending on Stellar.

## 🚀 Features
- **Freighter Wallet Integration**: Secure on-chain identity and signing.
- **Real-time Risk Analytics**: Fetched from the TradeFlow-API risk engine.
- **Smart Contract Interaction**: Direct minting of Invoice NFTs via Soroban.

## 🛠 Tech Stack
- **Framework**: Next.js 14
- **Blockchain**: Stellar SDK & Freighter API
- **Styling**: Tailwind CSS & Lucide Icons

## 🚦 Status
- **Development**: Active
- **CI/CD**: Passing



<!-- git add .
git commit -m "feat: connect Soroban contract bindings to Next.js frontend (#187)

- Add lib/soroban with config, client, and invoice contract wrappers
- Add useInvoice and useMintInvoice hooks
- Wire hooks into InvoiceMintForm and marketplace/inv-123 page
- Pull contract ID and network passphrase from env vars"

git push origin Soroban -->