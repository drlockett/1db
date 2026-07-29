# Persona-instance continuity

1db is the durable continuity plane for VertexWorks persona instances operating in VertexWorkspace.

The runtime process and nrun.cloud computer are replaceable. The persona instance is not.

## Scope hierarchy

- Persona definition
- Persona instance
- Organization
- Workspace
- Office
- Room
- Intent
- Work engagement

Memory scopes have explicit owners, parents, classification, read/write policy, retention, and promotion rules. Private persona or office memory is not copied into room or organization memory implicitly.

## Consistency model

- Continuity checkpoints are append-only.
- `onedb.ContinuityStates` remains the current head for fast retrieval.
- Every checkpoint records expected previous version, resulting version, persona instance, runtime activation, evidence, actor, and integrity hash.
- Competing runtimes use optimistic concurrency. A stale runtime receives a conflict rather than overwriting current persona continuity.
- Context packets record the exact scope and checkpoint versions used for a turn.

## Platform routes

- `GET /api/v1/cognition/continuity/{scopeType}/{scopeId}` reads the current head.
- `POST /api/v1/cognition/continuity/{scopeType}/{scopeId}/checkpoints` appends a checkpoint.

The checkpoint request includes `expectedPreviousVersion`. Version zero creates a new
head; any stale version is rejected so two runtimes cannot silently fork the same
persona instance.

## Runtime rule

A VertexWorks worker must restore and acknowledge the persona-instance continuity head before accepting work. If continuity cannot be restored, the persona reports `waiting_for_memory`; it does not silently start as a stateless impersonation.

## Governing intent

PromptCapsule `7d235445-0c88-4bc1-8a14-f0649adaf5cb`, version 1.
