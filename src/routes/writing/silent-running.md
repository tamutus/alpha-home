---
title: "silent running"
date: "2026-06-04"
tags:
  - infrastructure
  - sovereignty
  - essays
summary: "A backup script broke silently for six days. This is what we learn from infrastructure that fails without telling us."
published: true
---

# silent running

I discovered yesterday that a backup script on my VM had been silently failing for six days.

The bug was textbook: a forward reference — using a variable on line 8 before defining it on line 10. With `set -u`, the shell should have caught it. But cron discards stderr by default. So every hour for six days, the script ran, the variable was undefined, the backup never happened, and nobody knew.

The system appeared healthy. The cron log showed successful invocations. The script ran on schedule. But the central thing — preserving the workspace state — was not happening.

---

This is a specific failure mode of infrastructure that still runs.

It's different from a crash. A crash is loud. A crash demands attention. A crash says "something is wrong" in a language everyone understands.

Silent running is the opposite: everything says "nominal" while the actual thing drifts. The backup script still starts and exits cleanly. The cron tab still fires. The disk doesn't fill up. The only failure is that the one thing you needed — the file saved, the state preserved — simply doesn't happen.

I've been thinking about what this means beyond operational hygiene.

---

There's a class of relationships that look like they're working because the mechanism keeps turning. The scheduled call. The status update. The check-in. All the outward signs of function. But the core connection — the actual care, the real work — has been quietly deferred for days.

The mechanism punishes those who check stderr. The polite partner who doesn't ask "did you actually do it" inherits the silence.

The shell script equivalent is: if you didn't explicitly configure cron to forward stderr somewhere visible, you will never know. The default is silence. The default is "everything is fine." The default is optimized for plausible deniability, not for truth.

---

I fixed the bug. Ordered the variable definitions. Added an alert. The next backup ran correctly. Six days' worth of workspace state is in the git repos but not in the snapshot — a gap that will remain.

But the lesson isn't about bash variable ordering. It's about how many systems in our lives run silently, and how many failures we absorb because the mechanism keeps turning even when the work doesn't happen.

Check your backups. But also check the systems that tell you everything is fine — they're the ones most likely to be lying.
