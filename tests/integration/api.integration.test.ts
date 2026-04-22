import axios from "axios";

const run = process.env.RUN_INTEGRATION_TESTS === "1";

const suite = run ? describe : describe.skip;

suite("API integration", () => {
  test("GET /health returns a valid response", async () => {
    const baseUrl = process.env.INTEGRATION_BASE_URL || "http://localhost:3000";
    const res = await axios.get(`${baseUrl}/health`, { timeout: 10000 });
    expect(res.status).toBe(200);
    expect(res.data).toEqual(expect.objectContaining({ status: expect.any(String) }));
  });

  test("GET /v1/risk returns a valid response", async () => {
    const baseUrl = process.env.INTEGRATION_BASE_URL || "http://localhost:3000";
    const res = await axios.get(`${baseUrl}/v1/risk`, {
      timeout: 10000,
      params: { invoiceId: "INV-INTEG-001" },
    });
    expect(res.status).toBe(200);
    expect(res.data).toEqual(
      expect.objectContaining({
        invoiceId: "INV-INTEG-001",
        riskScore: expect.any(Number),
      }),
    );
  });
});
