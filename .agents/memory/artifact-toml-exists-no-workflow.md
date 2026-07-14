---
name: Artifact exists but its workflow is missing
description: Recovery step when an artifact.toml already exists (e.g. from an interrupted/failed import scaffold) but WorkflowsRestart reports the workflow doesn't exist.
---

If `artifacts/<slug>/.replit-artifact/artifact.toml` already exists and looks correct, but `WorkflowsRestart` says the workflow name doesn't exist, the artifact was never registered with the system (common after an import's automatic scaffolding failed partway, e.g. Vercel/v0 import recovery from `.migration-backup/`).

**Fix:** copy the existing `artifact.toml` to a sibling temp file unchanged (or with edits) and call `verifyAndReplaceArtifactToml({ tempFilePath, artifactTomlPath })`. This re-registers the artifact and creates its managed workflow(s), even though the file content didn't need to change.

**Why:** `createArtifact()` can't be reused (fails on an existing slug/dir), and directly editing `artifact.toml` doesn't trigger registration — only `verifyAndReplaceArtifactToml` does.

**How to apply:** After manually recovering a partially-migrated import (moving files into `.migration-backup/`, restoring the pnpm_workspace layout), if an artifact dir + toml already exist from a prior attempt, don't recreate it — just round-trip it through `verifyAndReplaceArtifactToml` to get workflows registered, then `WorkflowsRestart`.
