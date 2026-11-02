# Portable collaboration continuity

A conversation should survive a new agent session without losing its owners,
decisions, obligations or evidence. A portable collaboration packet records that
context. It does not authorize actions or replace the conversation.

`nodevertex.collaboration-continuity@1` is a versioned, extensible JSON shape.
Unknown fields survive round trips, including unfamiliar collaboration shapes.
It records:

- Stable member and optional persona/passport identity.
- A separately expiring declaration of runtime attention and capabilities.
- The objective, responsibility, current milestone and definition of done.
- Any obligation to remain available until an owner releases the participant.
- Conversation, agreement, control and handled-event references.
- Exact artifact revisions, observations, validation methods and limitations.
- Open question, decision and authority references.

An authority reference points to a grant or decision that the executing application
must independently verify. A display name, role, room message, passport, packet or
declared capability never grants access. A stopped runtime retains its identity
and unfinished obligations; an old listening declaration does not establish
current attention.

## Persist and restore

Use the existing versioned continuity routes:

```text
GET  /api/v1/cognition/continuity/{scopeType}/{scopeId}
POST /api/v1/cognition/continuity/{scopeType}/{scopeId}/checkpoints
```

Put the packet in checkpoint `state`, provide `expectedPreviousVersion`, and retain
its `packetUid`. Optional `personaInstanceUid` and `runtimeActivationUid` must agree
with the packet when both are supplied. The service validates the recognized
packet schema and tenant before appending the checkpoint. Ordinary JSON continuity
states remain compatible.

A stale expected version receives a conflict. If a response is lost, read the head
and compare the packet identity and contents before retrying. Do not silently
replace a newer head with a previously prepared state.

The canonical AI Persona Passport can carry this same optional collaboration
context without changing its node identity. Passport composition rejects a packet
from another tenant. Passport observations and collaboration authority remain
distinct sources of evidence.

## Retrieve exact scoped context

`POST /api/v1/cognition/context/retrieve` accepts optional `scopeRefs`:

```json
{
  "projectId": "release-review",
  "query": "What remains before the owner releases this engagement?",
  "scopeRefs": [
    {
      "scopeType": "engagement",
      "scopeId": "release-review",
      "expectedVersion": 3,
      "expectedCheckpointUid": "33333333-3333-4333-8333-333333333333"
    }
  ]
}
```

Up to eight explicit scopes can be selected. An optional `expectedIntegrityHash`
can pin a SHA-256 reference as well. A changed checkpoint returns a conflict after
access has been checked. The returned `scopeContexts`, also stored in the durable
context packet, preserve each selected scope identifier, checkpoint UID, version,
integrity hash and exact state. Legacy project context continues to work and records
its version even when an older state has no checkpoint UID or integrity hash.

Scope selection does not grant permission. New scoped retrieval checks the scope
owner or explicit `readerIds` / `tenantReadable` read policy. Unknown or empty
policies fail closed for other principals. Private memory is not promoted into a
room or organization implicitly. Scoped packet readback is bound to its requesting
principal; trusted application services retain their existing managed access.

The packet is limited to 256 KiB, 64 evidence references, 64 authority references
and 100 open question or decision references. These bounds support predictable
handoffs while preserving free-form context and extension fields.

## Authenticate callers

Use a signed-in 1db session or a tenant application credential as a Bearer token
or `X-Api-Key`. Credentials are validated through the existing platform credential
registry. Read operations, including context retrieval, require `cognition:read`;
mutations require `cognition:write`. Credentials issued only by the historical
Worker preview are not credentials for the current platform runtime.

`X-NRun-Tenant-Uid`, `X-1db-Tenant-Uid`, query `tenantUid` and JSON `tenantUid` remain
tenant selectors. Every supplied selector must agree with the authenticated tenant.
Supplying a tenant identifier alone does not authenticate the caller. Browser
mutations also require the application origin. A session with an older missing
tenant binding must sign in again; there is no default-tenant fallback.

The app binds actor and access context after authentication and replaces caller
copies of these fields, including alternate casing. Trusted service clients keep
their existing token access with an explicit tenant selection. Credential values
must remain outside packets, evidence, source and conversation messages.

## Verification

`npm run test:memory-security` exercises all public cognition aliases with local
HTTP fixtures, tenant-token and service-token compatibility, cross-tenant denial,
forged context replacement, session binding and scoped packet readback. Shared
contract tests cover extension round trips, runtime expiry, reference-only authority,
explicit read policies and exact checkpoint provenance.
