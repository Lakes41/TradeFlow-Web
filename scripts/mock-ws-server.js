const WebSocket = require('ws');

// Create WebSocket server on port 3001 (IPv4 only)
const wss = new WebSocket.Server({
  port: 3001,
  host: '127.0.0.1'
});

console.log('WebSocket server started on ws://127.0.0.1:3001');

const subscriptions = new Map();

// Generate mock trade data
function generateTradeData(symbol) {
  const now = Date.now();
  const basePrice = 0.15 + Math.random() * 0.02; // Base price around 0.15-0.17
  const volatility = 0.001;

  return {
    type: "trade",
    symbol: symbol,
    payload: {
      timestamp: now,
      open: basePrice,
      high: basePrice + (Math.random() * volatility),
      low: basePrice - (Math.random() * volatility),
      close: basePrice + ((Math.random() - 0.5) * volatility),
      volume: Math.floor(500 + Math.random() * 2000),
      previousClose: basePrice - ((Math.random() - 0.5) * volatility)
    }
  };
}

function generateRiskUpdate(invoiceId) {
  const riskScore = Math.max(0, Math.min(100, Math.round(40 + Math.random() * 55)));
  return {
    event: "risk_update",
    data: {
      invoiceId,
      riskScore,
      updatedAt: new Date().toISOString(),
    },
  };
}

// Handle new connections
wss.on('connection', (ws) => {
  console.log('New client connected');

  // Track subscriptions for this client
  const clientSubscriptions = new Set();

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === 'subscribe') {
        const symbol = data.payload && data.payload.symbol;
        const room = data.payload && data.payload.room;

        const topic = typeof room === 'string' ? room : symbol;
        if (!topic) return;

        clientSubscriptions.add(topic);
        if (!subscriptions.has(topic)) subscriptions.set(topic, new Set());
        subscriptions.get(topic).add(ws);

        console.log(`Client subscribed to ${topic}`);

        if (typeof symbol === 'string') {
          ws.send(JSON.stringify(generateTradeData(symbol)));
        } else if (typeof room === 'string') {
          if (room.startsWith('invoice:')) {
            const invoiceId = room.slice('invoice:'.length);
            ws.send(JSON.stringify(generateRiskUpdate(invoiceId)));
          } else if (room === 'risk:feed') {
            ws.send(JSON.stringify(generateRiskUpdate('INV-DEMO-001')));
          }
        }
      } else if (data.type === 'unsubscribe') {
        const room = data.payload && data.payload.room;
        const symbol = data.payload && data.payload.symbol;
        const topic = typeof room === 'string' ? room : symbol;
        if (!topic) return;

        clientSubscriptions.delete(topic);
        if (subscriptions.has(topic)) {
          subscriptions.get(topic).delete(ws);
          if (subscriptions.get(topic).size === 0) subscriptions.delete(topic);
        }
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');

    // Remove client from all subscriptions
    clientSubscriptions.forEach(topic => {
      if (!subscriptions.has(topic)) return;
      subscriptions.get(topic).delete(ws);
      if (subscriptions.get(topic).size === 0) subscriptions.delete(topic);
    });
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Broadcast live data to subscribed clients
setInterval(() => {
  subscriptions.forEach((clients, topic) => {
    let payload;
    if (typeof topic === 'string' && topic.startsWith('invoice:')) {
      const invoiceId = topic.slice('invoice:'.length);
      payload = generateRiskUpdate(invoiceId);
    } else if (topic === 'risk:feed') {
      payload = generateRiskUpdate('INV-DEMO-001');
    } else {
      payload = generateTradeData(topic);
    }

    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) client.send(JSON.stringify(payload));
    });
  });
}, 2000); // Send new data every 2 seconds

// Handle server shutdown
process.on('SIGINT', () => {
  console.log('Shutting down WebSocket server...');
  wss.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
