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

IF OBJECT_ID(N'onedb.CognitiveEdges', N'U') IS NULL
BEGIN
    CREATE TABLE onedb.CognitiveEdges
    (
        Id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_OneDb_CognitiveEdges PRIMARY KEY,
        EdgeUid UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_OneDb_CognitiveEdges_EdgeUid DEFAULT NEWID(),
        TenantId BIGINT NOT NULL,
        FromNodeId NVARCHAR(256) NOT NULL,
        ToNodeId NVARCHAR(256) NOT NULL,
        FromNodeType NVARCHAR(64) NOT NULL,
        ToNodeType NVARCHAR(64) NOT NULL,
        EdgeType NVARCHAR(96) NOT NULL,
        Confidence DECIMAL(9,6) NOT NULL CONSTRAINT DF_OneDb_CognitiveEdges_Confidence DEFAULT 0.5,
        Weight DECIMAL(9,6) NOT NULL CONSTRAINT DF_OneDb_CognitiveEdges_Weight DEFAULT 0.5,
        EvidenceEventUidsJson NVARCHAR(MAX) NULL,
        MemoryUidsJson NVARCHAR(MAX) NULL,
        Status NVARCHAR(32) NOT NULL CONSTRAINT DF_OneDb_CognitiveEdges_Status DEFAULT N'active',
        CreatedUtc DATETIME2(3) NOT NULL CONSTRAINT DF_OneDb_CognitiveEdges_CreatedUtc DEFAULT SYSUTCDATETIME(),
        UpdatedUtc DATETIME2(3) NOT NULL CONSTRAINT DF_OneDb_CognitiveEdges_UpdatedUtc DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_OneDb_CognitiveEdges_Tenants FOREIGN KEY (TenantId) REFERENCES security.Tenants(Id)
    );
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'onedb.CognitiveEdges') AND name = N'IX_OneDb_CognitiveEdges_From')
    CREATE INDEX IX_OneDb_CognitiveEdges_From ON onedb.CognitiveEdges(TenantId, FromNodeId, EdgeType);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'onedb.CognitiveEdges') AND name = N'IX_OneDb_CognitiveEdges_To')
    CREATE INDEX IX_OneDb_CognitiveEdges_To ON onedb.CognitiveEdges(TenantId, ToNodeId, EdgeType);
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

IF OBJECT_ID(N'onedb.StoreBackends', N'U') IS NULL
BEGIN
    CREATE TABLE onedb.StoreBackends
    (
        Id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_OneDb_StoreBackends PRIMARY KEY,
        BackendUid UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_OneDb_StoreBackends_BackendUid DEFAULT NEWID(),
        TenantId BIGINT NULL,
        BackendRole NVARCHAR(64) NOT NULL,
        ProviderKey NVARCHAR(96) NOT NULL,
        IsEnabled BIT NOT NULL CONSTRAINT DF_OneDb_StoreBackends_IsEnabled DEFAULT 1,
        Priority INT NOT NULL CONSTRAINT DF_OneDb_StoreBackends_Priority DEFAULT 100,
        ConfigJson NVARCHAR(MAX) NULL,
        CreatedUtc DATETIME2(3) NOT NULL CONSTRAINT DF_OneDb_StoreBackends_CreatedUtc DEFAULT SYSUTCDATETIME(),
        UpdatedUtc DATETIME2(3) NULL,
        CONSTRAINT FK_OneDb_StoreBackends_Tenants FOREIGN KEY (TenantId) REFERENCES security.Tenants(Id)
    );
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'onedb.StoreBackends') AND name = N'IX_OneDb_StoreBackends_Role')
    CREATE INDEX IX_OneDb_StoreBackends_Role ON onedb.StoreBackends(TenantId, BackendRole, IsEnabled, Priority);
GO

MERGE onedb.StoreBackends AS target
USING
(
    SELECT CAST(NULL AS BIGINT) AS TenantId, N'control-sql' AS BackendRole, N'sqlserver-nrun' AS ProviderKey, 10 AS Priority
    UNION ALL SELECT NULL, N'event-object', N'pending-object-store', 100
    UNION ALL SELECT NULL, N'vector', N'pending-vector-store', 100
    UNION ALL SELECT NULL, N'graph', N'sqlserver-edge-table', 50
    UNION ALL SELECT NULL, N'search', N'sqlserver-lexical', 50
    UNION ALL SELECT NULL, N'hot-cache', N'velo-redis', 50
) AS source
   ON ((target.TenantId IS NULL AND source.TenantId IS NULL) OR target.TenantId = source.TenantId)
  AND target.BackendRole = source.BackendRole
  AND target.ProviderKey = source.ProviderKey
WHEN MATCHED THEN
    UPDATE SET IsEnabled = 1, Priority = source.Priority, UpdatedUtc = SYSUTCDATETIME()
WHEN NOT MATCHED THEN
    INSERT (TenantId, BackendRole, ProviderKey, IsEnabled, Priority, CreatedUtc)
    VALUES (source.TenantId, source.BackendRole, source.ProviderKey, 1, source.Priority, SYSUTCDATETIME());
GO

SELECT Id, Code, Name, BaseUrl, IsActive
FROM client.Applications
WHERE Code = N'1db';

SELECT BackendRole, ProviderKey, IsEnabled, Priority
FROM onedb.StoreBackends
ORDER BY BackendRole, Priority;
GO
