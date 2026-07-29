# CFT Association Enrichment

NodeRunner CRM gathers Communication Matter: organizations, people, communications, activities, outcomes, and the relationships observed among them. 1db converts those observations into evolving Cognitive Association Model (CAM) objects.

The ownership boundary is deliberate:

- CRM owns the operational workflow and emits observations.
- 1db owns the durable association state, evidence, tenant scope, and evolution.
- The platform API mediates access to the canonical memory fabric.

## Observe an association

```http
POST /api/v1/cam/associations
X-NRun-Tenant-Uid: {tenantUid}
Content-Type: application/json
```

```json
{
  "source": "Acme Corporation",
  "sourceType": "organization",
  "relationType": "related_to",
  "target": "Jordan Lee",
  "targetType": "person",
  "strength": 0.72,
  "relationalYield": 0.48,
  "trust": 0.66,
  "confidence": 0.81,
  "evidence": 0.60,
  "persistence": 0.55,
  "contextSimilarity": 0.91,
  "decayRate": 0.01,
  "context": "crm-account-team",
  "frame": "customer-relationship",
  "evidenceSource": "NodeRunner CRM",
  "evidenceUri": "https://crm.nrun.com/organizations/{organizationId}",
  "actorId": "crm-association-observer"
}
```

The response includes the complete state vector, provenance references, observation count, last observation, and last reinforcement time. Values outside their CFT ranges are clamped before persistence.

## Apply later Communication Matter

Reinforcement is signed. A successful meeting can increase relational yield and trust; a missed commitment can reduce them while increasing evidence and observation count.

```http
POST /api/v1/cam/reinforce/{associationId}
X-NRun-Tenant-Uid: {tenantUid}
Content-Type: application/json
```

```json
{
  "strengthDelta": 0.03,
  "relationalYieldDelta": -0.12,
  "trustDelta": -0.08,
  "confidenceDelta": 0.02,
  "evidenceDelta": 0.05,
  "persistenceDelta": 0.01,
  "contextSimilarityDelta": 0.04,
  "decayRateDelta": 0,
  "evidenceSource": "NodeRunner CRM activity",
  "evidenceUri": "https://crm.nrun.com/activities/{activityId}",
  "actorId": "crm-activity-observer"
}
```

All bounded dimensions remain within their CFT ranges. Decay rate cannot become negative. The resulting state and deltas are preserved as evidence, keeping the association explainable.

## Mapping CRM matter to CAM

| CRM observation | CAM effect |
| --- | --- |
| Person belongs to organization | create or observe an association |
| Repeated communication | increase evidence; optionally reinforce strength |
| Positive outcome | increase relational yield; reinforce trust when reliability is demonstrated |
| Negative outcome | decrease relational yield; reduce trust when expectations are contradicted |
| Independent corroboration | increase evidence and confidence |
| Stable relationship over time | increase persistence |
| Context-specific interaction | set context/frame and context similarity |
| Long inactivity | decay is governed by the association's decay rate |

CRM should send observed facts and defensible deltas, not silently infer truth from communication frequency. Frequency, relational value, trust, confidence, and evidence are distinct CFT dimensions.
