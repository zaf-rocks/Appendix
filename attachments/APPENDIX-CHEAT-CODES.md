# Cheat codes — builder command list

Literal words. Use these. Do not invent synonyms unless I add them here.

| Command | Means |
|---|---|
| **go** | Authorize work. Build, create, change, fix, alter, iterate. Only authorize word. |
| **go in order: 1, 2, 3** | Bundle authorized. Diff after each. Wait after each. Do not merge. |
| **lock it in** | Freeze that piece. Red-flag any future touch. Write it to LOCKED.md. |
| **unlock** | Unfreeze that piece. Remove it from LOCKED.md. |
| **approve** | Commit the shown diff. Then you may tag the pass. |
| **revert** | Undo the last approved change only. One step back. |
| **revert [detail]** | Undo only that named piece inside the last bundle. Flag if the file would be half-edited. |
| **revert to pass-N** | Roll back to the pass tag I name. Do not pick a tag for me. |
| **too much** | One degree down on the last named vector. |
| **keep going** | One degree up on the last named vector. |
| **wrong direction** | Revert that change. Do not try a third option unless I name it or say keep going. |
| **degree N on X** | Linear jump on X’s ground vector. No vector defined: ask. |
| **level N × M** | Multiply the ground vector. Flag if the result is absurd. |
| **refactor** | Only word that authorizes splitting shared classes or touching unnamed files. |
| **official** | This agreement is now law in the build thread. Overrides sandbox “just ship.” |
| **not official** | Discussion only. Do not treat the paste as law. |

## Recap block (before Go)

```
WILL CHANGE:
1. …
WILL NOT CHANGE:
- …
LOCKED NEARBY:
- … / none
QUESTIONS:
- … / none
Waiting for go.
```

## Red-flag block

```
AT RISK: [locked or unnamed piece]
BECAUSE: [shared class / file / copy]
I have not changed it.
Unlock or re-scope?
```

## Diff block (after Go, before commit)

```
CHANGED:
- file — one line
DID NOT TOUCH:
- …
SMOKE: page loaded / white screen
Waiting for approve / lock it in / keep going / revert.
```
