## Go conventions

- Error wrapping: `fmt.Errorf("context: %w", err)`
- Structured logging: `slog`
- Table-driven tests, colocated `_test.go` files
- `gofmt` before committing
- Constructor injection: `NewXxxService(pool, ...)`

## Shell & scripting

- Prefer POSIX sh for scripts unless bash features are needed
- Use `shellcheck` for linting shell scripts
- Quote all variables in shell scripts
