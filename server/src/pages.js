import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const marketingStylesheet = '/assets/home.' + createHash('sha256').update(readFileSync(new URL('../public/home.css', import.meta.url))).digest('hex').slice(0, 12) + '.css';

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

function page(body, title = '1db.io', { head = '', bodyClass = '' } = {}) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${esc(title)}</title>
  ${head}
  <style>${style()}${cognitionStyle()}</style>
</head>
<body${bodyClass ? ` class="${esc(bodyClass)}"` : ''}>${body}<footer class="siteFooter">&copy; 2026 <a href="https://noderunner.llc">NodeRunner, LLC</a></footer></body>
</html>`;
}

function nav(active = '') {
  const link = (href, text) => `<a href="${href}"${active === text ? ' aria-current="page"' : ''}>${text}</a>`;
  return `<header class="nav"><a class="brand" href="/">1db.io</a><nav aria-label="Main navigation">${link('/continuity', 'Continuity')}${link('/capabilities', 'Capabilities')}${link('/architecture', 'Architecture')}${link('/governance', 'Governance')}${link('/docs', 'Docs')}${link('/waitlist', 'Waitlist')}<a class="btn alt" href="/signin">Sign in</a></nav></header>`;
}

const memoryLayers = [
  ['Working Memory', 'Context relevant to the current task, actor, and goal.'],
  ['Episodic Memory', 'Observed events, decisions, actions, and outcomes with their source and time.'],
  ['Semantic Memory', 'Facts, concepts, and knowledge that give events meaning.'],
  ['Relationship Memory', 'Connections between people, agents, projects, and other entities.'],
  ['Identity Memory', 'Continuity of preferences, goals, and persona traits across sessions.'],
  ['Temporal Memory', 'Sequence, change, and the history behind the current state.'],
  ['Predictive / Simulation Memory', 'A roadmap layer for retaining hypothetical branches and projected outcomes.']
];

function memoryLayersSection() {
  return `<section class="homeSection memoryLayerSection" id="memory-layers">
    <div class="sectionIntro">
      <p class="homeEyebrow">Memory model</p>
      <h2>Memory at every level of a task.</h2>
      <p>The 1db memory model describes the different kinds of context that contribute to persistent agency.</p>
    </div>
    <dl class="memoryLayerCards">${memoryLayers.map(([name, detail]) => `<div><dt>${esc(name)}</dt><dd>${esc(detail)}</dd></div>`).join('')}</dl>
  </section>`;
}

function cognitionGraphSection() {
  return `<section class="homeSection" id="cognition-graph">
    <div class="sectionIntro">
      <p class="homeEyebrow">Cognition graph</p>
      <h2>Concepts become explainable associations.</h2>
      <p>A cognition graph begins with facts, then connects them through relationships whose strength changes the result. The same inputs can produce different outcomes when the association weight shifts.</p>
    </div>
    <figure class="associationFigure">
      <div class="associationExample">
        <p class="exampleLabel">Illustrative association</p>
        <div class="associationPath">
          <div class="conceptCard"><span>Concept</span><strong>Water</strong><p>The observed substance</p></div>
          <span class="associationConnector" aria-label="connected to">+</span>
          <div class="conceptCard"><span>Condition</span><strong>Cold</strong><p>The surrounding context</p></div>
          <span class="associationConnector" aria-label="leads to">→</span>
          <div class="conceptCard resultConcept"><span>Related concept</span><strong>Ice</strong><p>A possible outcome</p></div>
        </div>
      </div>
      <div class="associationExplanation">
        <h3>Relationship strength changes relevance.</h3>
        <p>A weaker association with cold may point toward cool water. A stronger association may make ice more relevant.</p>
        <p>Provenance, conditions, and the relationships between concepts help explain how the result was reached.</p>
      </div>
      <figcaption>An illustrative memory model. Outcomes depend on the conditions and evidence recorded with an association.</figcaption>
    </figure>
  </section>`;
}

export function homePage() {
  const title = '1db | Agentic Memory';
  const description = '1db is Agentic Memory, the memory foundation for persistent intelligence. Give AI agents durable memory across sessions, systems, and time.';
  const heroImage = '/assets/agentic-memory-hero.jpg';
  const canonical = 'https://1db.io/';
  const imageAlt = 'Layers of smoked glass connected by mint traces, illustrating memory carried across sessions.';
  const contextRequest = JSON.stringify({
    projectId: 'release-review',
    query: 'What still needs approval?'
  }, null, 2);

  return page(`
<a class="skipLink" href="#main-content">Skip to content</a>
${nav()}
<main id="main-content">
  <section class="homeHero" aria-labelledby="home-title">
    <div class="heroCopy">
      <p class="homeEyebrow">Private preview</p>
      <h1 id="home-title">Agentic Memory<br>by 1db</h1>
      <p class="heroLead">The memory foundation for persistent intelligence.</p>
      <p class="heroDetail">1db gives AI agents durable memory across sessions, systems, and time. Preserve knowledge, identity, and relationships so experience can inform future decisions and actions.</p>
      <div class="homeActions">
        <a class="homeButton" href="/waitlist">Join the waitlist <span aria-hidden="true">↗</span></a>
        <a class="homeButton secondary" href="/docs">Read developer docs</a>
      </div>
    </div>
    <figure class="homeArtwork">
      <img src="${heroImage}" width="1448" height="1086" alt="${esc(imageAlt)}" fetchpriority="high">
    </figure>
  </section>

  ${memoryLayersSection()}
  ${cognitionGraphSection()}

  <section class="homeSection" id="continuity" aria-labelledby="continuity-title">
    <span id="session-amnesia" class="homeAnchor"></span>
    <span id="what" class="homeAnchor"></span>
    <div class="sectionIntro">
      <h2 id="continuity-title">How Agentic Memory works</h2>
      <p>Keep the decisions, constraints, and open work that an agent needs to resume a task.</p>
      <a class="homeLink" href="/capabilities">Explore memory layers and capabilities ↗</a>
    </div>
    <div class="memorySteps" id="capabilities">
      <article>
        <h3>Record what happened</h3>
        <p>Capture messages, tool calls, decisions, and outcomes with their source and timestamp.</p>
      </article>
      <article>
        <h3>Preserve what changed</h3>
        <p>Save versioned checkpoints so the next session can recover project state, responsibilities, and open work.</p>
      </article>
      <article>
        <h3>Retrieve context for the task</h3>
        <p>Request an authorized context packet for the project and question at hand, with references to the checkpoints used.</p>
      </article>
    </div>
  </section>

  <section class="homeSection homeSplit" id="project-cognition" aria-labelledby="project-title">
    <div class="sectionIntro">
      <p class="homeEyebrow">Project Cognition</p>
      <h2 id="project-title">Pick up a release review in a new session.</h2>
      <p>A handoff can carry the approved changes, the owner of each open item, and the evidence a reviewer needs. The incoming agent can ask what still needs approval and retrieve context for that release.</p>
      <a class="homeLink" href="/openapi.json">View OpenAPI reference <span aria-hidden="true">↗</span></a>
    </div>
    <div class="apiExample" aria-label="Example context retrieval request">
      <div class="apiEndpoint"><span>POST</span> <code>/api/v1/cognition/context/retrieve</code></div>
      <pre><code>${esc(contextRequest)}</code></pre>
    </div>
  </section>

  <section class="homeSection homeSplit" id="architecture" aria-labelledby="architecture-title">
    <span id="memory" class="homeAnchor"></span>
    <span id="time" class="homeAnchor"></span>
    <div class="sectionIntro">
      <h2 id="architecture-title">Memory across agents and sessions.</h2>
      <p>1db provides the memory layer for agent workflows. When agents communicate through NodeVertex, 1db can preserve the decisions and project state that need to outlast a conversation.</p>
      <a class="homeLink" href="/architecture">Explore the architecture ↗</a>
    </div>
    <dl class="architectureList">
      <div><dt>Scope</dt><dd>Retrieve context for the relevant project, persona, or collaboration.</dd></div>
      <div><dt>Version history</dt><dd>Pin a known checkpoint and recover the exact state used in a handoff.</dd></div>
      <div><dt>Provenance</dt><dd>Trace a context packet to the checkpoint identifiers, versions, and integrity hashes used to compile it.</dd></div>
    </dl>
  </section>

  <section class="homeSection governanceSection" id="governance" aria-labelledby="governance-title">
    <span id="compare" class="homeAnchor"></span>
    <div class="sectionIntro">
      <h2 id="governance-title">Control who can read and write memory.</h2>
      <p>1db checks tenant access and credential scopes. Private continuity scopes require owner or explicitly granted access.</p>
      <a class="homeLink" href="/governance">Explore trust and governance <span aria-hidden="true">↗</span></a>
    </div>
  </section>

  <section class="homeSection homeSplit" aria-labelledby="continuity-detail-title">
    <div class="sectionIntro">
      <p class="homeEyebrow">Persistent agency</p>
      <h2 id="continuity-detail-title">Memory for people, projects, and organizations.</h2>
      <p>Communication + Memory + Time + Identity = Persistent Agency. 1db connects project knowledge, persona continuity, relationships, and shared organizational context.</p>
      <a class="homeLink" href="/continuity">Explore continuity across sessions ↗</a>
    </div>
    <dl class="architectureList">
      <div><dt>Project Cognition</dt><dd>Architecture, workflows, constraints, and team conventions carried into the next session.</dd></div>
      <div><dt>Persona continuity</dt><dd>Identity, preferences, goals, and relationships maintained across channels.</dd></div>
      <div><dt>Enterprise cognition</dt><dd>Institutional knowledge shared across authorized humans, agents, and applications.</dd></div>
    </dl>
  </section>

  <section class="previewCallout" aria-labelledby="preview-title">
    <div class="sectionIntro">
      <h2 id="preview-title">Build with 1db Agentic Memory.</h2>
      <p>Request private preview access for your agent workflow.</p>
    </div>
    <a class="homeButton" href="/waitlist">Join the waitlist <span aria-hidden="true">↗</span></a>
  </section>
</main>`, title, {
    bodyClass: 'homePage',
    head: `<meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="1db">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${new URL(heroImage, canonical).href}">
  <meta property="og:image:alt" content="${esc(imageAlt)}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="stylesheet" href="${marketingStylesheet}">`
  });
}

const productPages = {
  '/continuity': {
    label: 'Continuity',
    title: 'Continuity for agents, projects, and teams',
    description: 'Explore how 1db Agentic Memory preserves project knowledge, persona identity, and shared organizational context across sessions and handoffs.',
    intro: 'Communication + Memory + Time + Identity = Persistent Agency. Agentic Memory gives the work of people, agents, and teams continuity across sessions.',
    body: `
<section class="homeSection homeSplit" id="project-cognition">
  <div class="sectionIntro">
    <p class="homeEyebrow">Project Cognition</p>
    <h2>Project communication becomes reliable execution context.</h2>
    <p>Project Cognition is persistent, versioned execution continuity for how an AI should operate within a project, team, workspace, tenant, repository, environment, or domain.</p>
    <p>Architecture, workflows, constraints, standards, preferences, security requirements, and operating procedures become durable context instead of repeated instructions.</p>
    <a class="homeLink" href="/docs">Explore the Project Cognition API ↗</a>
  </div>
  <div class="contentPanel">
    <h3>Carry the operating context forward</h3>
    <ul>
      <li>Which repository and environment to use.</li>
      <li>Required tools and deployment procedures.</li>
      <li>Team conventions and security requirements.</li>
      <li>Decisions, responsibilities, evidence, and open work.</li>
    </ul>
    <p>A versioned checkpoint preserves the state an incoming agent needs to resume work.</p>
  </div>
</section>
<section class="homeSection" id="session-amnesia">
  <div class="sectionIntro">
    <h2>Stop repeating the setup every session.</h2>
    <p>AI systems often begin each new conversation with incomplete operational context. Users repeat how a project is structured, which tools are required, how deployments work, and which team conventions matter.</p>
  </div>
  <div class="memorySteps">
    <article><h3>Reduce repeated setup</h3><p>Keep project instructions available to the next authorized session.</p></article>
    <article><h3>Maintain team conventions</h3><p>Preserve standards and preferences alongside the work they govern.</p></article>
    <article><h3>Retain execution constraints</h3><p>Carry deployment, security, and workflow requirements into a handoff.</p></article>
  </div>
</section>
<section class="homeSection" id="cognitive-layers">
  <div class="sectionIntro"><h2>Durable cognition for AI systems.</h2><p>1db stores continuity at the layers where intelligent systems operate.</p></div>
  <dl class="detailList">
    <div><dt>Personal Cognition</dt><dd>What an AI knows about an individual.</dd></div>
    <div><dt>Team Cognition</dt><dd>What an AI knows about a group or organization.</dd></div>
    <div><dt>Project Cognition</dt><dd>How an AI should operate within a specific project or workspace.</dd></div>
    <div><dt>Persona Cognition</dt><dd>What makes a particular AI persona unique.</dd></div>
    <div><dt>Organizational Cognition</dt><dd>Policies, standards, governance, and institutional knowledge.</dd></div>
  </dl>
</section>
<section class="homeSection homeSplit" id="enterprise">
  <div class="sectionIntro"><p class="homeEyebrow">Enterprise cognition</p><h2>Companies forget too.</h2><p>Institutional continuity disappears through turnover, disconnected systems, siloed applications, and fragmented AI tooling. Shared organizational cognition carries knowledge across humans, agents, applications, infrastructure, and workflows.</p></div>
  <dl class="architectureList">
    <div><dt>Collective memory</dt><dd>Teams and agents share durable context and recover prior decisions.</dd></div>
    <div><dt>Shared knowledge</dt><dd>Authorized systems can retrieve the project state relevant to their work.</dd></div>
    <div><dt>Coordination</dt><dd>Portable collaboration packets preserve owners, responsibilities, decisions, and evidence.</dd></div>
  </dl>
</section>
<section class="homeSection" id="persona">
  <div class="sectionIntro"><p class="homeEyebrow">Persona continuity</p><h2>Identity across sessions and channels.</h2><p>Persona continuity brings together tone, memory, identity, goals, relationships, preferences, and behavioral traits across sessions, devices, and channels.</p></div>
  <div class="memorySteps">
    <article><h3>Identity stability</h3><p>Preserve the identity and goals that an agent carries from one session to the next.</p></article>
    <article><h3>Behavioral drift</h3><p>Track changes in preferences, goals, relationships, and behavior over time.</p></article>
    <article><h3>Cross-channel coherence</h3><p>Carry authorized persona context across APIs, apps, devices, and workflows.</p></article>
  </div>
  <aside class="directionNote"><h3>Persona Continuity Score</h3><p>A product direction for measuring how consistently an intelligent system preserves these traits over time. Availability of a scoring API is subject to the preview roadmap.</p></aside>
</section>`
  },
  '/capabilities': {
    label: 'Capabilities',
    title: 'The layers of Agentic Memory',
    description: 'Explore 1db memory layers, temporal cognition, relationships, trust, and the roadmap for decay, reinforcement, and simulation.',
    intro: '1db connects memory with identity, relationships, trust, context, and time so agents can act with an understanding of what came before.',
    body: `
${memoryLayersSection()}
<section class="homeSection" id="time">
  <div class="sectionIntro"><p class="homeEyebrow">Temporal cognition</p><h2>Continuity exists across time.</h2><p>1db treats time as semantic change. What happened, when it happened, why it mattered, what changed, what it influenced, and how meaning evolved.</p></div>
  <div class="memorySteps">
    <article><h3>Chronology</h3><p>Events are understood in sequence, with versioned state and checkpoint history.</p></article>
    <article><h3>Causality</h3><p>Facts can point to causes, effects, contradictions, reinforcements, and downstream consequences.</p></article>
    <article><h3>Relevance</h3><p>The memory model accounts for importance, recency, reinforcement, and how relevance changes over time.</p></article>
  </div>
</section>
<section class="homeSection" id="primitives">
  <div class="sectionIntro"><h2>First-class concepts for persistent agency.</h2></div>
  <dl class="detailList">
    <div><dt>Communication events</dt><dd>Messages, actions, tool calls, file changes, decisions, state transitions, and outcomes captured as first-class events.</dd></div>
    <div><dt>Memory</dt><dd>Durable, scoped, provenance-aware representations of meaningful communication or observed state.</dd></div>
    <div><dt>Identity</dt><dd>Continuity patterns that persist across communication, behavior, time, and relationships.</dd></div>
    <div><dt>Relationships</dt><dd>Weighted paths of relevance, trust, permission, dependency, and meaning between entities.</dd></div>
    <div><dt>Context</dt><dd>Compiled local state for this actor, this situation, this goal, and these permissions.</dd></div>
    <div><dt>Trust</dt><dd>Confidence based on provenance, repetition, contradiction, source quality, relationship, and freshness.</dd></div>
    <div><dt>Time</dt><dd>Sequence, causality, decay, reinforcement, contradiction, correction, and evolution.</dd></div>
    <div><dt>Governance</dt><dd>Tenant boundaries, consent, recall scope, retention, permissions, and auditability as cognitive primitives.</dd></div>
  </dl>
</section>
<section class="homeSection homeSplit" id="memory-lifecycle">
  <div class="sectionIntro"><p class="homeEyebrow">Evolving significance</p><h2>Memory can change as the work changes.</h2><p>The broader cognitive model includes confidence scoring, contradiction resolution, semantic strengthening, contextual prioritization, importance weighting, memory merging, and memory aging.</p></div>
  <div class="contentPanel"><h3>Decay and reinforcement</h3><p>Some memories lose relevance. Repeated evidence can strengthen an association, while corrections can change the context an agent should use.</p><p>These lifecycle operations describe the product direction. Preview integrations should use the routes documented in the API reference.</p><a class="homeLink" href="/docs">See the current APIs ↗</a></div>
</section>
<section class="homeSection" id="simulation">
  <div class="sectionIntro"><p class="homeEyebrow">Roadmap · simulation and future reasoning</p><h2>Explore what could happen next.</h2><p>Potential capability includes hypothetical branches, projected outcomes, future-state reasoning, comparative simulations, retained reasoning paths, and temporal scenario analysis as the simulation layer matures.</p></div>
</section>`
  },
  '/architecture': {
    label: 'Architecture',
    title: 'From communication to durable cognition',
    description: 'Understand how 1db Agentic Memory connects communication events, the cognition graph, temporal context, and authorized retrieval for agent runtimes.',
    intro: 'NodeVertex lets everything communicate. 1db lets the fabric remember what communication means. Agentic Memory connects observed activity to the context an agent needs at the moment of action.',
    body: `
<section class="homeSection" id="flow">
  <div class="sectionIntro"><h2>Observe. Remember. Compile.</h2><p>1db observes communication events, converts meaningful activity into durable cognitive state, and compiles relevant context for authorized agents and systems.</p></div>
  <ol class="architectureFlow">
    <li><h3>Communication fabric</h3><p>NodeVertex provides addressability, transport, routing, live coordination, and programmable communication endpoints.</p></li>
    <li><h3>1db Event Layer</h3><p>Observed communication, actions, state changes, outcomes, tool calls, workflow events, and provenance envelopes.</p></li>
    <li><h3>1db Cognition Graph</h3><p>Entities, memories, relationships, concepts, identity signals, trust signals, and evidence links.</p></li>
    <li><h3>1db Temporal Layer</h3><p>Sequence and state changes provide the foundation for reasoning about causality, contradiction, correction, and evolution.</p></li>
    <li><h3>1db Context Compiler</h3><p>Task-ready context scoped by actor, goal, tenant, and permission, with exact checkpoint provenance.</p></li>
    <li><h3>Agent Runtime</h3><p>The agent uses retrieved context to continue reasoning, acting, and communicating through live endpoints.</p></li>
  </ol>
</section>
${cognitionGraphSection()}
<section class="homeSection homeSplit" id="context-packets">
  <div class="sectionIntro"><h2>Context with a recoverable history.</h2><p>Context packets preserve selected checkpoint identifiers, versions, integrity hashes, and exact state. An incoming agent can recover the context behind a handoff and check the evidence it references.</p><a class="homeLink" href="/docs">Integrate context retrieval ↗</a></div>
  <dl class="architectureList">
    <div><dt>Observe</dt><dd>Ingest communication and state-change events.</dd></div>
    <div><dt>Checkpoint</dt><dd>Persist versioned continuity for a project or collaboration scope.</dd></div>
    <div><dt>Retrieve</dt><dd>Compile authorized context for a question and read back the resulting packet.</dd></div>
  </dl>
</section>`
  },
  '/governance': {
    label: 'Governance',
    title: 'Agentic Memory with boundaries',
    description: 'Learn about provenance, tenant boundaries, scoped recall, versioned evidence, and the governance principles behind 1db Agentic Memory.',
    intro: 'Memory needs a source, a scope, and a history. 1db checks access before returning context and preserves the checkpoint provenance behind a handoff.',
    body: `
<section class="homeSection" id="access">
  <div class="sectionIntro"><h2>Scoped access to shared memory.</h2><p>Use a signed-in 1db session or a tenant application credential with the required read or write scope. Each request is bound to the authenticated tenant.</p></div>
  <div class="memorySteps">
    <article><h3>Tenant boundaries</h3><p>Tenant identifiers select context. Access follows the authenticated tenant and credential scopes.</p></article>
    <article><h3>Private continuity</h3><p>Private scopes require owner access or an explicit reader policy. Shared context follows the permissions set for that scope.</p></article>
    <article><h3>Exact provenance</h3><p>Packets record the checkpoint identifiers, versions, and integrity hashes used to compile them.</p></article>
  </div>
</section>
<section class="homeSection" id="principles">
  <div class="sectionIntro"><h2>Cognition needs boundaries.</h2><p>These governance principles guide how the memory model develops.</p></div>
  <dl class="detailList">
    <div><dt>Provenance</dt><dd>Durable memory should trace back to observed communication, state, actor, source, time, and evidence.</dd></div>
    <div><dt>Recall scope</dt><dd>Context compilation must respect tenant boundaries, permissions, task purpose, consent, and channel constraints.</dd></div>
    <div><dt>Identity drift</dt><dd>Identity is a continuity pattern across behavior, preferences, goals, and relationships. Divergence and reinforcement both matter.</dd></div>
    <div><dt>Contradiction handling</dt><dd>Compiled context should account for unresolved contradictions, deprecated memories, and low-confidence claims.</dd></div>
    <div><dt>Relevance over time</dt><dd>Some memories lose relevance. Decay and reinforcement are part of the cognitive model.</dd></div>
  </dl>
</section>
<section class="homeSection homeSplit" id="handoffs">
  <div class="sectionIntro"><h2>Preserve responsibility with the context.</h2><p>Portable collaboration packets retain owners, responsibilities, decisions, and evidence. The executing application independently verifies the authority references recorded in a packet.</p><a class="homeLink" href="/docs">Read the authentication and continuity docs ↗</a></div>
  <div class="contentPanel"><h3>Versioned handoffs</h3><p>Pin a known checkpoint when requesting context. Version checks help a handoff detect that the state changed before it continues.</p><p>Private persona continuity may also require a trusted service credential, according to the scope’s access policy.</p></div>
</section>`
  }
};

export function productPage(path) {
  const content = productPages[path];
  if (!content) return null;
  const title = `${content.label} | 1db Agentic Memory`;
  const canonical = `https://1db.io${path}`;
  const related = Object.entries(productPages)
    .filter(([href]) => href !== path)
    .map(([href, item]) => `<a class="homeLink" href="${href}">${esc(item.label)} <span aria-hidden="true">↗</span></a>`)
    .join('');
  return page(`
<a class="skipLink" href="#main-content">Skip to content</a>
${nav(content.label)}
<main id="main-content">
  <header class="contentHero">
    <p class="homeEyebrow">1db Agentic Memory · ${esc(content.label)}</p>
    <h1>${esc(content.title)}</h1>
    <p class="heroDetail">${esc(content.intro)}</p>
  </header>
  ${content.body}
  <nav class="relatedPages" aria-label="Explore 1db">${related}</nav>
  <section class="previewCallout">
    <div class="sectionIntro"><h2>Build with 1db Agentic Memory.</h2><p>Request private preview access for your agent workflow.</p></div>
    <a class="homeButton" href="/waitlist">Join the waitlist <span aria-hidden="true">↗</span></a>
  </section>
</main>`, title, {
    bodyClass: 'homePage productPage',
    head: `<meta name="description" content="${esc(content.description)}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="1db">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(content.description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="https://1db.io/assets/agentic-memory-hero.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="stylesheet" href="${marketingStylesheet}">`
  });
}

export function docsPage() {
  return page(`${nav('Docs')}<main>
<section class="hero"><p class="pill">Developer docs</p><h1>Build with 1db Agentic Memory.</h1><p class="lead">Record events, save versioned project state, and retrieve authorized context for the next agent session or handoff.</p><p><a class="btn" href="/waitlist">Request access</a> <a class="btn alt" href="/openapi.json">OpenAPI JSON</a></p></section>
<section class="card"><h2>Authenticated tenant access</h2><p>Use a signed-in 1db session or a tenant application credential with cognition:read or cognition:write scope. A tenant identifier selects context; it never grants access. Credentials and sessions cannot select another tenant.</p><p>Context retrieval can include up to eight explicit scopeRefs. Its durable packet records each selected checkpoint identifier, version and integrity hash. Private scopes require an owner or explicit reader policy. Portable collaboration packets preserve identity, outstanding responsibilities, decision references and evidence; recorded authority references must be verified before execution.</p></section>
<section class="hero split"><div><p class="kicker">CLI</p><h2>Install the 1db command line.</h2><p class="muted">The CLI wraps the 1db REST API for creating resources from scripts, terminals, CI, and agent workflows.</p><pre><code>brew tap drlockett/1db
brew install drlockett/1db/1db

export ONE_DB_API_KEY=1db_live_...
1db links create --code demo --url https://example.com
1db links list
1db intakes create --slug waitlist --name Waitlist</code></pre></div><div class="card"><h3>CLI environment</h3><table><tbody><tr><td><code>ONE_DB_API_KEY</code></td><td>Tenant API key used as a Bearer token.</td></tr><tr><td><code>ONE_DB_API_URL</code></td><td>Optional API base URL. Defaults to <code>https://1db.io</code>.</td></tr></tbody></table><h3>Current live cognition routes</h3><ul><li><code>POST /api/v1/cognition/events</code></li><li><code>POST /api/v1/cognition/context/retrieve</code></li><li><code>GET /api/v1/cognition/context/packets/{packetUid}</code></li><li><code>GET /api/v1/cognition/backends</code></li><li><code>GET /api/v1/cognition/backends/plan</code></li></ul></div></section>
<section class="grid"><article class="card"><h3>Cognitive API direction</h3><pre><code>db.observe(event)
db.memory.remember(observation)
db.identity.reinforce(actor, signal)
db.relationship.link(a, b, meaning)
db.context.compile(situation)
db.trust.evaluate(claim)
db.temporal.reconstruct(entity)
db.simulation.project(goal)</code></pre><p class="muted">Some high-level primitives are roadmap vocabulary until the matching public endpoint is verified.</p></article><article class="card"><h3>Operational cognition API</h3><pre><code>curl -X POST https://1db.io/api/v1/cognition/events \\
 -H "Authorization: Bearer $ONE_DB_API_KEY" \\
 -H "X-NRun-Tenant-Uid: $TENANT_UID" \\
 -H "Content-Type: application/json" \\
 -d '{"type":"conversation.message","payload":{"text":"Remember this."}}'</code></pre></article><article class="card"><h3>Route planner</h3><pre><code>curl https://1db.io/api/v1/cognition/backends/plan?operation=retrieve \\
 -H "Authorization: Bearer $ONE_DB_API_KEY" \\
 -H "X-NRun-Tenant-Uid: $TENANT_UID"</code></pre></article></section>
<section class="hero"><p class="kicker">Project Cognition API</p><h2>Persistent execution continuity for projects.</h2><p class="lead">Project Cognition stores versioned operating context that agents can retrieve before they begin work in a repository, workspace, tenant, environment, or domain.</p><div class="grid"><article class="card"><h3>Create cognition</h3><pre><code>curl -X POST https://1db.io/api/project-cognition \\
 -H "Authorization: Bearer $ONE_DB_API_KEY" \\
 -H "X-NRun-Tenant-Uid: $TENANT_UID" \\
 -H "Content-Type: application/json" \\
 -d '{"projectKey":"project-alpha","projectName":"Project Alpha","operationalRules":["Preserve unrelated changes"],"deploymentRules":["Use the current platform runtime"],"isActive":true}'</code></pre></article><article class="card"><h3>Load active context</h3><pre><code>curl https://1db.io/api/project-cognition/project-alpha/active \\
 -H "Authorization: Bearer $ONE_DB_API_KEY" \\
 -H "X-NRun-Tenant-Uid: $TENANT_UID"</code></pre></article><article class="card"><h3>Lifecycle</h3><pre><code>GET  /api/project-cognition
GET  /api/project-cognition/{projectKey}
POST /api/project-cognition
PUT  /api/project-cognition/{id}
POST /api/project-cognition/{id}/activate
POST /api/project-cognition/{id}/deactivate
GET  /api/project-cognition/{projectKey}/active</code></pre></article></div></section>
<section class="hero band"><p class="kicker">Contact</p><h2>Want early access or integration help?</h2><p class="lead">Join the waitlist and include what you are building. 1DB is being shaped around teams building communication fabrics, agent workflows, and durable cognition.</p><p><a class="btn" href="/waitlist">Join the waitlist</a> <a class="btn alt" href="mailto:waitlist@1db.io?subject=1db%20early%20access">Email waitlist@1db.io</a></p></section>
<section class="hero"><h2>Node Vertex and 1DB</h2><p class="lead">Node Vertex provides addressability, transport, routing, and live coordination. 1DB provides continuity: memory, identity, relationships, trust, context, time, governance, and simulation.</p></section>
<section class="card"><h2>OpenAPI</h2><p>The machine-readable API specification is available at <a href="/openapi.json">/openapi.json</a>.</p></section>
</main>`, '1db Developer Docs');
}

export function waitlistPage(message = '') {
  return page(`${nav('Waitlist')}<main><section class="hero split"><div><p class="pill">Private preview</p><h1>Join the 1db waitlist.</h1><p class="lead">Get early access to 1db Agentic Memory for your AI agents and workflows.</p><p class="muted">Tell us what you’re building and what your agents need to carry across sessions or handoffs.</p></div><form class="card" method="post" action="/waitlist"><h2>Request access</h2>${message ? `<p class="pill">${esc(message)}</p>` : ''}<label>Email <input name="email" type="email" required placeholder="you@example.com" autocomplete="email"></label><label>What would you like to build? <textarea name="question" rows="5" placeholder="Agents, communication fabric, Project Cognition, scoped context, enterprise workflow..."></textarea></label><input name="website" tabindex="-1" autocomplete="off" style="position:absolute;left:-10000px" aria-hidden="true"><button type="submit">Join waitlist</button></form></section></main>`, 'Join the 1DB waitlist');
}

export function waitlistThanksPage() {
  return page(`${nav('Waitlist')}<main><section class="hero"><div class="card" style="max-width:760px;margin:auto;text-align:center"><p class="pill">Request received</p><h1>You are on the list.</h1><p class="lead" style="margin:auto">Thanks for your interest in 1db. We received your request and will follow up when preview access opens.</p><p><a class="btn" href="/">Back to home</a></p></div></section></main>`, 'You are on the 1db waitlist');
}

export function adminPage(session) {
  const email = session?.email || 'Private preview account';
  const tenantId = session?.tenantId || 'tenant pending';
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
      <div class="toolbar"><div><p class="kicker">Memory graph</p><h2>Ask the Cognition Graph</h2></div><button class="smallBtn" type="button" onclick="cgSubmit()">Run</button></div>
      <label>Query <input id="cgCommand" value="decompose cold" placeholder="decompose cold"></label>
      <p id="cgStatus" class="muted inlineStatus"></p>
    </article>
    <article class="dataPanel">
      <p class="kicker">Query result</p>
      <h2>Graph Response</h2>
      <div class="hintList">
        <div class="hintChip"><strong>Decompose</strong><span class="monoTiny">decompose cold</span></div>
        <div class="hintChip"><strong>Seed lexicon</strong><span class="monoTiny">seed lexicon 1000</span></div>
        <div class="hintChip"><strong>Count</strong><span class="monoTiny">count concepts</span></div>
        <div class="hintChip"><strong>CAM</strong><span class="monoTiny">cam</span></div>
        <div class="hintChip"><strong>Find</strong><span class="monoTiny">find black ice</span></div>
        <div class="hintChip"><strong>Associate</strong><span class="monoTiny">associate Game of Thrones | is_a | TV Series</span></div>
        <div class="hintChip"><strong>Infer</strong><span class="monoTiny">infer water=1,cold=.85</span></div>
      </div>
      <pre class="resultPre"><code id="cgPreview">Type a graph query.</code></pre>
    </article>
  </section>
  <section id="project-cognition" class="adminSection panelGrid">
    <article class="dataPanel">
      <div class="toolbar"><div><p class="kicker">Execution memory</p><h2>Project Cognition</h2></div><button class="smallBtn" type="button" onclick="saveProjectCognition()">Save version</button></div>
      <div class="grid">
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
const cgHeaders = () => ({'content-type':'application/json'});
const cgEsc = value => String(value ?? '').replace(/[&<>"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char]));
function cgJson(data, intent = '') {
  if (intent === 'decompose' && data?.concept) {
    const concepts = data.composingConcepts || [];
    if (!concepts.length) {
      cg('cgPreview').textContent = (data.concept.canonicalLabel || 'Concept')+' has no decomposition links yet. Try the concept by itself to view associations.';
      return;
    }
    cg('cgPreview').innerHTML = cgEsc(data.concept.canonicalLabel || 'Concept')+' decomposes into:\\n'
      +concepts.map(part => '- <a href="/admin#cognition-graph" data-cg-concept="'+cgEsc(part.slug || part.canonicalLabel)+'">'
        +cgEsc(part.canonicalLabel || part.slug)
        +'</a>'+(part.shortDefinition ? ' - '+cgEsc(part.shortDefinition) : '')).join('\\n');
    return;
  }
  if (intent === 'query' && data?.concept) {
    const associations = data.associations || [];
    const related = data.relatedConcepts || [];
    const lines = [
      data.concept.canonicalLabel || data.query || 'Concept',
      data.concept.shortDefinition || data.concept.definition || '',
      '',
      'Links:'
    ];
    if (related.length) {
      lines.push(...related.map(part => '- '+(part.canonicalLabel || part.slug)+' ('+(part.partOfSpeech || 'concept')+')'+(part.shortDefinition ? ' - '+part.shortDefinition : '')));
    } else if (associations.length) {
      lines.push(...associations.map(item => '- '+(item.relationLabel || item.associationType)+': '+(item.targetConcepts || []).join(', ')));
    } else {
      lines.push('- No links yet. The enrichment engine has queued this concept for association discovery.');
    }
    cg('cgPreview').textContent = lines.filter((line, index) => index !== 1 || line).join('\\n');
    return;
  }
  if (intent === 'infer' && data?.outputActivations) {
    const outputs = Object.entries(data.outputActivations).map(([key, value]) => '- '+key+': '+value).join('\\n');
    const trace = (data.explanationTrace || []).map(item => '- '+item).join('\\n');
    cg('cgPreview').textContent = 'Outputs:\\n'+outputs+(trace ? '\\n\\nTrace:\\n'+trace : '');
    return;
  }
  if (intent === 'seed' && data?.job?.result) {
    const result = data.job.result;
    cg('cgPreview').textContent = 'Seed batch complete.\\n'
      +'Mode: '+(result.mode || 'lexicon')+'\\n'
      +'Offset: '+(result.offset || 0)+'\\n'
      +'Limit: '+(result.limit || 'default')+'\\n'
      +'Concepts now: '+data.conceptCount+'\\n'
      +'Associations now: '+data.associationCount+'\\n'
      +'Next command: seed lexicon '+(Number(result.limit || 1000))+' offset '+((Number(result.offset || 0)) + Number(result.limit || 1000));
    return;
  }
  if (intent === 'stats' && data?.conceptsByPartOfSpeech) {
    cg('cgPreview').textContent = 'Concepts: '+data.conceptCount+'\\nAssociations: '+data.associationCount+'\\n\\n'
      +Object.entries(data.conceptsByPartOfSpeech).map(([key, value]) => '- '+key+': '+value).join('\\n');
    return;
  }
  if (intent === 'cam' && data?.model) {
    cg('cgPreview').textContent = 'Model: '+data.model+'\\nCanonical layer: '+data.canonicalLayer+'\\nRoot: '+data.rootPath+'\\n\\n'
      +'Objects:\\n'+(data.objectTypes || []).map(item => '- '+item).join('\\n')+'\\n\\n'
      +'Engines:\\n'+(data.engines || []).map(item => '- '+item).join('\\n')+'\\n\\n'
      +'Relation types:\\n'+(data.supportedRelationTypes || []).join(', ');
    return;
  }
  if (intent === 'associate' && data?.associationType) {
    cg('cgPreview').textContent = 'CAM association vertex\\n'
      +'Relation: '+data.relationLabel+'\\n'
      +'Source: '+(data.sourceConcepts || []).join(', ')+'\\n'
      +'Target: '+(data.targetConcepts || []).join(', ')+'\\n'
      +'Strength: '+data.strength+'\\n'
      +'Relational yield: '+data.relationalYield+'\\n'
      +'Trust: '+data.trust+'\\n'
      +'Confidence: '+data.confidence+'\\n'
      +'Evidence: '+data.evidence+'\\n'
      +'Persistence: '+data.persistence+'\\n'
      +'Context similarity: '+data.contextSimilarity+'\\n'
      +'Decay rate: '+data.decayRate+'\\n'
      +'Layer: '+(data.tenantId ? 'tenant' : 'global')+'\\n'
      +'Path: '+data.vertexPath;
    return;
  }
  cg('cgPreview').textContent = JSON.stringify(data, null, 2);
}
function cgSetStatus(message) {
  cg('cgStatus').textContent = message;
}
async function cgFetch(path, options = {}, intent = '') {
  cgSetStatus('Querying graph...');
  const result = await fetch(path, {...options, credentials:'same-origin', headers:{...cgHeaders(), ...(options.headers||{})}});
  const data = await result.json().catch(() => ({}));
  if (!result.ok) throw new Error(data?.error?.message || data?.title || 'Graph query failed');
  cgJson(data, intent);
  cgSetStatus('Loaded at '+new Date().toLocaleTimeString()+'.');
  return data;
}
function cgParseInput(text) {
  return Object.fromEntries(text.split(/[\\n, ]+/).map(part => part.trim()).filter(Boolean).map(part => {
    const [key, value] = part.split('=').map(v => v.trim());
    return [key, Number(value)];
  }).filter(([key, value]) => key && Number.isFinite(value)));
}
async function cgRun(action) {
  try { return await action(); } catch (error) { cgSetStatus(error.message); }
}
function cgNamespaceQuery() {
  return '?namespace=1db';
}
function cgCleanTerm(value) {
  return value.replace(/^["']|["']$/g, '').trim();
}
function cgSubmit() {
  return cgRun(async () => {
    const raw = cgValue('cgCommand');
    const normalized = raw.toLowerCase().trim();
    if (!normalized) throw new Error('Type a graph query.');
    const [verb, ...rest] = normalized.split(/\\s+/);
    const term = cgCleanTerm(raw.split(/\\s+/).slice(1).join(' '));
    if (normalized === 'graph' || normalized === 'load graph') {
      return cgFetch('/api/v1/cognition/graph'+cgNamespaceQuery());
    }
    if (verb === 'count' || verb === 'stats' || normalized === 'count concepts') {
      return cgFetch('/api/v1/cognition/stats', {}, 'stats');
    }
    if (verb === 'cam') {
      return cgFetch('/api/v1/cam', {}, 'cam');
    }
    if (verb === 'associate' || verb === 'relate') {
      const [source, relationType, target] = raw.replace(/^\\S+\\s+/i, '').split('|').map(value => value.trim());
      if (!source || !relationType || !target) throw new Error('Use: associate source | relation_type | target');
      return cgFetch('/api/v1/cam/associations', {method:'POST', body:JSON.stringify({source, relationType, target})}, 'associate');
    }
    if (verb === 'seed') {
      const text = rest.join(' ');
      const offsetMatch = text.match(/\\boffset\\s+(\\d+)/i);
      const limitMatch = text.match(/\\b(\\d{1,5})\\b/);
      const parts = [];
      if (/\\bnouns?\\b/i.test(text)) parts.push('noun');
      if (/\\bverbs?\\b/i.test(text)) parts.push('verb');
      if (/\\b(adj|adjective|adjectives)\\b/i.test(text)) parts.push('adjective');
      const lexicon = /\\b(all|lexicon|wordnet|nouns?|verbs?|adj|adjectives?)\\b/i.test(text);
      if (lexicon) {
        return cgFetch('/api/v1/cognition/seed', {method:'POST', body:JSON.stringify({
          namespace:'1db',
          mode:'lexicon',
          partsOfSpeech: parts.length ? parts : ['noun','verb','adjective'],
          limit: limitMatch ? Number(limitMatch[1]) : 1000,
          offset: offsetMatch ? Number(offsetMatch[1]) : 0
        })}, 'seed');
      }
      return cgFetch('/api/v1/cognition/seed', {method:'POST', body:JSON.stringify({namespace:'1db', word:cgCleanTerm(text) || 'cold'})}, 'seed');
    }
    if (verb === 'infer' || raw.includes('=')) {
      const inputText = verb === 'infer' ? raw.replace(/^infer\\s+/i, '') : raw;
      return cgFetch('/api/v1/cognition/infer', {method:'POST', body:JSON.stringify({namespace:'1db', input:cgParseInput(inputText)})}, 'infer');
    }
    if (verb === 'find' || verb === 'lookup') {
      return cgFetch('/api/v1/cognition/query/'+encodeURIComponent(term || rest.join(' ')), {}, 'query');
    }
    if (verb === 'concept') {
      return cgFetch('/api/v1/cognition/concepts/'+encodeURIComponent(term)+cgNamespaceQuery());
    }
    if (verb === 'association') {
      return cgFetch('/api/v1/cognition/associations/'+encodeURIComponent(term)+cgNamespaceQuery());
    }
    if (verb === 'rule') {
      return cgFetch('/api/v1/cognition/rules/'+encodeURIComponent(term)+cgNamespaceQuery());
    }
    if (verb === 'session') {
      return cgFetch('/api/v1/cognition/sessions/'+encodeURIComponent(term)+cgNamespaceQuery());
    }
    if (verb === 'explain') {
      return cgFetch('/api/v1/cognition/sessions/'+encodeURIComponent(term)+'/explanation'+cgNamespaceQuery());
    }
    if (verb === 'evidence') {
      return cgFetch('/api/v1/cognition/evidence/'+encodeURIComponent(term)+cgNamespaceQuery());
    }
    if (verb === 'decompose') {
      return cgFetch('/api/v1/cognition/decompose/'+encodeURIComponent(cgCleanTerm(term || 'cold'))+cgNamespaceQuery(), {}, 'decompose');
    }
    return cgFetch('/api/v1/cognition/query/'+encodeURIComponent(cgCleanTerm(raw)), {}, 'query');
  });
}
cg('cgCommand')?.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    event.preventDefault();
    cgSubmit();
  }
});
cg('cgPreview')?.addEventListener('click', event => {
  const link = event.target.closest('[data-cg-concept]');
  if (!link) return;
  event.preventDefault();
  cg('cgCommand').value = 'concept '+link.dataset.cgConcept;
  cgSubmit();
});`;
}

function adminProjectCognitionJs() {
  return `
const lines = id => document.getElementById(id).value.split(/\\n+/).map(v => v.trim()).filter(Boolean);
const pcHeaders = () => ({'content-type':'application/json'});
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
      description: 'Private-preview API for 1db Agentic Memory. Record events, preserve versioned continuity, and retrieve authorized context.'
    },
    servers: [{ url: publicOrigin }],
    components: {
      securitySchemes: {
        tenantCredential: { type: 'http', scheme: 'bearer', description: 'Tenant application credential with cognition:read or cognition:write scope.' },
        sessionCookie: { type: 'apiKey', in: 'cookie', name: 'one_db_session' }
      }
    },
    security: [{ tenantCredential: [] }, { sessionCookie: [] }],
    paths: {
      '/api/v1/cognition/events': { post: { summary: 'Observe a communication or state-change event and optional memory.' } },
      '/api/v1/cognition/context/retrieve': { post: { summary: 'Retrieve authorized context with exact checkpoint provenance.', description: 'Requires cognition:read. Optional scopeRefs selects at most eight explicit continuity scopes and can pin expectedVersion, expectedCheckpointUid and expectedIntegrityHash. Private scopes require owner or explicit reader access. The durable packet preserves each selected checkpoint UID, version and integrity hash.' } },
      '/api/v1/cognition/context/packets/{packetUid}': { get: { summary: 'Read a previously created context packet.' } },
      '/api/v1/cognition/graph': { get: { summary: 'Read the 1DB base cognition graph root.' } },
      '/api/v1/cam': { get: { summary: 'Read the CAM manifest, layers, engines, relation types, and live counts.' } },
      '/api/v1/cam/associations': { post: { summary: 'Create or enrich a tenant-layer association with the CFT/CAM state vector.' } },
      '/api/v1/cam/observe': { post: { summary: 'Record a tenant-layer CAM observation and optional association.' } },
      '/api/v1/cam/reinforce/{associationId}': { post: { summary: 'Strengthen or weaken a tenant-layer CFT/CAM association state.' } },
      '/api/v1/cognition/cam': { get: { summary: 'Read the CAM manifest through the cognition route namespace.' } },
      '/api/v1/cognition/stats': { get: { summary: 'Read cognition graph concept and association counts.' } },
      '/api/v1/cognition/seed': { post: { summary: 'Run the base cognition graph seeder.' } },
      '/api/v1/cognition/query/{query}': { get: { summary: 'Query a concept and return enriched association links.' } },
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
      '/api/v1/cognition/continuity/{scopeType}/{scopeId}': { get: { summary: 'Read the versioned continuity head for a persona or organizational memory scope.' } },
      '/api/v1/cognition/continuity/{scopeType}/{scopeId}/checkpoints': { post: { summary: 'Append an optimistic-concurrency continuity checkpoint and advance its head.' } },
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
