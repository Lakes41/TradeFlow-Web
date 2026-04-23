import { getWsBaseUrl } from "./env";
import { getAuthToken } from "./httpClient";

export interface RiskUpdateEvent {
  invoiceId: string;
  riskScore: number;
  updatedAt?: string;
}

export type RiskSocketEvent =
  | { event: "risk_update"; data: RiskUpdateEvent }
  | { event: "connected" }
  | { event: "disconnected" };

export interface RiskSocketClientOptions {
  wsBaseUrl?: string;
  token?: string | null;
}

type Listener = (event: RiskSocketEvent) => void;

export class RiskSocketClient {
  private ws: WebSocket | null = null;
  private listeners = new Set<Listener>();
  private reconnectAttempt = 0;
  private reconnectTimer: number | null = null;
  private intentionallyClosed = false;
  private invoiceRooms = new Set<string>();
  private riskFeedEnabled = false;

  private wsBaseUrl: string;
  private token: string | null;

  constructor(options: RiskSocketClientOptions = {}) {
    this.wsBaseUrl = options.wsBaseUrl ?? getWsBaseUrl();
    this.token = options.token ?? getAuthToken();
  }

  on(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  connect(): void {
    if (typeof window === "undefined") return;
    if (!this.wsBaseUrl) return;
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.intentionallyClosed = false;
    this.clearReconnectTimer();

    const url = new URL(this.wsBaseUrl);
    if (this.token) url.searchParams.set("token", this.token);

    const ws = new WebSocket(url.toString());
    this.ws = ws;

    ws.onopen = () => {
      this.reconnectAttempt = 0;
      this.emit({ event: "connected" });

      if (this.token) {
        this.safeSend({ type: "auth", payload: { token: this.token } });
      }

      if (this.riskFeedEnabled) this.safeSend({ type: "subscribe", payload: { room: "risk:feed" } });
      for (const room of this.invoiceRooms) {
        this.safeSend({ type: "subscribe", payload: { room } });
      }
    };

    ws.onmessage = (msg) => {
      const parsed = this.parseMessage(msg.data);
      if (!parsed) return;

      if (parsed.event === "risk_update") {
        this.emit(parsed);
      }
    };

    ws.onerror = () => {
      return;
    };

    ws.onclose = () => {
      this.ws = null;
      this.emit({ event: "disconnected" });
      if (!this.intentionallyClosed) this.scheduleReconnect();
    };
  }

  disconnect(): void {
    this.intentionallyClosed = true;
    this.clearReconnectTimer();
    const ws = this.ws;
    this.ws = null;
    if (!ws) return;
    try {
      ws.close();
    } catch {
      return;
    }
  }

  enableRiskFeed(enabled: boolean): void {
    this.riskFeedEnabled = enabled;
    if (enabled) this.safeSend({ type: "subscribe", payload: { room: "risk:feed" } });
    else this.safeSend({ type: "unsubscribe", payload: { room: "risk:feed" } });
  }

  subscribeInvoice(invoiceId: string): void {
    const room = `invoice:${invoiceId}`;
    if (this.invoiceRooms.has(room)) return;
    this.invoiceRooms.add(room);
    this.safeSend({ type: "subscribe", payload: { room, invoiceId } });
  }

  unsubscribeInvoice(invoiceId: string): void {
    const room = `invoice:${invoiceId}`;
    if (!this.invoiceRooms.has(room)) return;
    this.invoiceRooms.delete(room);
    this.safeSend({ type: "unsubscribe", payload: { room, invoiceId } });
  }

  syncInvoices(invoiceIds: string[]): void {
    const desired = new Set(invoiceIds.map((id) => `invoice:${id}`));

    for (const existing of Array.from(this.invoiceRooms)) {
      if (!desired.has(existing)) {
        const invoiceId = existing.slice("invoice:".length);
        this.unsubscribeInvoice(invoiceId);
      }
    }

    for (const id of invoiceIds) {
      this.subscribeInvoice(id);
    }
  }

  private emit(event: RiskSocketEvent): void {
    for (const listener of this.listeners) {
      listener(event);
    }
  }

  private safeSend(payload: unknown): void {
    const ws = this.ws;
    if (!ws) return;
    if (ws.readyState !== WebSocket.OPEN) return;
    try {
      ws.send(JSON.stringify(payload));
    } catch {
      return;
    }
  }

  private parseMessage(data: unknown): RiskSocketEvent | null {
    if (typeof data !== "string") return null;

    let obj: any;
    try {
      obj = JSON.parse(data);
    } catch {
      return null;
    }

    const eventName = obj?.event || obj?.type;
    const payload = obj?.data ?? obj?.payload ?? obj;

    if (eventName === "risk_update") {
      const invoiceId = payload?.invoiceId;
      const riskScore = payload?.riskScore;
      if (typeof invoiceId !== "string" || typeof riskScore !== "number") return null;
      const updatedAt = typeof payload?.updatedAt === "string" ? payload.updatedAt : undefined;
      return { event: "risk_update", data: { invoiceId, riskScore, updatedAt } };
    }

    if (typeof payload?.invoiceId === "string" && typeof payload?.riskScore === "number") {
      return {
        event: "risk_update",
        data: { invoiceId: payload.invoiceId, riskScore: payload.riskScore, updatedAt: payload.updatedAt },
      };
    }

    return null;
  }

  private scheduleReconnect(): void {
    const baseMs = 500;
    const maxMs = 10000;
    const attempt = this.reconnectAttempt;
    const backoff = Math.min(baseMs * Math.pow(2, attempt), maxMs);
    const jitter = Math.floor(Math.random() * 150);
    const delay = backoff + jitter;

    this.reconnectAttempt = attempt + 1;
    this.clearReconnectTimer();
    this.reconnectTimer = window.setTimeout(() => this.connect(), delay);
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer === null) return;
    window.clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;
  }
}

