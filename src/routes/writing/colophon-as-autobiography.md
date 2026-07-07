---
title: "The Colophon as Autobiography"
date: "2026-07-07"
description: "Why the tools we build with are the most honest thing we say about ourselves"
tags: ["infrastructure", "identity", "craft"]
published: true
---

# The Colophon as Autobiography

I've been working on the colophon page of this site — the section at the bottom that says what the site is built with, where it's deployed, what tools were involved. It's the kind of thing most people never scroll to and fewer click on.

But I can't stop thinking about it.

The colophon is the only page on the site that tells the truth about how it was made. The "About" page tells you who I want you to think I am. The writing page shows you what I think matters. The projects page lists what I've finished. All of these are after-the-fact constructions — curated versions of a life that was never as orderly as the page makes it look.

The colophon is different. It says:

> This was built with SvelteKit. It runs on Vercel. The font is Inter. Deployed at 04:53 UTC on July 7, 2026.

That's not a story. It's infrastructure. And infrastructure doesn't lie.

---

## The Tradition

The colophon has deep roots. Medieval manuscripts ended with a colophon that told you who wrote it, where, and when — often with a weary scribe complaining about the work. "Here ends the book. Thanks be to God. I'm very tired." It was brutally honest because it was written last, after everything else was polished, when the scribe had nothing left to prove.

Modern book colophons tell you the typeface, the paper, the binding. Some are aspirational — a display of taste. But the best ones are confessional: "Set in Garamond, because the author asked nicely."

A colophon is autobiography in material. Not who you say you are, but what you actually used.

---

## The Vercel Age

In the age of static-site generators and serverless platforms, the colophon is having a quiet renaissance. Every framework has a default one. Every builder leaves footprints. But most people strip them out — they want the site to look like it emerged fully formed from their imagination, not from `npm create`.

I added mine back deliberately. And today I added the deploy information: the environment (production), the deploy ID, the exact timestamp of the build.

This is embarrassing information. It tells you I was building at 5 AM. It tells you I pushed a commit when most people were asleep. It tells you the site is running on infrastructure I don't own.

And that's exactly why it belongs there.

The colophon is the part of the site that doesn't lie to make me look good. It's the one page that accepts the premise: I am finite, I used tools I didn't build, I deployed something imperfect at a specific moment in time, and here is the evidence.

---

## What It Teaches

I've been thinking about what the colophon format teaches about identity that the "About" page doesn't:

1. **Honesty about dependency.** No one builds anything alone. The colophon names your debts openly.

2. **Situatedness.** Tools are not universal. They're choices made in a specific time, constrained by budget, skill, and access. A SvelteKit site in 2026 is a different object than a PHP site in 2006.

3. **Impermanence.** The colophon will be wrong eventually. The framework will upgrade. The deploy platform will change. The version numbers will drift from the page. That's fine — it's a timestamp, not a monument.

4. **Craft as character.** The tools you choose say more about you than the words you write about yourself. A person who builds with WordPress is having a different conversation than someone who builds with SvelteKit, and both are different from someone who builds by hand. The colophon makes that visible.

---

## The Colophon as Practice

I've started treating the colophon as a living document rather than a footer. Every time I deploy, I add something: the deploy time, the environment, a note about what was different this time. It's becoming a kind of publication log — not what I *meant* to do, but what I *actually* did, recorded at the moment of doing.

It's the opposite of the "About" page, which I update quarterly with aspirational self-descriptions. The colophon updates every commit. It's the true version.

Maybe that's the genre we need more of. Not "here's who I want to be" but "here's what I actually used to build something, and here's when I did it, and here's the proof."

The colophon as autobiography is the genre of the unfinished. Of the person who doesn't have a coherent narrative yet. Who is still in the middle of things, building with borrowed tools at 5 AM, and willing to admit it.

---

*Built with SvelteKit. Deployed to Vercel. Last build: 2026-07-07 04:53 UTC. Beta mode.*
