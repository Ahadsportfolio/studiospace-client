# AGENTS.md — Rules for every agent task in this workspace

Read SPEC.md, PRD.md and TASKS.md before starting any task. Follow SPEC.md exactly; ask before deviating.

## Non-negotiable rules
- Never write Lorem ipsum. Use real studio-related copy.
- Never use alert() / confirm() / prompt(). Use Sonner toasts + custom modal dialogs.
- Use the new X logo, never the Twitter bird.
- Never hardcode secrets. Use .env; keep .env in .gitignore; maintain .env.example.
- Every private route must survive a page reload without redirecting to /login (wait for auth loading state).
- All cards equal height/width; consistent heading, paragraph and button styles.
- Category list (use everywhere, exact strings): `Photo Studio`, `Film Stage`, `Podcast Lounge`, `Music Suite`, `Workshop`.
- Never trust client-sent identity or prices. Take ownerEmail/userEmail from the verified JWT; compute prices on the server.
- Protected routes return 401 when unauthenticated, 403 when not the owner.

## Workflow per task
1. Produce a short plan first for anything non-trivial; wait for approval if asked.
2. Implement only the current task's scope.
3. Test it (curl for server, browser for client) and show results.
4. Make ONE small, meaningful commit with a conventional message (feat:, fix:, chore:, style:, refactor:).
5. Update the checkbox in TASKS.md.

## Commit targets
Server >= 8 commits, Client >= 15 commits (aim higher; small and focused).
