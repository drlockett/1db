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
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at 20% 0%,rgba(37,99,235,.12),transparent 30%),linear-gradient(180deg,#fafdff,#eef8fc 55%,#f6fffb);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}a{color:inherit}.nav{position:sticky;top:0;z-index:10;display:flex;justify-content:space-between;align-items:center;gap:24px;padding:18px 32px;background:rgba(247,251,255,.86);backdrop-filter:blur(18px);border-bottom:1px solid var(--line)}.brand{font-weight:950;letter-spacing:-.04em;color:var(--ink);font-size:24px}.nav nav{display:flex;align-items:center;gap:20px;flex-wrap:wrap;font-weight:800}.nav a{text-decoration:none;color:#456176}main{max-width:1220px;margin:0 auto;padding:0 22px}.hero{padding:84px 0}.heroGrid{display:grid;grid-template-columns:minmax(0,.95fr) minmax(420px,1fr);gap:46px;align-items:center;min-height:calc(100vh - 70px)}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:18px}.card{background:rgba(255,255,255,.86);border:1px solid var(--line);border-radius:8px;padding:26px;box-shadow:var(--shadow)}.btn,button{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:linear-gradient(135deg,var(--blue),var(--cyan));color:#fff;border:0;border-radius:999px;padding:12px 18px;font-weight:950;text-decoration:none;cursor:pointer;box-shadow:0 14px 32px rgba(37,99,235,.18)}.btn.alt{background:#fff;color:var(--blue2);border:1px solid var(--line2);box-shadow:0 10px 24px rgba(16,36,62,.08)}.btn.ghost{background:var(--softgreen);color:#087f68;border:1px solid rgba(18,184,134,.24);box-shadow:none}h1{max-width:850px;color:var(--ink);font-size:clamp(48px,6.5vw,82px);line-height:1.02;margin:0 0 24px;letter-spacing:0;text-wrap:balance}h2{color:var(--ink);font-size:clamp(30px,4vw,54px);line-height:1;margin:0 0 14px;letter-spacing:0}h3{color:var(--ink);margin:0 0 8px}.lead{font-size:clamp(19px,2vw,24px);line-height:1.55;color:#4b6178;max-width:790px}.muted{color:var(--muted)}.pill{display:inline-flex;gap:9px;align-items:center;border:1px solid rgba(18,184,134,.34);background:linear-gradient(90deg,rgba(18,184,134,.12),rgba(37,99,235,.08));border-radius:999px;padding:7px 14px;color:#087f68;font-weight:900;letter-spacing:.01em;margin-bottom:22px}.pill:before{content:"";width:7px;height:7px;border-radius:50%;background:var(--green)}.kicker{color:#087f68;font-weight:950;text-transform:uppercase;font-size:12px;letter-spacing:.18em}.graph{height:500px;border-radius:8px;background:radial-gradient(circle at 50% 44%,rgba(27,183,216,.18),transparent 36%),linear-gradient(180deg,#ffffff,#eef7fc);border:1px solid var(--line);position:relative;overflow:hidden;box-shadow:var(--shadow)}.graph:before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(37,99,235,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(18,184,134,.045) 1px,transparent 1px);background-size:38px 38px}.node{position:absolute;width:14px;height:14px;border-radius:50%;background:var(--blue);box-shadow:0 0 0 7px rgba(37,99,235,.10),0 0 20px rgba(37,99,235,.34);animation:pulse 2.8s ease-in-out infinite}.node.big{width:24px;height:24px;background:var(--green);box-shadow:0 0 0 9px rgba(18,184,134,.12),0 0 28px rgba(18,184,134,.32)}.node:after{content:attr(data-label);position:absolute;left:18px;top:-8px;white-space:nowrap;color:var(--ink);font:12px ui-monospace,monospace;background:rgba(255,255,255,.82);border:1px solid var(--line);border-radius:999px;padding:3px 7px}.edge{position:absolute;height:2px;background:linear-gradient(90deg,transparent,rgba(37,99,235,.28),rgba(18,184,134,.42),transparent);transform-origin:left center;animation:flow 3.6s linear infinite}.trail{position:absolute;width:6px;height:6px;border-radius:50%;background:var(--green);box-shadow:0 0 16px rgba(18,184,134,.5);animation:drift 7s linear infinite}@keyframes pulse{50%{transform:scale(1.35)}}@keyframes flow{50%{opacity:.45}}@keyframes drift{0%{transform:translate(20px,430px);opacity:0}10%{opacity:1}55%{transform:translate(340px,180px)}100%{transform:translate(500px,68px);opacity:0}}.memory{display:grid;gap:12px}.memory .rowx{display:grid;grid-template-columns:150px 1fr;gap:12px;align-items:center}.stream{height:10px;border-radius:999px;background:linear-gradient(90deg,var(--blue),var(--green),var(--cyan));background-size:220% 100%;animation:stream 2.4s linear infinite}@keyframes stream{to{background-position:220% 0}}pre{overflow:auto;background:#f5fbff;border:1px solid var(--line);border-radius:8px;padding:18px;color:#17324d}code,input,textarea,select{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}code{color:#075fb8}input,textarea,select{width:100%;background:#fff;color:var(--text);border:1px solid var(--line2);border-radius:8px;padding:11px}label{display:block;margin:10px 0;font-weight:800;color:var(--ink)}table{width:100%;border-collapse:collapse}td,th{border-bottom:1px solid var(--line);padding:10px;text-align:left}ul{padding-left:20px}.split{display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start}.quote{font-size:clamp(30px,5vw,64px);line-height:.98;letter-spacing:0;color:var(--ink)}.band{background:linear-gradient(180deg,rgba(234,244,255,.78),rgba(233,251,244,.68));border:1px solid var(--line);border-radius:8px;padding:30px}.stat{font-size:36px;font-weight:950;color:var(--ink);letter-spacing:0}.live{display:inline-flex;align-items:center;gap:8px;color:#087f68;font-weight:900}.live:before{content:"";width:8px;height:8px;border-radius:50%;background:var(--green);box-shadow:0 0 0 6px rgba(18,184,134,.12)}@media(max-width:900px){.heroGrid,.split{grid-template-columns:1fr}.graph{height:420px}.nav{align-items:flex-start;flex-direction:column;padding:16px 20px}.nav nav{gap:16px;font-size:16px}.hero{padding:58px 0}h1{font-size:50px;line-height:1.03}.memory .rowx{grid-template-columns:1fr}}`;
}

function page(body, title = '1db.io') {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${esc(title)}</title>
  <style>${style()}</style>
</head>
<body>${body}</body>
</html>`;
}

function nav(active = '') {
  const link = (href, text) => `<a href="${href}"${active === text ? ' aria-current="page"' : ''}>${text}</a>`;
  return `<header class="nav"><a class="brand" href="/">1db.io</a><nav>${link('/#continuity', 'Continuity')}${link('/#memory', 'Memory')}${link('/#time', 'Time')}${link('/#compare', 'Compare')}${link('/docs', 'Docs')}${link('/waitlist', 'Waitlist')}<a class="btn alt" href="/signin">Sign in</a></nav></header>`;
}

function graphVisual() {
  const nodes = [['48%', '47%', '1db', 'big'], ['13%', '20%', 'agent'], ['78%', '18%', 'human'], ['20%', '72%', 'app'], ['72%', '76%', 'memory'], ['44%', '16%', 'vector'], ['84%', '48%', 'event'], ['35%', '82%', 'identity']];
  const edges = [[50, 50, 15, 23], [50, 50, 80, 21], [50, 50, 22, 74], [50, 50, 73, 78], [50, 50, 46, 18], [50, 50, 86, 50], [50, 50, 37, 84]];
  return `<div class="graph" aria-label="Living intelligence graph">${edges.map(([x, y, x2, y2]) => {
    const dx = x2 - x;
    const dy = y2 - y;
    const len = Math.hypot(dx, dy);
    return `<i class="edge" style="left:${x}%;top:${y}%;width:${len}%;transform:rotate(${Math.atan2(dy, dx)}rad)"></i>`;
  }).join('')}${nodes.map(([x, y, label, big], i) => `<i class="node ${big || ''}" data-label="${label}" style="left:${x};top:${y};animation-delay:${i * .22}s"></i>`).join('')}<i class="trail"></i><i class="trail" style="animation-delay:2s"></i><i class="trail" style="animation-delay:4s"></i></div>`;
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
  return page(`${nav()}<main>
<section class="hero heroGrid"><div><p class="pill">Cognitive infrastructure</p><h1>The Cognitive Infrastructure Layer for Persistent Intelligence</h1><p class="lead">1db is the persistence substrate for semantic continuity, machine memory, temporal intelligence, relationship awareness, and distributed cognition.</p><p><a class="btn" href="/waitlist">Join the waitlist</a> <a class="btn ghost" href="#architecture">Read Architecture</a> <a class="btn alt" href="/openapi.json">Explore API</a></p><p class="live">Live private preview</p></div>${graphVisual()}</section>
<section id="continuity" class="hero band"><p class="kicker">Core narrative</p><h2>Intelligence without continuity is not intelligence.</h2><p class="lead">Large language models generate responses. But without continuity they forget, reset, lose identity, lose relationships, cannot evolve, cannot maintain goals, and cannot preserve behavioral patterns.</p><div class="grid"><article class="card"><h3>Not chat history</h3><p>1db is not a transcript archive or session store. It is a continuously evolving intelligence graph.</p></article><article class="card"><h3>Not simple retrieval</h3><p>Retrieval finds similar content. Continuity preserves identity, causality, significance, and change over time.</p></article><article class="card"><h3>Persistent cognition</h3><p>Memory becomes a living substrate that can strengthen, decay, merge, contradict, and evolve.</p></article></div></section>
<section id="what" class="hero"><p class="kicker">What is 1db?</p><h2>Infrastructure for Persistent Intelligence.</h2><p class="lead">1db is cognitive infrastructure: a living graph of facts, memories, embeddings, events, identity, temporal state, simulations, and relationships. It is the continuity layer required before advanced machine cognition can become dependable.</p><div class="grid">${caps.map(c => `<article class="card"><p>${c}</p></article>`).join('')}</div></section>
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
await db.simulation.project()
await db.temporal.reconstruct()</code></pre></article><article class="card"><h3>Operational cognition API</h3><pre><code>curl -X POST https://1db.io/api/v1/cognition/events \\
 -H "X-NRun-Tenant-Uid: $TENANT_UID" \\
 -H "Content-Type: application/json" \\
 -d '{"type":"conversation.message","payload":{"text":"Remember this."}}'</code></pre></article><article class="card"><h3>Route planner</h3><pre><code>curl https://1db.io/api/v1/cognition/backends/plan?operation=retrieve \\
 -H "X-NRun-Tenant-Uid: $TENANT_UID"</code></pre></article></section>
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

export function signInPage(message = '', session = null) {
  if (session) {
    return page(`${nav()}<main><section class="hero"><div class="card" style="max-width:720px;margin:auto"><p class="pill">Private preview</p><h1>Account</h1><p class="lead">You are signed in to 1db.</p><p class="muted">${esc(session.email || 'Private preview account')}</p><form method="post" action="/signout"><button type="submit">Sign out</button></form></div></section></main>`, '1db Account');
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
      '/api/v1/cognition/backends': { get: { summary: 'List available cognition stores.' } },
      '/api/v1/cognition/backends/plan': { get: { summary: 'Plan a cognition operation.' } },
      '/api/v1/cognition/projects/{projectId}/continuity': { get: { summary: 'Read project continuity state.' } }
    }
  };
}
