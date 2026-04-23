import { RiskSocketClient } from "../riskSocket";

jest.mock("../env", () => ({
  getWsBaseUrl: () => "ws://localhost:1234",
}));

jest.mock("../httpClient", () => ({
  getAuthToken: () => "test-token",
}));

class MockWebSocket {
  static instances: MockWebSocket[] = [];
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  url: string;
  readyState: number = MockWebSocket.CONNECTING;
  sent: string[] = [];

  onopen: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onclose: (() => void) | null = null;
  onerror: (() => void) | null = null;

  constructor(url: string) {
    this.url = url;
    MockWebSocket.instances.push(this);
  }

  send(data: string) {
    this.sent.push(data);
  }

  close() {
    this.readyState = MockWebSocket.CLOSED;
    this.onclose?.();
  }
}

describe("RiskSocketClient", () => {
  beforeEach(() => {
    MockWebSocket.instances = [];
    (global as any).WebSocket = MockWebSocket;
  });

  test("connect appends token and resubscribes invoice rooms on open", () => {
    const client = new RiskSocketClient();
    client.connect();

    expect(MockWebSocket.instances).toHaveLength(1);
    const ws = MockWebSocket.instances[0]!;
    expect(ws.url).toContain("token=test-token");

    client.subscribeInvoice("INV-1");

    ws.readyState = 1;
    ws.onopen?.();

    expect(ws.sent.some((s) => s.includes("\"type\":\"subscribe\""))).toBe(true);
    expect(ws.sent.some((s) => s.includes("invoice:INV-1"))).toBe(true);
  });

  test("emits risk_update events from incoming messages", () => {
    const client = new RiskSocketClient();
    client.connect();

    const ws = MockWebSocket.instances[0]!;
    ws.readyState = 1;
    ws.onopen?.();

    const received: any[] = [];
    client.on((evt) => received.push(evt));

    ws.onmessage?.({
      data: JSON.stringify({ event: "risk_update", data: { invoiceId: "INV-9", riskScore: 88 } }),
    });

    expect(received.some((e) => e.event === "risk_update" && e.data.invoiceId === "INV-9")).toBe(true);
  });

  test("reconnects with backoff when the socket closes unexpectedly", () => {
    jest.useFakeTimers();
    jest.spyOn(Math, "random").mockReturnValue(0);

    const client = new RiskSocketClient();
    client.connect();

    expect(MockWebSocket.instances).toHaveLength(1);
    const ws = MockWebSocket.instances[0]!;
    ws.onclose?.();

    jest.advanceTimersByTime(500);
    expect(MockWebSocket.instances).toHaveLength(2);

    (Math.random as any).mockRestore?.();
    jest.useRealTimers();
  });

  test("does not reconnect after manual disconnect", () => {
    jest.useFakeTimers();
    jest.spyOn(Math, "random").mockReturnValue(0);

    const client = new RiskSocketClient();
    client.connect();

    expect(MockWebSocket.instances).toHaveLength(1);
    client.disconnect();

    jest.advanceTimersByTime(5000);
    expect(MockWebSocket.instances).toHaveLength(1);

    (Math.random as any).mockRestore?.();
    jest.useRealTimers();
  });
});
