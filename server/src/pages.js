function esc(value) {
  return String(value || '').replace(/[&<>"]/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
  }[char]));
}

function style() {
  return `
:root{color-scheme:light;--bg:#f7fbff;--panel:#fff;--ink:#10243e;--text:#263f59;--muted:#617489;--blue:#2563eb;--blue2:#0b63ce;--cyan:#1bb7d8;--green:#12b886;--softgreen:#e9fbf4;--line:#dbeaf4;--line2:#cce1ef;--shadow:0 22px 70px rgba(16,36,62,.11)}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;overflow-x:hidden;background:radial-gradient(circle at 20% 0%,rgba(37,99,235,.12),transparent 30%),linear-gradient(180deg,#fafdff,#eef8fc 55%,#f6fffb);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}a{color:inherit}.nav{position:sticky;top:0;z-index:10;display:flex;justify-content:space-between;align-items:center;gap:24px;padding:18px 32px;background:rgba(247,251,255,.86);backdrop-filter:blur(18px);border-bottom:1px solid var(--line)}.brand{font-weight:950;letter-spacing:-.04em;color:var(--ink);font-size:24px}.nav nav{display:flex;align-items:center;gap:20px;flex-wrap:wrap;font-weight:800}.nav a{text-decoration:none;color:#456176}main{width:100%;max-width:1220px;margin:0 auto;padding:0 22px}.hero{padding:56px 0}.heroGrid{display:grid;grid-template-columns:minmax(0,.95fr) minmax(360px,1fr);gap:40px;align-items:center;min-height:auto}.heroGrid>*,.grid>*,.split>*,.panelGrid>*{min-width:0}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:18px}.card{min-width:0;background:rgba(255,255,255,.86);border:1px solid var(--line);border-radius:8px;padding:26px;box-shadow:var(--shadow)}.btn,button{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:linear-gradient(135deg,var(--blue),var(--cyan));color:#fff;border:0;border-radius:999px;padding:12px 18px;font-weight:950;text-decoration:none;cursor:pointer;box-shadow:0 14px 32px rgba(37,99,235,.18)}.hero .btn{margin:0 6px 10px 0}.btn.alt{background:#fff;color:var(--blue2);border:1px solid var(--line2);box-shadow:0 10px 24px rgba(16,36,62,.08)}.btn.ghost{background:var(--softgreen);color:#087f68;border:1px solid rgba(18,184,134,.24);box-shadow:none}h1{max-width:780px;color:var(--ink);font-size:clamp(34px,4vw,52px);line-height:1.1;margin:0 0 22px;letter-spacing:0;text-wrap:balance;overflow-wrap:anywhere}h2{color:var(--ink);font-size:clamp(24px,2.6vw,36px);line-height:1.12;margin:0 0 14px;letter-spacing:0;text-wrap:balance;overflow-wrap:anywhere}h3{color:var(--ink);margin:0 0 8px}.lead{font-size:clamp(16px,1.25vw,20px);line-height:1.55;color:#4b6178;max-width:720px}.muted{color:var(--muted)}.pill{display:inline-flex;gap:9px;align-items:center;border:1px solid rgba(18,184,134,.34);background:linear-gradient(90deg,rgba(18,184,134,.12),rgba(37,99,235,.08));border-radius:999px;padding:7px 14px;color:#087f68;font-weight:900;letter-spacing:.01em;margin-bottom:22px}.pill:before{content:"";width:7px;height:7px;border-radius:50%;background:var(--green)}.kicker{color:#087f68;font-weight:950;text-transform:uppercase;font-size:12px;letter-spacing:.18em}.graph{height:420px;border-radius:8px;background:radial-gradient(circle at 50% 44%,rgba(27,183,216,.18),transparent 36%),linear-gradient(180deg,#ffffff,#eef7fc);border:1px solid var(--line);position:relative;overflow:hidden;box-shadow:var(--shadow)}.heroGraphic{display:block;width:100%;height:auto;padding:6px;border:1px solid rgba(190,214,226,.9);border-radius:8px;box-shadow:var(--shadow);background:rgba(255,255,255,.76)}.graph:before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(37,99,235,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(18,184,134,.045) 1px,transparent 1px);background-size:38px 38px}.node{position:absolute;width:14px;height:14px;border-radius:50%;background:var(--blue);box-shadow:0 0 0 7px rgba(37,99,235,.10),0 0 20px rgba(37,99,235,.34);animation:pulse 2.8s ease-in-out infinite}.node.big{width:24px;height:24px;background:var(--green);box-shadow:0 0 0 9px rgba(18,184,134,.12),0 0 28px rgba(18,184,134,.32)}.node:after{content:attr(data-label);position:absolute;left:18px;top:-8px;white-space:nowrap;color:var(--ink);font:12px ui-monospace,monospace;background:rgba(255,255,255,.82);border:1px solid var(--line);border-radius:999px;padding:3px 7px}.edge{position:absolute;height:2px;background:linear-gradient(90deg,transparent,rgba(37,99,235,.28),rgba(18,184,134,.42),transparent);transform-origin:left center;animation:flow 3.6s linear infinite}.trail{position:absolute;width:6px;height:6px;border-radius:50%;background:var(--green);box-shadow:0 0 16px rgba(18,184,134,.5);animation:drift 7s linear infinite}@keyframes pulse{50%{transform:scale(1.35)}}@keyframes flow{50%{opacity:.45}}@keyframes drift{0%{transform:translate(20px,430px);opacity:0}10%{opacity:1}55%{transform:translate(340px,180px)}100%{transform:translate(500px,68px);opacity:0}}.memory{display:grid;gap:12px}.memory .rowx{display:grid;grid-template-columns:150px 1fr;gap:12px;align-items:center}.stream{height:10px;border-radius:999px;background:linear-gradient(90deg,var(--blue),var(--green),var(--cyan));background-size:220% 100%;animation:stream 2.4s linear infinite}@keyframes stream{to{background-position:220% 0}}pre{max-width:100%;overflow:auto;background:#f5fbff;border:1px solid var(--line);border-radius:8px;padding:18px;color:#17324d}code,input,textarea,select{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}code{color:#075fb8}input,textarea,select{width:100%;background:#fff;color:var(--text);border:1px solid var(--line2);border-radius:8px;padding:11px}label{display:block;margin:10px 0;font-weight:800;color:var(--ink)}table{width:100%;border-collapse:collapse;display:block;overflow-x:auto}td,th{border-bottom:1px solid var(--line);padding:10px;text-align:left}ul{padding-left:20px}.split{display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start}.quote{font-size:clamp(28px,3.8vw,46px);line-height:1.05;letter-spacing:0;color:var(--ink);overflow-wrap:anywhere}.band{background:linear-gradient(180deg,rgba(234,244,255,.78),rgba(233,251,244,.68));border:1px solid var(--line);border-radius:8px;padding:30px}.stat{font-size:30px;font-weight:950;color:var(--ink);letter-spacing:0}.live{display:inline-flex;align-items:center;gap:8px;color:#087f68;font-weight:900}.live:before{content:"";width:8px;height:8px;border-radius:50%;background:var(--green);box-shadow:0 0 0 6px rgba(18,184,134,.12)}.siteFooter{max-width:1220px;margin:0 auto;padding:28px 22px 38px;color:var(--muted);font-size:14px;text-align:center}.siteFooter a{color:var(--blue2);font-weight:900;text-decoration:none}.siteFooter a:hover{text-decoration:underline}.adminShell{display:grid;grid-template-columns:248px minmax(0,1fr);min-height:100vh;background:#f7fbff}.adminSide{position:sticky;top:0;height:100vh;padding:24px 18px;border-right:1px solid var(--line);background:rgba(255,255,255,.9);backdrop-filter:blur(16px)}.adminSide .brand{display:block;margin:0 0 28px;text-decoration:none}.adminNav{display:grid;gap:6px}.adminNav a{border-radius:8px;color:#405b73;font-weight:900;padding:11px 12px;text-decoration:none}.adminNav a[aria-current="page"],.adminNav a:hover{background:#eaf4ff;color:var(--blue2)}.adminSide form{margin-top:26px}.adminSide button{width:100%;background:#fff;color:var(--muted);border:1px solid var(--line2);box-shadow:none}.adminMain{max-width:none;padding:32px;overflow:hidden}.adminTop{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;margin-bottom:24px}.adminTop h1{font-size:34px;line-height:1.1;margin:0 0 8px}.tenantBadge{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--line2);border-radius:999px;background:#fff;padding:8px 12px;color:#456176;font-weight:900;white-space:nowrap}.metricGrid{display:grid;grid-template-columns:repeat(4,minmax(160px,1fr));gap:14px;margin-bottom:22px}.metric{background:#fff;border:1px solid var(--line);border-radius:8px;padding:18px}.metric strong{display:block;color:var(--ink);font-size:28px;letter-spacing:0}.adminSection{scroll-margin-top:22px;margin-bottom:26px}.adminSection h2{font-size:24px;line-height:1.15}.panelGrid{display:grid;grid-template-columns:1.35fr .8fr;gap:18px}.dataPanel{background:#fff;border:1px solid var(--line);border-radius:8px;padding:20px;box-shadow:0 14px 40px rgba(16,36,62,.07)}.toolbar{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:14px}.tableStatus{display:inline-flex;align-items:center;border-radius:999px;background:var(--softgreen);color:#087f68;font-size:12px;font-weight:950;padding:5px 9px}.smallBtn{padding:9px 12px;font-size:13px;box-shadow:none}.subtleBtn{background:#fff;color:var(--blue2);border:1px solid var(--line2);box-shadow:none}.integrationList{display:grid;gap:12px}.integration{display:flex;align-items:center;justify-content:space-between;gap:12px;border:1px solid var(--line);border-radius:8px;padding:14px;background:#fbfdff}.integration strong{color:var(--ink)}@media(max-width:900px){.heroGrid,.split,.adminShell,.panelGrid{grid-template-columns:1fr}.graph{height:300px}.nav{align-items:flex-start;flex-direction:column;padding:16px 20px}.nav nav{gap:14px;font-size:15px}.hero{padding:36px 0}h1{font-size:clamp(32px,9vw,38px);line-height:1.12}h2{font-size:clamp(25px,8vw,34px);line-height:1.12}.lead{font-size:17px}.memory .rowx{grid-template-columns:1fr}.adminSide{position:relative;height:auto}.adminMain{padding:22px}.adminTop{display:block}.metricGrid{grid-template-columns:1fr 1fr}}`;
}

function cognitionStyle() {
  return `
.cognitionDemo{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(300px,.8fr);gap:22px;align-items:center}
.cognitionImage{display:block;width:100%;height:auto;border:1px solid rgba(190,214,226,.9);border-radius:8px;box-shadow:0 22px 70px rgba(16,36,62,.16);background:#06111f}
.cognitionRules{display:grid;gap:14px}
.ruleCard{background:rgba(255,255,255,.82);border:1px solid var(--line);border-radius:8px;padding:18px}
.ruleCard h3{display:flex;align-items:center;gap:10px;color:var(--blue2);font-size:16px;text-transform:uppercase;letter-spacing:.08em}
.ruleCard h3:before{content:"";width:9px;height:9px;border-radius:50%;background:linear-gradient(135deg,var(--blue),var(--green));box-shadow:0 0 0 6px rgba(37,99,235,.08)}
.ruleCard p{margin:8px 0 0}
.ruleCard code{display:block;margin-top:8px;color:#17324d;white-space:normal;line-height:1.55}
.weight{color:#087f68;font-weight:950}
.queryGrid{display:grid;grid-template-columns:repeat(2,minmax(180px,1fr));gap:12px}
.buttonRow{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:14px 0}
.resultPre{min-height:360px;max-height:620px}
.hintList{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:12px 0}
.hintChip{border:1px solid var(--line);border-radius:8px;background:#fbfdff;padding:10px}
.hintChip strong{display:block;color:var(--ink);font-size:13px}
.hintChip span{display:block;color:var(--muted);font-size:12px;margin-top:3px}
.inlineStatus{min-height:22px}
.monoTiny{font-size:12px;line-height:1.5}
@media(max-width:900px){.cognitionDemo{grid-template-columns:1fr}}
@media(max-width:900px){.queryGrid,.hintList{grid-template-columns:1fr}}
`;
}

function page(body, title = '1db.io') {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${esc(title)}</title>
  <style>${style()}${cognitionStyle()}</style>
</head>
<body>${body}<footer class="siteFooter">&copy; 2026 <a href="https://noderunner.llc">NodeRunner, LLC</a></footer></body>
</html>`;
}

function nav(active = '') {
  const link = (href, text) => `<a href="${href}"${active === text ? ' aria-current="page"' : ''}>${text}</a>`;
  return `<header class="nav"><a class="brand" href="/">1db.io</a><nav>${link('/#continuity', 'Continuity')}${link('/#project-cognition', 'Project Cognition')}${link('/#memory', 'Memory')}${link('/#compare', 'Compare')}${link('/docs', 'Docs')}${link('/waitlist', 'Waitlist')}<a class="btn alt" href="/signin">Sign in</a></nav></header>`;
}

function graphVisual() {
  return `<img class="heroGraphic" src="/assets/learns.png" width="1494" height="1052" alt="1db persistent intelligence surrounded by identity, knowledge, memory, relationships, projects, goals, and events.">`;
}

export function homePage() {
  const caps = [
    'Semantic memory stores meaning, identity, context, causality, embeddings, references, and conversation history.',
    'Distributed intelligence keeps knowledge near agents, users, compute, and edge systems while synchronizing globally.',
    'Realtime knowledge streams make agents aware of new facts, relationships, and events as they happen.',
    'AI-native querying combines graph traversal, vector search, live subscriptions, and programmable schemas.'
  ];
  const primitives = [
    ['Memory', 'Durable facts, preferences, decisions, constraints, tasks, and experience fragments.'],
    ['Identity', 'Stable profiles for agents, people, organizations, devices, services, and applications.'],
    ['Relationships', 'Weighted contextual connections between people, agents, systems, organizations, facts, and events.'],
    ['Context', 'Environmental semantic awareness around the current task, actor, goal, project, and history.'],
    ['Intent', 'Goals and directional cognition that help systems understand what action is trying to become.'],
    ['Observation', 'Captured events, state changes, signals, and sensory input from distributed systems.'],
    ['Simulation', 'Projected futures, hypothetical branches, modeled outcomes, and retained reasoning paths.'],
    ['Trust', 'Confidence, reinforcement, contradiction resolution, importance weighting, and semantic strength.'],
    ['Temporal State', 'Chronological understanding of what happened, why it mattered, and how meaning evolved.']
  ];
  const layers = ['Working Memory', 'Episodic Memory', 'Semantic Memory', 'Relationship Memory', 'Identity Memory', 'Temporal Memory', 'Predictive / Simulation Memory'];
  const cognitionLayers = [
    ['Personal Cognition', 'What an AI knows about an individual.'],
    ['Team Cognition', 'What an AI knows about a group or organization.'],
    ['Project Cognition', 'How an AI should operate within a specific project or workspace.'],
    ['Persona Cognition', 'What makes a particular AI persona unique.'],
    ['Organizational Cognition', 'Policies, standards, governance, and institutional knowledge.']
  ];
  return page(`${nav()}<main>
<section class="hero heroGrid"><div><p class="pill">Cognitive infrastructure</p><h1>AI + Memory = Persona</h1><p class="lead">Give AI a memory, identity, and continuity. Build assistants that learn, remember, and evolve.</p><p class="muted">1DB provides persistent cognition, relationships, temporal awareness, and persona continuity for the next generation of AI systems.</p><p><a class="btn" href="/openapi.json">Explore API</a> <a class="btn ghost" href="#architecture">Read Architecture</a> <a class="btn alt" href="/waitlist">Join Waitlist</a></p><p class="live">Live private preview</p></div>${graphVisual()}</section>
<section id="continuity" class="hero band"><p class="kicker">Core narrative</p><h2>Intelligence without continuity is not intelligence.</h2><p class="lead">Large language models generate responses. But without continuity they forget, reset, lose identity, lose relationships, cannot evolve, cannot maintain goals, and cannot preserve behavioral patterns.</p><div class="grid"><article class="card"><h3>Not chat history</h3><p>1db is not a transcript archive or session store. It is a continuously evolving intelligence graph.</p></article><article class="card"><h3>Not simple retrieval</h3><p>Retrieval finds similar content. Continuity preserves identity, causality, significance, and change over time.</p></article><article class="card"><h3>Persistent cognition</h3><p>Memory becomes a living substrate that can strengthen, decay, merge, contradict, and evolve.</p></article></div></section>
<section id="session-amnesia" class="hero"><p class="kicker">Eliminate session amnesia</p><h2>Stop re-training your agents every session.</h2><p class="lead">AI systems often begin each new conversation with incomplete operational context. Users repeat how a project is structured, which tools are required, what actions are prohibited, how deployments work, and which team conventions matter.</p><div class="grid"><article class="card"><h3>Friction</h3><p>Repeated setup slows every new session and wastes expert attention.</p></article><article class="card"><h3>Inconsistency</h3><p>Critical standards and preferences drift when context is reconstructed by memory or copied from old prompts.</p></article><article class="card"><h3>Operational risk</h3><p>As projects grow, forgotten deployment, security, and workflow constraints become execution hazards.</p></article></div></section>
<section id="project-cognition" class="hero split"><div><p class="kicker">Project Cognition</p><h2>Agent + Project Memory = Reliable Execution</h2><p class="lead">Project Cognition is persistent, versioned execution memory for how an AI should operate within a project, team, workspace, tenant, repository, environment, or domain.</p><p class="muted">Architecture, workflows, constraints, standards, preferences, security requirements, and operating procedures become durable context instead of repeated instructions.</p></div><div class="card"><h3>Before 1db</h3><ul><li>Use this repository.</li><li>Follow these deployment procedures.</li><li>Use these tools.</li><li>Avoid these actions.</li><li>Respect these organizational requirements.</li></ul><h3>After 1db</h3><pre><code>const cognition =
  await cognition.loadProject("project-alpha");</code></pre><p class="muted">The AI starts with the correct project-aware intelligence.</p></div></section>
<section class="hero band"><p class="kicker">Cognitive layers</p><h2>Durable cognition for AI systems.</h2><p class="lead">1db stores memory at the layers where intelligent systems actually operate: people, teams, projects, personas, and organizations.</p><div class="grid">${cognitionLayers.map(([title, detail]) => `<article class="card"><h3>${title}</h3><p>${detail}</p></article>`).join('')}</div></section>
<section id="what" class="hero"><p class="kicker">What is 1db?</p><h2>Infrastructure for Persistent Intelligence.</h2><p class="lead">1db is cognitive infrastructure: a living graph of facts, memories, embeddings, events, identity, temporal state, simulations, and relationships. It is the continuity layer required before advanced machine cognition can become dependable.</p><div class="grid">${caps.map(c => `<article class="card"><p>${c}</p></article>`).join('')}</div></section>
<section class="hero band"><p class="kicker">Cognition graph</p><h2>Concepts become explainable associations.</h2><p class="lead">A cognition graph begins with facts, then connects them through relationships whose strength changes the result. The same inputs can produce different outcomes when the association weight shifts.</p><div class="cognitionDemo"><img class="cognitionImage" src="/assets/cognition-graph.png" width="1536" height="1024" alt="Cognition graph network showing water, cold, ice, oil, heat, and black ice with weighted associations and example inference results."><div class="cognitionRules"><article class="ruleCard"><h3>Fact</h3><p>Water exists.</p></article><article class="ruleCard"><h3>Association</h3><code>water + cold -> ice</code></article><article class="ruleCard"><h3>Weighted association</h3><code>water <span class="weight">1.0</span> + cold <span class="weight">0.25</span> -> cool water</code><code>water <span class="weight">1.0</span> + cold <span class="weight">0.90</span> -> ice</code><code>ice + oil + road -> black ice</code></article></div></div></section>
<section id="memory" class="hero split"><div><p class="kicker">Human-like memory model</p><h2>Memory is layered, temporal, and alive.</h2><p class="muted">Human memory is not a flat vector index. 1db models memory as active context, experiences, concepts, relationships, identity, chronology, and projected futures.</p></div><div class="card memory">${layers.map((layer, i) => `<div class="rowx"><strong>${layer}</strong><span class="stream" style="animation-delay:${i * .25}s"></span></div>`).join('')}<pre><code>{ layer: "temporal", entity: "acme", fact: "security review changed priority", caused_by: "new residency requirement", confidence: 0.84 }</code></pre></div></section>
<section id="time" class="hero band"><p class="kicker">Temporal cognition</p><h2>Intelligence exists across time.</h2><p class="lead">1db treats time as a first-class concept: what happened, when it happened, why it mattered, what changed, what it influenced, and how memory evolves.</p><div class="grid"><article><div class="stat">Chronology</div><p class="muted">Events are understood in sequence, not as disconnected records.</p></article><article><div class="stat">Causality</div><p class="muted">Facts can point to causes, effects, contradictions, reinforcements, and downstream consequences.</p></article><article><div class="stat">Relevance</div><p class="muted">Context changes over time through decay curves, reinforcement, importance, and recency.</p></article></div></section>
<section class="hero split"><div><p class="kicker">Evolving significance</p><h2>Intelligence is not static storage.</h2><p class="lead">It is evolving significance.</p><p class="muted">1db introduces memory decay and reinforcement as cognitive infrastructure primitives: confidence scoring, contradiction resolution, semantic strengthening, contextual prioritization, importance weighting, memory merging, and memory aging.</p></div><div class="card"><h3>Memory lifecycle</h3><pre><code>await db.memory.remember(fact)
await db.identity.reinforce(signal)
await db.memory.decay({ curve: "contextual" })
await db.relationship.merge(conflict)
await db.timeline.query({ relevance: "now" })</code></pre></div></section>
<section class="hero"><p class="kicker">Persona continuity primitive</p><h2>Persona Continuity Score</h2><p class="lead">Measure how consistently an intelligent system preserves tone, memory, identity, goals, relationships, preferences, and behavioral traits across sessions, devices, channels, and years.</p><div class="grid"><article class="card"><h3>Identity stability</h3><p>Continuity is tracked as infrastructure, not as a branded personal assistant experience.</p></article><article class="card"><h3>Behavioral drift</h3><p>Systems can observe where tone, preferences, goals, or memory diverge from prior state.</p></article><article class="card"><h3>Cross-channel coherence</h3><p>Agents can remain consistent across APIs, apps, devices, workflows, and organizations.</p></article></div></section>
<section class="hero split"><div><p class="kicker">Simulation and future reasoning</p><h2>Memory is not only about what happened. It is also about what could happen.</h2><p class="muted">1db stores hypothetical branches, projected outcomes, future-state reasoning, comparative simulations, retained reasoning paths, and temporal scenario analysis.</p></div><div class="card"><pre><code>await db.simulation.project({
  entity: "supply-chain",
  horizon: "90d",
  branches: ["delay", "price shock", "new supplier"],
  retain_reasoning: true
})</code></pre></div></section>
<section class="hero band"><p class="kicker">Enterprise cognition</p><h2>Companies forget too.</h2><p class="lead">Institutional memory disappears through turnover, disconnected systems, siloed applications, and fragmented AI tooling. 1db creates shared organizational cognition across humans, agents, applications, infrastructure, workflows, and distributed systems.</p><div class="grid"><article><div class="stat">Collective memory</div><p class="muted">Teams and agents share durable context instead of re-learning the same facts.</p></article><article><div class="stat">Semantic propagation</div><p class="muted">New knowledge updates the graph and becomes available to authorized systems in realtime.</p></article><article><div class="stat">Distributed reasoning</div><p class="muted">Multiple agents coordinate around shared facts, goals, context, and temporal state.</p></article></div></section>
<section id="architecture" class="hero"><p class="kicker">Architecture</p><h2>Node Vertex moves information. 1db understands it.</h2><div class="grid"><article class="card"><h3>Node Vertex</h3><p class="muted">Distributed communication fabric: streams, vertices, transport, routing, and live coordination.</p></article><article class="card"><h3>1db</h3><p class="muted">Cognitive persistence layer: memory, identity, temporal state, simulations, semantic relationships, and machine continuity.</p></article><article class="card"><h3>Continuity layer</h3><p class="muted">Durable context, recall, relationships, and temporal awareness for intelligent systems.</p></article></div></section>
<section class="hero"><p class="kicker">Cognitive primitives</p><h2>First-class concepts for machine memory.</h2><div class="grid">${primitives.map(([a, b]) => `<article class="card"><h3>${a}</h3><p>${b}</p></article>`).join('')}</div></section>
<section id="compare" class="hero"><p class="kicker">Post-vector database</p><h2>1db is not a vector database with nicer branding.</h2><div class="card"><table><thead><tr><th>Traditional Vector DB</th><th>1db</th></tr></thead><tbody><tr><td>Stores embeddings</td><td>Stores cognition</td></tr><tr><td>Retrieval</td><td>Continuity</td></tr><tr><td>Static vectors</td><td>Evolving memory</td></tr><tr><td>Similarity search</td><td>Identity-aware reasoning</td></tr><tr><td>Session context</td><td>Persistent intelligence</td></tr><tr><td>Chunks</td><td>Semantic entities</td></tr><tr><td>Search infrastructure</td><td>Cognitive infrastructure</td></tr></tbody></table></div></section>
<section class="hero split"><div><p class="quote">Databases were built for applications. 1db is built for cognition.</p></div><div class="card"><p class="kicker">Cognitive API</p><h2>Elegant. Minimal. Inevitable.</h2><pre><code>await db.memory.remember()
await db.identity.reinforce()
await db.relationship.link()
await db.context.observe()
await db.simulation.project()
await db.memory.decay()
await db.timeline.query()
await db.temporal.reconstruct()</code></pre></div></section>
<section class="hero band"><p class="kicker">Private preview</p><h2>Build assistants that remember.</h2><p class="lead">Join the 1db waitlist for early access to persistent cognition, relationships, temporal awareness, and persona continuity.</p><p><a class="btn" href="/waitlist">Join Waitlist</a></p></section>
</main>`, '1db.io - Cognitive Infrastructure for Persistent Intelligence');
}

export function docsPage() {
  return page(`${nav('Docs')}<main>
<section class="hero"><p class="pill">Developer docs</p><h1>Build on cognitive infrastructure.</h1><p class="lead">Use 1db to create persistent memory, semantic relationships, temporal context, and AI-native continuity through a small private-preview API.</p><p><a class="btn" href="/waitlist">Request access</a> <a class="btn alt" href="/openapi.json">OpenAPI JSON</a></p></section>
<section class="hero split"><div><p class="kicker">CLI</p><h2>Install the 1db command line.</h2><p class="muted">The CLI wraps the 1db REST API for creating resources from scripts, terminals, CI, and agent workflows.</p><pre><code>brew tap drlockett/1db
brew install drlockett/1db/1db

export ONE_DB_API_KEY=1db_live_...
1db links create --code demo --url https://example.com
1db links list
1db intakes create --slug waitlist --name Waitlist</code></pre></div><div class="card"><h3>CLI environment</h3><table><tbody><tr><td><code>ONE_DB_API_KEY</code></td><td>Tenant API key used as a Bearer token.</td></tr><tr><td><code>ONE_DB_API_URL</code></td><td>Optional API base URL. Defaults to <code>https://1db.io</code>.</td></tr></tbody></table><h3>Current live cognition routes</h3><ul><li><code>POST /api/v1/cognition/events</code></li><li><code>POST /api/v1/cognition/context/retrieve</code></li><li><code>GET /api/v1/cognition/context/packets/{packetUid}</code></li><li><code>GET /api/v1/cognition/backends</code></li><li><code>GET /api/v1/cognition/backends/plan</code></li></ul></div></section>
<section class="grid"><article class="card"><h3>Cognitive API direction</h3><pre><code>await db.memory.remember()
await db.identity.reinforce()
await db.relationship.link()
await db.context.observe()
await cognition.loadProject("project-alpha")
await db.simulation.project()
await db.temporal.reconstruct()</code></pre></article><article class="card"><h3>Operational cognition API</h3><pre><code>curl -X POST https://1db.io/api/v1/cognition/events \\
 -H "X-NRun-Tenant-Uid: $TENANT_UID" \\
 -H "Content-Type: application/json" \\
 -d '{"type":"conversation.message","payload":{"text":"Remember this."}}'</code></pre></article><article class="card"><h3>Route planner</h3><pre><code>curl https://1db.io/api/v1/cognition/backends/plan?operation=retrieve \\
 -H "X-NRun-Tenant-Uid: $TENANT_UID"</code></pre></article></section>
<section class="hero"><p class="kicker">Project Cognition API</p><h2>Persistent execution memory for projects.</h2><p class="lead">Project Cognition stores versioned operating context that agents can retrieve before they begin work in a repository, workspace, tenant, environment, or domain.</p><div class="grid"><article class="card"><h3>Create cognition</h3><pre><code>curl -X POST https://1db.io/api/project-cognition \\
 -H "X-NRun-Tenant-Uid: $TENANT_UID" \\
 -H "Content-Type: application/json" \\
 -d '{"projectKey":"project-alpha","projectName":"Project Alpha","operationalRules":["Preserve unrelated changes"],"deploymentRules":["Use the current platform runtime"],"isActive":true}'</code></pre></article><article class="card"><h3>Load active context</h3><pre><code>curl https://1db.io/api/project-cognition/project-alpha/active \\
 -H "X-NRun-Tenant-Uid: $TENANT_UID"</code></pre></article><article class="card"><h3>Lifecycle</h3><pre><code>GET  /api/project-cognition
GET  /api/project-cognition/{projectKey}
POST /api/project-cognition
PUT  /api/project-cognition/{id}
POST /api/project-cognition/{id}/activate
POST /api/project-cognition/{id}/deactivate
GET  /api/project-cognition/{projectKey}/active</code></pre></article></div></section>
<section class="hero band"><p class="kicker">Contact</p><h2>Want early access or integration help?</h2><p class="lead">Join the waitlist and include what you are building. 1db is being shaped around teams pushing agent memory and distributed cognition forward.</p><p><a class="btn" href="/waitlist">Join the waitlist</a> <a class="btn alt" href="mailto:waitlist@1db.io?subject=1db%20early%20access">Email waitlist@1db.io</a></p></section>
<section class="hero"><h2>Node Vertex and 1db</h2><p class="lead">Node Vertex provides the distributed communication fabric. 1db provides the cognitive persistence layer built on top of it. Node Vertex moves information. 1db understands it.</p></section>
<section class="card"><h2>OpenAPI</h2><p>The machine-readable API specification is available at <a href="/openapi.json">/openapi.json</a>.</p></section>
</main>`, '1db Developer Docs');
}

export function waitlistPage(message = '') {
  return page(`${nav('Waitlist')}<main><section class="hero split"><div><p class="pill">Private preview</p><h1>Join the 1db waitlist.</h1><p class="lead">Get early access to the distributed intelligence database for semantic memory, realtime knowledge, relationships, vectors, and AI-native context.</p><p class="muted">Tell us what you want to build and we will prioritize access for teams pushing agent memory and distributed cognition forward.</p></div><form class="card" method="post" action="/waitlist"><h2>Request access</h2>${message ? `<p class="pill">${esc(message)}</p>` : ''}<label>Email <input name="email" type="email" required placeholder="you@example.com" autocomplete="email"></label><label>What would you like to build? <textarea name="question" rows="5" placeholder="Agents, memory, graph, realtime knowledge, enterprise use case..."></textarea></label><input name="website" tabindex="-1" autocomplete="off" style="position:absolute;left:-10000px" aria-hidden="true"><button type="submit">Join waitlist</button></form></section></main>`, 'Join the 1db waitlist');
}

export function waitlistThanksPage() {
  return page(`${nav('Waitlist')}<main><section class="hero"><div class="card" style="max-width:760px;margin:auto;text-align:center"><p class="pill">Request received</p><h1>You are on the list.</h1><p class="lead" style="margin:auto">Thanks for your interest in 1db. We received your request and will follow up when preview access opens.</p><p><a class="btn" href="/">Back to home</a></p></div></section></main>`, 'You are on the 1db waitlist');
}

export function adminPage(session) {
  const email = session?.email || 'Private preview account';
  const tenantId = session?.tenantId || 'tenant pending';
  const tenantUid = session?.tenantUid || (/^[0-9a-f-]{36}$/i.test(String(tenantId)) ? tenantId : '');
  const users = [
    ['You', email, 'Owner', 'Active'],
    ['Ops lead', 'ops@example.com', 'Admin', 'Invite ready'],
    ['Developer', 'dev@example.com', 'Developer', 'Limited']
  ];
  const integrations = [
    ['Platform API', 'Connected', 'Authenticated access for 1db cognition routes'],
    ['Memory fabric', 'Managed', 'Canonical tenant memory and context persistence'],
    ['Webhooks', 'Ready', 'Outbound events for billing and usage workflows']
  ];
  return page(`<div class="adminShell">
<aside class="adminSide">
  <a class="brand" href="/admin">1db.io</a>
  <nav class="adminNav" aria-label="Tenant admin">
    <a href="#overview" aria-current="page">Overview</a>
    <a href="#cognition-graph">Cognition Graph</a>
    <a href="#project-cognition">Project Cognition</a>
    <a href="#users">Users</a>
    <a href="#billing">Billing</a>
    <a href="#integrations">Integrations</a>
    <a href="/docs">Docs</a>
  </nav>
  <form method="post" action="/signout"><button type="submit">Sign out</button></form>
</aside>
<main class="adminMain">
  <section id="overview" class="adminTop">
    <div>
      <p class="kicker">Tenant admin</p>
      <h1>Admin console</h1>
      <p class="muted">Signed in as ${esc(email)}.</p>
    </div>
    <span class="tenantBadge">${esc(tenantId)}</span>
  </section>
  <section class="metricGrid" aria-label="Tenant health">
    <article class="metric"><span class="muted">Users</span><strong>3</strong><span class="tableStatus">2 active</span></article>
    <article class="metric"><span class="muted">Plan</span><strong>Preview</strong><span class="tableStatus">Private access</span></article>
    <article class="metric"><span class="muted">Cognition</span><strong>Graph</strong><span class="tableStatus">Queryable</span></article>
    <article class="metric"><span class="muted">Tenant state</span><strong>Open</strong><span class="tableStatus">Access gated</span></article>
  </section>
  <section id="cognition-graph" class="adminSection panelGrid">
    <article class="dataPanel">
      <div class="toolbar"><div><p class="kicker">Memory graph</p><h2>Cognition Graph Query</h2></div><button class="smallBtn" type="button" onclick="cgSeed()">Seed graph</button></div>
      <div class="queryGrid">
        <label>Tenant UID <input id="cgTenant" value="${esc(tenantUid)}" placeholder="tenant uid"></label>
        <label>Namespace <input id="cgNamespace" value="1db"></label>
        <label>Concept or label <input id="cgConcept" value="cold" placeholder="cold, water, black ice"></label>
        <label>Association or rule <input id="cgAssociation" value="water-high-cold-produces-ice" placeholder="association slug"></label>
        <label>Session ID <input id="cgSession" placeholder="session id from inference"></label>
        <label>Evidence ID <input id="cgEvidence" placeholder="evidence id"></label>
      </div>
      <label>Inference inputs <textarea id="cgInput" rows="4">water=1.0,cold=0.85</textarea></label>
      <div class="buttonRow">
        <button class="smallBtn subtleBtn" type="button" onclick="cgGraph()">Load graph</button>
        <button class="smallBtn subtleBtn" type="button" onclick="cgDecompose()">Decompose</button>
        <button class="smallBtn subtleBtn" type="button" onclick="cgConceptByLabel()">Find label</button>
        <button class="smallBtn subtleBtn" type="button" onclick="cgConcept()">Read concept</button>
        <button class="smallBtn subtleBtn" type="button" onclick="cgAssociation()">Read association</button>
        <button class="smallBtn subtleBtn" type="button" onclick="cgRule()">Read rule</button>
        <button class="smallBtn subtleBtn" type="button" onclick="cgInfer()">Infer</button>
        <button class="smallBtn subtleBtn" type="button" onclick="cgSessionRead()">Session</button>
        <button class="smallBtn subtleBtn" type="button" onclick="cgExplain()">Explain</button>
        <button class="smallBtn subtleBtn" type="button" onclick="cgEvidenceRead()">Evidence</button>
      </div>
      <p id="cgStatus" class="muted inlineStatus"></p>
    </article>
    <article class="dataPanel">
      <p class="kicker">Query result</p>
      <h2>Graph Response</h2>
      <div class="hintList">
        <div class="hintChip"><strong>Low cold</strong><span class="monoTiny">water=1.0,cold=0.25</span></div>
        <div class="hintChip"><strong>Freeze</strong><span class="monoTiny">water=1.0,cold=0.85</span></div>
        <div class="hintChip"><strong>Road hazard</strong><span class="monoTiny">ice=1.0,oil=0.9,road=1.0</span></div>
        <div class="hintChip"><strong>Steam</strong><span class="monoTiny">water=1.0,heat=0.9</span></div>
      </div>
      <pre class="resultPre"><code id="cgPreview">Choose a graph query.</code></pre>
    </article>
  </section>
  <section id="project-cognition" class="adminSection panelGrid">
    <article class="dataPanel">
      <div class="toolbar"><div><p class="kicker">Execution memory</p><h2>Project Cognition</h2></div><button class="smallBtn" type="button" onclick="saveProjectCognition()">Save version</button></div>
      <div class="grid">
        <label>Tenant UID <input id="pcTenant" value="${esc(tenantUid)}" placeholder="tenant uid"></label>
        <label>Project key <input id="pcKey" value="project-alpha"></label>
        <label>Project name <input id="pcName" value="Project Alpha"></label>
        <label>Change reason <input id="pcReason" value="Initial operating context"></label>
      </div>
      <label>Description <textarea id="pcDescription" rows="3">Persistent operating context for agents working on this project.</textarea></label>
      <label>Architecture notes <textarea id="pcArchitecture" rows="4">Repository locations, service boundaries, runtime ownership, and integration decisions.</textarea></label>
      <label>Operational rules <textarea id="pcOperational" rows="4">Use the established project workflow.
Preserve unrelated user changes.
Verify behavior before reporting completion.</textarea></label>
      <label>Deployment rules <textarea id="pcDeployment" rows="3">Use the current platform deployment path for this application.
Do not deploy historical runtimes unless explicitly requested.</textarea></label>
      <label>Coding standards <textarea id="pcCoding" rows="3">Follow existing code style.
Keep changes scoped.
Prefer platform contracts over app-local persistence.</textarea></label>
      <label>Tool preferences <textarea id="pcTools" rows="3">Use ripgrep for search.
Use existing platform API routes.
Use SQL migrations for durable schema changes.</textarea></label>
      <label>Environment notes <textarea id="pcEnvironment" rows="3">Store environment-specific constraints, repo paths, and runtime notes here.</textarea></label>
      <label>Security requirements <textarea id="pcSecurity" rows="3">Do not hard-code credentials.
Use tenant-scoped access.
Keep internal platform names out of customer-facing copy.</textarea></label>
      <label>Organizational constraints <textarea id="pcOrg" rows="3">Respect team conventions, naming standards, and approval boundaries.</textarea></label>
      <div class="toolbar"><button class="smallBtn subtleBtn" type="button" onclick="loadProjectCognition()">Load versions</button><button class="smallBtn subtleBtn" type="button" onclick="loadActiveProjectCognition()">Preview active</button></div>
      <p id="pcStatus" class="muted"></p>
    </article>
    <article class="dataPanel">
      <p class="kicker">Agent bootstrap</p>
      <h2>Preview Agent Context</h2>
      <pre><code id="pcPreview">No project cognition loaded.</code></pre>
      <div id="pcVersions" class="integrationList"></div>
    </article>
  </section>
  <section id="users" class="adminSection panelGrid">
    <article class="dataPanel">
      <div class="toolbar"><div><p class="kicker">Access</p><h2>Users</h2></div><button class="smallBtn" type="button">Invite user</button></div>
      <table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr></thead><tbody>${users.map(([name, userEmail, role, status]) => `<tr><td>${esc(name)}</td><td>${esc(userEmail)}</td><td>${esc(role)}</td><td><span class="tableStatus">${esc(status)}</span></td></tr>`).join('')}</tbody></table>
    </article>
    <article class="dataPanel">
      <p class="kicker">Role model</p>
      <h2>Tenant controls</h2>
      <p class="muted">Tenant membership is anchored to NodeRunner platform tenancy. 1db exposes application-scoped access here.</p>
      <label>Default role <select><option>Developer</option><option>Admin</option><option>Read only</option></select></label>
      <button class="smallBtn subtleBtn" type="button">Review policy</button>
    </article>
  </section>
  <section id="billing" class="adminSection panelGrid">
    <article class="dataPanel">
      <div class="toolbar"><div><p class="kicker">Billing</p><h2>Plan and usage</h2></div><button class="smallBtn subtleBtn" type="button">Manage plan</button></div>
      <table><tbody><tr><th>Plan</th><td>Private preview</td></tr><tr><th>Monthly events</th><td>100,000 included</td></tr><tr><th>Usage policy</th><td>Managed 1db persistence</td></tr><tr><th>Invoice contact</th><td>${esc(email)}</td></tr></tbody></table>
    </article>
    <article class="dataPanel">
      <p class="kicker">Spend guardrails</p>
      <h2>Limits</h2>
      <label>Monthly event limit <input value="100000" inputmode="numeric"></label>
      <label>Overage behavior <select><option>Notify admins</option><option>Throttle ingestion</option><option>Pause writes</option></select></label>
    </article>
  </section>
  <section id="integrations" class="adminSection">
    <article class="dataPanel">
      <div class="toolbar"><div><p class="kicker">Connections</p><h2>Integrations</h2></div><button class="smallBtn" type="button">Add integration</button></div>
      <div class="integrationList">${integrations.map(([name, status, detail]) => `<div class="integration"><div><strong>${esc(name)}</strong><p class="muted">${esc(detail)}</p></div><span class="tableStatus">${esc(status)}</span></div>`).join('')}</div>
    </article>
  </section>
</main>
<script>${adminProjectCognitionJs()}${adminCognitionGraphJs()}</script>
</div>`, '1db Admin');
}

function adminCognitionGraphJs() {
  return `
const cg = id => document.getElementById(id);
const cgValue = id => cg(id).value.trim();
const cgHeaders = () => ({'content-type':'application/json','x-nrun-tenant-uid':cgValue('cgTenant')});
function cgJson(data) {
  cg('cgPreview').textContent = JSON.stringify(data, null, 2);
}
function cgSetStatus(message) {
  cg('cgStatus').textContent = message;
}
async function cgFetch(path, options = {}) {
  cgSetStatus('Querying graph...');
  const result = await fetch(path, {...options, headers:{...cgHeaders(), ...(options.headers||{})}});
  const data = await result.json().catch(() => ({}));
  if (!result.ok) throw new Error(data?.error?.message || data?.title || 'Graph query failed');
  cgJson(data);
  cgSetStatus('Loaded at '+new Date().toLocaleTimeString()+'.');
  return data;
}
function cgParseInput() {
  return Object.fromEntries(cgValue('cgInput').split(/[\\n,]+/).map(part => part.trim()).filter(Boolean).map(part => {
    const [key, value] = part.split('=').map(v => v.trim());
    return [key, Number(value)];
  }).filter(([key, value]) => key && Number.isFinite(value)));
}
async function cgRun(action) {
  try { return await action(); } catch (error) { cgSetStatus(error.message); }
}
function cgNamespaceQuery() {
  return '?namespace='+encodeURIComponent(cgValue('cgNamespace') || '1db');
}
function cgGraph() {
  return cgRun(() => cgFetch('/api/v1/cognition/graph'+cgNamespaceQuery()));
}
function cgSeed() {
  return cgRun(() => cgFetch('/api/v1/cognition/seed', {method:'POST', body:JSON.stringify({namespace:cgValue('cgNamespace') || '1db', word:cgValue('cgConcept') || 'cold'})}));
}
function cgDecompose() {
  return cgRun(() => cgFetch('/api/v1/cognition/decompose/'+encodeURIComponent(cgValue('cgConcept') || 'cold')+cgNamespaceQuery()));
}
function cgConceptByLabel() {
  return cgRun(() => cgFetch('/api/v1/cognition/concepts/by-label/'+encodeURIComponent(cgValue('cgConcept') || 'cold')+cgNamespaceQuery()));
}
function cgConcept() {
  return cgRun(() => cgFetch('/api/v1/cognition/concepts/'+encodeURIComponent(cgValue('cgConcept') || 'cold')+cgNamespaceQuery()));
}
function cgAssociation() {
  return cgRun(() => cgFetch('/api/v1/cognition/associations/'+encodeURIComponent(cgValue('cgAssociation'))+cgNamespaceQuery()));
}
function cgRule() {
  return cgRun(() => cgFetch('/api/v1/cognition/rules/'+encodeURIComponent(cgValue('cgAssociation'))+cgNamespaceQuery()));
}
async function cgInfer() {
  return cgRun(async () => {
    const data = await cgFetch('/api/v1/cognition/infer', {method:'POST', body:JSON.stringify({namespace:cgValue('cgNamespace') || '1db', input:cgParseInput()})});
    if (data?.id) cg('cgSession').value = data.id;
    return data;
  });
}
function cgSessionRead() {
  return cgRun(() => cgFetch('/api/v1/cognition/sessions/'+encodeURIComponent(cgValue('cgSession'))+cgNamespaceQuery()));
}
function cgExplain() {
  return cgRun(() => cgFetch('/api/v1/cognition/sessions/'+encodeURIComponent(cgValue('cgSession'))+'/explanation'+cgNamespaceQuery()));
}
function cgEvidenceRead() {
  return cgRun(() => cgFetch('/api/v1/cognition/evidence/'+encodeURIComponent(cgValue('cgEvidence'))+cgNamespaceQuery()));
}
setTimeout(() => { if (cgValue('cgTenant')) cgGraph(); }, 200);`;
}

function adminProjectCognitionJs() {
  return `
const lines = id => document.getElementById(id).value.split(/\\n+/).map(v => v.trim()).filter(Boolean);
const pcHeaders = () => ({'content-type':'application/json','x-nrun-tenant-uid':document.getElementById('pcTenant').value.trim()});
async function pcFetch(path, options = {}) {
  const result = await fetch(path, {...options, headers:{...pcHeaders(), ...(options.headers||{})}});
  const data = await result.json().catch(() => ({}));
  if (!result.ok) throw new Error(data?.error?.message || data?.title || 'Project Cognition request failed');
  return data;
}
function pcPayload() {
  return {
    projectKey: pcKey.value,
    projectName: pcName.value,
    description: pcDescription.value,
    architectureNotes: pcArchitecture.value,
    operationalRules: lines('pcOperational'),
    deploymentRules: lines('pcDeployment'),
    codingStandards: lines('pcCoding'),
    toolPreferences: lines('pcTools'),
    environmentNotes: pcEnvironment.value,
    securityRequirements: lines('pcSecurity'),
    organizationalConstraints: lines('pcOrg'),
    isActive: true,
    actorId: '1db-admin',
    changeReason: pcReason.value
  };
}
function renderProjectCognition(item) {
  pcPreview.textContent = item?.agentContext || 'No active Project Cognition.';
}
function renderVersions(items) {
  pcVersions.innerHTML = (items || []).map(item => '<div class="integration"><div><strong>'+item.projectName+' v'+item.version+'</strong><p class="muted">'+item.projectKey+' &middot; '+(item.isActive?'active':'inactive')+'</p></div><span><button class="smallBtn subtleBtn" type="button" onclick="activateProjectCognition(\\''+item.id+'\\')">Activate</button> <button class="smallBtn subtleBtn" type="button" onclick="deactivateProjectCognition(\\''+item.id+'\\')">Deactivate</button></span></div>').join('');
}
async function saveProjectCognition() {
  try {
    pcStatus.textContent = 'Saving Project Cognition...';
    const item = await pcFetch('/api/project-cognition', {method:'POST', body:JSON.stringify(pcPayload())});
    renderProjectCognition(item);
    await loadProjectCognition();
    pcStatus.textContent = 'Saved version '+item.version+'.';
  } catch (error) { pcStatus.textContent = error.message; }
}
async function loadProjectCognition() {
  try {
    const data = await pcFetch('/api/project-cognition/'+encodeURIComponent(pcKey.value));
    renderVersions(data.items || []);
    if ((data.items || [])[0]) renderProjectCognition(data.items[0]);
    pcStatus.textContent = 'Loaded '+(data.items || []).length+' versions.';
  } catch (error) { pcStatus.textContent = error.message; }
}
async function loadActiveProjectCognition() {
  try {
    const item = await pcFetch('/api/project-cognition/'+encodeURIComponent(pcKey.value)+'/active');
    renderProjectCognition(item);
    pcStatus.textContent = 'Loaded active version '+item.version+'.';
  } catch (error) { pcStatus.textContent = error.message; }
}
async function activateProjectCognition(id) {
  try {
    const item = await pcFetch('/api/project-cognition/'+id+'/activate', {method:'POST', body:'{}'});
    renderProjectCognition(item);
    await loadProjectCognition();
  } catch (error) { pcStatus.textContent = error.message; }
}
async function deactivateProjectCognition(id) {
  try {
    const item = await pcFetch('/api/project-cognition/'+id+'/deactivate', {method:'POST', body:'{}'});
    renderProjectCognition(item);
    await loadProjectCognition();
  } catch (error) { pcStatus.textContent = error.message; }
}`;
}

export function signInPage(message = '', session = null) {
  if (session) {
    return adminPage(session);
  }

  return page(`${nav()}<main><section class="hero split"><div><p class="pill">Private preview</p><h1>Sign in</h1><p class="lead">Use a provisioned 1db private-preview account.</p><p class="muted">New account requests are handled through the waitlist.</p><p><a class="btn alt" href="/waitlist">Join the waitlist</a></p></div><form class="card" method="post" action="/signin"><h2>Account access</h2>${message ? `<p class="pill">${esc(message)}</p>` : ''}<label>Email <input name="email" type="email" required autocomplete="email"></label><label>Password <input name="password" type="password" required autocomplete="current-password"></label><button type="submit">Sign in</button></form></section></main>`, 'Sign in');
}

export function notFoundPage(title = 'Not found', detail = 'No route matched.') {
  return page(`<main class="hero"><section class="card" style="max-width:760px;margin:auto"><p class="brand">1db.io</p><h1>${esc(title)}</h1><p class="lead">${esc(detail)}</p><p><a class="btn" href="/">Home</a></p></section></main>`, title);
}

export function openApiDocument(publicOrigin = 'https://1db.io') {
  return {
    openapi: '3.1.0',
    info: {
      title: '1db API',
      version: '0.2.0',
      description: '1db private-preview API for persistent memory, continuity, and context retrieval.'
    },
    servers: [{ url: publicOrigin }],
    components: {
      securitySchemes: {
        tenantUid: { type: 'apiKey', in: 'header', name: 'X-NRun-Tenant-Uid' }
      }
    },
    security: [{ tenantUid: [] }],
    paths: {
      '/api/v1/cognition/events': { post: { summary: 'Append a cognitive event and optional memory.' } },
      '/api/v1/cognition/context/retrieve': { post: { summary: 'Retrieve a durable context packet.' } },
      '/api/v1/cognition/context/packets/{packetUid}': { get: { summary: 'Read a previously created context packet.' } },
      '/api/v1/cognition/graph': { get: { summary: 'Read the 1DB base cognition graph root.' } },
      '/api/v1/cognition/seed': { post: { summary: 'Run the base cognition graph seeder.' } },
      '/api/v1/cognition/concepts/{conceptId}': { get: { summary: 'Read a cognition concept vertex.' } },
      '/api/v1/cognition/concepts/by-label/{label}': { get: { summary: 'Resolve a concept vertex by label.' } },
      '/api/v1/cognition/associations/{associationId}': { get: { summary: 'Read an association vertex.' } },
      '/api/v1/cognition/decompose/{conceptId}': { get: { summary: 'Read seeded concept decomposition.' } },
      '/api/v1/cognition/rules/{ruleId}': { get: { summary: 'Read a composition rule association vertex.' } },
      '/api/v1/cognition/infer': { post: { summary: 'Run activation-based inference and persist a session vertex.' } },
      '/api/v1/cognition/sessions/{sessionId}': { get: { summary: 'Read a cognition session vertex.' } },
      '/api/v1/cognition/sessions/{sessionId}/explanation': { get: { summary: 'Read the explanation trace for a cognition session.' } },
      '/api/v1/cognition/seed/jobs/{jobId}': { get: { summary: 'Read a cognition seed job.' } },
      '/api/v1/cognition/enrichment/jobs/{jobId}': { get: { summary: 'Read a cognition enrichment job.' } },
      '/api/v1/cognition/evidence/{evidenceId}': { get: { summary: 'Read cognition graph evidence.' } },
      '/1db/cognition': { get: { summary: 'NodeVertex-style route for the base cognition graph root.' } },
      '/1db/cognition/concepts/{conceptId}': { get: { summary: 'NodeVertex-style concept vertex route.' } },
      '/1db/cognition/associations/{associationId}': { get: { summary: 'NodeVertex-style association vertex route.' } },
      '/1db/cognition/infer': { post: { summary: 'NodeVertex-style cognition inference route.' } },
      '/api/v1/cognition/backends': { get: { summary: 'List available cognition stores.' } },
      '/api/v1/cognition/backends/plan': { get: { summary: 'Plan a cognition operation.' } },
      '/api/v1/cognition/projects/{projectId}/continuity': { get: { summary: 'Read project continuity state.' } },
      '/api/project-cognition': {
        get: { summary: 'List Project Cognition versions.' },
        post: { summary: 'Create a versioned Project Cognition record.' }
      },
      '/api/project-cognition/{projectKey}': { get: { summary: 'List versions for one project.' } },
      '/api/project-cognition/{projectKey}/active': { get: { summary: 'Load active Project Cognition for agent initialization.' } },
      '/api/project-cognition/{id}': { put: { summary: 'Create an updated Project Cognition version.' } },
      '/api/project-cognition/{id}/activate': { post: { summary: 'Activate a Project Cognition version.' } },
      '/api/project-cognition/{id}/deactivate': { post: { summary: 'Deactivate a Project Cognition version.' } }
    }
  };
}
