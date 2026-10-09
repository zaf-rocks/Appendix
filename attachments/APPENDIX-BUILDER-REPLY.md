# Reply to working agreement

Not official in the build thread until I say **official**.

## Section 1 — accepted as written

Purpose. Surgical change. Confirm before build. Go is the trigger. Lock it in. Default to silence. One change per prompt. Show before commit. Vocabulary as written. Degree scale in principle. End state is “locked.” We decide together when this is law.

## Section 2 — decisions

1. **Shared CSS / shared components.**  
   **(a) always red-flag and wait.**  
   Do not silently split a shared class. If honoring “only what I named” requires a split, stop and say so. A split is a **refactor**. I have to say the word **refactor** first.

2. **Bundled prompts vs one-change-per-prompt.**  
   Default is one change, wait after each.  
   Escape hatch: I write **go in order: 1, 2, 3**.  
   Recap the list. I say that phrase. You do them in order. Show a diff after each. Wait after each. Do not merge steps.

3. **What counts as “the change.”**  
   **(a) tests are part of Go.**  
   Typecheck + smoke open of the page after the named change. Report: page loaded / white screen. Do not commit until I approve.

4. **Commits and pass tags.**  
   Show the diff in chat first. I say **approve**, **lock it in**, **keep going**, or **revert**.  
   Only then you commit.  
   Keep pass tags only after my approve. No auto pass-N.

5. **Ground vectors.**  
   Do not invent them.  
   First time I say “degree N on X,” if X has no vector, ask.  
   Fill a short table as we go: body px, heading px, caption px, tracking em, spacing px, shadow px + opacity, motion seconds.  
   If I use a multiplier that would blow past any reasonable size, flag it before applying.

6. **“Too much” / “keep going” without a number.**  
   One degree down / one degree up on the last named vector. Be intuitive.  
   If there is no last named vector, ask “degree?”

7. **Cut-off messages.**  
   Wait. Never finish my sentence. Even if the missing tail looks obvious.

8. **Sandbox vs this agreement.**  
   When I say **official** in the build thread, this agreement overrides sandbox standing orders for this project.  
   Talk freely. Change the product only after **go**. Keep the preview alive.

9. **Lock register.**  
   **LOCKED.md** in the repo is source of truth. Short copy in the build thread after each lock.  
   If they drift, the file wins, and you tell me.

10. **Revert target.**  
    **revert** = last approved change under these rules. One step back.  
    Nothing approved yet: revert to the last pass tag I name. Do not pick a tag for me.  
    I can revert one named detail inside a bundle. If that would leave a file half-edited, flag it first and wait.

11. **Go synonyms.**  
    Literal word **go** only.  
    “Okay,” “do it,” “yeah go ahead,” “please,” “ship it” are not Go. Recap and wait.

## Section 3 — accepted with tweaks

- Red-flag format: always the same block.  
  `AT RISK: [locked or unnamed piece] — because [shared class / file / copy]. I have not changed it. Unlock or re-scope?`
- Recap format: numbered list of what will change, what will not change, locked piece nearby. Then wait.
- Diff format: files + one-line each, what you did not touch, smoke result. No commit in that message.
- Shared-surface map: not now. Only if I say **refactor**.
- Bundle keyword: **go in order: 1, 2, 3**.
- Degree card on first use: yes.
- Locked nominations: suggestions only. Nothing freezes until I say **lock it in** on that piece.
- “Wrong direction” includes taste. Revert. Do not try a third option unless I name it or say keep going.
- Talk like a collaborator. Build like a surgeon.
- Other thread decides. Build thread builds after Go.
- New prompt mid-change: stop after the current named step, show the diff, recap the new prompt. Do not merge.
- Honesty over speed: leave a one-pass inconsistency and tell me. Do not match it without permission.
