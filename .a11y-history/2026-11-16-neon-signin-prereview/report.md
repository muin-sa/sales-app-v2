# Web Accessibility Audit

An audit of web content, run on 2026-11-16. Read the executive summary for the verdict, the priorities section for what to do first, and the findings tables for detail.

## Metadata

What was audited, with what, and under which settings.

| Field | Value |
|---|---|
| Date | 2026-11-16 |
| Scope | 6 items |
| Skills run | alt-text-headings, aria-specialist, contrast-master, forms-specialist, keyboard-navigator, live-region-controller |
| Tooling | node v24.21.0, a11y-mcp-server 7.1.0 |
| Scan configuration | defaults, no config file found |
| Checks counted | 10 |

Audited:

- `src/app/auth/sign-in/SignInForm.tsx (planned)`
- `src/app/auth/sign-in/page.tsx (planned)`
- `src/app/auth/sign-up/SignUpForm.tsx`
- `src/app/auth/sign-up/page.tsx`
- `src/app/globals.css`
- `src/app/layout.tsx`

## Executive summary

Pass. No critical or serious findings.

The headline numbers for this run.

| Measure | Value |
|---|---|
| Score | 100 out of 100 |
| Grade | A |
| Findings | 0 |
| Blocking (critical plus serious) | 0 |
| Verdict | Pass |

## Severity breakdown

Counts by severity, highest impact first.

| Severity | Count | What it means |
|---|---:|---|
| critical | 0 | Blocks a person from completing the task |
| serious | 0 | Major barrier with a difficult workaround |
| moderate | 0 | Real friction, workaround exists |
| minor | 0 | Noticeable but rarely blocking |

## Findings

No findings. Every check listed under "What passed" ran and came back clean.

## Remediation priorities

Nothing to remediate.

## What passed

2 checks ran and found nothing.

- The existing signup screen uses visible associated labels and native required inputs.
- The root layout sets lang="ar" and dir="rtl".

## Needs a human

Items a skill could not decide, or could not check automatically.

- **alt-text-headings**: Pre-implementation review only; the sign-in page does not exist yet. Give it a distinct Arabic title, exactly one main landmark and a descriptive h1. Avoid heading-level skips; the RTL language and direction inherit from the root layout.
- **aria-specialist**: Pre-implementation review only; the sign-in files do not exist yet. Use one main landmark, one h1, a native form and labeled inputs. Keep a persistent status region for pending updates; announce form-level errors and associate field-specific errors with their inputs.
- **contrast-master**: Pre-implementation review only; the sign-in colors do not exist yet. Use at least 4.5:1 for normal text and 3:1 for field boundaries and focus indicators; do not rely on the global faint border or muted-text tokens without measuring their actual use.
- **forms-specialist**: Pre-implementation review only; the sign-in files do not exist yet. Use email and password labels, required controls, username/current-password autocomplete, allow autofill and paste, announce generic credential failures, and focus errors.
- **keyboard-navigator**: Pre-implementation review only; the sign-in files do not exist yet. Preserve native tab order, visible focus, focusable error feedback, and move focus to the Dashboard heading after successful client-side navigation. Add a descriptive sign-in link to the signup form.
- **live-region-controller**: Pre-implementation review only; the sign-in page does not exist yet. Announce loading and credential/network failures with persistent status or alert regions. Ensure the Dashboard route has a clear heading and focus destination after sign-in.

## Next steps

1. Keep the current checks in continuous integration so this does not regress.
2. Re-audit when the interface changes materially, or quarterly.
3. Confirm the automated result with a manual screen reader and keyboard pass.

Automated checks find a minority of accessibility barriers. A passing score is a floor, not a guarantee.

## Findings data

The merged findings, embedded so the next run can compute a delta without parsing this document.

```json a11y-findings
{
  "skills": [
    "alt-text-headings",
    "aria-specialist",
    "contrast-master",
    "forms-specialist",
    "keyboard-navigator",
    "live-region-controller"
  ],
  "scope": [
    "src/app/auth/sign-in/SignInForm.tsx (planned)",
    "src/app/auth/sign-in/page.tsx (planned)",
    "src/app/auth/sign-up/SignUpForm.tsx",
    "src/app/auth/sign-up/page.tsx",
    "src/app/globals.css",
    "src/app/layout.tsx"
  ],
  "findings": [],
  "passed": [
    "The existing signup screen uses visible associated labels and native required inputs.",
    "The root layout sets lang=\"ar\" and dir=\"rtl\"."
  ],
  "notes": [
    {
      "skill": "alt-text-headings",
      "note": "Pre-implementation review only; the sign-in page does not exist yet. Give it a distinct Arabic title, exactly one main landmark and a descriptive h1. Avoid heading-level skips; the RTL language and direction inherit from the root layout."
    },
    {
      "skill": "aria-specialist",
      "note": "Pre-implementation review only; the sign-in files do not exist yet. Use one main landmark, one h1, a native form and labeled inputs. Keep a persistent status region for pending updates; announce form-level errors and associate field-specific errors with their inputs."
    },
    {
      "skill": "contrast-master",
      "note": "Pre-implementation review only; the sign-in colors do not exist yet. Use at least 4.5:1 for normal text and 3:1 for field boundaries and focus indicators; do not rely on the global faint border or muted-text tokens without measuring their actual use."
    },
    {
      "skill": "forms-specialist",
      "note": "Pre-implementation review only; the sign-in files do not exist yet. Use email and password labels, required controls, username/current-password autocomplete, allow autofill and paste, announce generic credential failures, and focus errors."
    },
    {
      "skill": "keyboard-navigator",
      "note": "Pre-implementation review only; the sign-in files do not exist yet. Preserve native tab order, visible focus, focusable error feedback, and move focus to the Dashboard heading after successful client-side navigation. Add a descriptive sign-in link to the signup form."
    },
    {
      "skill": "live-region-controller",
      "note": "Pre-implementation review only; the sign-in page does not exist yet. Announce loading and credential/network failures with persistent status or alert regions. Ensure the Dashboard route has a clear heading and focus destination after sign-in."
    }
  ],
  "counts": {
    "critical": 0,
    "serious": 0,
    "moderate": 0,
    "minor": 0
  },
  "components": [],
  "score": 100,
  "grade": "A",
  "penalty": 0,
  "checks": 10,
  "generated": "2026-11-16",
  "template": "web"
}
```
