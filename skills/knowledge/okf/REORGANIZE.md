# Reorganize and retire

Part of the `okf` skill. `SKILL.md` comes first: its Ingest steps define placement, the timestamp and log entry, validation, and landing, and this file builds on them.

Path is concept identity, so a move or rename carries the ingest maintenance obligations
and a wider completion gate:

1. Classify the destination as a bundle, initiative workspace, lifecycle section, or
   concept doc using the grain rules in `knowledge/README.md`.
2. Inventory the old paths and repository-wide inbound references before moving.
3. After moving, search the repository for every old path. Classify each occurrence by
   function: a live destination or operational reference, or historical prose. Update
   every live reference; leave historical prose intact.
4. Inspect every changed Markdown destination for the intended concept, not merely an
   existing file. Confirm every changed local destination exists in tracked state unless
   its local-only status is part of the owning contract. Reconcile indexes and logs, then
   validate every affected bundle.

Done means every old-path occurrence is accounted for, every changed destination names
the intended concept and survives a clean checkout unless explicitly local, indexes and
logs are reconciled, and every affected validator reports zero errors and zero warnings.

## Retiring a doc

A source can also kill knowledge. Retired concept (system
decommissioned, vendor dropped): delete its doc — git is the archive — then fix
every inbound link and index line, and log the retirement. Then validate and land it as any ingest.
