// Industry-tailored AdaptiveDeck templates.
// Each deck's slide[0] is a dashboard-style "showcase" slide rendered in the
// template card preview. Subsequent slides form a usable presentation flow.

const themes = {
  training: {
    name: "Training Indigo",
    primaryColor: "#6366f1",
    accentColor: "#a78bfa",
    backgroundColor: "#1e1b4b",
    fontFamily: "Segoe UI, sans-serif",
    darkMode: true,
  },
  healthcare: {
    name: "Healthcare Teal",
    primaryColor: "#10b981",
    accentColor: "#5eead4",
    backgroundColor: "#064e3b",
    fontFamily: "Segoe UI, sans-serif",
    darkMode: true,
  },
  financial: {
    name: "Financial Navy",
    primaryColor: "#3b82f6",
    accentColor: "#fbbf24",
    backgroundColor: "#0c1f4d",
    fontFamily: "Segoe UI, sans-serif",
    darkMode: true,
  },
  retail: {
    name: "Retail Coral",
    primaryColor: "#fb7185",
    accentColor: "#fbbf24",
    backgroundColor: "#5c1a3b",
    fontFamily: "Segoe UI, sans-serif",
    darkMode: true,
  },
  manufacturing: {
    name: "Manufacturing Steel",
    primaryColor: "#f97316",
    accentColor: "#facc15",
    backgroundColor: "#1c2128",
    fontFamily: "Segoe UI, sans-serif",
    darkMode: true,
  },
  publicSector: {
    name: "Public Sector Forest",
    primaryColor: "#16a34a",
    accentColor: "#fbbf24",
    backgroundColor: "#14532d",
    fontFamily: "Segoe UI, sans-serif",
    darkMode: true,
  },
  education: {
    name: "Education Purple",
    primaryColor: "#a855f7",
    accentColor: "#fbbf24",
    backgroundColor: "#3b1466",
    fontFamily: "Segoe UI, sans-serif",
    darkMode: true,
  },
  sales: {
    name: "Sales Emerald",
    primaryColor: "#10b981",
    accentColor: "#06b6d4",
    backgroundColor: "#064e3b",
    fontFamily: "Segoe UI, sans-serif",
    darkMode: true,
  },
  support: {
    name: "Support Crimson",
    primaryColor: "#ef4444",
    accentColor: "#fb7185",
    backgroundColor: "#4c0519",
    fontFamily: "Segoe UI, sans-serif",
    darkMode: true,
  },
  generated: {
    name: "Generated Cyan",
    primaryColor: "#06b6d4",
    accentColor: "#a78bfa",
    backgroundColor: "#082f49",
    fontFamily: "Segoe UI, sans-serif",
    darkMode: true,
  },
};

const defaultDeckSettings = {
  layout: "stack",
  transition: "fade",
  padding: "default",
};

function deck({ title, description, tags, slides, theme }) {
  return {
    $schema: "./schemas/deck.schema.json",
    type: "AdaptiveDeck",
    version: "1.0.0",
    metadata: {
      title,
      description,
      author: "Adaptive Slide Templates",
      tags,
      language: "en-US",
    },
    theme,
    defaults: defaultDeckSettings,
    slides,
  };
}

function gradientBackground(theme, angle = 135) {
  return {
    gradient: {
      type: "linear",
      colors: [theme.backgroundColor, theme.primaryColor],
      angle,
    },
  };
}

// KPI/stat tile: large value over small label.
// The renderer detects this shape (Container with two Text items where the
// first has style "heading" and the second "caption") and renders as a stat block.
function statTile({ value, label, style = "accent", gridPosition }) {
  return {
    type: "Tile.Container",
    style,
    gridPosition,
    items: [
      {
        type: "Tile.Text",
        text: value,
        style: "heading",
        size: "extraLarge",
        weight: "bolder",
        color: "light",
        horizontalAlignment: "center",
      },
      {
        type: "Tile.Text",
        text: label,
        style: "caption",
        color: "light",
        horizontalAlignment: "center",
      },
    ],
  };
}

// Status tile: small subheading title + body status text + optional caption.
function statusTile({ label, status, detail, style = "emphasis", gridPosition }) {
  const items = [
    {
      type: "Tile.Text",
      text: label,
      style: "subheading",
      weight: "bolder",
      color: "accent",
    },
    {
      type: "Tile.Text",
      text: status,
      style: "body",
      color: "light",
    },
  ];
  if (detail) {
    items.push({
      type: "Tile.Text",
      text: detail,
      style: "caption",
      color: "light",
    });
  }
  return { type: "Tile.Container", style, gridPosition, items };
}

// List tile: subheading title + bullet list body.
function listTile({ title, items, style = "default", gridPosition }) {
  return {
    type: "Tile.Container",
    style,
    gridPosition,
    items: [
      {
        type: "Tile.Text",
        text: title,
        style: "subheading",
        weight: "bolder",
        color: "accent",
      },
      {
        type: "Tile.Text",
        text: items.map((item) => `- ${item}`).join("\n"),
        style: "body",
        color: "light",
      },
    ],
  };
}

function chartTile({ title, chartType = "bar", labels, values, color = "#a78bfa", gridPosition }) {
  return {
    type: "Tile.Chart",
    chartType,
    title,
    gridPosition,
    data: {
      labels,
      datasets: [{ label: title, values, color }],
    },
  };
}

function headerTile({ text, gridPosition }) {
  return {
    type: "Tile.Text",
    text,
    style: "heading",
    size: "large",
    weight: "bolder",
    color: "light",
    gridPosition,
  };
}

function subheaderTile({ text, gridPosition }) {
  return {
    type: "Tile.Text",
    text,
    style: "subheading",
    color: "accent",
    gridPosition,
  };
}

// Dashboard slide with grid layout.
// Title row, optional subtitle row, then composed body of stat/chart/list tiles.
function dashboardSlide({ id, title, subtitle, columns = 4, body, theme }) {
  return {
    type: "AdaptiveSlide",
    id,
    title,
    background: gradientBackground(theme),
    layout: { mode: "grid", columns, gap: "small" },
    body: [
      headerTile({ text: title, gridPosition: { column: 1, row: 1, columnSpan: columns } }),
      ...(subtitle
        ? [subheaderTile({ text: subtitle, gridPosition: { column: 1, row: 2, columnSpan: columns } })]
        : []),
      ...body,
    ],
  };
}

function titleSlide(id, title, subtitle, theme) {
  return {
    type: "AdaptiveSlide",
    id,
    title,
    background: gradientBackground(theme),
    body: [
      {
        type: "Tile.Text",
        text: title,
        style: "heading",
        size: "extraLarge",
        weight: "bolder",
        color: "light",
        horizontalAlignment: "center",
      },
      {
        type: "Tile.Text",
        text: subtitle,
        style: "subheading",
        color: "light",
        horizontalAlignment: "center",
      },
    ],
  };
}

function agendaSlide(id, title, items) {
  return {
    type: "AdaptiveSlide",
    id,
    title,
    layout: { mode: "grid", columns: 2, gap: "default" },
    body: [
      {
        type: "Tile.Text",
        text: title,
        style: "heading",
        size: "large",
        gridPosition: { column: 1, row: 1, columnSpan: 2 },
      },
      ...items.map((item, index) => ({
        type: "Tile.Container",
        style: index % 2 === 0 ? "accent" : "emphasis",
        gridPosition: { column: (index % 2) + 1, row: Math.floor(index / 2) + 2 },
        items: [
          {
            type: "Tile.Text",
            text: item.label,
            style: "subheading",
            weight: "bolder",
            color: "accent",
          },
          { type: "Tile.Text", text: item.detail, style: "body" },
        ],
      })),
    ],
  };
}

function checklistSlide(id, title, items) {
  return {
    type: "AdaptiveSlide",
    id,
    title,
    body: [
      { type: "Tile.Text", text: title, style: "heading", size: "large" },
      {
        type: "Tile.Text",
        text: items.map((item) => `- ${item}`).join("\n"),
        style: "body",
      },
    ],
  };
}

function closeSlide(id, title, subtitle, theme) {
  return {
    type: "AdaptiveSlide",
    id,
    title,
    background: { color: theme.primaryColor },
    body: [
      {
        type: "Tile.Text",
        text: title,
        style: "heading",
        size: "extraLarge",
        weight: "bolder",
        color: "light",
        horizontalAlignment: "center",
      },
      {
        type: "Tile.Text",
        text: subtitle,
        style: "body",
        color: "light",
        horizontalAlignment: "center",
      },
    ],
  };
}

export function createPromptDeck(prompt) {
  const normalizedPrompt = prompt.trim() || "Custom adaptive card training deck";
  const title =
    normalizedPrompt.split(/\s+/).slice(0, 8).join(" ").replace(/[^\w\s-]/g, "").trim() ||
    "Generated Adaptive Slide Deck";

  return deck({
    title,
    description: `Starter deck generated from prompt: ${normalizedPrompt}`,
    tags: ["generated", "starter", "adaptive-slide"],
    theme: themes.generated,
    slides: [
      dashboardSlide({
        id: "generated-dashboard",
        title,
        subtitle: "Generated starter — replace placeholder content with your own.",
        theme: themes.generated,
        columns: 4,
        body: [
          statTile({ value: "4", label: "Slides", style: "accent", gridPosition: { column: 1, row: 3 } }),
          statTile({ value: "5", label: "Tile types", style: "emphasis", gridPosition: { column: 2, row: 3 } }),
          statTile({ value: "JSON", label: "Schema", style: "good", gridPosition: { column: 3, row: 3 } }),
          statTile({ value: "MCP", label: "Renderable", style: "accent", gridPosition: { column: 4, row: 3 } }),
          listTile({
            title: "Build flow",
            items: [
              "Refine prompt and regenerate",
              "Edit JSON in your tool of choice",
              "Validate against the schema",
              "Render in MCP host or web",
            ],
            gridPosition: { column: 1, row: 4, columnSpan: 4 },
          }),
        ],
      }),
      titleSlide("generated-title", title, "Adaptive Slide starter from natural language", themes.generated),
      agendaSlide("generated-plan", "Suggested slide plan", [
        { label: "Audience", detail: "Who the deck is for and the decision they need to make." },
        { label: "Outcome", detail: "Behavior, knowledge, or action the deck should drive." },
        { label: "Content", detail: "Convert ideas into text, chart, code, image, and container tiles." },
        { label: "Validation", detail: "Run the deck through the schema validator before publishing." },
      ]),
      closeSlide(
        "generated-close",
        "Ready to customize",
        "Download the JSON, edit it, and render with Adaptive Slide.",
        themes.generated,
      ),
    ],
  });
}

// =============================================================================
// Industry-tailored templates
// =============================================================================

export const templateDecks = [
  // ---- Training -----------------------------------------------------------
  {
    id: "training-onboarding",
    title: "New Hire Onboarding Readiness",
    category: "Training",
    useCase: "Cohort onboarding and product enablement",
    audience: "Talent enablement, managers, learning leaders",
    summary:
      "Cohort-level readiness dashboard with module completion, knowledge scores, at-risk learners, and weekly trend.",
    tags: ["training", "onboarding", "enablement"],
    deck: deck({
      title: "New Hire Onboarding — Cohort 2025-Q3",
      description: "Cohort-level training readiness dashboard and program flow.",
      tags: ["training", "onboarding", "enablement"],
      theme: themes.training,
      slides: [
        dashboardSlide({
          id: "training-dashboard",
          title: "Onboarding Readiness — Week 4",
          subtitle: "Cohort 2025-Q3 · 47 learners · 12-week program",
          theme: themes.training,
          columns: 4,
          body: [
            statTile({ value: "8/12", label: "Modules complete", style: "accent", gridPosition: { column: 1, row: 3 } }),
            statTile({ value: "92%", label: "Average score", style: "good", gridPosition: { column: 2, row: 3 } }),
            statTile({ value: "47", label: "Active learners", style: "emphasis", gridPosition: { column: 3, row: 3 } }),
            statTile({ value: "3", label: "At risk", style: "attention", gridPosition: { column: 4, row: 3 } }),
            chartTile({
              title: "Module completion %",
              labels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4"],
              values: [98, 95, 88, 82],
              color: "#a78bfa",
              gridPosition: { column: 1, row: 4, columnSpan: 2, rowSpan: 2 },
            }),
            listTile({
              title: "This week",
              items: [
                "Live demo: product tour (Mon 1p)",
                "Office hours: Wed 10a",
                "Cohort retro: Fri 3p",
              ],
              style: "default",
              gridPosition: { column: 3, row: 4, columnSpan: 2, rowSpan: 2 },
            }),
          ],
        }),
        titleSlide(
          "training-title",
          "New Hire Onboarding",
          "Cohort 2025-Q3 — twelve weeks to fully ramped",
          themes.training,
        ),
        agendaSlide("training-objectives", "Program objectives", [
          { label: "Foundation", detail: "Core values, tools, and team orientation in week 1." },
          { label: "Product", detail: "Hands-on product mastery and demo certification by week 4." },
          { label: "Process", detail: "Internal workflows, escalation paths, and tooling by week 8." },
          { label: "Practice", detail: "Real customer scenarios with mentor sign-off by week 12." },
        ]),
        checklistSlide("training-week-checklist", "Manager check-in this week", [
          "Confirm learner has completed Module 8 lab",
          "Schedule 1:1 to review week-4 self-assessment",
          "Pair learner with shadow account for next week",
          "Submit at-risk flag if any module is overdue >5 days",
        ]),
        closeSlide(
          "training-close",
          "Ready to ramp",
          "Track completion weekly and escalate at-risk learners early.",
          themes.training,
        ),
      ],
    }),
  },

  // ---- Healthcare ---------------------------------------------------------
  {
    id: "healthcare-discharge",
    title: "Patient Discharge Summary",
    category: "Healthcare",
    useCase: "Patient discharge and care-team handoff",
    audience: "Care coordinators, hospitalists, patient educators",
    summary:
      "Patient discharge dashboard with vitals, daily medications, follow-up appointment, and warning-sign alerts.",
    tags: ["healthcare", "discharge", "patient-education"],
    deck: deck({
      title: "Discharge Summary Template",
      description: "Patient-friendly discharge education dashboard and care-team handoff.",
      tags: ["healthcare", "discharge", "patient-education"],
      theme: themes.healthcare,
      slides: [
        dashboardSlide({
          id: "healthcare-dashboard",
          title: "Discharge Summary — MRN 7842301",
          subtitle: "Day 4 post-op · Cardiac unit · Ready for home transition",
          theme: themes.healthcare,
          columns: 4,
          body: [
            statTile({ value: "72", label: "Heart rate (bpm)", style: "good", gridPosition: { column: 1, row: 3 } }),
            statTile({ value: "118/76", label: "Blood pressure", style: "good", gridPosition: { column: 2, row: 3 } }),
            statTile({ value: "98.4°", label: "Temp (°F)", style: "accent", gridPosition: { column: 3, row: 3 } }),
            statTile({ value: "98%", label: "O₂ saturation", style: "good", gridPosition: { column: 4, row: 3 } }),
            listTile({
              title: "Daily medication",
              items: [
                "Metoprolol 25 mg — 8a / 8p",
                "Aspirin 81 mg — 9a",
                "Atorvastatin 40 mg — bedtime",
              ],
              gridPosition: { column: 1, row: 4, columnSpan: 2, rowSpan: 2 },
            }),
            statusTile({
              label: "Follow-up",
              status: "Cardiology — Tue Apr 30, 10:30a",
              detail: "Bring meds list. Lab draw 30 min before visit.",
              style: "accent",
              gridPosition: { column: 3, row: 4, columnSpan: 2 },
            }),
            statusTile({
              label: "Call your team if",
              status: "Chest pain · shortness of breath · fever >100.4°",
              style: "attention",
              gridPosition: { column: 3, row: 5, columnSpan: 2 },
            }),
          ],
        }),
        titleSlide(
          "healthcare-title",
          "Discharge Education",
          "Care plan, warning signs, follow-up, and support contacts",
          themes.healthcare,
        ),
        agendaSlide("healthcare-careplan", "Care plan summary", [
          { label: "Medication", detail: "Dose, timing, and missed-dose instructions for each prescription." },
          { label: "Warning signs", detail: "Symptoms that require an urgent call to the care team." },
          { label: "Follow-up", detail: "Appointment date, location, and what to bring." },
          { label: "Support", detail: "After-hours nurse line and patient portal contact options." },
        ]),
        checklistSlide("healthcare-checklist", "Home readiness checklist", [
          "Patient can teach back medication plan",
          "Caregiver knows when to call the care team",
          "Transportation home is confirmed",
          "Follow-up appointment is on the calendar",
        ]),
        closeSlide(
          "healthcare-close",
          "Safe transition home",
          "Document teach-back and share with the receiving care team.",
          themes.healthcare,
        ),
      ],
    }),
  },

  // ---- Financial Services -------------------------------------------------
  {
    id: "financial-fraud",
    title: "Fraud Operations Briefing",
    category: "Financial Services",
    useCase: "Weekly fraud and risk operations review",
    audience: "Risk officers, fraud ops, compliance, executive leadership",
    summary:
      "Fraud operations dashboard with open cases, recovery dollars, channel breakdown, and risk exposure by region.",
    tags: ["financial-services", "fraud", "risk", "ops"],
    deck: deck({
      title: "Fraud Operations Briefing",
      description: "Weekly fraud operations dashboard and response actions.",
      tags: ["financial-services", "fraud", "risk", "ops"],
      theme: themes.financial,
      slides: [
        dashboardSlide({
          id: "financial-dashboard",
          title: "Q3 Fraud Operations — Week 28",
          subtitle: "Cards · ACH · Wire · Digital channels · Region 1–4",
          theme: themes.financial,
          columns: 4,
          body: [
            statTile({ value: "142", label: "Open cases", style: "attention", gridPosition: { column: 1, row: 3 } }),
            statTile({ value: "$1.2M", label: "Recovered YTD", style: "good", gridPosition: { column: 2, row: 3 } }),
            statTile({ value: "4.2d", label: "Mean time to close", style: "accent", gridPosition: { column: 3, row: 3 } }),
            statTile({ value: "$4.8M", label: "Loss prevented", style: "good", gridPosition: { column: 4, row: 3 } }),
            chartTile({
              title: "Cases by channel %",
              labels: ["Cards", "ACH", "Wire", "Digital"],
              values: [31, 18, 9, 42],
              color: "#fbbf24",
              gridPosition: { column: 1, row: 4, columnSpan: 2, rowSpan: 2 },
            }),
            statusTile({
              label: "High exposure",
              status: "Region 4 — synthetic identity ring, 23 accounts flagged",
              detail: "Containment in progress · ETA 24h",
              style: "attention",
              gridPosition: { column: 3, row: 4, columnSpan: 2 },
            }),
            listTile({
              title: "This week's actions",
              items: [
                "Tighten velocity rule on digital channel (R4)",
                "Publish exec summary by Thu EOD",
                "Open SAR review on ring 0427-A",
              ],
              gridPosition: { column: 3, row: 5, columnSpan: 2 },
            }),
          ],
        }),
        titleSlide(
          "financial-title",
          "Fraud Operations Briefing",
          "Trend analysis · control posture · weekly action register",
          themes.financial,
        ),
        agendaSlide("financial-controls", "Control response", [
          { label: "Detect", detail: "Tune anomaly rules, velocity limits, and device intelligence signals." },
          { label: "Triage", detail: "Prioritize high-loss exposure, vulnerable customers, and repeated patterns." },
          { label: "Investigate", detail: "Connect case notes, transaction context, and customer communications." },
          { label: "Report", detail: "Prepare regulatory, leadership, and remediation status updates." },
        ]),
        checklistSlide("financial-actions", "Action register", [
          "Confirm threshold changes with risk owners",
          "Review false positive rate after deployment",
          "Update analyst runbook",
          "Publish weekly executive summary",
        ]),
        closeSlide(
          "financial-close",
          "Risk response aligned",
          "Track owners, due dates, and post-control effectiveness.",
          themes.financial,
        ),
      ],
    }),
  },

  // ---- Retail -------------------------------------------------------------
  {
    id: "retail-seasonal",
    title: "Seasonal Launch Performance",
    category: "Retail",
    useCase: "Store team merchandising and campaign launch",
    audience: "Store leaders, merchandising, marketing, operations",
    summary:
      "Daily launch performance with traffic, conversion, AOV, top SKUs, and store rankings for execution focus.",
    tags: ["retail", "merchandising", "campaign"],
    deck: deck({
      title: "Holiday 2025 Launch — Day 3",
      description: "Daily seasonal launch performance dashboard and execution plan.",
      tags: ["retail", "merchandising", "campaign"],
      theme: themes.retail,
      slides: [
        dashboardSlide({
          id: "retail-dashboard",
          title: "Holiday Launch — Day 3",
          subtitle: "248 stores · Region East / West / Central · vs. plan",
          theme: themes.retail,
          columns: 4,
          body: [
            statTile({ value: "+18%", label: "Traffic vs plan", style: "good", gridPosition: { column: 1, row: 3 } }),
            statTile({ value: "4.2%", label: "Conversion", style: "accent", gridPosition: { column: 2, row: 3 } }),
            statTile({ value: "$87", label: "AOV", style: "emphasis", gridPosition: { column: 3, row: 3 } }),
            statTile({ value: "12", label: "Top stores", style: "good", gridPosition: { column: 4, row: 3 } }),
            chartTile({
              title: "Top 4 SKUs (units)",
              labels: ["Hero A", "Hero B", "Add-on C", "Gift D"],
              values: [842, 615, 503, 391],
              color: "#fbbf24",
              gridPosition: { column: 1, row: 4, columnSpan: 2, rowSpan: 2 },
            }),
            statusTile({
              label: "Store of the day",
              status: "#0142 Northgate — 142% to plan",
              detail: "Standout: hero display + barista promo",
              style: "good",
              gridPosition: { column: 3, row: 4, columnSpan: 2 },
            }),
            listTile({
              title: "Tonight's action",
              items: [
                "Replenish Hero A — 6pm cutoff",
                "Reset front table to gift moment",
                "Confirm Wed staffing for peak",
              ],
              gridPosition: { column: 3, row: 5, columnSpan: 2 },
            }),
          ],
        }),
        titleSlide(
          "retail-title",
          "Seasonal Launch Playbook",
          "Campaign story, store execution, and daily operating rhythm",
          themes.retail,
        ),
        agendaSlide("retail-plan", "Launch plan", [
          { label: "Story", detail: "Seasonal message, hero assortment, and customer promise." },
          { label: "Floor set", detail: "Display placement, signage, replenishment, visual standards." },
          { label: "Staffing", detail: "Coverage to expected traffic, peak windows, and service moments." },
          { label: "Metrics", detail: "Conversion, basket size, attachment rate, and inventory health." },
        ]),
        checklistSlide("retail-readiness", "Store readiness checklist", [
          "Visual standards confirmed and photographed",
          "Inventory exceptions escalated by 9a",
          "Daily huddle script shared with leads",
          "Customer objections captured and routed",
        ]),
        closeSlide(
          "retail-close",
          "Launch ready",
          "Run the floor walk, publish final deck, and monitor daily signals.",
          themes.retail,
        ),
      ],
    }),
  },

  // ---- Manufacturing ------------------------------------------------------
  {
    id: "manufacturing-safety",
    title: "Plant Shift Safety Standup",
    category: "Manufacturing",
    useCase: "Daily plant safety + quality standup",
    audience: "Plant managers, line leads, quality, safety teams",
    summary:
      "Plant safety dashboard with incident streak, OEE, first-pass yield, line status, and today's safety focus.",
    tags: ["manufacturing", "safety", "quality", "ops"],
    deck: deck({
      title: "Plant 2 — Shift Safety Standup",
      description: "Daily manufacturing safety and quality standup dashboard.",
      tags: ["manufacturing", "safety", "quality", "ops"],
      theme: themes.manufacturing,
      slides: [
        dashboardSlide({
          id: "manufacturing-dashboard",
          title: "Plant 2 — Shift Briefing",
          subtitle: "Day shift · 06:00 handoff · Lines A · B · C",
          theme: themes.manufacturing,
          columns: 4,
          body: [
            statTile({ value: "47", label: "Days w/o incident", style: "good", gridPosition: { column: 1, row: 3 } }),
            statTile({ value: "84%", label: "OEE rolling 7d", style: "accent", gridPosition: { column: 2, row: 3 } }),
            statTile({ value: "96%", label: "First-pass yield", style: "good", gridPosition: { column: 3, row: 3 } }),
            statTile({ value: "3", label: "Open NCRs", style: "warning", gridPosition: { column: 4, row: 3 } }),
            statusTile({
              label: "Line A — Assembly",
              status: "Running · OEE 88% · 0 stops",
              style: "good",
              gridPosition: { column: 1, row: 4 },
            }),
            statusTile({
              label: "Line B — Coating",
              status: "Hold · cure-zone calibration",
              detail: "Maint ETA 07:30",
              style: "warning",
              gridPosition: { column: 2, row: 4 },
            }),
            statusTile({
              label: "Line C — Pack",
              status: "Running · OEE 81%",
              detail: "Watch: label feed jam history",
              style: "accent",
              gridPosition: { column: 3, row: 4 },
            }),
            statusTile({
              label: "Hot zone",
              status: "Bay 4 forklift route",
              detail: "Spotter required this shift",
              style: "attention",
              gridPosition: { column: 4, row: 4 },
            }),
            listTile({
              title: "Today's safety focus",
              items: [
                "LOTO refresher at 10:00",
                "Confirm bay-4 spotter coverage",
                "Close near-miss NM-0426 by EOD",
              ],
              gridPosition: { column: 1, row: 5, columnSpan: 4 },
            }),
          ],
        }),
        titleSlide(
          "manufacturing-title",
          "Plant 2 — Shift Standup",
          "Hazards · quality · handoff · escalation discipline",
          themes.manufacturing,
        ),
        agendaSlide("manufacturing-handoff", "Shift handoff", [
          { label: "People", detail: "Staffing, training restrictions, support assignments." },
          { label: "Process", detail: "Standard work changes and active containment actions." },
          { label: "Equipment", detail: "Downtime risk, maintenance windows, and blocked assets." },
          { label: "Escalation", detail: "When to stop the line and who owns each escalation path." },
        ]),
        checklistSlide("manufacturing-quality", "Quality watch", [
          "Confirm first-piece sign-off on each line",
          "Review NCR aging — escalate >48h",
          "Trend scrap by line for end-of-shift report",
          "Note any audit-relevant deviations",
        ]),
        closeSlide(
          "manufacturing-close",
          "Safe shift start",
          "Document decisions and carry open risks into the next handoff.",
          themes.manufacturing,
        ),
      ],
    }),
  },

  // ---- Public Sector ------------------------------------------------------
  {
    id: "public-sector-emergency",
    title: "Emergency Response Briefing",
    category: "Public Sector",
    useCase: "Multi-agency incident coordination",
    audience: "Agency leadership, EOC commanders, communications",
    summary:
      "Incident response dashboard with affected population, deployed crews, shelter capacity, and public-message status.",
    tags: ["public-sector", "emergency", "incident-response"],
    deck: deck({
      title: "Storm Response — Region 4",
      description: "Multi-agency incident coordination dashboard.",
      tags: ["public-sector", "emergency", "incident-response"],
      theme: themes.publicSector,
      slides: [
        dashboardSlide({
          id: "public-dashboard",
          title: "Storm Response — Day 2",
          subtitle: "Region 4 · EOC activated · Multi-agency operation",
          theme: themes.publicSector,
          columns: 4,
          body: [
            statTile({ value: "12,400", label: "Residents affected", style: "warning", gridPosition: { column: 1, row: 3 } }),
            statTile({ value: "8", label: "Shelters open", style: "good", gridPosition: { column: 2, row: 3 } }),
            statTile({ value: "47", label: "Crews deployed", style: "accent", gridPosition: { column: 3, row: 3 } }),
            statTile({ value: "36h", label: "ETR power", style: "warning", gridPosition: { column: 4, row: 3 } }),
            chartTile({
              title: "Shelter capacity %",
              labels: ["North", "East", "South", "West"],
              values: [62, 88, 41, 73],
              color: "#fbbf24",
              gridPosition: { column: 1, row: 4, columnSpan: 2, rowSpan: 2 },
            }),
            statusTile({
              label: "Critical infra",
              status: "Hospital generators operational · Water main intact",
              style: "good",
              gridPosition: { column: 3, row: 4, columnSpan: 2 },
            }),
            statusTile({
              label: "Public message",
              status: "10:00 update posted · Next at 14:00",
              detail: "Channels: web, SMS, radio, social",
              style: "accent",
              gridPosition: { column: 3, row: 5, columnSpan: 2 },
            }),
          ],
        }),
        titleSlide(
          "public-title",
          "Emergency Response Briefing",
          "Situation · priorities · resources · public updates",
          themes.publicSector,
        ),
        agendaSlide("public-priorities", "Operational priorities", [
          { label: "Life safety", detail: "Protect impacted residents, responders, and vulnerable populations." },
          { label: "Stabilization", detail: "Coordinate resources, logistics, and agency responsibilities." },
          { label: "Information", detail: "Share confirmed updates and suppress unverified claims." },
          { label: "Recovery", detail: "Plan transition from immediate response to sustained support." },
        ]),
        checklistSlide("public-comms", "Public message checklist", [
          "Plain language; reading-level checked",
          "Verified sources cited inline",
          "Includes next update time and contact",
          "Accessible: alt text, captions, translations",
        ]),
        closeSlide(
          "public-close",
          "Response aligned",
          "Publish update and capture unresolved dependencies for next shift.",
          themes.publicSector,
        ),
      ],
    }),
  },

  // ---- Education ----------------------------------------------------------
  {
    id: "education-module",
    title: "Course Module Progress",
    category: "Education",
    useCase: "Mid-cycle classroom or course module review",
    audience: "Teachers, instructional designers, learning leaders",
    summary:
      "Student progress dashboard with mastery %, at-risk count, average score, engagement, and topic-mastery chart.",
    tags: ["education", "course", "workshop"],
    deck: deck({
      title: "Algebra II — Module 4 Mid-Cycle",
      description: "Mid-cycle student progress dashboard for a course module.",
      tags: ["education", "course", "workshop"],
      theme: themes.education,
      slides: [
        dashboardSlide({
          id: "education-dashboard",
          title: "Algebra II · Module 4 — Mid-cycle",
          subtitle: "Period 3 · 28 students · Day 6 of 12",
          theme: themes.education,
          columns: 4,
          body: [
            statTile({ value: "78%", label: "Class mastery", style: "accent", gridPosition: { column: 1, row: 3 } }),
            statTile({ value: "84%", label: "Avg score", style: "good", gridPosition: { column: 2, row: 3 } }),
            statTile({ value: "92%", label: "Engagement", style: "good", gridPosition: { column: 3, row: 3 } }),
            statTile({ value: "4", label: "At risk", style: "warning", gridPosition: { column: 4, row: 3 } }),
            chartTile({
              title: "Topic mastery %",
              labels: ["Linear", "Quadratic", "Systems", "Functions"],
              values: [88, 72, 65, 81],
              color: "#fbbf24",
              gridPosition: { column: 1, row: 4, columnSpan: 2, rowSpan: 2 },
            }),
            listTile({
              title: "Reteach focus",
              items: [
                "Quadratic word problems (small group)",
                "Systems via substitution (warm-up)",
                "Office hours: Thu lunch",
              ],
              gridPosition: { column: 3, row: 4, columnSpan: 2 },
            }),
            statusTile({
              label: "Next assessment",
              status: "Quiz 4B — Friday",
              detail: "Covers systems and functions",
              style: "accent",
              gridPosition: { column: 3, row: 5, columnSpan: 2 },
            }),
          ],
        }),
        titleSlide(
          "education-title",
          "Course Module — Algebra II",
          "Outcomes · activities · assessment · reflection",
          themes.education,
        ),
        agendaSlide("education-outcomes", "Learning outcomes", [
          { label: "Recall", detail: "Define key vocabulary and concepts." },
          { label: "Practice", detail: "Apply the concept to a guided scenario." },
          { label: "Assess", detail: "Demonstrate mastery through a short task." },
          { label: "Reflect", detail: "Connect content to a real-world context." },
        ]),
        checklistSlide("education-activities", "Module activities", [
          "Warm-up question",
          "Concept mini-lesson",
          "Guided practice",
          "Independent task",
          "Exit ticket",
        ]),
        closeSlide(
          "education-close",
          "Module complete",
          "Collect artifacts, review misconceptions, and assign extension work.",
          themes.education,
        ),
      ],
    }),
  },

  // ---- Sales --------------------------------------------------------------
  {
    id: "sales-enablement",
    title: "Quarterly Pipeline Review",
    category: "Sales",
    useCase: "Pipeline review and account team enablement",
    audience: "Sales leaders, account teams, solutions, ops",
    summary:
      "Pipeline coverage dashboard with quarter pipeline, win rate, stage distribution, and deals-at-risk callout.",
    tags: ["sales", "pipeline", "enablement"],
    deck: deck({
      title: "Q3 Pipeline Snapshot",
      description: "Quarterly pipeline review dashboard and enablement playbook.",
      tags: ["sales", "pipeline", "enablement"],
      theme: themes.sales,
      slides: [
        dashboardSlide({
          id: "sales-dashboard",
          title: "Q3 Pipeline Snapshot — Week 8",
          subtitle: "Enterprise West · 14 reps · target $4.2M",
          theme: themes.sales,
          columns: 4,
          body: [
            statTile({ value: "$12.4M", label: "Pipeline", style: "good", gridPosition: { column: 1, row: 3 } }),
            statTile({ value: "3.2x", label: "Coverage ratio", style: "accent", gridPosition: { column: 2, row: 3 } }),
            statTile({ value: "28%", label: "Win rate", style: "good", gridPosition: { column: 3, row: 3 } }),
            statTile({ value: "7", label: "Stalled deals", style: "warning", gridPosition: { column: 4, row: 3 } }),
            chartTile({
              title: "Stage distribution ($M)",
              labels: ["Discover", "Qualify", "Propose", "Close"],
              values: [3.8, 4.1, 2.9, 1.6],
              color: "#06b6d4",
              gridPosition: { column: 1, row: 4, columnSpan: 2, rowSpan: 2 },
            }),
            statusTile({
              label: "Top deal",
              status: "Acme Co · $620K · Propose · close Aug 22",
              detail: "Risk: budget timing — exec sponsor confirmed",
              style: "good",
              gridPosition: { column: 3, row: 4, columnSpan: 2 },
            }),
            listTile({
              title: "Deals at risk",
              items: [
                "Globex — security review stalled (14d)",
                "Initech — competing eval starts Mon",
                "Acme W — sponsor moved teams",
              ],
              style: "warning",
              gridPosition: { column: 3, row: 5, columnSpan: 2 },
            }),
          ],
        }),
        titleSlide(
          "sales-title",
          "Pipeline Review",
          "Coverage · stage health · enablement plays",
          themes.sales,
        ),
        agendaSlide("sales-message", "Buyer conversation framework", [
          { label: "Pain", detail: "Connect the offering to urgent business pressure and measurable impact." },
          { label: "Value", detail: "State differentiated outcomes in the customer's operating language." },
          { label: "Proof", detail: "Use evidence, customer examples, and implementation milestones." },
          { label: "Close", detail: "Decision criteria, next meeting, owner, and mutual action plan." },
        ]),
        checklistSlide("sales-objections", "Common objections", [
          "Budget timing — phase of contract",
          "Security review — pre-stage docs",
          "Change management — exec sponsor + adoption plan",
          "Competitive comparison — proof points + references",
        ]),
        closeSlide(
          "sales-close",
          "Field ready",
          "Share the playbook, capture feedback, and update win stories.",
          themes.sales,
        ),
      ],
    }),
  },

  // ---- Customer Support ---------------------------------------------------
  {
    id: "support-escalation",
    title: "Sev 2 Incident Tracker",
    category: "Customer Support",
    useCase: "Active incident response and customer recovery",
    audience: "Support managers, incident leads, engineering, comms",
    summary:
      "Active incident dashboard with customers impacted, MTTR clock, workstream status, and customer comms timeline.",
    tags: ["support", "escalation", "incident"],
    deck: deck({
      title: "INC-4821 — Authentication Degradation",
      description: "Active customer-impact incident dashboard and recovery plan.",
      tags: ["support", "escalation", "incident"],
      theme: themes.support,
      slides: [
        dashboardSlide({
          id: "support-dashboard",
          title: "INC-4821 — Auth Degradation",
          subtitle: "Sev 2 · Started 09:42 UTC · Mitigating",
          theme: themes.support,
          columns: 4,
          body: [
            statTile({ value: "1,247", label: "Customers impacted", style: "attention", gridPosition: { column: 1, row: 3 } }),
            statTile({ value: "4m", label: "Time to ack", style: "good", gridPosition: { column: 2, row: 3 } }),
            statTile({ value: "1h", label: "MTTR target", style: "accent", gridPosition: { column: 3, row: 3 } }),
            statTile({ value: "32m", label: "Elapsed", style: "warning", gridPosition: { column: 4, row: 3 } }),
            statusTile({
              label: "Engineering",
              status: "Rolling back auth-svc to v4.2.1",
              detail: "Owner: @evelyn · ETA 15m",
              style: "accent",
              gridPosition: { column: 1, row: 4, columnSpan: 2 },
            }),
            statusTile({
              label: "Support",
              status: "Workaround posted · 187 cases routed",
              detail: "Owner: @marcus",
              style: "good",
              gridPosition: { column: 3, row: 4, columnSpan: 2 },
            }),
            listTile({
              title: "Customer comms timeline",
              items: [
                "09:46 — Status page updated to Investigating",
                "09:58 — Workaround posted",
                "10:04 — Personalized email to top accounts",
                "Next: 10:30 status update + RCA placeholder",
              ],
              gridPosition: { column: 1, row: 5, columnSpan: 4 },
            }),
          ],
        }),
        titleSlide(
          "support-title",
          "Incident Escalation Review",
          "Impact · timeline · owners · recovery plan",
          themes.support,
        ),
        agendaSlide("support-summary", "Escalation summary", [
          { label: "Impact", detail: "Affected users, business process, severity, and start time." },
          { label: "Timeline", detail: "Detection, triage, mitigation, and customer updates." },
          { label: "Owners", detail: "Accountable support, engineering, customer success, comms." },
          { label: "Recovery", detail: "Fix plan, validation criteria, follow-up commitments." },
        ]),
        checklistSlide("support-next", "Customer update checklist", [
          "Plain-language summary at the top",
          "Current status and any workaround",
          "Next update time committed",
          "Named owner and escalation path",
        ]),
        closeSlide(
          "support-close",
          "Recovery in motion",
          "Track commitments and convert learnings into a reusable support article.",
          themes.support,
        ),
      ],
    }),
  },
];

export function findTemplateDeck(id) {
  return templateDecks.find((template) => template.id === id) ?? templateDecks[0];
}
