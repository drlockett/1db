-- Canonical source: nrun.api/v1/SQL/20260729_AddPersonaInstanceContinuity.sql
-- Keep this public 1db migration semantically aligned with the canonical
-- platform migration before applying it to SQL Server database Nrun.

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

IF OBJECT_ID(N'onedb.MemoryScopes', N'U') IS NULL
BEGIN
    CREATE TABLE onedb.MemoryScopes
    (
        Id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_OneDb_MemoryScopes PRIMARY KEY,
        ScopeUid UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_OneDb_MemoryScopes_Uid DEFAULT NEWSEQUENTIALID(),
        TenantId BIGINT NOT NULL,
        ScopeType NVARCHAR(64) NOT NULL,
        ScopeId NVARCHAR(256) NOT NULL,
        ParentScopeUid UNIQUEIDENTIFIER NULL,
        OwnerNid NVARCHAR(256) NULL,
        DisplayName NVARCHAR(300) NULL,
        Classification NVARCHAR(32) NOT NULL CONSTRAINT DF_OneDb_MemoryScopes_Classification DEFAULT N'internal',
        ReadPolicyJson NVARCHAR(MAX) NOT NULL CONSTRAINT DF_OneDb_MemoryScopes_ReadPolicy DEFAULT N'{}',
        WritePolicyJson NVARCHAR(MAX) NOT NULL CONSTRAINT DF_OneDb_MemoryScopes_WritePolicy DEFAULT N'{}',
        PromotionPolicyJson NVARCHAR(MAX) NOT NULL CONSTRAINT DF_OneDb_MemoryScopes_PromotionPolicy DEFAULT N'{}',
        RetentionPolicyJson NVARCHAR(MAX) NOT NULL CONSTRAINT DF_OneDb_MemoryScopes_RetentionPolicy DEFAULT N'{}',
        Status NVARCHAR(32) NOT NULL CONSTRAINT DF_OneDb_MemoryScopes_Status DEFAULT N'active',
        CreatedUtc DATETIME2(3) NOT NULL CONSTRAINT DF_OneDb_MemoryScopes_Created DEFAULT SYSUTCDATETIME(),
        UpdatedUtc DATETIME2(3) NOT NULL CONSTRAINT DF_OneDb_MemoryScopes_Updated DEFAULT SYSUTCDATETIME(),
        RemovedUtc DATETIME2(3) NULL,
        CONSTRAINT FK_OneDb_MemoryScopes_Tenant FOREIGN KEY (TenantId) REFERENCES security.Tenants(Id),
        CONSTRAINT FK_OneDb_MemoryScopes_Parent FOREIGN KEY (ParentScopeUid) REFERENCES onedb.MemoryScopes(ScopeUid),
        CONSTRAINT CK_OneDb_MemoryScopes_ReadPolicy CHECK (ISJSON(ReadPolicyJson) = 1),
        CONSTRAINT CK_OneDb_MemoryScopes_WritePolicy CHECK (ISJSON(WritePolicyJson) = 1),
        CONSTRAINT CK_OneDb_MemoryScopes_PromotionPolicy CHECK (ISJSON(PromotionPolicyJson) = 1),
        CONSTRAINT CK_OneDb_MemoryScopes_RetentionPolicy CHECK (ISJSON(RetentionPolicyJson) = 1)
    );
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'onedb.MemoryScopes') AND name = N'UX_OneDb_MemoryScopes_Uid')
    CREATE UNIQUE INDEX UX_OneDb_MemoryScopes_Uid ON onedb.MemoryScopes(ScopeUid);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'onedb.MemoryScopes') AND name = N'UX_OneDb_MemoryScopes_TenantScope')
    CREATE UNIQUE INDEX UX_OneDb_MemoryScopes_TenantScope ON onedb.MemoryScopes(TenantId, ScopeType, ScopeId) WHERE RemovedUtc IS NULL;
GO

IF OBJECT_ID(N'onedb.PersonaMemoryBindings', N'U') IS NULL
BEGIN
    CREATE TABLE onedb.PersonaMemoryBindings
    (
        Id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_OneDb_PersonaMemoryBindings PRIMARY KEY,
        BindingUid UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_OneDb_PersonaMemoryBindings_Uid DEFAULT NEWSEQUENTIALID(),
        TenantId BIGINT NOT NULL,
        PersonaInstanceUid UNIQUEIDENTIFIER NOT NULL,
        PersonaDefinitionNrn NVARCHAR(512) NOT NULL,
        WorkspaceUid UNIQUEIDENTIFIER NOT NULL,
        OfficeUid UNIQUEIDENTIFIER NULL,
        PersonaScopeUid UNIQUEIDENTIFIER NOT NULL,
        OrganizationScopeUid UNIQUEIDENTIFIER NOT NULL,
        WorkspaceScopeUid UNIQUEIDENTIFIER NOT NULL,
        OfficeScopeUid UNIQUEIDENTIFIER NULL,
        MemoryPolicyJson NVARCHAR(MAX) NOT NULL CONSTRAINT DF_OneDb_PersonaMemoryBindings_Policy DEFAULT N'{}',
        Status NVARCHAR(32) NOT NULL CONSTRAINT DF_OneDb_PersonaMemoryBindings_Status DEFAULT N'active',
        BoundUtc DATETIME2(3) NOT NULL CONSTRAINT DF_OneDb_PersonaMemoryBindings_Bound DEFAULT SYSUTCDATETIME(),
        UpdatedUtc DATETIME2(3) NOT NULL CONSTRAINT DF_OneDb_PersonaMemoryBindings_Updated DEFAULT SYSUTCDATETIME(),
        UnboundUtc DATETIME2(3) NULL,
        CONSTRAINT FK_OneDb_PersonaMemoryBindings_Tenant FOREIGN KEY (TenantId) REFERENCES security.Tenants(Id),
        CONSTRAINT FK_OneDb_PersonaMemoryBindings_PersonaScope FOREIGN KEY (PersonaScopeUid) REFERENCES onedb.MemoryScopes(ScopeUid),
        CONSTRAINT FK_OneDb_PersonaMemoryBindings_OrganizationScope FOREIGN KEY (OrganizationScopeUid) REFERENCES onedb.MemoryScopes(ScopeUid),
        CONSTRAINT FK_OneDb_PersonaMemoryBindings_WorkspaceScope FOREIGN KEY (WorkspaceScopeUid) REFERENCES onedb.MemoryScopes(ScopeUid),
        CONSTRAINT FK_OneDb_PersonaMemoryBindings_OfficeScope FOREIGN KEY (OfficeScopeUid) REFERENCES onedb.MemoryScopes(ScopeUid),
        CONSTRAINT CK_OneDb_PersonaMemoryBindings_Policy CHECK (ISJSON(MemoryPolicyJson) = 1)
    );
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'onedb.PersonaMemoryBindings') AND name = N'UX_OneDb_PersonaMemoryBindings_Uid')
    CREATE UNIQUE INDEX UX_OneDb_PersonaMemoryBindings_Uid ON onedb.PersonaMemoryBindings(BindingUid);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'onedb.PersonaMemoryBindings') AND name = N'UX_OneDb_PersonaMemoryBindings_Active')
    CREATE UNIQUE INDEX UX_OneDb_PersonaMemoryBindings_Active ON onedb.PersonaMemoryBindings(TenantId, PersonaInstanceUid) WHERE UnboundUtc IS NULL;
GO

IF OBJECT_ID(N'onedb.ContinuityCheckpoints', N'U') IS NULL
BEGIN
    CREATE TABLE onedb.ContinuityCheckpoints
    (
        Id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_OneDb_ContinuityCheckpoints PRIMARY KEY,
        CheckpointUid UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_OneDb_ContinuityCheckpoints_Uid DEFAULT NEWSEQUENTIALID(),
        TenantId BIGINT NOT NULL,
        ScopeType NVARCHAR(64) NOT NULL,
        ScopeId NVARCHAR(256) NOT NULL,
        ScopeUid UNIQUEIDENTIFIER NULL,
        PersonaInstanceUid UNIQUEIDENTIFIER NULL,
        RuntimeActivationUid UNIQUEIDENTIFIER NULL,
        ExpectedPreviousVersion INT NOT NULL,
        Version INT NOT NULL,
        StateJson NVARCHAR(MAX) NOT NULL,
        Summary NVARCHAR(MAX) NULL,
        EvidenceRefsJson NVARCHAR(MAX) NOT NULL CONSTRAINT DF_OneDb_ContinuityCheckpoints_Evidence DEFAULT N'[]',
        IntegrityHash NVARCHAR(80) NOT NULL,
        ActorId NVARCHAR(256) NULL,
        CreatedUtc DATETIME2(3) NOT NULL CONSTRAINT DF_OneDb_ContinuityCheckpoints_Created DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_OneDb_ContinuityCheckpoints_Tenant FOREIGN KEY (TenantId) REFERENCES security.Tenants(Id),
        CONSTRAINT FK_OneDb_ContinuityCheckpoints_Scope FOREIGN KEY (ScopeUid) REFERENCES onedb.MemoryScopes(ScopeUid),
        CONSTRAINT CK_OneDb_ContinuityCheckpoints_Version CHECK (Version > 0 AND ExpectedPreviousVersion >= 0 AND Version = ExpectedPreviousVersion + 1),
        CONSTRAINT CK_OneDb_ContinuityCheckpoints_State CHECK (ISJSON(StateJson) = 1),
        CONSTRAINT CK_OneDb_ContinuityCheckpoints_Evidence CHECK (ISJSON(EvidenceRefsJson) = 1)
    );
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'onedb.ContinuityCheckpoints') AND name = N'UX_OneDb_ContinuityCheckpoints_Uid')
    CREATE UNIQUE INDEX UX_OneDb_ContinuityCheckpoints_Uid ON onedb.ContinuityCheckpoints(CheckpointUid);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'onedb.ContinuityCheckpoints') AND name = N'UX_OneDb_ContinuityCheckpoints_ScopeVersion')
    CREATE UNIQUE INDEX UX_OneDb_ContinuityCheckpoints_ScopeVersion ON onedb.ContinuityCheckpoints(TenantId, ScopeType, ScopeId, Version);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'onedb.ContinuityCheckpoints') AND name = N'IX_OneDb_ContinuityCheckpoints_Persona')
    CREATE INDEX IX_OneDb_ContinuityCheckpoints_Persona ON onedb.ContinuityCheckpoints(TenantId, PersonaInstanceUid, CreatedUtc DESC);
GO

IF COL_LENGTH(N'onedb.ContinuityStates', N'HeadCheckpointUid') IS NULL
    ALTER TABLE onedb.ContinuityStates ADD HeadCheckpointUid UNIQUEIDENTIFIER NULL;
GO
IF COL_LENGTH(N'onedb.ContinuityStates', N'IntegrityHash') IS NULL
    ALTER TABLE onedb.ContinuityStates ADD IntegrityHash NVARCHAR(80) NULL;
GO
IF COL_LENGTH(N'onedb.ContinuityStates', N'PolicyJson') IS NULL
    ALTER TABLE onedb.ContinuityStates ADD PolicyJson NVARCHAR(MAX) NULL;
GO

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = N'FK_OneDb_ContinuityStates_HeadCheckpoint')
    ALTER TABLE onedb.ContinuityStates
        ADD CONSTRAINT FK_OneDb_ContinuityStates_HeadCheckpoint FOREIGN KEY (HeadCheckpointUid)
        REFERENCES onedb.ContinuityCheckpoints(CheckpointUid);
GO
