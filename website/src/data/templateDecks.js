const defaultTheme = {
  name: "Adaptive Dark",
  primaryColor: "#0f6cbd",
  accentColor: "#50e6ff",
  backgroundColor: "#071a2f",
  fontFamily: "Segoe UI, sans-serif",
  darkMode: true,
};

const defaultDeckSettings = {
  layout: "stack",
  transition: "fade",
  padding: "default",
};

function deck({ title, description, tags, slides, theme = defaultTheme }) {
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

function titleSlide(id, title, subtitle) {
  return {
    type: "AdaptiveSlide",
    id,
    title,
    background: {
      gradient: {
        type: "linear",
        colors: ["#071a2f", "#0f6cbd"],
        angle: 135,
      },
    },
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
    layout: {
      mode: "grid",
      columns: 2,
      gap: "default",
    },
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
        gridPosition: {
          column: (index % 2) + 1,
          row: Math.floor(index / 2) + 2,
        },
        items: [
          {
            type: "Tile.Text",
            text: item.label,
            style: "subheading",
            weight: "bolder",
            color: "accent",
          },
          {
            type: "Tile.Text",
            text: item.detail,
            style: "body",
          },
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
      {
        type: "Tile.Text",
        text: title,
        style: "heading",
        size: "large",
      },
      {
        type: "Tile.Text",
        text: items.map((item) => `- ${item}`).join("\n"),
        style: "body",
      },
    ],
  };
}

function metricSlide(id, title, labels, values, label) {
  return {
    type: "AdaptiveSlide",
    id,
    title,
    body: [
      {
        type: "Tile.Text",
        text: title,
        style: "heading",
        size: "large",
      },
      {
        type: "Tile.Chart",
        chartType: "bar",
        title,
        data: {
          labels,
          datasets: [
            {
              label,
              values,
              color: "#50e6ff",
            },
          ],
        },
      },
    ],
  };
}

function closeSlide(id, title, actions) {
  return {
    type: "AdaptiveSlide",
    id,
    title,
    background: {
      color: "#0f6cbd",
    },
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
        text: actions,
        style: "body",
        color: "light",
        horizontalAlignment: "center",
      },
    ],
  };
}

export function createPromptDeck(prompt) {
  const normalizedPrompt = prompt.trim() || "Custom adaptive card training deck";
  const title = normalizedPrompt
    .split(/\s+/)
    .slice(0, 8)
    .join(" ")
    .replace(/[^\w\s-]/g, "")
    .trim() || "Generated Adaptive Slide Deck";

  return deck({
    title,
    description: `Starter deck generated from prompt: ${normalizedPrompt}`,
    tags: ["generated", "starter", "adaptive-slide"],
    slides: [
      titleSlide("generated-title", title, "Adaptive Slide starter deck from natural language"),
      agendaSlide("generated-plan", "Suggested slide plan", [
        {
          label: "Audience",
          detail: "Define who the deck is for and the decision they need to make.",
        },
        {
          label: "Outcome",
          detail: "State the behavior, knowledge, or action the deck should drive.",
        },
        {
          label: "Content",
          detail: "Convert core ideas into text, chart, code, image, or container tiles.",
        },
        {
          label: "Validation",
          detail: "Run the deck through the schema validator before publishing.",
        },
      ]),
      checklistSlide("generated-next-steps", "Next steps", [
        "Replace placeholder language with domain-specific content.",
        "Add charts, media, and speaker notes where the audience needs evidence.",
        "Validate the deck JSON with npm run validate or an equivalent schema check.",
      ]),
      closeSlide("generated-close", "Ready to customize", "Download this starter deck, edit the JSON, and render it with Adaptive Slide."),
    ],
  });
}

export const templateDecks = [
  {
    id: "training-onboarding",
    title: "Typical Training Deck",
    category: "Training",
    useCase: "New hire or product enablement",
    audience: "Facilitators, managers, enablement teams",
    summary: "A reusable training structure with objectives, agenda, knowledge checks, and follow-up actions.",
    tags: ["training", "onboarding", "enablement"],
    deck: deck({
      title: "Adaptive Slide Training Template",
      description: "A typical training deck for onboarding, product education, or recurring enablement.",
      tags: ["training", "onboarding", "enablement"],
      slides: [
        titleSlide("training-title", "Adaptive Slide Training", "Objectives, agenda, exercises, and measurable outcomes"),
        agendaSlide("training-objectives", "Learning objectives", [
          {
            label: "Understand",
            detail: "Explain the concept, audience, and business reason for the training.",
          },
          {
            label: "Apply",
            detail: "Practice the process through a realistic scenario or guided exercise.",
          },
          {
            label: "Measure",
            detail: "Confirm comprehension with a short knowledge check and success metric.",
          },
          {
            label: "Reinforce",
            detail: "Assign follow-up actions, job aids, and office-hour support.",
          },
        ]),
        checklistSlide("training-agenda", "Facilitator agenda", [
          "Welcome and context",
          "Concept walkthrough",
          "Hands-on exercise",
          "Knowledge check",
          "Commitments and follow-up",
        ]),
        metricSlide("training-readiness", "Readiness pulse", ["Baseline", "Practice", "Assessment", "Follow-up"], [45, 70, 85, 92], "Confidence"),
        closeSlide("training-close", "Training complete", "Capture feedback, publish the deck JSON, and schedule reinforcement."),
      ],
    }),
  },
  {
    id: "healthcare-discharge",
    title: "Healthcare Discharge Education",
    category: "Healthcare",
    useCase: "Patient education and care-team handoff",
    audience: "Care coordinators, nurses, patient educators",
    summary: "A patient-friendly deck for discharge instructions, warning signs, medication reminders, and follow-up care.",
    tags: ["healthcare", "patient-education", "handoff"],
    deck: deck({
      title: "Discharge Education Template",
      description: "Adaptive tile slide deck for patient discharge education and care-team handoff.",
      tags: ["healthcare", "patient-education", "handoff"],
      slides: [
        titleSlide("healthcare-title", "Discharge Education", "Clear care instructions for patients and caregivers"),
        agendaSlide("healthcare-care-plan", "Care plan summary", [
          {
            label: "Medication",
            detail: "List dose, timing, route, and what to do if a dose is missed.",
          },
          {
            label: "Warning signs",
            detail: "Highlight symptoms that require immediate care-team contact.",
          },
          {
            label: "Follow-up",
            detail: "Show appointment date, provider, location, and preparation needs.",
          },
          {
            label: "Support",
            detail: "Provide contact paths for urgent, non-urgent, and after-hours questions.",
          },
        ]),
        checklistSlide("healthcare-home-checklist", "Home readiness checklist", [
          "Patient can explain the medication plan",
          "Caregiver knows warning signs",
          "Transportation is confirmed",
          "Follow-up appointment is scheduled",
        ]),
        closeSlide("healthcare-close", "Safe transition home", "Review teach-back notes and share the final deck with the care team."),
      ],
    }),
  },
  {
    id: "financial-fraud",
    title: "Financial Services Fraud Response",
    category: "Financial Services",
    useCase: "Fraud operations briefing",
    audience: "Risk, fraud, compliance, and operations teams",
    summary: "A response playbook deck for fraud trends, investigation workflow, controls, and executive action items.",
    tags: ["financial-services", "fraud", "risk"],
    deck: deck({
      title: "Fraud Response Briefing",
      description: "Adaptive tile slide deck for fraud operations and risk response updates.",
      tags: ["financial-services", "fraud", "risk"],
      slides: [
        titleSlide("financial-title", "Fraud Response Briefing", "Trend summary, control posture, and response actions"),
        metricSlide("financial-trends", "Case volume by channel", ["Cards", "ACH", "Wire", "Digital"], [31, 18, 9, 42], "Case share"),
        agendaSlide("financial-controls", "Control response", [
          {
            label: "Detect",
            detail: "Tune anomaly rules, velocity limits, and device intelligence signals.",
          },
          {
            label: "Triage",
            detail: "Prioritize high-loss exposure, vulnerable customers, and repeated patterns.",
          },
          {
            label: "Investigate",
            detail: "Connect case notes, transaction context, and customer communications.",
          },
          {
            label: "Report",
            detail: "Prepare regulatory, leadership, and remediation status updates.",
          },
        ]),
        checklistSlide("financial-actions", "Action register", [
          "Confirm threshold changes with risk owners",
          "Review false positive rate after deployment",
          "Update analyst runbook",
          "Publish weekly executive summary",
        ]),
        closeSlide("financial-close", "Risk response aligned", "Track owners, due dates, and post-control effectiveness."),
      ],
    }),
  },
  {
    id: "retail-seasonal",
    title: "Retail Seasonal Launch",
    category: "Retail",
    useCase: "Store team merchandising and campaign launch",
    audience: "Store leaders, merchandising, marketing, and operations",
    summary: "A launch deck for seasonal campaigns, merchandising tasks, staffing, and performance goals.",
    tags: ["retail", "merchandising", "campaign"],
    deck: deck({
      title: "Seasonal Retail Launch",
      description: "Adaptive tile slide deck for a retail campaign launch and store execution plan.",
      tags: ["retail", "merchandising", "campaign"],
      slides: [
        titleSlide("retail-title", "Seasonal Retail Launch", "Campaign story, store execution, and daily operating rhythm"),
        agendaSlide("retail-plan", "Launch plan", [
          {
            label: "Story",
            detail: "Clarify the seasonal message, hero assortment, and customer promise.",
          },
          {
            label: "Floor set",
            detail: "Confirm display placement, signage, replenishment, and visual standards.",
          },
          {
            label: "Staffing",
            detail: "Align coverage to expected traffic, peak windows, and service moments.",
          },
          {
            label: "Metrics",
            detail: "Track conversion, basket size, attachment rate, and inventory health.",
          },
        ]),
        metricSlide("retail-goals", "Launch goals", ["Traffic", "Conversion", "Basket", "Attachment"], [12, 8, 15, 18], "Lift percent"),
        checklistSlide("retail-readiness", "Store readiness checklist", [
          "Visual standards confirmed",
          "Inventory exceptions escalated",
          "Daily huddle script shared",
          "Customer objections captured",
        ]),
        closeSlide("retail-close", "Launch ready", "Run the floor walk, publish final deck, and monitor daily signals."),
      ],
    }),
  },
  {
    id: "manufacturing-safety",
    title: "Manufacturing Safety Standup",
    category: "Manufacturing",
    useCase: "Shift safety and quality standup",
    audience: "Plant managers, line leads, quality, and safety teams",
    summary: "A concise deck for shift handoff, hazard review, quality focus, and escalation rules.",
    tags: ["manufacturing", "safety", "quality"],
    deck: deck({
      title: "Safety Standup Template",
      description: "Adaptive tile slide deck for manufacturing shift safety and quality standups.",
      tags: ["manufacturing", "safety", "quality"],
      slides: [
        titleSlide("manufacturing-title", "Shift Safety Standup", "Hazards, quality focus, and escalation discipline"),
        checklistSlide("manufacturing-safety", "Safety focus", [
          "Review yesterday's near misses",
          "Confirm lockout and tagout reminders",
          "Call out hot zones and material movement",
          "Assign owner for each open hazard",
        ]),
        metricSlide("manufacturing-quality", "Quality signals", ["Scrap", "Rework", "Downtime", "First pass"], [8, 11, 14, 92], "Current value"),
        agendaSlide("manufacturing-handoff", "Shift handoff", [
          {
            label: "People",
            detail: "Confirm staffing, training restrictions, and support assignments.",
          },
          {
            label: "Process",
            detail: "Review standard work changes and active containment actions.",
          },
          {
            label: "Equipment",
            detail: "Identify downtime risk, maintenance windows, and blocked assets.",
          },
          {
            label: "Escalation",
            detail: "State when to stop the line and who owns each escalation path.",
          },
        ]),
        closeSlide("manufacturing-close", "Safe shift start", "Document decisions and carry open risks into the next handoff."),
      ],
    }),
  },
  {
    id: "public-sector-emergency",
    title: "Public Sector Emergency Briefing",
    category: "Public Sector",
    useCase: "Incident update and response coordination",
    audience: "Agency leadership, emergency response, and communications teams",
    summary: "A response coordination deck for situational status, priorities, resources, and public messaging.",
    tags: ["public-sector", "emergency", "incident-response"],
    deck: deck({
      title: "Emergency Response Briefing",
      description: "Adaptive tile slide deck for public-sector incident coordination.",
      tags: ["public-sector", "emergency", "incident-response"],
      slides: [
        titleSlide("public-title", "Emergency Response Briefing", "Situation, priorities, resources, and public updates"),
        agendaSlide("public-priorities", "Operational priorities", [
          {
            label: "Life safety",
            detail: "Protect impacted residents, responders, and vulnerable populations.",
          },
          {
            label: "Stabilization",
            detail: "Coordinate resources, logistics, and agency responsibilities.",
          },
          {
            label: "Information",
            detail: "Share confirmed updates and suppress unverified claims.",
          },
          {
            label: "Recovery",
            detail: "Plan transition from immediate response to sustained support.",
          },
        ]),
        metricSlide("public-resources", "Resource status", ["Shelter", "Medical", "Transport", "Comms"], [78, 62, 55, 88], "Readiness"),
        checklistSlide("public-comms", "Public message checklist", [
          "Use plain language",
          "Cite verified sources",
          "Include next update time",
          "Provide accessible contact options",
        ]),
        closeSlide("public-close", "Response aligned", "Publish the update deck and capture unresolved dependencies."),
      ],
    }),
  },
  {
    id: "education-module",
    title: "Education Course Module",
    category: "Education",
    useCase: "Lesson module or workshop",
    audience: "Teachers, instructional designers, and trainers",
    summary: "A course module deck with learning outcomes, guided practice, assessment, and reflection.",
    tags: ["education", "course", "workshop"],
    deck: deck({
      title: "Course Module Template",
      description: "Adaptive tile slide deck for a lesson, course module, or workshop.",
      tags: ["education", "course", "workshop"],
      slides: [
        titleSlide("education-title", "Course Module", "Learning outcomes, practice, assessment, and reflection"),
        agendaSlide("education-outcomes", "Learning outcomes", [
          {
            label: "Recall",
            detail: "Students can define the key vocabulary and concepts.",
          },
          {
            label: "Practice",
            detail: "Students can apply the concept to a guided scenario.",
          },
          {
            label: "Assess",
            detail: "Students can demonstrate mastery through a short task.",
          },
          {
            label: "Reflect",
            detail: "Students can connect the content to a real-world context.",
          },
        ]),
        checklistSlide("education-activities", "Module activities", [
          "Warm-up question",
          "Concept mini-lesson",
          "Guided practice",
          "Independent task",
          "Exit ticket",
        ]),
        closeSlide("education-close", "Module complete", "Collect artifacts, review misconceptions, and assign extension work."),
      ],
    }),
  },
  {
    id: "sales-enablement",
    title: "Sales Enablement Playbook",
    category: "Sales",
    useCase: "Product launch or account team enablement",
    audience: "Account teams, solution specialists, and partner sellers",
    summary: "A field-ready playbook for buyer pain, qualification, demo flow, objections, and next steps.",
    tags: ["sales", "enablement", "playbook"],
    deck: deck({
      title: "Sales Enablement Playbook",
      description: "Adaptive tile slide deck for launch readiness and account-team enablement.",
      tags: ["sales", "enablement", "playbook"],
      slides: [
        titleSlide("sales-title", "Sales Enablement Playbook", "Positioning, qualification, demo flow, and close plan"),
        agendaSlide("sales-message", "Buyer conversation", [
          {
            label: "Pain",
            detail: "Connect the offering to urgent business pressure and measurable impact.",
          },
          {
            label: "Value",
            detail: "State differentiated outcomes in the customer's operating language.",
          },
          {
            label: "Proof",
            detail: "Use evidence, customer examples, and implementation milestones.",
          },
          {
            label: "Close",
            detail: "Define decision criteria, next meeting, owner, and mutual action plan.",
          },
        ]),
        checklistSlide("sales-objections", "Objection handling", [
          "Budget timing",
          "Security review",
          "Change management",
          "Competitive comparison",
        ]),
        metricSlide("sales-pipeline", "Pipeline focus", ["Discover", "Qualify", "Propose", "Close"], [24, 18, 11, 7], "Accounts"),
        closeSlide("sales-close", "Field ready", "Share the playbook, capture feedback, and update win stories."),
      ],
    }),
  },
  {
    id: "support-escalation",
    title: "Customer Support Escalation",
    category: "Customer Support",
    useCase: "Escalation review and service recovery",
    audience: "Support managers, incident leads, customer success, and engineering",
    summary: "A support deck for issue summary, timeline, customer impact, owner map, and recovery plan.",
    tags: ["support", "escalation", "service-recovery"],
    deck: deck({
      title: "Support Escalation Review",
      description: "Adaptive tile slide deck for customer escalation and service recovery.",
      tags: ["support", "escalation", "service-recovery"],
      slides: [
        titleSlide("support-title", "Support Escalation Review", "Issue summary, impact, owner map, and recovery plan"),
        agendaSlide("support-summary", "Escalation summary", [
          {
            label: "Impact",
            detail: "State affected users, business process, severity, and start time.",
          },
          {
            label: "Timeline",
            detail: "Summarize detection, triage, mitigation, and customer updates.",
          },
          {
            label: "Owners",
            detail: "List accountable support, engineering, customer success, and comms owners.",
          },
          {
            label: "Recovery",
            detail: "Define fix plan, validation criteria, and follow-up commitments.",
          },
        ]),
        checklistSlide("support-next", "Customer update checklist", [
          "Plain-language summary",
          "Current status and workaround",
          "Next update time",
          "Named owner and escalation path",
        ]),
        closeSlide("support-close", "Recovery in motion", "Track commitments and convert learnings into a reusable support article."),
      ],
    }),
  },
];

export function findTemplateDeck(id) {
  return templateDecks.find((template) => template.id === id) ?? templateDecks[0];
}
