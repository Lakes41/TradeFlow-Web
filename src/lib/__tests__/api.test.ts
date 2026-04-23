import { getHealth, getInvoices, getPnl, getRiskScore } from "../api";
import { httpClient, normalizeHttpError } from "../httpClient";

jest.mock("../httpClient", () => ({
  httpClient: {
    get: jest.fn(),
  },
  normalizeHttpError: jest.fn(),
}));

const mockGet = httpClient.get as unknown as jest.Mock;
const mockNormalize = normalizeHttpError as unknown as jest.Mock;

beforeEach(() => {
  mockGet.mockReset();
  mockNormalize.mockReset();
});

describe("api wrappers", () => {
  test("getHealth returns ok result for valid response", async () => {
    mockGet.mockResolvedValue({
      status: 200,
      data: { status: "ok", service: "x" },
      headers: { "content-type": "application/json" },
    });

    const res = await getHealth();
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.data.status).toBe("ok");
      expect(res.status).toBe(200);
    }
  });

  test("getHealth returns failure for invalid response shape", async () => {
    mockGet.mockResolvedValue({
      status: 200,
      data: { nope: true },
      headers: {},
    });

    const res = await getHealth();
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.error.message).toContain("Invalid /health response shape");
    }
  });

  test("getRiskScore validates invoiceId", async () => {
    const res = await getRiskScore("bad id with spaces");
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.status).toBe(400);
    }
  });

  test("getRiskScore returns ok result for valid response", async () => {
    mockGet.mockResolvedValue({
      status: 200,
      data: { invoiceId: "INV-1", riskScore: 72 },
      headers: {},
    });

    const res = await getRiskScore("INV-1");
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.data.invoiceId).toBe("INV-1");
      expect(res.data.riskScore).toBe(72);
    }
  });

  test("getInvoices returns failure when http layer throws", async () => {
    mockGet.mockRejectedValue(new Error("network down"));
    mockNormalize.mockReturnValue({ status: 502, error: { message: "normalized" } });

    const res = await getInvoices();
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.status).toBe(502);
      expect(res.error.message).toBe("normalized");
    }
  });

  test("getPnl returns ok result for valid response", async () => {
    mockGet.mockResolvedValue({
      status: 200,
      data: [
        { date: "Jan 1", value: 10 },
        { date: "Jan 2", value: 12 },
      ],
      headers: {},
    });

    const res = await getPnl();
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.data).toHaveLength(2);
      expect(res.data[0]?.value).toBe(10);
    }
  });
});
