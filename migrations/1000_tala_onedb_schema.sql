SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = N'onedb')
    EXEC(N'CREATE SCHEMA onedb');
GO

IF NOT EXISTS (SELECT 1 FROM client.Applications WHERE Code = N'1db')
BEGIN
    SET IDENTITY_INSERT client.Applications ON;

    INSERT INTO client.Applications
        (Id, Uid, Name, Code, BaseUrl, Description, IsActive, CreatedUtc, ModifiedUtc, TenantId)
    VALUES
        (20005, NEWID(), N'1db', N'1db', N'https://1db.io',
         N'Cognitive memory database for persistent intelligence, continuity, relationships, and context reconstruction.',
         1, SYSUTCDATETIME(), NULL, NULL);

    SET IDENTITY_INSERT client.Applications OFF;
END
ELSE
BEGIN
    UPDATE client.Applications
       SET Name = N'1db',
           BaseUrl = N'https://1db.io',
           Description = N'Cognitive memory database for persistent intelligence, continuity, relationships, and context reconstruction.',
           IsActive = 1,
           ModifiedUtc = SYSUTCDATETIME()
     WHERE Code = N'1db';
END;
GO

IF OBJECT_ID(N'onedb.CognitiveEvents', N'U') IS NULL
BEGIN
    CREATE TABLE onedb.CognitiveEvents
    (
        Id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_OneDb_CognitiveEvents PRIMARY KEY,
        EventUid UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_OneDb_CognitiveEvents_EventUid DEFAULT NEWID(),
        TenantId BIGINT NOT NULL,
        ApplicationId BIGINT NOT NULL,
        EventType NVARCHAR(96) NOT NULL,
        ActorId NVARCHAR(256) NOT NULL,
        SubjectId NVARCHAR(256) NULL,
        SessionId NVARCHAR(256) NULL,
        ConversationId NVARCHAR(256) NULL,
        ProjectId NVARCHAR(256) NULL,
        WorkflowId NVARCHAR(256) NULL,
        SourceKind NVARCHAR(64) NOT NULL CONSTRAINT DF_OneDb_CognitiveEvents_SourceKind DEFAULT N'agent',
        SourceId NVARCHAR(256) NULL,
        SourceConfidence DECIMAL(9,6) NULL,
        PayloadJson NVARCHAR(MAX) NOT NULL,
        VisibilityJson NVARCHAR(MAX) NOT NULL,
        LineageJson NVARCHAR(MAX) NULL,
        AuditJson NVARCHAR(MAX) NOT NULL,
        CreatedUtc DATETIME2(3) NOT NULL CONSTRAINT DF_OneDb_CognitiveEvents_CreatedUtc DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_OneDb_CognitiveEvents_Tenants FOREIGN KEY (TenantId) REFERENCES security.Tenants(Id),
        CONSTRAINT FK_OneDb_CognitiveEvents_Applications FOREIGN KEY (ApplicationId) REFERENCES client.Applications(Id)
    );
END;
GO

;WITH SeedTenants AS
(
    SELECT CAST(1 AS BIGINT) AS TenantId
    WHERE EXISTS (SELECT 1 FROM security.Tenants WHERE Id = 1)
)
MERGE client.TenantApplications AS target
USING
(
    SELECT st.TenantId, a.Id AS ApplicationId
    FROM SeedTenants st
    CROSS JOIN client.Applications a
    WHERE a.Code = N'1db'
) AS source
   ON target.TenantId = source.TenantId
  AND target.ApplicationId = source.ApplicationId
WHEN MATCHED THEN
    UPDATE SET
        IsEnabled = 1,
        RemovedUtc = NULL,
        DisabledUtc = NULL,
        UpdatedUtc = SYSUTCDATETIME(),
        Source = COALESCE(target.Source, N'1db bootstrap registration')
WHEN NOT MATCHED THEN
    INSERT (TenantId, ApplicationId, IsEnabled, Source, CreatedUtc)
    VALUES (source.TenantId, source.ApplicationId, 1, N'1db bootstrap registration', SYSUTCDATETIME());
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'onedb.CognitiveEvents') AND name = N'UX_OneDb_CognitiveEvents_EventUid')
    CREATE UNIQUE INDEX UX_OneDb_CognitiveEvents_EventUid ON onedb.CognitiveEvents(EventUid);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'onedb.CognitiveEvents') AND name = N'IX_OneDb_CognitiveEvents_Project')
    CREATE INDEX IX_OneDb_CognitiveEvents_Project ON onedb.CognitiveEvents(TenantId, ProjectId, CreatedUtc DESC);
GO

IF OBJECT_ID(N'onedb.MemoryAtoms', N'U') IS NULL
BEGIN
    CREATE TABLE onedb.MemoryAtoms
    (
        Id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_OneDb_MemoryAtoms PRIMARY KEY,
        MemoryUid UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_OneDb_MemoryAtoms_MemoryUid DEFAULT NEWID(),
        TenantId BIGINT NOT NULL,
        ApplicationId BIGINT NOT NULL,
        OwnerId NVARCHAR(256) NULL,
        ProjectId NVARCHAR(256) NULL,
        ConversationId NVARCHAR(256) NULL,
        Kind NVARCHAR(64) NOT NULL,
        CanonicalText NVARCHAR(MAX) NOT NULL,
        RawText NVARCHAR(MAX) NULL,
        Confidence DECIMAL(9,6) NOT NULL CONSTRAINT DF_OneDb_MemoryAtoms_Confidence DEFAULT 0.5,
        Salience DECIMAL(9,6) NOT NULL CONSTRAINT DF_OneDb_MemoryAtoms_Salience DEFAULT 0.5,
        UtilityScore DECIMAL(9,6) NULL,
        EmotionalWeight DECIMAL(9,6) NULL,
        Status NVARCHAR(32) NOT NULL CONSTRAINT DF_OneDb_MemoryAtoms_Status DEFAULT N'active',
        SupersedesJson NVARCHAR(MAX) NULL,
        SupersededByJson NVARCHAR(MAX) NULL,
        TemporalJson NVARCHAR(MAX) NOT NULL,
        AccessJson NVARCHAR(MAX) NOT NULL,
        MetadataJson NVARCHAR(MAX) NULL,
        ReinforcementCount INT NOT NULL CONSTRAINT DF_OneDb_MemoryAtoms_ReinforcementCount DEFAULT 0,
        LastReinforcedUtc DATETIME2(3) NULL,
        StaleAfterUtc DATETIME2(3) NULL,
        QualityFlagsJson NVARCHAR(MAX) NOT NULL CONSTRAINT DF_OneDb_MemoryAtoms_QualityFlags DEFAULT N'[]',
        DuplicateOfMemoryUid UNIQUEIDENTIFIER NULL,
        CreatedUtc DATETIME2(3) NOT NULL CONSTRAINT DF_OneDb_MemoryAtoms_CreatedUtc DEFAULT SYSUTCDATETIME(),
        UpdatedUtc DATETIME2(3) NOT NULL CONSTRAINT DF_OneDb_MemoryAtoms_UpdatedUtc DEFAULT SYSUTCDATETIME(),
        RemovedUtc DATETIME2(3) NULL,
        CONSTRAINT FK_OneDb_MemoryAtoms_Tenants FOREIGN KEY (TenantId) REFERENCES security.Tenants(Id),
        CONSTRAINT FK_OneDb_MemoryAtoms_Applications FOREIGN KEY (ApplicationId) REFERENCES client.Applications(Id)
    );
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'onedb.MemoryAtoms') AND name = N'UX_OneDb_MemoryAtoms_MemoryUid')
    CREATE UNIQUE INDEX UX_OneDb_MemoryAtoms_MemoryUid ON onedb.MemoryAtoms(MemoryUid);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'onedb.MemoryAtoms') AND name = N'IX_OneDb_MemoryAtoms_Project')
    CREATE INDEX IX_OneDb_MemoryAtoms_Project ON onedb.MemoryAtoms(TenantId, ProjectId, Kind, Status, UpdatedUtc DESC) WHERE RemovedUtc IS NULL;
GO

IF OBJECT_ID(N'onedb.MemoryEvidence', N'U') IS NULL
BEGIN
    CREATE TABLE onedb.MemoryEvidence
    (
        Id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_OneDb_MemoryEvidence PRIMARY KEY,
        EvidenceUid UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_OneDb_MemoryEvidence_EvidenceUid DEFAULT NEWID(),
        TenantId BIGINT NOT NULL,
        MemoryUid UNIQUEIDENTIFIER NOT NULL,
        EventUid UNIQUEIDENTIFIER NOT NULL,
        Excerpt NVARCHAR(2000) NULL,
        EvidenceRole NVARCHAR(64) NOT NULL CONSTRAINT DF_OneDb_MemoryEvidence_EvidenceRole DEFAULT N'source',
        Confidence DECIMAL(9,6) NOT NULL CONSTRAINT DF_OneDb_MemoryEvidence_Confidence DEFAULT 1,
        CreatedUtc DATETIME2(3) NOT NULL CONSTRAINT DF_OneDb_MemoryEvidence_CreatedUtc DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_OneDb_MemoryEvidence_Tenants FOREIGN KEY (TenantId) REFERENCES security.Tenants(Id),
        CONSTRAINT FK_OneDb_MemoryEvidence_Memory FOREIGN KEY (MemoryUid) REFERENCES onedb.MemoryAtoms(MemoryUid),
        CONSTRAINT FK_OneDb_MemoryEvidence_Event FOREIGN KEY (EventUid) REFERENCES onedb.CognitiveEvents(EventUid)
    );
END;
GO

IF OBJECT_ID(N'onedb.ContinuityStates', N'U') IS NULL
BEGIN
    CREATE TABLE onedb.ContinuityStates
    (
        Id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_OneDb_ContinuityStates PRIMARY KEY,
        StateUid UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_OneDb_ContinuityStates_StateUid DEFAULT NEWID(),
        TenantId BIGINT NOT NULL,
        ScopeType NVARCHAR(64) NOT NULL,
        ScopeId NVARCHAR(256) NOT NULL,
        StateJson NVARCHAR(MAX) NOT NULL,
        Summary NVARCHAR(MAX) NULL,
        Version INT NOT NULL CONSTRAINT DF_OneDb_ContinuityStates_Version DEFAULT 1,
        CreatedUtc DATETIME2(3) NOT NULL CONSTRAINT DF_OneDb_ContinuityStates_CreatedUtc DEFAULT SYSUTCDATETIME(),
        UpdatedUtc DATETIME2(3) NOT NULL CONSTRAINT DF_OneDb_ContinuityStates_UpdatedUtc DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_OneDb_ContinuityStates_Tenants FOREIGN KEY (TenantId) REFERENCES security.Tenants(Id)
    );
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'onedb.ContinuityStates') AND name = N'UX_OneDb_ContinuityStates_Scope')
    CREATE UNIQUE INDEX UX_OneDb_ContinuityStates_Scope ON onedb.ContinuityStates(TenantId, ScopeType, ScopeId);
GO

IF OBJECT_ID(N'onedb.ContextPackets', N'U') IS NULL
BEGIN
    CREATE TABLE onedb.ContextPackets
    (
        Id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_OneDb_ContextPackets PRIMARY KEY,
        PacketUid UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_OneDb_ContextPackets_PacketUid DEFAULT NEWID(),
        TenantId BIGINT NOT NULL,
        ActorId NVARCHAR(256) NOT NULL,
        ProjectId NVARCHAR(256) NULL,
        QueryText NVARCHAR(2000) NULL,
        Intent NVARCHAR(128) NULL,
        PacketJson NVARCHAR(MAX) NOT NULL,
        TokenEstimate INT NOT NULL CONSTRAINT DF_OneDb_ContextPackets_TokenEstimate DEFAULT 0,
        CreatedUtc DATETIME2(3) NOT NULL CONSTRAINT DF_OneDb_ContextPackets_CreatedUtc DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_OneDb_ContextPackets_Tenants FOREIGN KEY (TenantId) REFERENCES security.Tenants(Id)
    );
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'onedb.ContextPackets') AND name = N'UX_OneDb_ContextPackets_PacketUid')
    CREATE UNIQUE INDEX UX_OneDb_ContextPackets_PacketUid ON onedb.ContextPackets(PacketUid);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'onedb.ContextPackets') AND name = N'IX_OneDb_ContextPackets_Tenant_Project')
    CREATE INDEX IX_OneDb_ContextPackets_Tenant_Project ON onedb.ContextPackets(TenantId, ProjectId, CreatedUtc DESC);
GO

IF OBJECT_ID(N'onedb.CognitionGraphs', N'U') IS NULL
BEGIN
    CREATE TABLE onedb.CognitionGraphs
    (
        Id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_OneDb_CognitionGraphs PRIMARY KEY,
        GraphUid UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_OneDb_CognitionGraphs_GraphUid DEFAULT NEWID(),
        GraphId NVARCHAR(256) NOT NULL,
        Namespace NVARCHAR(128) NOT NULL,
        RootVertexPath NVARCHAR(512) NOT NULL,
        RootUrl NVARCHAR(1000) NOT NULL,
        Description NVARCHAR(MAX) NOT NULL,
        CreatedBy NVARCHAR(256) NOT NULL,
        Version INT NOT NULL CONSTRAINT DF_OneDb_CognitionGraphs_Version DEFAULT 1,
        CreatedUtc DATETIME2(3) NOT NULL CONSTRAINT DF_OneDb_CognitionGraphs_CreatedUtc DEFAULT SYSUTCDATETIME(),
        UpdatedUtc DATETIME2(3) NOT NULL CONSTRAINT DF_OneDb_CognitionGraphs_UpdatedUtc DEFAULT SYSUTCDATETIME()
    );
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'onedb.CognitionGraphs') AND name = N'UX_OneDb_CognitionGraphs_GraphId')
    CREATE UNIQUE INDEX UX_OneDb_CognitionGraphs_GraphId ON onedb.CognitionGraphs(GraphId);
GO

IF OBJECT_ID(N'onedb.CognitionConcepts', N'U') IS NULL
BEGIN
    CREATE TABLE onedb.CognitionConcepts
    (
        Id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_OneDb_CognitionConcepts PRIMARY KEY,
        ConceptUid UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_OneDb_CognitionConcepts_ConceptUid DEFAULT NEWID(),
        TenantId BIGINT NULL,
        ApplicationId BIGINT NOT NULL,
        Namespace NVARCHAR(128) NOT NULL,
        BaseGraphId NVARCHAR(256) NOT NULL,
        VertexPath NVARCHAR(512) NOT NULL,
        CanonicalLabel NVARCHAR(256) NOT NULL,
        Slug NVARCHAR(256) NOT NULL,
        AliasesJson NVARCHAR(MAX) NOT NULL CONSTRAINT DF_OneDb_CognitionConcepts_Aliases DEFAULT N'[]',
        PartOfSpeech NVARCHAR(64) NOT NULL,
        ConceptType NVARCHAR(96) NOT NULL,
        Definition NVARCHAR(MAX) NOT NULL,
        ShortDefinition NVARCHAR(1000) NOT NULL,
        FramesJson NVARCHAR(MAX) NOT NULL CONSTRAINT DF_OneDb_CognitionConcepts_Frames DEFAULT N'[]',
        PrimitiveStatus NVARCHAR(64) NOT NULL CONSTRAINT DF_OneDb_CognitionConcepts_PrimitiveStatus DEFAULT N'refinable',
        DecompositionStatus NVARCHAR(64) NOT NULL CONSTRAINT DF_OneDb_CognitionConcepts_DecompositionStatus DEFAULT N'pending',
        SeedStatus NVARCHAR(64) NOT NULL CONSTRAINT DF_OneDb_CognitionConcepts_SeedStatus DEFAULT N'seeded',
        Confidence DECIMAL(9,6) NOT NULL CONSTRAINT DF_OneDb_CognitionConcepts_Confidence DEFAULT 0.840000,
        SourceRefsJson NVARCHAR(MAX) NOT NULL CONSTRAINT DF_OneDb_CognitionConcepts_SourceRefs DEFAULT N'[]',
        CreatedBy NVARCHAR(256) NOT NULL,
        CreatedUtc DATETIME2(3) NOT NULL CONSTRAINT DF_OneDb_CognitionConcepts_CreatedUtc DEFAULT SYSUTCDATETIME(),
        UpdatedUtc DATETIME2(3) NOT NULL CONSTRAINT DF_OneDb_CognitionConcepts_UpdatedUtc DEFAULT SYSUTCDATETIME(),
        Version INT NOT NULL CONSTRAINT DF_OneDb_CognitionConcepts_Version DEFAULT 1,
        Nid AS (CONVERT(NVARCHAR(400), N'nid:' + Namespace + N':cognition:concept:' + Slug)) PERSISTED,
        Nrn AS (CONVERT(NVARCHAR(500), N'nrn:nodevertex:' + Namespace + N':cognition:concept:' + Slug)) PERSISTED,
        Url AS (CONVERT(NVARCHAR(1000), N'https://nodevertex.com' + VertexPath)) PERSISTED,
        CONSTRAINT FK_OneDb_CognitionConcepts_Tenants FOREIGN KEY (TenantId) REFERENCES security.Tenants(Id),
        CONSTRAINT FK_OneDb_CognitionConcepts_Applications FOREIGN KEY (ApplicationId) REFERENCES client.Applications(Id)
    );
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'onedb.CognitionConcepts') AND name = N'UX_OneDb_CognitionConcepts_Uid')
    CREATE UNIQUE INDEX UX_OneDb_CognitionConcepts_Uid ON onedb.CognitionConcepts(ConceptUid);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'onedb.CognitionConcepts') AND name = N'UX_OneDb_CognitionConcepts_BaseSlug')
    CREATE UNIQUE INDEX UX_OneDb_CognitionConcepts_BaseSlug ON onedb.CognitionConcepts(Namespace, BaseGraphId, Slug) WHERE TenantId IS NULL;
GO

IF OBJECT_ID(N'onedb.CognitionAssociations', N'U') IS NULL
BEGIN
    CREATE TABLE onedb.CognitionAssociations
    (
        Id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_OneDb_CognitionAssociations PRIMARY KEY,
        AssociationUid UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_OneDb_CognitionAssociations_AssociationUid DEFAULT NEWID(),
        TenantId BIGINT NULL,
        ApplicationId BIGINT NOT NULL,
        Namespace NVARCHAR(128) NOT NULL,
        BaseGraphId NVARCHAR(256) NOT NULL,
        VertexPath NVARCHAR(512) NOT NULL,
        Slug NVARCHAR(512) NOT NULL,
        AssociationType NVARCHAR(96) NOT NULL,
        SourceConceptIdsJson NVARCHAR(MAX) NOT NULL CONSTRAINT DF_OneDb_CognitionAssociations_SourceIds DEFAULT N'[]',
        SourceConceptSlugsJson NVARCHAR(MAX) NOT NULL CONSTRAINT DF_OneDb_CognitionAssociations_SourceSlugs DEFAULT N'[]',
        TargetConceptIdsJson NVARCHAR(MAX) NOT NULL CONSTRAINT DF_OneDb_CognitionAssociations_TargetIds DEFAULT N'[]',
        TargetConceptSlugsJson NVARCHAR(MAX) NOT NULL CONSTRAINT DF_OneDb_CognitionAssociations_TargetSlugs DEFAULT N'[]',
        RelationLabel NVARCHAR(128) NOT NULL,
        Strength DECIMAL(9,6) NOT NULL CONSTRAINT DF_OneDb_CognitionAssociations_Strength DEFAULT 0.500000,
        RelationalYield DECIMAL(9,6) NOT NULL CONSTRAINT DF_OneDb_CognitionAssociations_RelationalYield DEFAULT 0.000000,
        Trust DECIMAL(9,6) NOT NULL CONSTRAINT DF_OneDb_CognitionAssociations_Trust DEFAULT 0.500000,
        Confidence DECIMAL(9,6) NOT NULL CONSTRAINT DF_OneDb_CognitionAssociations_Confidence DEFAULT 0.500000,
        EvidenceScore DECIMAL(9,6) NOT NULL CONSTRAINT DF_OneDb_CognitionAssociations_EvidenceScore DEFAULT 0.500000,
        Persistence DECIMAL(9,6) NOT NULL CONSTRAINT DF_OneDb_CognitionAssociations_Persistence DEFAULT 0.500000,
        ContextSimilarity DECIMAL(9,6) NOT NULL CONSTRAINT DF_OneDb_CognitionAssociations_ContextSimilarity DEFAULT 0.500000,
        DecayRate DECIMAL(12,9) NOT NULL CONSTRAINT DF_OneDb_CognitionAssociations_DecayRate DEFAULT 0.000000000,
        Context NVARCHAR(128) NULL,
        Frame NVARCHAR(128) NULL,
        EvidenceRefsJson NVARCHAR(MAX) NOT NULL CONSTRAINT DF_OneDb_CognitionAssociations_EvidenceRefs DEFAULT N'[]',
        Directionality NVARCHAR(64) NOT NULL CONSTRAINT DF_OneDb_CognitionAssociations_Directionality DEFAULT N'directed',
        Reversibility BIT NOT NULL CONSTRAINT DF_OneDb_CognitionAssociations_Reversibility DEFAULT 0,
        ObservedCount INT NOT NULL CONSTRAINT DF_OneDb_CognitionAssociations_ObservedCount DEFAULT 1,
        LastObservedUtc DATETIME2(3) NOT NULL CONSTRAINT DF_OneDb_CognitionAssociations_LastObserved DEFAULT SYSUTCDATETIME(),
        LastReinforcedUtc DATETIME2(3) NULL,
        RuleJson NVARCHAR(MAX) NULL,
        CreatedBy NVARCHAR(256) NOT NULL,
        CreatedUtc DATETIME2(3) NOT NULL CONSTRAINT DF_OneDb_CognitionAssociations_CreatedUtc DEFAULT SYSUTCDATETIME(),
        UpdatedUtc DATETIME2(3) NOT NULL CONSTRAINT DF_OneDb_CognitionAssociations_UpdatedUtc DEFAULT SYSUTCDATETIME(),
        Version INT NOT NULL CONSTRAINT DF_OneDb_CognitionAssociations_Version DEFAULT 1,
        Nid AS (CONVERT(NVARCHAR(700), N'nid:' + Namespace + N':cognition:association:' + Slug)) PERSISTED,
        Nrn AS (CONVERT(NVARCHAR(800), N'nrn:nodevertex:' + Namespace + N':cognition:association:' + Slug)) PERSISTED,
        Url AS (CONVERT(NVARCHAR(1000), N'https://nodevertex.com' + VertexPath)) PERSISTED,
        CONSTRAINT FK_OneDb_CognitionAssociations_Tenants FOREIGN KEY (TenantId) REFERENCES security.Tenants(Id),
        CONSTRAINT FK_OneDb_CognitionAssociations_Applications FOREIGN KEY (ApplicationId) REFERENCES client.Applications(Id)
    );
END;
GO

IF COL_LENGTH(N'onedb.CognitionAssociations', N'RelationalYield') IS NULL
    ALTER TABLE onedb.CognitionAssociations ADD RelationalYield DECIMAL(9,6) NOT NULL CONSTRAINT DF_OneDb_CognitionAssociations_RelationalYield DEFAULT 0.000000;
GO

IF COL_LENGTH(N'onedb.CognitionAssociations', N'Trust') IS NULL
    ALTER TABLE onedb.CognitionAssociations ADD Trust DECIMAL(9,6) NOT NULL CONSTRAINT DF_OneDb_CognitionAssociations_Trust DEFAULT 0.500000;
GO

IF COL_LENGTH(N'onedb.CognitionAssociations', N'EvidenceScore') IS NULL
    ALTER TABLE onedb.CognitionAssociations ADD EvidenceScore DECIMAL(9,6) NOT NULL CONSTRAINT DF_OneDb_CognitionAssociations_EvidenceScore DEFAULT 0.500000;
GO

IF COL_LENGTH(N'onedb.CognitionAssociations', N'Persistence') IS NULL
    ALTER TABLE onedb.CognitionAssociations ADD Persistence DECIMAL(9,6) NOT NULL CONSTRAINT DF_OneDb_CognitionAssociations_Persistence DEFAULT 0.500000;
GO

IF COL_LENGTH(N'onedb.CognitionAssociations', N'ContextSimilarity') IS NULL
    ALTER TABLE onedb.CognitionAssociations ADD ContextSimilarity DECIMAL(9,6) NOT NULL CONSTRAINT DF_OneDb_CognitionAssociations_ContextSimilarity DEFAULT 0.500000;
GO

IF COL_LENGTH(N'onedb.CognitionAssociations', N'DecayRate') IS NULL
    ALTER TABLE onedb.CognitionAssociations ADD DecayRate DECIMAL(12,9) NOT NULL CONSTRAINT DF_OneDb_CognitionAssociations_DecayRate DEFAULT 0.000000000;
GO

IF COL_LENGTH(N'onedb.CognitionAssociations', N'LastReinforcedUtc') IS NULL
    ALTER TABLE onedb.CognitionAssociations ADD LastReinforcedUtc DATETIME2(3) NULL;
GO

IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = N'CK_OneDb_CognitionAssociations_RelationalYield')
    ALTER TABLE onedb.CognitionAssociations ADD CONSTRAINT CK_OneDb_CognitionAssociations_RelationalYield CHECK (RelationalYield BETWEEN -1 AND 1);
GO

IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = N'CK_OneDb_CognitionAssociations_CftUnitScores')
    ALTER TABLE onedb.CognitionAssociations ADD CONSTRAINT CK_OneDb_CognitionAssociations_CftUnitScores
        CHECK (Trust BETWEEN 0 AND 1 AND EvidenceScore BETWEEN 0 AND 1 AND Persistence BETWEEN 0 AND 1 AND ContextSimilarity BETWEEN 0 AND 1);
GO

IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = N'CK_OneDb_CognitionAssociations_DecayRate')
    ALTER TABLE onedb.CognitionAssociations ADD CONSTRAINT CK_OneDb_CognitionAssociations_DecayRate CHECK (DecayRate >= 0);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'onedb.CognitionAssociations') AND name = N'UX_OneDb_CognitionAssociations_Uid')
    CREATE UNIQUE INDEX UX_OneDb_CognitionAssociations_Uid ON onedb.CognitionAssociations(AssociationUid);
GO

IF EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'onedb.CognitionAssociations') AND name = N'UX_OneDb_CognitionAssociations_BaseSlug')
    DROP INDEX UX_OneDb_CognitionAssociations_BaseSlug ON onedb.CognitionAssociations;
GO

IF COL_LENGTH(N'onedb.CognitionAssociations', N'SlugHash') IS NULL
    ALTER TABLE onedb.CognitionAssociations ADD SlugHash AS (CONVERT(BINARY(32), HASHBYTES('SHA2_256', Slug))) PERSISTED;
GO

CREATE UNIQUE INDEX UX_OneDb_CognitionAssociations_BaseSlug ON onedb.CognitionAssociations(Namespace, BaseGraphId, SlugHash) WHERE TenantId IS NULL;
GO

IF OBJECT_ID(N'onedb.CognitionAssociationInputs', N'U') IS NULL
BEGIN
    CREATE TABLE onedb.CognitionAssociationInputs
    (
        Id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_OneDb_CognitionAssociationInputs PRIMARY KEY,
        AssociationUid UNIQUEIDENTIFIER NOT NULL,
        ConceptUid UNIQUEIDENTIFIER NOT NULL,
        InputRole NVARCHAR(64) NOT NULL CONSTRAINT DF_OneDb_CognitionAssociationInputs_Role DEFAULT N'input',
        Weight DECIMAL(9,6) NOT NULL CONSTRAINT DF_OneDb_CognitionAssociationInputs_Weight DEFAULT 1,
        MinActivation DECIMAL(9,6) NULL,
        IdealActivation DECIMAL(9,6) NULL,
        MaxActivation DECIMAL(9,6) NULL,
        CreatedUtc DATETIME2(3) NOT NULL CONSTRAINT DF_OneDb_CognitionAssociationInputs_CreatedUtc DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_OneDb_CognitionAssociationInputs_Association FOREIGN KEY (AssociationUid) REFERENCES onedb.CognitionAssociations(AssociationUid),
        CONSTRAINT FK_OneDb_CognitionAssociationInputs_Concept FOREIGN KEY (ConceptUid) REFERENCES onedb.CognitionConcepts(ConceptUid)
    );
END;
GO

IF OBJECT_ID(N'onedb.CognitionSessions', N'U') IS NULL
BEGIN
    CREATE TABLE onedb.CognitionSessions
    (
        Id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_OneDb_CognitionSessions PRIMARY KEY,
        SessionUid UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_OneDb_CognitionSessions_SessionUid DEFAULT NEWID(),
        TenantId BIGINT NULL,
        ApplicationId BIGINT NOT NULL,
        Namespace NVARCHAR(128) NOT NULL,
        BaseGraphId NVARCHAR(256) NOT NULL,
        VertexPath NVARCHAR(512) NOT NULL,
        SessionType NVARCHAR(96) NOT NULL,
        InputActivationsJson NVARCHAR(MAX) NOT NULL,
        ActivatedVerticesJson NVARCHAR(MAX) NOT NULL,
        CandidateAssociationsJson NVARCHAR(MAX) NOT NULL,
        OutputActivationsJson NVARCHAR(MAX) NOT NULL,
        ExplanationTraceJson NVARCHAR(MAX) NOT NULL,
        Status NVARCHAR(64) NOT NULL,
        StartedUtc DATETIME2(3) NOT NULL,
        CompletedUtc DATETIME2(3) NULL,
        Ttl NVARCHAR(64) NULL,
        CreatedBy NVARCHAR(256) NOT NULL,
        Url AS (CONVERT(NVARCHAR(1000), N'https://nodevertex.com' + VertexPath)) PERSISTED,
        CONSTRAINT FK_OneDb_CognitionSessions_Tenants FOREIGN KEY (TenantId) REFERENCES security.Tenants(Id),
        CONSTRAINT FK_OneDb_CognitionSessions_Applications FOREIGN KEY (ApplicationId) REFERENCES client.Applications(Id)
    );
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'onedb.CognitionSessions') AND name = N'UX_OneDb_CognitionSessions_Uid')
    CREATE UNIQUE INDEX UX_OneDb_CognitionSessions_Uid ON onedb.CognitionSessions(SessionUid);
GO

IF OBJECT_ID(N'onedb.CognitionSeedJobs', N'U') IS NULL
BEGIN
    CREATE TABLE onedb.CognitionSeedJobs
    (
        Id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_OneDb_CognitionSeedJobs PRIMARY KEY,
        JobUid UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_OneDb_CognitionSeedJobs_JobUid DEFAULT NEWID(),
        TenantId BIGINT NULL,
        ApplicationId BIGINT NOT NULL,
        Namespace NVARCHAR(128) NOT NULL,
        BaseGraphId NVARCHAR(256) NOT NULL,
        JobType NVARCHAR(96) NOT NULL,
        Status NVARCHAR(64) NOT NULL,
        RequestJson NVARCHAR(MAX) NOT NULL,
        ResultJson NVARCHAR(MAX) NOT NULL,
        CreatedUtc DATETIME2(3) NOT NULL CONSTRAINT DF_OneDb_CognitionSeedJobs_CreatedUtc DEFAULT SYSUTCDATETIME(),
        UpdatedUtc DATETIME2(3) NOT NULL CONSTRAINT DF_OneDb_CognitionSeedJobs_UpdatedUtc DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_OneDb_CognitionSeedJobs_Tenants FOREIGN KEY (TenantId) REFERENCES security.Tenants(Id),
        CONSTRAINT FK_OneDb_CognitionSeedJobs_Applications FOREIGN KEY (ApplicationId) REFERENCES client.Applications(Id)
    );
END;
GO

IF OBJECT_ID(N'onedb.CognitionEvidence', N'U') IS NULL
BEGIN
    CREATE TABLE onedb.CognitionEvidence
    (
        Id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_OneDb_CognitionEvidence PRIMARY KEY,
        EvidenceUid UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_OneDb_CognitionEvidence_EvidenceUid DEFAULT NEWID(),
        TenantId BIGINT NULL,
        ApplicationId BIGINT NOT NULL,
        Namespace NVARCHAR(128) NOT NULL,
        BaseGraphId NVARCHAR(256) NOT NULL,
        SourceName NVARCHAR(256) NOT NULL,
        SourceType NVARCHAR(96) NOT NULL,
        SourceUri NVARCHAR(1000) NULL,
        License NVARCHAR(256) NULL,
        ExtractionMethod NVARCHAR(128) NOT NULL,
        ExtractedUtc DATETIME2(3) NOT NULL,
        Confidence DECIMAL(9,6) NOT NULL,
        RawPayloadJson NVARCHAR(MAX) NOT NULL,
        NormalizedPayloadJson NVARCHAR(MAX) NOT NULL,
        RelatedVertexPath NVARCHAR(512) NULL,
        RelatedNrn NVARCHAR(800) NULL,
        CreatedUtc DATETIME2(3) NOT NULL CONSTRAINT DF_OneDb_CognitionEvidence_CreatedUtc DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_OneDb_CognitionEvidence_Tenants FOREIGN KEY (TenantId) REFERENCES security.Tenants(Id),
        CONSTRAINT FK_OneDb_CognitionEvidence_Applications FOREIGN KEY (ApplicationId) REFERENCES client.Applications(Id)
    );
END;
GO

IF OBJECT_ID(N'onedb.CognitionObservations', N'U') IS NULL
BEGIN
    CREATE TABLE onedb.CognitionObservations
    (
        Id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_OneDb_CognitionObservations PRIMARY KEY,
        ObservationUid UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_OneDb_CognitionObservations_ObservationUid DEFAULT NEWID(),
        TenantId BIGINT NULL,
        ApplicationId BIGINT NOT NULL,
        Namespace NVARCHAR(128) NOT NULL,
        BaseGraphId NVARCHAR(256) NOT NULL,
        InputJson NVARCHAR(MAX) NOT NULL,
        ObservedResult NVARCHAR(256) NULL,
        Confidence DECIMAL(9,6) NOT NULL,
        Source NVARCHAR(128) NOT NULL,
        CreatedUtc DATETIME2(3) NOT NULL CONSTRAINT DF_OneDb_CognitionObservations_CreatedUtc DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_OneDb_CognitionObservations_Tenants FOREIGN KEY (TenantId) REFERENCES security.Tenants(Id),
        CONSTRAINT FK_OneDb_CognitionObservations_Applications FOREIGN KEY (ApplicationId) REFERENCES client.Applications(Id)
    );
END;
GO

IF OBJECT_ID(N'onedb.CognitionQualityMetrics', N'U') IS NULL
BEGIN
    CREATE TABLE onedb.CognitionQualityMetrics
    (
        Id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_OneDb_CognitionQualityMetrics PRIMARY KEY,
        MetricUid UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_OneDb_CognitionQualityMetrics_MetricUid DEFAULT NEWID(),
        TenantId BIGINT NULL,
        ApplicationId BIGINT NOT NULL,
        Namespace NVARCHAR(128) NOT NULL,
        BaseGraphId NVARCHAR(256) NOT NULL,
        MetricName NVARCHAR(128) NOT NULL,
        MetricValue DECIMAL(18,6) NOT NULL,
        DetailJson NVARCHAR(MAX) NOT NULL CONSTRAINT DF_OneDb_CognitionQualityMetrics_Detail DEFAULT N'{}',
        CreatedUtc DATETIME2(3) NOT NULL CONSTRAINT DF_OneDb_CognitionQualityMetrics_CreatedUtc DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_OneDb_CognitionQualityMetrics_Tenants FOREIGN KEY (TenantId) REFERENCES security.Tenants(Id),
        CONSTRAINT FK_OneDb_CognitionQualityMetrics_Applications FOREIGN KEY (ApplicationId) REFERENCES client.Applications(Id)
    );
END;
GO

IF OBJECT_ID(N'onedb.ProjectCognition', N'U') IS NULL
BEGIN
    CREATE TABLE onedb.ProjectCognition
    (
        Id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_OneDb_ProjectCognition PRIMARY KEY,
        ProjectCognitionUid UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_OneDb_ProjectCognition_Uid DEFAULT NEWID(),
        TenantId BIGINT NOT NULL,
        ApplicationId BIGINT NOT NULL,
        ProjectKey NVARCHAR(256) NOT NULL,
        ProjectName NVARCHAR(256) NOT NULL,
        Description NVARCHAR(2000) NULL,
        ArchitectureNotes NVARCHAR(MAX) NULL,
        OperationalRulesJson NVARCHAR(MAX) NOT NULL CONSTRAINT DF_OneDb_ProjectCognition_OperationalRules DEFAULT N'[]',
        DeploymentRulesJson NVARCHAR(MAX) NOT NULL CONSTRAINT DF_OneDb_ProjectCognition_DeploymentRules DEFAULT N'[]',
        CodingStandardsJson NVARCHAR(MAX) NOT NULL CONSTRAINT DF_OneDb_ProjectCognition_CodingStandards DEFAULT N'[]',
        ToolPreferencesJson NVARCHAR(MAX) NOT NULL CONSTRAINT DF_OneDb_ProjectCognition_ToolPreferences DEFAULT N'[]',
        EnvironmentNotes NVARCHAR(MAX) NULL,
        SecurityRequirementsJson NVARCHAR(MAX) NOT NULL CONSTRAINT DF_OneDb_ProjectCognition_SecurityRequirements DEFAULT N'[]',
        OrganizationalConstraintsJson NVARCHAR(MAX) NOT NULL CONSTRAINT DF_OneDb_ProjectCognition_OrganizationalConstraints DEFAULT N'[]',
        Version INT NOT NULL CONSTRAINT DF_OneDb_ProjectCognition_Version DEFAULT 1,
        IsActive BIT NOT NULL CONSTRAINT DF_OneDb_ProjectCognition_IsActive DEFAULT 1,
        SupersedesProjectCognitionUid UNIQUEIDENTIFIER NULL,
        ChangeReason NVARCHAR(1000) NULL,
        CreatedBy NVARCHAR(256) NULL,
        AuditJson NVARCHAR(MAX) NOT NULL CONSTRAINT DF_OneDb_ProjectCognition_Audit DEFAULT N'{}',
        CreatedUtc DATETIME2(3) NOT NULL CONSTRAINT DF_OneDb_ProjectCognition_CreatedUtc DEFAULT SYSUTCDATETIME(),
        UpdatedUtc DATETIME2(3) NOT NULL CONSTRAINT DF_OneDb_ProjectCognition_UpdatedUtc DEFAULT SYSUTCDATETIME(),
        DeactivatedUtc DATETIME2(3) NULL,
        CONSTRAINT FK_OneDb_ProjectCognition_Tenants FOREIGN KEY (TenantId) REFERENCES security.Tenants(Id),
        CONSTRAINT FK_OneDb_ProjectCognition_Applications FOREIGN KEY (ApplicationId) REFERENCES client.Applications(Id)
    );
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'onedb.ProjectCognition') AND name = N'UX_OneDb_ProjectCognition_Uid')
    CREATE UNIQUE INDEX UX_OneDb_ProjectCognition_Uid ON onedb.ProjectCognition(ProjectCognitionUid);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'onedb.ProjectCognition') AND name = N'UX_OneDb_ProjectCognition_Project_Version')
    CREATE UNIQUE INDEX UX_OneDb_ProjectCognition_Project_Version ON onedb.ProjectCognition(TenantId, ProjectKey, Version);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'onedb.ProjectCognition') AND name = N'UX_OneDb_ProjectCognition_Active')
    CREATE UNIQUE INDEX UX_OneDb_ProjectCognition_Active ON onedb.ProjectCognition(TenantId, ProjectKey) WHERE IsActive = 1;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'onedb.ProjectCognition') AND name = N'IX_OneDb_ProjectCognition_Project')
    CREATE INDEX IX_OneDb_ProjectCognition_Project ON onedb.ProjectCognition(TenantId, ProjectKey, Version DESC, UpdatedUtc DESC);
GO

IF OBJECT_ID(N'onedb.StoreBackends', N'U') IS NULL
BEGIN
    CREATE TABLE onedb.StoreBackends
    (
        Id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_OneDb_StoreBackends PRIMARY KEY,
        BackendUid UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_OneDb_StoreBackends_BackendUid DEFAULT NEWID(),
        TenantId BIGINT NULL,
        BackendRole NVARCHAR(64) NOT NULL,
        ProviderKey NVARCHAR(96) NOT NULL,
        ProviderType NVARCHAR(64) NOT NULL CONSTRAINT DF_OneDb_StoreBackends_ProviderType DEFAULT N'unknown',
        IsEnabled BIT NOT NULL CONSTRAINT DF_OneDb_StoreBackends_IsEnabled DEFAULT 1,
        Priority INT NOT NULL CONSTRAINT DF_OneDb_StoreBackends_Priority DEFAULT 100,
        ConfigJson NVARCHAR(MAX) NULL,
        CapabilitiesJson NVARCHAR(MAX) NULL,
        HealthStatus NVARCHAR(32) NOT NULL CONSTRAINT DF_OneDb_StoreBackends_HealthStatus DEFAULT N'unknown',
        LastHealthCheckUtc DATETIME2(3) NULL,
        Notes NVARCHAR(1000) NULL,
        CreatedUtc DATETIME2(3) NOT NULL CONSTRAINT DF_OneDb_StoreBackends_CreatedUtc DEFAULT SYSUTCDATETIME(),
        UpdatedUtc DATETIME2(3) NULL,
        CONSTRAINT FK_OneDb_StoreBackends_Tenants FOREIGN KEY (TenantId) REFERENCES security.Tenants(Id)
    );
END;
GO

IF COL_LENGTH(N'onedb.StoreBackends', N'ProviderType') IS NULL
    ALTER TABLE onedb.StoreBackends ADD ProviderType NVARCHAR(64) NOT NULL CONSTRAINT DF_OneDb_StoreBackends_ProviderType DEFAULT N'unknown';
GO

IF COL_LENGTH(N'onedb.StoreBackends', N'CapabilitiesJson') IS NULL
    ALTER TABLE onedb.StoreBackends ADD CapabilitiesJson NVARCHAR(MAX) NULL;
GO

IF COL_LENGTH(N'onedb.StoreBackends', N'HealthStatus') IS NULL
    ALTER TABLE onedb.StoreBackends ADD HealthStatus NVARCHAR(32) NOT NULL CONSTRAINT DF_OneDb_StoreBackends_HealthStatus DEFAULT N'unknown';
GO

IF COL_LENGTH(N'onedb.StoreBackends', N'LastHealthCheckUtc') IS NULL
    ALTER TABLE onedb.StoreBackends ADD LastHealthCheckUtc DATETIME2(3) NULL;
GO

IF COL_LENGTH(N'onedb.StoreBackends', N'Notes') IS NULL
    ALTER TABLE onedb.StoreBackends ADD Notes NVARCHAR(1000) NULL;
GO

MERGE onedb.StoreBackends AS target
USING
(
    SELECT CAST(NULL AS BIGINT) AS TenantId, N'control-sql' AS BackendRole, N'sqlserver-nrun' AS ProviderKey, N'sqlserver' AS ProviderType, 10 AS Priority, N'operational' AS HealthStatus,
           N'{"operations":["tenant-governance","event-ledger","memory-ledger","continuity","context-packets"],"read":true,"write":true}' AS CapabilitiesJson,
           N'Canonical 1db control ledger in SQL Server Nrun.' AS Notes
    UNION ALL SELECT NULL, N'document', N'onedb-mongo', N'mongodb', 40, N'provisioned',
           N'{"operations":["payload-documents","memory-documents","context-packet-documents","session-snapshots"],"read":true,"write":true,"service":"onedb-mongo.nrun-platform.svc.cluster.local:27017","secret":"onedb-mongo-secrets"}',
           N'Kubernetes MongoDB document backend is provisioned; TALA provider client wiring is next.'
    UNION ALL SELECT NULL, N'event-object', N'pending-object-store', N'object-store', 100, N'planned',
           N'{"operations":["raw-events","transcripts","large-artifacts","exports"],"read":true,"write":true}',
           N'Planned object/N2/R2-compatible event artifact store.'
    UNION ALL SELECT NULL, N'vector', N'onedb-qdrant', N'qdrant', 100, N'provisioned',
           N'{"operations":["embedding-write","semantic-recall","nearest-neighbor"],"read":true,"write":true,"service":"onedb-qdrant.nrun-platform.svc.cluster.local:6333","secret":"onedb-qdrant-secrets"}',
           N'Kubernetes Qdrant vector backend is provisioned; TALA provider client wiring is next.'
    UNION ALL SELECT NULL, N'graph', N'sqlserver-edge-table', N'sqlserver', 50, N'operational',
           N'{"operations":["relationship-ledger","graph-neighborhood","causality"],"read":true,"write":true}',
           N'Initial graph role backed by SQL Server edge tables.'
    UNION ALL SELECT NULL, N'search', N'sqlserver-lexical', N'sqlserver', 50, N'operational',
           N'{"operations":["lexical-recall","bm25-planned","hybrid-recall-planned"],"read":true,"write":false}',
           N'Initial lexical retrieval over SQL Server memory text.'
    UNION ALL SELECT NULL, N'hot-cache', N'velo-redis', N'redis', 50, N'provisioned',
           N'{"operations":["active-context-cache","queue-locks","short-lived-packets"],"read":true,"write":true,"service":"velo-redis.nrun-platform.svc.cluster.local:6379"}',
           N'VELO/Redis cache role is provisioned for hot cognition paths; TALA provider client wiring is next.'
    UNION ALL SELECT NULL, N'notebook', N'onedb-jupyter', N'jupyter', 200, N'provisioned',
           N'{"operations":["memory-quality-analysis","embedding-evaluation","consolidation-research","drift-analysis"],"read":true,"write":false,"service":"onedb-jupyter.nrun-platform.svc.cluster.local:8888","secret":"onedb-jupyter-secrets"}',
           N'Kubernetes Jupyter workbench is provisioned as an internal research path; not a serving path.'
) AS source
   ON ((target.TenantId IS NULL AND source.TenantId IS NULL) OR target.TenantId = source.TenantId)
  AND target.BackendRole = source.BackendRole
  AND target.ProviderKey = source.ProviderKey
WHEN MATCHED THEN
    UPDATE SET IsEnabled = 1, ProviderType = source.ProviderType, Priority = source.Priority, CapabilitiesJson = source.CapabilitiesJson,
               HealthStatus = source.HealthStatus, Notes = source.Notes, UpdatedUtc = SYSUTCDATETIME()
WHEN NOT MATCHED THEN
    INSERT (TenantId, BackendRole, ProviderKey, ProviderType, IsEnabled, Priority, CapabilitiesJson, HealthStatus, Notes, CreatedUtc)
    VALUES (source.TenantId, source.BackendRole, source.ProviderKey, source.ProviderType, 1, source.Priority, source.CapabilitiesJson, source.HealthStatus, source.Notes, SYSUTCDATETIME());

UPDATE onedb.StoreBackends
SET IsEnabled = 0,
    UpdatedUtc = SYSUTCDATETIME(),
    Notes = N'Deprecated placeholder entry superseded by Kubernetes provisioned backend.'
WHERE TenantId IS NULL
  AND BackendRole IN (N'document', N'vector', N'notebook')
  AND ProviderKey IN (N'mongodb-planned', N'pending-vector-store', N'jupyter-planned');
GO
