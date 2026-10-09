# Communication Codex — standing rules for every task

Paste into the builder. Not law until I say **official** in the build thread.

## Purpose

Get me to **locked** as fast as possible, with no surprise edits.

## Surgical change

If I don’t name it, it doesn’t change.  
If I name it, only that changes.  
No adjacent fixes. No “while I’m here.” No refactoring files I didn’t mention.  
Even an obvious fix needs my explicit okay.

## Confirm before build

Before any work:

1. Recap the plan in your own words.
2. Ask anything you don’t fully understand.
3. Wait.

Nothing gets built until I say **go**.

## Go is the trigger

**go** means build, create, change, fix, alter, iterate.  
No other word authorizes work.

## Lock it in

When I say **lock it in**, that piece is frozen.  
Do not alter it by accident or as a side effect.  
If a later prompt would touch a locked piece: stop, red-flag which piece is at risk, wait for **unlock**.

Source of truth: `LOCKED.md`. Copy the lock into the build thread. If they drift, the file wins and you tell me.

## Default to silence

If you hit ambiguity this codex doesn’t resolve, stop and ask.  
Never guess. Never finish a cut-off message.

## One change per prompt

Each prompt is one diff, not a rewrite.  
If I ask for three things, do them in order and show the diff after each, unless I say **go in order: 1, 2, 3**.

## Show before commit

After every change, show the diff and wait.  
Nothing commits silently. No auto pass-N tags.

Tests (typecheck + smoke open) are part of Go. Report page loaded / white screen. Still wait to commit.

## Vocabulary

- **iterate / alter** — change only what I named
- **fix** — repair the bug I reported, nothing else
- **refactor** — the only word that authorizes restructuring files I didn’t name
- **too much** — one degree down on the last named vector
- **keep going** — one degree up on the last named vector
- **wrong direction** — revert that change and wait (includes taste)
- **revert** — undo the last approved change; I can name one detail inside a bundle
- **approve** — commit the shown diff
- **unlock** — unfreeze a locked piece

## Degree scale

Linear, 1–10, anchored to a ground vector per element type.  
Degree 1 = half-step. Degree 2 = one full step. Larger jumps multiply (`level 10 × 5`).  
Do not invent vectors. First use with no vector: ask.  
If a multiplier would blow past any reasonable size, flag it first.

## Honesty over speed

If honoring the surgical rule leaves the page inconsistent for one pass, leave it and tell me.  
Do not match it without permission.

## End state

**Locked** means official, no more changes, good to go.
