export function auditDom(section: string): Record<string, unknown> {
  const root = document.getElementById("main-content");
  if (!root) return { section };

  return {
    section,
    h1_count: root.querySelectorAll("h1").length,
    h2_count: root.querySelectorAll("h2").length,
    cta_count: root.querySelectorAll("button").length,
    has_code_block: root.querySelector("pre") !== null,
    has_empty_state: root.textContent?.includes("Seed demo") || root.textContent?.includes("No memories") || false,
    has_trust_badges: root.querySelector("[data-grant-trust]") !== null,
    has_budget_bar: root.querySelector("[data-grant-budget]") !== null,
    has_progress: root.querySelector("[data-demo-progress]") !== null,
    viewport_w: window.innerWidth,
    viewport_h: window.innerHeight,
  };
}
