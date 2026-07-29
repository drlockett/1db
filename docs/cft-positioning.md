# 1DB CFT Positioning

## 1. Positioning Statement

1DB is the semantic persistence layer for a communication fabric, converting communication events into durable cognition across memory, identity, relationships, trust, context, time, governance, and simulation.

North star: Node Vertex lets everything communicate. 1DB lets the fabric remember what communication means.

## 2. Homepage Hero

Headline: The continuity layer for the communication fabric.

Subheadline: 1DB turns communication events into durable cognition so agents, people, projects, files, workflows, and systems can act with situated memory instead of isolated recall.

Primary CTA: Explore the API

Secondary CTA: Read the Architecture

Supporting value bullets:

- Observe communication and state changes with provenance, scope, and actor context.
- Preserve identity, relationships, trust, causality, and change across time.
- Compile task-ready context packets for agents at the moment of action.

## 3. What Is 1DB?

1DB is cognitive infrastructure for persistent agency. It is not merely a place to store memories. It is a semantic persistence layer that observes communication events, converts them into durable cognitive state, and compiles relevant context for authorized agents and systems.

In CFT terms, communication is the primitive. Memory is the residue of communication. Identity is the stable pattern that emerges across communication over time. Relationships are weighted communication channels. Trust is the fabric's confidence in a pattern. Context is the local state of the fabric at the moment of action. Simulation is communication projected forward before it happens.

1DB makes those primitives operational. It preserves what happened, who or what was involved, why it mattered, how it changed existing state, which permissions apply, what contradictions remain open, and what an agent should know before acting.

## 4. Why 1DB?

Ordinary memory is usually static. It stores claims without enough provenance, scope, decay, contradiction handling, or relationship context.

Vector search finds similarity. It does not know whether a memory is still valid, which actor can use it, whether a newer event contradicted it, or how it should affect identity and trust.

Chat history preserves transcripts. It does not convert communication into structured cognition that can evolve, reinforce, decay, and participate in future action.

RAG retrieves documents. It does not provide continuity across actors, projects, permissions, temporal causality, and live communication channels.

1DB exists because agents need more than recall. They need situated continuity: scoped memory with provenance, identity with drift control, relationships with meaning, trust with evidence, context with contradictions, and time as semantic evolution.

## 5. CFT Capability Map

| Primitive | 1DB Capability |
| --- | --- |
| Communication events | Observe messages, actions, tool calls, file changes, workflow transitions, decisions, and outcomes as first-class events with provenance. |
| Memory | Convert meaningful communication or observed state into durable, scoped, provenance-aware memory. |
| Identity | Reinforce continuity patterns for people, agents, organizations, services, projects, files, and workflows. |
| Relationships | Link entities through weighted relevance, trust, permission, dependency, authorship, and meaning. |
| Context | Compile local state packets for a specific actor, goal, task, channel, and permission scope. |
| Trust | Evaluate claims through source quality, repetition, contradiction, relationship, freshness, and provenance. |
| Time | Track sequence, causality, decay, reinforcement, contradiction, correction, and evolution. |
| Simulation | Project possible communication or action futures from current memory, identity, relationships, goals, and constraints. |
| Governance / permissions | Apply tenant boundaries, consent, provenance, recall scope, actor rights, retention policy, and auditability. |

## 6. Messaging Translation

| Old language | CFT-native language |
| --- | --- |
| AI memory database | Semantic persistence layer for the communication fabric |
| Give AI memory | Give the fabric continuity |
| Store and retrieve memories | Observe communication, persist cognition, compile context |
| AI + Memory = Persona | Communication + Memory + Time + Identity = Persistent Agency |
| Chat history for agents | Provenance-aware cognitive state across events, actors, and time |
| Vector memory | Multi-layer cognition with memory, identity, relationships, trust, and time |
| Persona profile | Identity continuity pattern across behavior, communication, relationships, and drift |
| Similarity search | Scoped, trust-aware recall and context compilation |
| Knowledge base for agents | Living cognition graph for agent action |
| Static facts | Evolving memories with decay, reinforcement, contradiction, and correction |

## 7. Technical Architecture

1. Node Vertex: addressability, transport, routing, live coordination, governance surfaces, and programmable communication endpoints.
2. 1DB Event Layer: observed communication, actions, state changes, outcomes, tool calls, workflow events, and provenance envelopes.
3. 1DB Cognition Graph: entities, memories, relationships, concepts, identity signals, trust signals, and evidence links.
4. 1DB Temporal Layer: sequence, causality, decay, reinforcement, contradiction, correction, and evolution.
5. 1DB Context Compiler: task-ready fabric state for agents, scoped by actor, goal, channel, tenant, and permission.
6. Agent / Persona Runtime: action, reasoning, simulation, and communication through Node Vertex endpoints.

Assumption: Current 1DB cognition routes already support event ingest, context retrieval, context packet readback, backend discovery, route planning, Project Cognition, memory explanation, correction, and deprecation. Advanced identity, trust, temporal causality, and simulation APIs should be labeled as near-term or future until implementation is verified.

## 8. Proposed Capability / API Vocabulary

Use verbs that describe cognitive operations:

- `observe`: record a communication event or state change.
- `remember`: convert an observation into durable memory.
- `relate`: connect entities through meaning, permission, trust, dependency, or relevance.
- `reinforce`: strengthen a memory, identity pattern, or relationship through repetition or evidence.
- `compile`: assemble task-ready context for an actor and situation.
- `evaluate`: score a claim, memory, or identity signal for trust and current validity.
- `reconstruct`: rebuild a temporal narrative for an entity, project, or decision.
- `simulate`: project possible communication or action futures.

Example primitives:

```js
db.observe(event)
db.memory.remember(observation)
db.identity.reinforce(actor, signal)
db.relationship.link(a, b, meaning)
db.context.compile(situation)
db.trust.evaluate(claim)
db.temporal.reconstruct(entity)
db.simulation.project(goal)
```

## 9. Proposed Docs Structure

Top-level pages:

- Overview: 1DB as semantic persistence for the communication fabric.
- Core Concepts: communication, memory, identity, relationships, context, trust, time, simulation, governance.
- Architecture: Node Vertex + 1DB layers.
- Quickstart: observe an event, remember an observation, compile context.
- API Reference: event ingest, context retrieval, context packets, memory operations, Project Cognition.
- Project Cognition: persistent execution memory for repositories, teams, tenants, environments, and workflows.
- Governance and Scope: tenants, permissions, consent, retention, audit, recall boundaries.
- Temporal Cognition: decay, reinforcement, contradiction, correction, causality.
- Trust Model: provenance, source quality, freshness, contradiction, relationship confidence.
- Simulation: future projected communication and action paths.
- Integration Guides: agents, Node Vertex endpoints, project/workspace tools, workflow systems, enterprise systems.
- Operator Notes: deployment, storage backends, health checks, environment configuration.

Developer guides:

- Observe your first communication event.
- Compile context for an agent task.
- Explain, correct, or deprecate a memory.
- Model project continuity.
- Link entities and relationships.
- Handle contradictions and stale memory.
- Design permission-scoped recall.
- Build a Node Vertex + 1DB agent workflow.

## 10. Roadmap

Already-shippable / core capabilities, based on current repo and docs:

- Event ingest for cognitive events.
- Context retrieval and durable context packet readback.
- Project Cognition for persistent execution memory.
- Memory explanation, correction, and deprecation endpoints.
- Backend discovery and route planning.
- Cognition graph querying, concept lookup, association creation, observation, and reinforcement.
- CFT/CAM association state vectors covering strength, relational yield, trust, confidence, evidence, persistence, context similarity, and decay.
- Signed association reinforcement so new Communication Matter can strengthen or weaken cognitive state.
- Reinforcement-aware retrieval and contradiction reporting hooks.
- Tenant-scoped access patterns.

Near-term CFT-aligned enhancements:

- Rename public concepts around `observe`, `remember`, `relate`, `compile`, and `reconstruct`.
- Add first-class provenance envelopes to all observed events.
- Add explicit recall scope to context compilation.
- Expand relationship semantics beyond the implemented CAM state vector into permission propagation and policy-aware traversal.
- Add identity reinforcement and drift reports.
- Add trust evaluation APIs for claims and memories.
- Add temporal reconstruction for entities, projects, and decisions.
- Add contradiction-aware context compilation and stale-memory warnings.

Future / advanced capabilities:

- Simulation projection APIs for goals, actions, and communication futures.
- Cross-channel identity continuity across Node Vertex endpoints.
- Policy-driven decay and reinforcement engines.
- Multi-agent shared context negotiation.
- Trust propagation across relationship paths.
- Causal graph analysis and counterfactual reconstruction.
- Consent-aware memory portability across tenants and projects.

## 11. Trust And Governance

No memory without provenance. Every durable memory should trace back to observed communication, state, actor, source, time, and evidence.

No recall without scope. Context compilation must respect tenant boundaries, actor permissions, task purpose, consent, and channel constraints.

No identity without drift control. Identity is a continuity pattern, not a static profile. 1DB should detect reinforcement, divergence, contradiction, and behavior change.

No context without contradiction handling. Compiled context should expose relevant unresolved contradictions, stale assumptions, deprecated memories, and low-confidence claims.

No intelligence without decay. Some memories lose relevance. Decay, reinforcement, freshness, and correction are core cognitive operations, not cleanup jobs.

Permissions, tenant boundaries, and consent are part of cognition. A memory that cannot be recalled under the current actor, tenant, task, or consent scope should not participate in context.

## 12. Investor / Customer Narrative

The Agent Internet will not be made of isolated chatbots. It will be made of agents, people, services, files, workflows, devices, and organizations communicating continuously through programmable endpoints. Node Vertex gives those entities addressability, routing, transport, and live coordination.

But communication alone is not enough. Without continuity, agents reset. Teams repeat themselves. Identity drifts. Trust becomes implicit. Context is rebuilt by hand. Systems cannot explain what changed or why.

1DB gives the Agent Internet its semantic persistence layer. It turns communication into durable cognition: memory, identity, relationships, trust, context, causality, governance, and simulation. That makes agents more reliable, workflows more coherent, and organizations less dependent on fragile prompt stuffing and disconnected retrieval systems.

## 13. Tagline Options

1. The continuity layer for the communication fabric.
2. Memory is residue. 1DB makes it operational.
3. Turn communication into durable cognition.
4. Semantic persistence for persistent agency.
5. Context that remembers why it matters.
6. The cognition layer for the Agent Internet.
7. Where communication becomes continuity.
8. Not agent memory. Fabric memory.
9. Give the fabric a memory of meaning.
10. Node Vertex lets everything communicate. 1DB lets it remember what communication means.

## 14. Terms

Use:

- Communication fabric
- Semantic persistence
- Cognitive infrastructure
- Durable cognition
- Persistent agency
- Situated memory
- Provenance-aware memory
- Scoped recall
- Context compiler
- Cognition graph
- Identity continuity
- Relationship paths
- Trust evaluation
- Temporal causality
- Decay, reinforcement, contradiction, correction
- Agent Internet

Avoid or qualify:

- AI memory database
- Chat history
- Simple memory
- Vector memory
- RAG database
- Persona profile
- Static facts
- Session storage
- Long-term memory as the whole product
- Embeddings as the primary value proposition
- Generic knowledge base
- CRM notes for agents
- Brain for AI, unless used informally and explained technically
