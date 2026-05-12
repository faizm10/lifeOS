# Commit messages (Conventional Commits)

Always use **Conventional Commits**. The subject line must match:

```text
<type>(<optional-scope>): <short description in imperative mood>
```

## Allowed types (use exactly these words)

| Type       | When to use |
|-----------|-------------|
| **feat**  | New user-facing feature or capability |
| **fix**   | Bug fix |
| **docs**  | Documentation only |
| **style** | Formatting, whitespace, semicolons (no logic change) |
| **refactor** | Code change that neither fixes a bug nor adds a feature |
| **perf**  | Performance improvement |
| **test**  | Adding or fixing tests |
| **build** | Build system, bundler, Dockerfile, dependencies |
| **ci**    | CI workflows, Husky, GitHub Actions |
| **chore** | Maintenance, tooling, config that does not fit elsewhere |
| **revert** | Reverts a previous commit |

## Rules

- Use **lowercase** type; no period at the end of the subject.
- Subject: **imperative mood** ("add" not "added" or "adds"), max ~72 characters.
- **Scope** is optional: `feat(auth): magic link`, `fix: typo in README`.
- **Body** (optional): explain *why* after a blank line below the subject.
- **Footer** (optional): `BREAKING CHANGE:`, `Refs #123`, etc.

## Examples

- `feat(dashboard): show savings rate on home`
- `fix(bills): correct next due date for monthly cadence`
- `chore: add husky and commitlint`
- `ci: cache npm on fly deploy`
- `docs: document NEXT_PUBLIC_SITE_URL`

Do **not** use vague subjects like "update" or "changes" without a type prefix.
