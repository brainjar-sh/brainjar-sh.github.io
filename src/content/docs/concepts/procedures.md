---
title: Procedures
description: Step-by-step playbooks for how the agent carries out work.
---

A procedure is a step-by-step playbook — the **method** the agent should follow to carry out work. Where a persona answers *who is doing this*, a procedure answers *how is this done*.

Think of it as the agent's **runbook**.

## Procedure vs persona

Personas describe role and disposition: *you are a code reviewer*, *you are a CTO*. Procedures describe sequence: *first read every changed file, then run tests, then write the verdict*. The same persona can run different procedures (a CTO doing design vs a CTO triaging an incident); the same procedure can be run by different personas (a delivery playbook executed by an engineer or a tech lead).

Both compose into the same prompt — procedures sit alongside soul, persona, and rules in the effective state.

## Creating a procedure

```bash
cat delivery.md | brainjar procedure create delivery
# or
brainjar procedure create delivery --file ./delivery.md
```

`create` is an upsert — it stores whatever content you hand it (`--content`, `--file`, or stdin, in that precedence order). Re-running `create` with new content replaces the previous version; the prior version stays in the version history (`brainjar versions procedure delivery`).

A typical procedure spells out phases, the inputs each phase consumes, and the artifacts each phase produces. There's no required structure — the content is plain markdown.

## Activating a procedure

```bash
brainjar procedure use delivery
```

`procedure use` writes to the **workspace** state override. Run `brainjar sync` (or rely on the SessionStart hook) to push the change into the platform's managed config block.

## Managing procedures

```bash
brainjar procedure list                  # See available procedures
brainjar procedure show                  # View the active procedure
brainjar procedure show delivery         # View a specific procedure
brainjar versions procedure delivery     # List version history
brainjar versions procedure delivery 2   # Print version 2's content to stdout
brainjar procedure drop                  # Clear the active-procedure override
brainjar procedure delete delivery       # Permanently delete the procedure
```

There is no revert subcommand. To restore an old version, capture its content with `brainjar versions procedure delivery <n>` and pipe it back into `brainjar procedure create delivery`.

See full flag and subcommand details in the [CLI reference for `procedure`](/reference/cli/#procedure) and [`versions`](/reference/cli/#versions).

## Bundling with a brain

A brain can carry a procedure alongside its soul, persona, and rules. Pass `--procedure <slug>` to `brain save`:

```bash
brainjar brain save delivery-cto \
  --soul straight-shooter \
  --persona cto \
  --procedure delivery \
  --rule security \
  --rule testing
```

`brainjar brain use delivery-cto` then loads all four layers into workspace state in one shot. The procedure flag is optional; omit it to bind the brain to no procedure.

## When to reach for a procedure

A procedure earns its keep when the *order of operations* matters and you want it to apply across multiple personas or sessions. Examples:

- **Delivery flow.** Design → approve → build → verify, with concrete handoffs at each transition.
- **Incident response.** Reproduce → contain → root-cause → write postmortem.
- **Migration playbook.** Inventory callers → introduce shim → migrate one caller at a time → remove shim.

If the steps are tightly bound to one persona's identity (a reviewer's review process, say), keep them inside the persona instead. Procedures pay off when the same playbook is reused by different personas or when you want to swap playbooks without changing the persona.
