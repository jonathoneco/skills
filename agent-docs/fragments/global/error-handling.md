## Error handling

Never swallow errors. Always fail loudly. If a function catches an error, it must either re-throw or surface it — never `return []`, `return null`, or silently continue. Pipeline retries depend on errors propagating; observability depends on failures being visible.

Catching to add context (`throw new Error('failed to X', { cause: e })`) is fine. Catching to convert one exception type to another is fine. Catching to suppress is the failure mode.
