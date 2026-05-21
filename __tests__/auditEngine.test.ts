import { runAudit } from "../src/lib/auditEngine";
import type { ToolEntry } from "../src/lib/auditEngine";

function entry(overrides: Partial<ToolEntry> & Pick<ToolEntry, "toolId" | "plan">): ToolEntry {
  return {
    id: Math.random().toString(36).slice(2),
    toolName: overrides.toolId,
    monthlySpend: 40,
    seats: 1,
    useCase: "coding",
    ...overrides,
  };
}

// ── Test 1: Cursor Business with 2 seats → downgrade to Pro ──────────────
test("Cursor Business ≤3 seats recommends downgrade to Pro", () => {
  const result = runAudit([
    entry({ toolId: "cursor", toolName: "Cursor", plan: "Business", monthlySpend: 40, seats: 2 }),
  ]);
  const rec = result.recommendations[0];
  expect(rec.suggestedAction).toBe("downgrade");
  expect(rec.suggestedPlan).toBe("Pro");
  expect(rec.saving).toBe(40); // 2 seats × ($40 - $20)
});

// ── Test 2: ChatGPT Team with 2 seats → downgrade to Plus ────────────────
test("ChatGPT Team ≤2 seats recommends downgrade to Plus", () => {
  const result = runAudit([
    entry({ toolId: "chatgpt", toolName: "ChatGPT (OpenAI)", plan: "Team", monthlySpend: 30, seats: 2 }),
  ]);
  const rec = result.recommendations[0];
  expect(rec.suggestedAction).toBe("downgrade");
  expect(rec.suggestedPlan).toBe("Plus");
  expect(rec.saving).toBe(20); // 2×$30 current - 2×$20 new = $20 saved
});

// ── Test 3: Claude Max → Pro when low spend ───────────────────────────────
test("Claude Max recommends downgrade to Pro when spend ≤$120", () => {
  const result = runAudit([
    entry({ toolId: "claude", toolName: "Claude (Anthropic)", plan: "Max", monthlySpend: 100, seats: 1 }),
  ]);
  const rec = result.recommendations[0];
  expect(rec.suggestedAction).toBe("downgrade");
  expect(rec.suggestedPlan).toBe("Pro");
  expect(rec.saving).toBe(80); // 100 - 20
});

// ── Test 4: High API spend surfaces api-switch + Credex ──────────────────
test("OpenAI API direct >$400 recommends api-switch to Credex", () => {
  const result = runAudit([
    entry({ toolId: "openai_api", toolName: "OpenAI API", plan: "Pay as you go", monthlySpend: 600, seats: 1 }),
  ]);
  const rec = result.recommendations[0];
  expect(rec.suggestedAction).toBe("api-switch");
  expect(rec.suggestedTool).toContain("Credex");
  expect(rec.saving).toBeGreaterThan(0);
});

// ── Test 5: Already optimal plan → keep, zero savings ────────────────────
test("Cursor Pro with 1 seat is already optimal — no savings", () => {
  const result = runAudit([
    entry({ toolId: "cursor", toolName: "Cursor", plan: "Pro", monthlySpend: 20, seats: 1 }),
  ]);
  const rec = result.recommendations[0];
  expect(rec.suggestedAction).toBe("keep");
  expect(rec.saving).toBe(0);
  expect(result.totalSaving).toBe(0);
});

// ── Test 6: savings tier classification ──────────────────────────────────
test("Total saving >$500 sets savingsTier to 'high'", () => {
  const result = runAudit([
    entry({ toolId: "anthropic_api", toolName: "Anthropic API", plan: "Pay as you go", monthlySpend: 2200, seats: 1 }),
  ]);
  expect(result.savingsTier).toBe("high");
  expect(result.totalSaving).toBeGreaterThan(0);
});

test("Zero savings sets savingsTier to 'optimal'", () => {
  const result = runAudit([
    entry({ toolId: "cursor", toolName: "Cursor", plan: "Pro", monthlySpend: 20, seats: 1 }),
  ]);
  expect(result.savingsTier).toBe("optimal");
});
