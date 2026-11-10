# Rotation Vault (EF 151, Exam 4)

An interactive, Obsidian-style study vault for EF 151 Module 4 (rotation). It's built from all six past Exam 4 solution keys (Fall 2023 through Spring 2026) and explains every concept as if you've never seen it before.

## Open it
Double-click `index.html`. You don't need to install anything, and it works offline.

## What's inside
- **23 concept notes**, from torque, cross products, center of mass, moment of inertia and the parallel axis theorem through τ = Iα, pulleys, rolling energy and angular momentum. Each one covers what the idea means, the formulas, a step-by-step method, common traps and worked examples from the real exams.
- **All 84 exam problems**, reworded. Multiple-choice problems are clickable and explain the answer. Free-response problems let you type in your own answer and check it, then reveal the solution one step at a time, with "common mistakes" pulled from the grading rubrics.
- **Graph view**: a force-directed map of every note. You can drag it, zoom it and click any node. Each note also has a local graph and a backlinks panel.
- **14 interactive widgets** inside the notes, including a torque playground, cross-product calculator, composite-CM table, ramp race, spinning skater, pulley simulator, seesaw, belt drive and parallel-axis slider.
- **Brain Game**: an endless quiz that mixes the real exam questions with 24 random-number problem generators. It tracks XP and streaks, and it has a "focus on my weakest concepts" mode.
- **Flashcards** and a **progress page**. Mastery rings in the graph fill up as you get questions right. Progress is saved in your browser.
- **Ctrl+K** jumps to any note.

## Files
```
index.html        app shell
css/style.css     theme (dark/light)
js/concepts.js    concept notes (markdown-lite)
js/problems.js    every exam problem + walkthrough
js/graph.js       force-directed graph
js/widgets.js     interactive widgets
js/quiz.js        quiz generators + flashcards
js/app.js         router, renderer, sidebar, progress
tests/check.js    self-check: node tests/check.js
```

`node tests/check.js` checks that every link resolves and every answer index is valid. It also runs each generator 300 times to make sure none of them produces a NaN, and it recalculates several exam answers from scratch.
