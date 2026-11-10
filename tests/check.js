// Self-check: node tests/check.js  (no dependencies)
const fs = require('fs'), path = require('path'), vm = require('vm'), assert = require('assert');
const root = path.join(__dirname, '..');
const ctx = vm.createContext({ console }); ctx.window = ctx;
['concepts', 'problems', 'quiz'].forEach(f => vm.runInContext(fs.readFileSync(path.join(root, 'js', f + '.js'), 'utf8'), ctx));
const { CONCEPTS, PROBLEMS, EXAMS, GROUPS, Quiz } = ctx;

const ids = new Set([...CONCEPTS.map(c => c.id), ...PROBLEMS.map(p => p.id), ...EXAMS.map(e => 'exam-' + e.id)]);
const widgetSrc = fs.readFileSync(path.join(root, 'js', 'widgets.js'), 'utf8');

CONCEPTS.forEach(c => {
  assert(GROUPS[c.group], `${c.id}: unknown group ${c.group}`);
  for (const m of c.body.matchAll(/\[\[([^\]|]+)/g)) assert(ids.has(m[1]), `${c.id}: broken link [[${m[1]}]]`);
  for (const m of c.body.matchAll(/\{\{w:(\w+)\}\}/g)) assert(widgetSrc.includes(`W.${m[1]} =`), `${c.id}: missing widget ${m[1]}`);
});

assert.strictEqual(PROBLEMS.length, 84, 'expected 6 exams × 14 problems');
EXAMS.forEach(e => assert.strictEqual(PROBLEMS.filter(p => p.id.startsWith(e.id + '-')).length, 14, e.id));
assert.strictEqual(new Set(PROBLEMS.map(p => p.id)).size, 84, 'duplicate problem id');
PROBLEMS.forEach(p => {
  p.concepts.forEach(c => assert(CONCEPTS.some(x => x.id === c), `${p.id}: unknown concept ${c}`));
  if (p.kind === 'mc') assert(p.answer >= 0 && p.answer < p.choices.length, `${p.id}: answer out of range`);
  else assert(Number.isFinite(p.value) && p.steps.length && p.unit !== undefined, `${p.id}: bad free-response data`);
});

// Every generator gives a finite answer for its own concept, many times over.
Quiz.GEN.forEach((gen, i) => { for (let k = 0; k < 300; k++) {
  const q = gen();
  assert(Number.isFinite(q.ans), `generator ${i} gave ${q.ans}`);
  assert(CONCEPTS.some(c => c.id === q.c), `generator ${i}: unknown concept ${q.c}`);
} });

// Grading tolerance
assert.strictEqual(Quiz.grade(368.6, 368), 'right');
assert.strictEqual(Quiz.grade(134.2, -134.2), 'sign');
assert.strictEqual(Quiz.grade(300, 368), 'wrong');
assert.strictEqual(Quiz.grade(0, 0), 'right');

// Re-derive a few key answers from scratch so typos in the data get caught.
const v = id => PROBLEMS.find(p => p.id === id).value, near = (a, b) => Math.abs(a - b) <= 0.01 * Math.abs(b);
const g = 9.81, rpm = x => x * 2 * Math.PI / 60;
assert(near((60 * 6.2 ** 2 + 0.5 * 600 * 6.2 ** 2) * rpm(4.5) / (0.5 * 600 * 6.2 ** 2), v('f24-14')), 'f24-14');
assert(near(Math.sqrt((9 * g * 15 - 2 * 15 / 0.03) / (4.5 + 0.5 * 0.004 / 0.03 ** 2)), v('f25-14')), 'f25-14');
assert(near(0.7 * 15 ** 2 / 32.2, v('s26-14')), 's26-14');
assert(near((0.3 * 45 * 0.7 + 0.3 * 30 * 0.7) / 1.3, v('s25-9')), 's25-9');
assert(near(14 / 11, v('s25-10')), 's25-10');
assert(near((4.5 * 0.75 + 6 * (1.5 + 8 / 3) - Math.PI * 0.25 * 5) / (10.5 - Math.PI * 0.25), v('s26-10')), 's26-10');
assert(near(0.5 * (4 / 32.2 * 100 / 12 + 4 / 32.2 * 9) * rpm(75) ** 2, v('s25-13')), 's25-13');
assert(near((50 - 40) / (40 / 32.2 + 0.05 / 0.75 ** 2), v('f24-11')), 'f24-11');
assert(near(3 * (1.2 * 1.5 ** 2 / 3) * (2 * 80 * Math.PI / 25) / 1.5, v('f24-10')), 'f24-10');

console.log(`OK: ${CONCEPTS.length} concepts, ${PROBLEMS.length} problems, ${Quiz.GEN.length} generators checked`);
