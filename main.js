/* ─────────────────────────────────────────────────────────────────────────
   MOCK DATA

   Root (Height) fields:
     height, size, votes, tkt, rev, age
   rows[] — two entries per block, type "VAR" and "SKA":
     type  : "VAR" | "SKA"
     txn   : transaction count
     amt   : total coin amount (string)
     size  : total size of this group (string)
     subs  : [] for VAR; [{coin, txn, amt, size}, …] for SKA coin-type breakdown
───────────────────────────────────────────────────────────────────────── */
const blocks = [
  {
    height: 891042,
    size: "14.2 kB",
    votes: 5,
    tkt: 3,
    rev: 1,
    age: "2m 14s",
    rows: [
      { type: "VAR", txn: 4, amt: "6.2501", size: "1.1 kB", subs: [] },
      {
        type: "SKA",
        txn: 3,
        amt: "6.6343",
        size: "3.8 kB",
        subs: [
          { coin: "SKA-1", txn: 1, amt: "1.0000", size: "312 B" },
          { coin: "SKA-2", txn: 1, amt: "2.3120", size: "298 B" },
          { coin: "SKA-3", txn: 1, amt: "3.3223", size: "315 B" },
        ],
      },
    ],
  },
  {
    height: 891041,
    size: "9.6 kB",
    votes: 5,
    tkt: 1,
    rev: 0,
    age: "4m 07s",
    rows: [
      { type: "VAR", txn: 2, amt: "4.0000", size: "890 B", subs: [] },
      {
        type: "SKA",
        txn: 2,
        amt: "6.5021",
        size: "2.1 kB",
        subs: [
          { coin: "SKA-1", txn: 1, amt: "3.2500", size: "320 B" },
          { coin: "SKA-7", txn: 1, amt: "3.2521", size: "301 B" },
        ],
      },
    ],
  },
  {
    height: 891040,
    size: "6.3 kB",
    votes: 4,
    tkt: 2,
    rev: 2,
    age: "6m 51s",
    rows: [
      { type: "VAR", txn: 3, amt: "3.9100", size: "750 B", subs: [] },
      {
        type: "SKA",
        txn: 7,
        amt: "4.2400",
        size: "1.7 kB",
        subs: [
          { coin: "SKA-1", txn: 2, amt: "1.1200", size: "290 B" },
          { coin: "SKA-4", txn: 1, amt: "1.5600", size: "278 B" },
          { coin: "SKA-12", txn: 3, amt: "0.8800", size: "260 B" },
          { coin: "SKA-19", txn: 1, amt: "0.6800", size: "255 B" },
        ],
      },
    ],
  },
  {
    height: 891039,
    size: "18.1 kB",
    votes: 5,
    tkt: 4,
    rev: 0,
    age: "9m 33s",
    rows: [
      { type: "VAR", txn: 6, amt: "10.3100", size: "3.3 kB", subs: [] },
      {
        type: "SKA",
        txn: 9,
        amt: "5.0110",
        size: "4.2 kB",
        subs: [
          { coin: "SKA-2", txn: 2, amt: "0.9500", size: "310 B" },
          { coin: "SKA-5", txn: 1, amt: "1.2300", size: "295 B" },
          { coin: "SKA-11", txn: 3, amt: "1.4100", size: "308 B" },
          { coin: "SKA-23", txn: 2, amt: "0.7200", size: "280 B" },
          { coin: "SKA-47", txn: 1, amt: "0.7010", size: "272 B" },
        ],
      },
    ],
  },
  {
    height: 891038,
    size: "11.4 kB",
    votes: 3,
    tkt: 2,
    rev: 1,
    age: "12m 05s",
    rows: [
      { type: "VAR", txn: 5, amt: "7.6600", size: "2.0 kB", subs: [] },
      {
        type: "SKA",
        txn: 4,
        amt: "3.7800",
        size: "2.5 kB",
        subs: [
          { coin: "SKA-3", txn: 2, amt: "1.5000", size: "330 B" },
          { coin: "SKA-8", txn: 2, amt: "2.2800", size: "310 B" },
        ],
      },
    ],
  },
];

/* ─────────────────────────────────────────────────────────────────────────
   STATE
   "b{i}"     → block i expanded (L1 → L2)
   "b{i}r{j}" → block i, row j (SKA) expanded (L2 → L3)
───────────────────────────────────────────────────────────────────────── */
const state = {
  openRow: null,
};

/* ── Shared dash cell ──────────────────────────────────────────────────── */
const DASH = `<td class="r"><div class="dash">—</div></td>`;

/* ─────────────────────────────────────────────────────────────────────────
   RENDER
───────────────────────────────────────────────────────────────────────── */
function render() {
  const tbody = document.getElementById("tbody");
  let html = "";

  blocks.forEach((block, bi) => {
    const key = "b" + bi;
    const open = state.openRow === key;

    const vr = block.rows.find((r) => r.type === "VAR");
    const sr = block.rows.find((r) => r.type === "SKA");

    /* ── Main row (Level 1) ───────────────────────── */
    html += `
      <tr class="row-root">
        <td class="l">
          <div class="cell">
            <span class="caret ${open ? "open" : ""}" data-key="${key}">&#9658;</span>
            <a href="#" class="link" style="font-weight:700">#${block.height.toLocaleString()}</a>
          </div>
        </td>

        <td class="r"><div class="cell num">${block.votes}</div></td>
        <td class="r"><div class="cell num">${block.tkt}</div></td>
        <td class="r"><div class="cell num">${block.rev}</div></td>

        <td class="r">
          <div class="cell num">
            ${vr ? `${vr.txn} tx / ${vr.amt}` : "—"}
          </div>
        </td>

        <td class="r">
          <div class="cell num">
            ${sr ? `${sr.txn} tx / ${sr.amt}` : "—"}
          </div>
        </td>

        <td class="r"><div class="cell num">${block.size}</div></td>
        <td class="r"><div class="cell num" style="color:var(--text-secondary)">${block.age}</div></td>
      </tr>
    `;

    /* ── Expanded panel (Level 2) ─────────────────── */
    if (open) {
      html += `
        <tr class="row-detail">
          <td colspan="8">
            <div class="detail-panel">

              <div class="detail-section">
                <div class="detail-title">VAR</div>
                <div class="detail-grid">
                  <div>Txn</div><div>${vr?.txn ?? "—"}</div>
                  <div>Amount</div><div>${vr?.amt ?? "—"}</div>
                  <div>Size</div><div>${vr?.size ?? "—"}</div>
                </div>
              </div>

              <div class="detail-section">
                <div class="detail-title">SKA</div>
                <div class="detail-grid">
                  <div>Txn</div><div>${sr?.txn ?? "—"}</div>
                  <div>Amount</div><div>${sr?.amt ?? "—"}</div>
                  <div>Size</div><div>${sr?.size ?? "—"}</div>
                </div>
              </div>

              ${
                sr?.subs?.length
                  ? `
                <div class="detail-section">
                  <div class="detail-title">SKA Breakdown</div>
                  <div class="detail-list">
                    ${sr.subs
                      .map(
                        (sub) => `
                      <div class="detail-row">
                        <span>${sub.coin}</span>
                        <span>${sub.txn} txn</span>
                        <span>${sub.amt}</span>
                        <span>${sub.size}</span>
                      </div>
                    `,
                      )
                      .join("")}
                  </div>
                </div>
              `
                  : ""
              }

            </div>
          </td>
        </tr>
      `;
    }

    html += `<tr class="row-sep"><td colspan="8"></td></tr>`;
  });

  tbody.innerHTML = html;
  updateCount();
  attachCarets();
}

/* ── Caret listeners ────────────────────────────────────────────────────── */
function attachCarets() {
  document.querySelectorAll(".caret[data-key]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();

      const key = el.dataset.key;

      state.openRow = state.openRow === key ? null : key;

      render();
    });
  });
}
/* ── Row counter ────────────────────────────────────────────────────────── */
function updateCount() {
  const n = document.querySelectorAll(
    "tr.row-root, tr.row-txn, tr.row-sub",
  ).length;
  document.getElementById("row-count").textContent = n + " rows visible";
}

/* ── Toolbar ────────────────────────────────────────────────────────────── */
document.getElementById("btn-expand").addEventListener("click", () => {
  blocks.forEach((block, bi) => {
    state["b" + bi] = true;
    block.rows.forEach((row, ri) => {
      if (row.type === "SKA" && row.subs.length)
        state["b" + bi + "r" + ri] = true;
    });
  });
  render();
});

document.getElementById("btn-collapse").addEventListener("click", () => {
  Object.keys(state).forEach((k) => delete state[k]);
  render();
});

/* ── Boot ───────────────────────────────────────────────────────────────── */
render();
