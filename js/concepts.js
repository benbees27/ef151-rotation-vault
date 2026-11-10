// Concept notes. Body is a tiny markdown dialect rendered by app.js:
// # headings, - lists, 1. lists, **bold**, *italic*, [[id|label]] links,
// "$$ " formula lines, "> [!tip] Title" callouts, | tables |, {{w:widget}} embeds.
window.GROUPS = {
  hub:        { label: 'Start',          color: '#e5c07b' },
  foundation: { label: 'Foundations',    color: '#9aa5ce' },
  kinematics: { label: 'Kinematics',     color: '#56b6c2' },
  cm:         { label: 'Center of Mass', color: '#98c379' },
  torque:     { label: 'Torque',         color: '#e06c75' },
  inertia:    { label: 'Inertia',        color: '#c678dd' },
  dynamics:   { label: 'Dynamics',       color: '#d19a66' },
  energy:     { label: 'Energy',         color: '#61afef' },
  momentum:   { label: 'Momentum',       color: '#ff79c6' },
  exam:       { label: 'Exams',          color: '#7f848e' },
};

window.CONCEPTS = [
{
  id: 'start-here', title: 'Start Here', group: 'hub',
  body: `
# Welcome to the Rotation Vault
This vault teaches everything on **EF 151 Exam 4 (Module 4: rotation)**, built from all 6 past solution keys (Fall 2023 to Spring 2026). It assumes you have **never seen any of it before**.

> [!tip] How to use this vault
> Every purple word is a link. Click it to jump to that idea. The **graph** on the right shows what the current note connects to. Press **Ctrl+K** to jump anywhere. Green progress rings fill up as you get questions right.

# The big idea in one paragraph
Module 3 was about things that **slide** (push it, it speeds up: F = ma). Module 4 is the exact same physics for things that **spin**. Every sliding idea has a spinning twin:

| Sliding (linear) | Spinning (rotational) | Note |
|---|---|---|
| position x | angle θ | [[angular-kinematics]] |
| velocity v | angular velocity ω | [[angular-kinematics]] |
| acceleration a | angular acceleration α | [[const-alpha]] |
| force F | torque τ | [[torque]] |
| mass m | moment of inertia I | [[moment-of-inertia]] |
| F = ma | τ = Iα | [[newton-rotation]] |
| KE = ½mv² | KE = ½Iω² | [[rot-ke]] |
| momentum p = mv | angular momentum L = Iω | [[angular-momentum]] |
| power P = Fv | power P = τω | [[power-rotation]] |

If you learn the left column's twin for each row, you have learned this module.

# Learning path (do these in order)
1. [[process-method|The PROCESS format]] and [[units|units & conversions]] (free points)
2. [[vectors]] then [[cross-product]]
3. [[angular-kinematics]], [[linear-angular]], [[belts-gears]], [[const-alpha]]
4. [[center-of-mass]]
5. [[torque]] and [[equilibrium]]
6. [[moment-of-inertia]] then [[parallel-axis]]
7. [[newton-rotation]] then [[pulley-systems]]
8. [[rot-ke]], [[rolling]], [[energy-rotation]], [[rolling-resistance]], [[power-rotation]]
9. [[angular-momentum]] then [[coam]]

# What shows up on every exam
{{w:examstats}}

# Every exam
- [[exam-f23|Fall 2023]]
- [[exam-s24|Spring 2024]]
- [[exam-f24|Fall 2024]]
- [[exam-s25|Spring 2025]]
- [[exam-f25|Fall 2025]]
- [[exam-s26|Spring 2026]]

> [!example] Exam shape
> Every exam is 8 quick multiple-choice (2 pts each) + 6 free-response problems (11 to 18 pts each). The free-response ones are almost always: one **center of mass**, one **torque sum**, one **pulley (τ = Iα + F = ma)**, one **energy with rolling**, one **angular momentum or inertia**, one **kinematics/belts**.
`,
  cards: [
    ['Rotational twin of mass m', 'Moment of inertia I'],
    ['Rotational twin of force F', 'Torque τ'],
    ['Rotational twin of F = ma', 'Στ = Iα'],
  ],
},
{
  id: 'process-method', title: 'The PROCESS Format', group: 'foundation',
  body: `
# What it is
Every free-response answer on the exam is graded on a fixed layout. Points are handed out for each box, so following it is free credit even if your final number is wrong.

1. **Problem Statement**: write what you are finding, in symbols (e.g. "Find ω′ of the rod").
2. **Represent**: a picture. For dynamics problems this means **two complete FBD = KD pairs** (see [[newton-rotation]]).
3. **Organize Information**: list every given with units (m = 0.3 kg, r = 0.7 m, ...). Convert units here.
4. **Calculations**: write each equation **in variable form first** (KE = ½Iω²), *then* plug numbers.
5. **Final Answer**: number + units, 3 to 5 significant figures, boxed.

> [!warn] Where people lose points
> - Plugging numbers before writing the variable equation.
> - Only one FBD when the problem says two are required (always pulley + block).
> - Forgetting units on the final answer, or giving 9 significant figures.

# Rubric patterns seen on these keys
| Box | Typical points |
|---|---|
| Problem statement | +1 |
| Organize information | +1 to +4 |
| Each correct FBD = KD | +2 to +4 |
| Variable-form equation | +1 each |
| Each correct intermediate (I, α, a...) | +2 to +5 |
| Final answer | +2 to +4 |
`,
  cards: [['The 5 parts of PROCESS', 'Problem statement, Representation, Organized info, Calculations (variable form first), Final answer with units']],
},
{
  id: 'units', title: 'Units & Conversions', group: 'foundation',
  body: `
# Why this matters
Half the "wrong answers" on rotation problems are unit mistakes, not physics mistakes. The two killers are **rpm** and **pounds**.

# Angles: always radians
Every rotational formula (s = rθ, v = rω, KE = ½Iω²) only works with **radians**. A radian is just "one radius of arc length", so a full circle is 2π radians.
$$ 1 rev = 2π rad = 360°
$$ rpm → rad/s:  ω = (rpm) × 2π / 60

{{w:rpm}}

> [!example] Fall 2023 #13
> 27 rpm × (2π rad / 1 rev) × (1 min / 60 s) = **2.827 rad/s**

# Pounds are a force, not a mass
In US units, "lb" is a **weight**. To get mass you must divide by g:
$$ m (slug) = W (lb) / 32.2 ft/s²
So a "4 lb rod" has m = 4 / 32.2 = 0.1242 slug. Moments of inertia in US units are in **slug·ft²**, energies in **ft·lb**.

| Quantity | SI | US |
|---|---|---|
| mass | kg | slug |
| force / weight | N | lb |
| g | 9.81 m/s² | 32.2 ft/s² |
| I | kg·m² | slug·ft² |
| torque / energy | N·m, J | lb·ft, ft·lb |

> [!warn] Trap
> When you see "weighs 48 lb" or "a 25 lb box", convert to slugs before using it in ½mv², Iα, or md². Only use the raw 48 lb when you want its **weight** (a force), e.g. in mgh you can write W·h directly.

Also: grams to kg (14 g = 0.014 kg, [[s26-11]]), mm to m (40 mm = 0.04 m, [[f23-11]]).
`,
  cards: [
    ['Convert 60 rpm to rad/s', '60 × 2π / 60 = 2π ≈ 6.283 rad/s'],
    ['Mass of a 32.2 lb object', '1 slug'],
    ['Why radians?', 'Formulas like s = rθ and v = rω only hold when θ is in radians'],
  ],
},
{
  id: 'vectors', title: 'Vectors & Unit Vectors', group: 'foundation',
  body: `
# What a vector is
A vector is an arrow: it has a **size** (magnitude) and a **direction**. We describe it with three numbers, one per axis, using the **unit vectors** î, ĵ, k̂ (arrows of length 1 pointing along x, y, z).
$$ A = (1î + 3ĵ + 5k̂) means "1 along x, 3 along y, 5 along z"

# Axis directions
- **x**: right
- **y**: up (on the page)
- **z**: straight **out of the page** toward you

That last one matters: rotation on a flat page happens "around z". Counterclockwise (CCW) spin points along **+k̂** (out of the page); clockwise (CW) points along **−k̂**. This is why the exams say **"CCW is positive"**.

# Breaking a force into components
A force F at angle θ from horizontal:
$$ Fx = F cos θ,   Fy = F sin θ
Draw the little right triangle every time. If the angle is measured from the **vertical**, sin and cos swap. Seen in [[torque]] problems on every exam.

Next: [[cross-product]].
`,
  cards: [['Which way does +k̂ point?', 'Out of the page, toward you. CCW rotation = +k̂']],
},
{
  id: 'cross-product', title: 'Cross Product', group: 'foundation',
  body: `
# What it is
The cross product A × B takes two vectors and gives a **third vector perpendicular to both**. Torque is defined with it: τ = r × F ([[torque]]), and so is angular momentum ([[angular-momentum]]).

# Way 1: the unit-vector cycle (fastest for MC)
Write î → ĵ → k̂ → î in a circle.
- Going **with** the arrows gives **+**: î × ĵ = k̂, ĵ × k̂ = î, k̂ × î = ĵ
- Going **against** gives **−**: ĵ × î = −k̂, k̂ × ĵ = −î, î × k̂ = −ĵ
- Anything crossed with itself is **0**: k̂ × k̂ = 0 ([[s25-7]])

# Way 2: the component formula
$$ (A × B)x = Ay·Bz − Az·By
$$ (A × B)y = Az·Bx − Ax·Bz
$$ (A × B)z = Ax·By − Ay·Bx
Memory trick: for the x-part, cover the x column and do "y z minus z y". The pattern always cycles x → y → z → x.

{{w:cross}}

# Key facts that get tested
- **Order matters**: A × B = −(B × A). So "r × F = F × r" is **False** ([[s24-7]]).
- The result is **perpendicular to the plane** containing both vectors ([[s24-8]]).
- Size: |A × B| = |A||B| sin θ. Parallel vectors give 0.

> [!example] Fall 2025 #2
> A = (1, 3, 5), B = (2, −4, −6). y-component = Az·Bx − Ax·Bz = 5·2 − 1·(−6) = 10 + 6 = **16**.

# Right-hand rule
Point your fingers along the first vector, curl them toward the second. Your thumb points along the result. For torque: fingers along r (pivot → where the force acts), curl toward F, thumb gives the torque direction. Used in [[s26-1]] (door torque points **down**).
`,
  cards: [
    ['î × ĵ', 'k̂'],
    ['ĵ × î', '−k̂'],
    ['k̂ × k̂', '0'],
    ['(A × B)y formula', 'Az·Bx − Ax·Bz'],
    ['Is r × F = F × r?', 'No: A × B = −B × A'],
  ],
},
{
  id: 'angular-kinematics', title: 'Angular Position, Velocity, Acceleration', group: 'kinematics',
  body: `
# Picture it
Stick a dot on a spinning wheel. Instead of tracking where the dot is in x and y, track **the angle it has swept**.

- **θ (theta)**, angular position: how far it has turned, in radians.
- **ω (omega)**, angular velocity: how fast θ changes, rad/s. ω = dθ/dt
- **α (alpha)**, angular acceleration: how fast ω changes, rad/s². α = dω/dt

> [!tip] Every point on a rigid body shares θ, ω, α
> The hub and the rim of a wheel turn through the same angle in the same time. So **angular velocity and angular acceleration are the same everywhere** on a rigid body ([[f25-6]]), and it doesn't matter where you sit on a merry-go-round: same ω ([[s26-8]]). What changes with distance is the **linear** speed: see [[linear-angular]].

# Derivatives (when θ is given as a formula)
If θ(t) is given, differentiate to get ω, differentiate again for α.
> [!example] Fall 2023 #3
> θ = 6 + 4t^(3/2). ω = dθ/dt = 4 · (3/2) t^(1/2) = 6√t. At t = 9 s: ω = 6·3 = **18 rad/s**. (114 is θ itself; a trap.)

# Period and frequency
- **Period T**: time for one full revolution. T = (total time) / (number of revs).
- 6 revolutions in 3 minutes → T = 0.5 min ([[s26-7]]).
- ω = 2π / T.

For constant α problems, go to [[const-alpha]]. For converting rpm, see [[units]].
`,
  cards: [
    ['ω is the derivative of ___', 'θ (angular position)'],
    ['Do all points of a rigid body share ω?', 'Yes, and α too. Only linear speed changes with radius'],
    ['Period from revs and time', 'T = time / revolutions'],
  ],
},
{
  id: 'linear-angular', title: 'Linking Linear & Angular Motion', group: 'kinematics',
  body: `
# The bridge equations
A point at distance r from the axis moves along a circle. Its **linear** quantities are the angular ones times r:
$$ s = r θ      (arc length)
$$ v = r ω      (tangential speed)
$$ a_t = r α    (tangential acceleration)
$$ a_n = r ω²   (normal / centripetal acceleration, points to the center)

θ, ω, α must be in radians. That's the whole reason radians exist.

# What this means physically
- Farther from the axis = faster. Sam at 2r moves **twice as fast** as Jace at r, so Jace is **half** Sam ([[f24-5]]).
- If ω is constant, α = 0, so a_t = 0 for **everyone**, near or far ([[s24-4]]). (They still have a_n, which is not the same.)
- A rope wrapped on a reel/pulley that doesn't slip: rope length pulled = rθ, rope speed = rω, rope (and hanging block) acceleration = rα. This is the **constraint** you use in every [[pulley-systems]] problem: **α = a / r**.

> [!example] Fall 2025 #11 (fishing reel)
> Reel turns θ = 128 rad. Line pulled out: s = rθ = 0.05 × 128 = **6.4 m**.

# Rolling without slipping
For a ball or wheel rolling (not skidding): v_center = rω and a_center = rα, where r is the radius **that touches the ground**. For a hollow cylinder that's the **outer** radius ([[s24-6]]). See [[rolling]].
`,
  cards: [
    ['Arc length formula', 's = rθ'],
    ['Tangential speed', 'v = rω'],
    ['Tangential acceleration', 'a_t = rα'],
    ['Pulley constraint', 'α = a / r (rope does not slip)'],
  ],
},
{
  id: 'belts-gears', title: 'Belts, Gears & Connected Pulleys', group: 'kinematics',
  body: `
# Two rules to memorize
**Rule 1: Things connected by a belt (or touching gears) share linear speed at the rim.**
The belt can't stretch, so every point on it moves at the same speed, and the rims it touches move with it:
$$ r₁ω₁ = r₂ω₂     and also     r₁α₁ = r₂α₂     and     r₁θ₁ = r₂θ₂
So the **small** pulley spins **faster** ([[f25-3]]: ω₁ > ω₂ for the smaller pulley 1).

**Rule 2: Things on the same axle share angular quantities.**
A pulley and a saw blade bolted on one shaft have the **same** ω and α, even though their radii differ.

# Recipe
1. Draw the chain: motor → (belt) → pulley → (axle) → blade.
2. Across a belt: multiply/divide by radii (rω same).
3. Across an axle: copy ω/α straight over.
4. At the end, convert to linear speed with v = rω using the radius of the point you care about.

> [!example] Fall 2023 #11 (table saw)
> Motor α = 9.4 rad/s², r = 40 mm. Belt → pulley r = 60 mm: α_p = 9.4·40/60 = 6.267 rad/s². Same axle → blade α = 6.267. Blade edge (r = 90 mm) needs v = 30 m/s → ω = 30/0.09 = 333.3 rad/s. From rest: t = ω/α = **53.2 s**.

{{w:belt}}

Related: [[const-alpha]], [[linear-angular]].
`,
  cards: [
    ['Belt-connected pulleys share...', 'Rim speed: r₁ω₁ = r₂ω₂'],
    ['Same-axle parts share...', 'ω and α (angular quantities)'],
    ['Which spins faster on a belt, big or small pulley?', 'The small one'],
  ],
},
{
  id: 'const-alpha', title: 'Constant Angular Acceleration', group: 'kinematics',
  body: `
# Same 4 equations as Module 2, new letters
If α is constant, just swap x→θ, v→ω, a→α in the kinematics equations you already know:

| Linear | Rotational | Missing variable |
|---|---|---|
| v = v₀ + at | ω = ω₀ + αt | θ |
| x = x₀ + v₀t + ½at² | θ = θ₀ + ω₀t + ½αt² | ω |
| v² = v₀² + 2aΔx | ω² = ω₀² + 2αΔθ | t |
| x = x₀ + ½(v₀+v)t | θ = θ₀ + ½(ω₀+ω)t | α |

# Recipe
1. List the five: θ₀/Δθ, ω₀, ω, α, t. Mark which three you know.
2. Pick the equation that **doesn't contain** the one you neither know nor want.
3. Convert revolutions to radians first (40 rev = 80π rad).
4. "Starts from rest" means ω₀ = 0.

{{w:kin}}

> [!example] Fall 2024 #10 (fan)
> 40 rev in 5 s from rest. θ = 80π = 251.3 rad. θ = ½αt² → α = 2θ/t² = **20.11 rad/s²**.
> Trap from the rubric: finding ω_final as θ/t and then α = ω/t loses points, because θ/t is the **average** ω, not the final.

> [!example] Spring 2024 #12 (two pulleys)
> Pulley A turns 18 rad in 4 s from rest. Average-ω equation: 18 = ½(0 + ω)(4) → ω_A = 9 rad/s. Belt: ω_B = 9·0.14/0.30 = 4.2 rad/s. Point P at 0.25 m: v = 4.2·0.25 = **1.05 m/s**.

Used inside [[newton-rotation]] problems (find α from motion, then τ = Iα) and [[belts-gears]].
`,
  cards: [
    ['ω with constant α', 'ω = ω₀ + αt'],
    ['θ with constant α', 'θ = θ₀ + ω₀t + ½αt²'],
    ['Equation without time', 'ω² = ω₀² + 2αΔθ'],
    ['40 revolutions in radians', '80π ≈ 251.3 rad'],
  ],
},
{
  id: 'center-of-mass', title: 'Center of Mass', group: 'cm',
  body: `
# What it is
The **center of mass (CM)** is the single point where you could pretend all the object's mass is squeezed. Balance a ruler on your finger: your finger is under the CM.

Why care?
- A thrown or floating object **spins about its CM** if nothing external acts on it ([[f24-1]]).
- Gravity acts as if it pulls only at the CM.
- The CM is the "average position" of the mass, weighted by how much mass is where.

# Intuition rules (great for multiple choice)
- It lies on any **line of symmetry** if one exists ([[s26-3]]). It does **not** have to be on the object (a donut's CM is in the hole) and it's not always at the "geometric center".
- It's pulled toward the **heavier** stuff ([[s24-1]]).
- A hole moves the CM **away** from the hole ([[f25-7]]).
- Velocity of the CM is the mass-weighted average velocity. Two equal masses at 1 and 3 m/s → v_cm = 2 m/s ([[s25-2]]).

# The formula
$$ x̄ = Σ(Aᵢ·x̄ᵢ) / ΣAᵢ        (flat shapes, uniform thickness & density)
$$ x̄ = Σ(mᵢ·xᵢ) / Σmᵢ        (point masses)
Same for ȳ with y-values. "Uniform thickness and density" is the exam's way of saying **you can use area instead of mass**.

# Recipe for composite shapes (one per exam, 13 to 14 pts)
1. **Chop** the shape into rectangles, triangles, circles, semicircles.
2. **Holes are negative area.** A circular hole gets A = −πr².
3. For each piece find **area A** and the **x̄ of that piece measured from the origin** (not from the piece's own corner).
4. Make the table: Shape | A | x̄ | A·x̄.
5. Divide total A·x̄ by total A.

| Shape | Area | Centroid (from the shape's own reference) |
|---|---|---|
| Rectangle | b·h | b/2 from a side |
| Right triangle | ½·b·h | b/3 from the **right-angle (tall) side**, 2b/3 from the pointy end |
| Circle | πr² | at its center |
| Semicircle | ½πr² | 4r/(3π) from the flat edge |

> [!warn] The triangle trap
> The centroid is **1/3 of the way from the fat side**. If the vertical (right-angle) side is on the left, x̄ = x_start + b/3. If the vertical side is on the right (triangle ramps up to the right), x̄ = x_start + 2b/3. Sketch it and ask "which side has more stuff?"

{{w:cm}}

> [!example] Spring 2026 #10
> Rectangle 1.5×3: A = 4.5, x̄ = 0.75. Triangle b = 4, h = 3 ramping up to the right starting at 1.5: A = 6, x̄ = 1.5 + (2/3)(4) = 4.167. Hole r = 0.5 at x = 5: A = −0.7854.
> x̄ = (3.375 + 25 − 3.927) / (4.5 + 6 − 0.7854) = 24.45 / 9.715 = **2.517 ft**.

Exam problems: see the backlinks panel.
`,
  cards: [
    ['Composite CM formula', 'x̄ = Σ(A·x̄ᵢ) / ΣA'],
    ['How to handle a hole', 'Negative area (and negative A·x̄)'],
    ['Right-triangle centroid', '1/3 of the base from the right-angle side'],
    ['Semicircle centroid from flat edge', '4r / (3π)'],
    ['Is the CM always on the object?', 'No (e.g. a ring or L-shape)'],
  ],
},
{
  id: 'torque', title: 'Torque', group: 'torque',
  body: `
# What it is
**Torque (τ, "tau")** is a force's ability to make something **spin**. Push a door at the handle and it swings easily. Push right next to the hinge and nothing happens. Push straight at the hinge (along the door) and nothing happens either. Torque captures both effects:
$$ τ = r × F        magnitude: τ = r·F·sin θ = r⊥·F = r·F⊥
- **r**: arrow from the pivot to where the force is applied.
- **θ**: angle between r and F.
- **r⊥ (moment arm)**: the perpendicular distance from the pivot to the force's **line of action** (the infinite line the force lies on).

{{w:torque}}

# The 3 ways a force makes zero torque
1. It's applied **at** the pivot (r = 0).
2. It points **straight toward or away** from the pivot (θ = 0° or 180°). Least effective door push: [[f24-2]].
3. Its **line of action passes through the pivot** ([[f25-1]], [[s26-5]]).
Max torque is at θ = 90° (force perpendicular to the arm, [[s25-3]]).

> [!tip] Sliding a force along its line doesn't change its torque
> Same magnitude, same direction, same line of action → same torque ([[f23-6]]).

# Signs
Exams say **"counterclockwise is positive"**. For each force, imagine the object pinned at the pivot: if this force alone would spin it CCW, +; CW, −. (Why CCW? Because CCW points along +k̂, out of the page, see [[vectors]].)

# Recipe: torque from several forces (one per exam, 14 to 15 pts)
1. Put the pivot at the origin. Write each force's application point (x, y) relative to it.
2. Split every angled force into Fx and Fy ([[vectors]]).
3. For each component: torque = (component) × (perpendicular distance), with a sign.
   - A **vertical** component's arm is the **horizontal** distance.
   - A **horizontal** component's arm is the **vertical** distance.
   - Equivalent formula that handles signs automatically: **τ = x·Fy − y·Fx**.
4. Add them all up. Report with sign (or "25.7 N·m CW").

| Force part | Value | Arm | Torque |
|---|---|---|---|
| fill in one row per component | | | |

> [!example] Fall 2023 #14
> 24 lb at 20° from vertical, 3 ft right of A: vertical part 24cos20 = 22.55 lb down → −22.55·3 = −67.65. Horizontal part's line goes through A → 0.
> 32 lb at 40° below horizontal at (8 ft, 4 ft): vertical 20.57 down → −164.56; horizontal 24.51 to the left, 4 ft above A → +98.04.
> Total **−134.2 lb·ft** (CW).

# Torque as a vector
Because τ = r × F ([[cross-product]]), torque points **perpendicular to the plane of r and F** ([[s24-8]]). For flat problems that's ±k̂, which is why we just use + and −.
`,
  cards: [
    ['Torque magnitude', 'τ = rF sin θ = r⊥F'],
    ['3 ways to get zero torque', 'Force at the pivot, force along r, or line of action through the pivot'],
    ['τ from components', 'τ = x·Fy − y·Fx'],
    ['Angle for max torque', '90° between r and F'],
    ['Exam sign convention', 'CCW positive'],
  ],
},
{
  id: 'equilibrium', title: 'Rotational Equilibrium (Balance)', group: 'torque',
  body: `
# What it is
An object is in **rotational equilibrium** when the torques cancel: Στ = 0. Then α = 0 (it either stays still or spins at constant ω). If the forces also cancel (ΣF = 0), it doesn't accelerate at all.

# Seesaws
A seesaw balances when the CCW torques equal the CW torques:
$$ m₁·g·d₁ = m₂·g·d₂
> [!example] Fall 2024 #3
> Both kids move to half their distance. Both torques get cut in half, so they're still equal: **still balanced**. You don't need the masses.

{{w:seesaw}}

# "Which force makes the disk not accelerate?"
Pick the force whose torque exactly cancels the existing one.
> [!example] Spring 2025 #1
> A force F pushes right at about r/2 above the pivot → CW torque F·(r/2). At B (left edge, arm r), a downward force makes CCW torque. Need f·r = F·r/2 → f = ½F downward: **Z**.

Next: what happens when the torques **don't** cancel → [[newton-rotation]]. Torque basics: [[torque]].
`,
  cards: [['Rotational equilibrium condition', 'Στ = 0 (so α = 0)'], ['Seesaw balance', 'm₁d₁ = m₂d₂']],
},
{
  id: 'moment-of-inertia', title: 'Moment of Inertia', group: 'inertia',
  body: `
# What it is
**Mass moment of inertia (I)** is how hard something is to **spin up or slow down**. It's the rotational version of mass, but it depends on **where** the mass is, not just how much:
$$ I = Σ mᵢ rᵢ²     (each bit of mass × its distance² from the axis)
Mass far from the axis counts a lot (distance is **squared**). That's why:
- A rod is much harder to spin about its **end** than its middle ([[s26-2]]).
- A hollow sphere (all mass at the edge) has a bigger I than a solid one of the same mass.
- A diver stretched out has a bigger I than when tucked ([[s24-3]]).
- Moving the sliding masses on the arms **inward** lowers I, so that system spins up faster and its block falls faster ([[f25-8]]).

# The shape table (you're given this on the exam sheet)
| Shape | Axis | I |
|---|---|---|
| Point mass | distance r away | m r² |
| Thin rod | through center | (1/12) m L² |
| Thin rod | through one end | (1/3) m L² |
| Solid cylinder / disk | center | (1/2) m r² |
| Thin hoop / hollow cylinder | center | m r² |
| Solid sphere | center | (2/5) m r² |
| Hollow sphere | center | (2/3) m r² |
| Rectangular plate | center, ⊥ to plate | (1/12) m (h² + w²) |
| Door (plate about its edge) | hinge | (1/3) m w² |

Units: kg·m² or slug·ft² ([[units]]).

# Composite objects: just add
I_total = I₁ + I₂ + ... **as long as every I is about the same axis**. If a piece's I is given about its own center but the axis is somewhere else, shift it with the [[parallel-axis]] theorem first.

> [!example] Fall 2024 #10 (fan)
> Each blade is a rod about its end: I = (1/3)(1.2)(1.5)² = 0.9 kg·m². Three blades: I = **2.7 kg·m²**. (Using only one blade lost points.)

{{w:inertia}}
`,
  cards: [
    ['I of a point mass', 'm r²'],
    ['I of rod about center', '(1/12) m L²'],
    ['I of rod about end', '(1/3) m L²'],
    ['I of solid disk/cylinder', '(1/2) m r²'],
    ['I of solid sphere', '(2/5) m r²'],
    ['I of hoop', 'm r²'],
    ['Why does a hollow sphere have bigger I than a solid one?', 'Its mass is farther from the axis (r² weighting)'],
  ],
},
{
  id: 'parallel-axis', title: 'Parallel Axis Theorem', group: 'inertia',
  body: `
# What it is
The shape table only gives I about the **center of mass**. When something spins about a **different** axis (parallel to that one), use:
$$ I_axis = I_cm + m d²
**d** = straight-line distance between the CM and the new axis.

# Consequences
- The md² term is never negative, so **I is smallest about the CM**. Any other axis gives a bigger I ([[s25-8]]).
- Check: rod about its end. I_cm = (1/12)mL², d = L/2 → (1/12)mL² + m(L/2)² = **(1/3)mL²**. ✓ The table agrees.

{{w:parallel}}

# Finding d
- On a line: d = |position of CM − position of axis|.
- In 2D: d = √(Δx² + Δy²). Disk centered at (0.3, 0.3), axis at origin → d = √0.18 = **0.424 m** ([[f23-4]]).

# Recipe for multi-piece objects (mallets, rod + sphere, rod + plate)
1. For each piece: I_cm from the table.
2. Find each piece's CM distance d to the axis (draw it!).
3. I_piece = I_cm + m d².
4. Add the pieces.

> [!example] Fall 2025 #10 (mallet)
> Handle rod 1.4 kg, L = 0.35 m, CM at 0.175 m from the bottom, axis P 0.05 m above bottom → d = 0.125 m. I = (1/12)(1.4)(0.35²) + 1.4(0.125²) = 0.03617.
> Head cylinder 2.25 kg, r = 0.05 m, CM 0.35 m from P: I = ½(2.25)(0.05²) + 2.25(0.35²) = 0.27844.
> Total **0.315 kg·m²**.

> [!example] Spring 2026 #12 (run it backwards)
> Given KE_rot = 170 ft·lb at 9 rad/s → I_pivot = 2·170/81 = 4.198. I_cm = (1/12)(48/32.2)(3.6²) = 1.610. Solve 4.198 = 1.610 + (1.4907)d² → d = **1.318 ft**.
`,
  cards: [
    ['Parallel axis theorem', 'I = I_cm + m d²'],
    ['About which axis is I smallest?', 'Through the center of mass'],
    ['d in the theorem is...', 'Distance between the CM and the new (parallel) axis'],
  ],
},
{
  id: 'newton-rotation', title: "Newton's 2nd Law for Rotation (Στ = Iα)", group: 'dynamics',
  body: `
# What it is
Net torque causes angular acceleration, the same way net force causes linear acceleration:
$$ Στ = I α        (twin of ΣF = m a)
Bigger torque → spins up faster. Bigger I → harder to spin up.

# FBD = KD (the picture the exam requires)
- **FBD (free body diagram)**: the object alone with every **force** drawn where it acts.
- **KD (kinetic diagram)**: the same object with the **result**: an "ma" arrow for something sliding, an "Iα" curl for something spinning.
- "FBD = KD" means: sum of the forces/torques on the left equals the ma / Iα on the right.

For a pulley: FBD has tensions at the rim, weight and an axle force at the center (those two make no torque). KD is a curl labeled Iα.

# Recipe
1. Choose a positive rotation direction (usually the way it will actually spin, or CCW if told).
2. Draw FBD = KD.
3. Στ about the axle = ± Iα. Forces through the axle drop out.
4. If you know the motion (from [[const-alpha]]), get α first, then τ, then the force: F = τ / (r sin θ).

> [!example] Fall 2024 #10 (fan)
> α = 20.11 rad/s², I = 2.7 kg·m² → τ = Iα = 54.30 N·m. Force at the blade tip, perpendicular: F = τ / r = 54.30 / 1.5 = **36.2 N**.

When a rope connects the spinning thing to a sliding/hanging mass, you have **two** objects and need the [[pulley-systems]] recipe.
`,
  cards: [
    ["Newton's 2nd law for rotation", 'Στ = Iα'],
    ['What does the KD show for a pulley?', 'An Iα curl (for a block: an ma arrow)'],
    ['Do the axle force and pulley weight make torque about the axle?', 'No, they act through the axle'],
  ],
},
{
  id: 'pulley-systems', title: 'Pulley + Block Systems', group: 'dynamics',
  body: `
# Shows up on every single exam (14 to 18 pts)
A rope wraps a pulley (which has mass, so it has I) and connects to a block or cart. You need **two** objects, **two** FBD = KDs, **two** equations, and the rope constraint.

# Recipe
1. **Pick directions that agree.** If the block goes up, which way does the pulley turn? Call both positive.
2. **Block**: ΣF = m a. Example (lifting): T − W = m a. (Sliding cart on a frictionless table: T = m a.)
3. **Pulley**: Στ = Iα. Each rope tension acts at the rim with arm r. Example: F·r − T·r = I α.
4. **Constraint**: rope doesn't slip → **α = a / r**.
5. Substitute and solve the 2 equations for the 2 unknowns.

> [!warn] Tension is NOT the weight
> If the block accelerates, T ≠ mg. Only when a = 0 is T = W. That's why a person pulling with 890 N accelerates block A faster than hanging an 890 N weight: the hanging weight's own mass also has to be accelerated, so the rope tension ends up **less** than 890 N ([[f24-8]]).

{{w:pulley}}

> [!example] Spring 2025 #10 (cart + pulley + 35 N pull)
> Cart: T = 20a. Pulley (I = ½·15·0.4² = 1.2): T(0.4) − 35(0.4) = −1.2·(a/0.4).
> Substitute: 8a − 14 = −3a → **a = 1.27 m/s²**.

> [!example] Fall 2023 #9 (find the pull)
> Box: 350 − 30(9.81) = 30a → a = 1.857 m/s², α = a/r = 4.642.
> Pulley: 350(0.4) − F(0.4) = −1.6(4.642) → **F = 368 N**.

> [!example] Fall 2025 #14 (resistive torque)
> A friction torque on the axle is just one more term in Στ: τ_r − T·r = −Iα. Or use energy: the work lost is τ_r·θ ([[energy-rotation]]).

Related: [[newton-rotation]], [[linear-angular]], [[moment-of-inertia]].
`,
  cards: [
    ['Two equations for a pulley-block problem', 'Block: ΣF = ma. Pulley: Στ = Iα'],
    ['Rope constraint', 'α = a / r'],
    ['Is rope tension equal to the hanging weight?', 'Only if nothing accelerates'],
  ],
},
{
  id: 'rot-ke', title: 'Rotational Kinetic Energy', group: 'energy',
  body: `
# What it is
A spinning object has energy even if it isn't going anywhere (a flywheel, a spinning top):
$$ KE_rot = ½ I ω²        (twin of ½ m v²)
A rolling object has **both**: ½mv² for its center moving and ½Iω² for the spin.

# Recipe
1. Get I about the **actual** rotation axis (use [[parallel-axis]] if it spins about a non-CM point).
2. Convert ω to rad/s ([[units]]).
3. Plug in.

> [!example] Spring 2025 #13
> 10 ft, 4 lb rod spinning about A, 3 ft from its center, at 75 rpm.
> m = 4/32.2 = 0.1242 slug. I_cm = (1/12)(0.1242)(10²) = 1.035. I_A = 1.035 + 0.1242(3²) = 2.153 slug·ft². ω = 7.854 rad/s.
> KE = ½(2.153)(7.854²) = **66.4 ft·lb**.

# Translational vs rotational share for rolling
For something rolling, v = ωr, so KE_rot = ½(k m r²)(v/r)² = k·(½mv²), where I = k m r².
| Shape | k | KE_rot / KE_trans |
|---|---|---|
| Solid sphere | 2/5 | 0.4 → translational is bigger ([[f25-5]]) |
| Solid cylinder | 1/2 | 0.5 |
| Hollow sphere | 2/3 | 0.67 |
| Hoop | 1 | 1 (equal) |

Next: [[rolling]] and [[energy-rotation]].
`,
  cards: [
    ['Rotational KE', '½ I ω²'],
    ['Rolling solid sphere: bigger KE_trans or KE_rot?', 'Translational (KE_rot is 2/5 of it)'],
  ],
},
{
  id: 'rolling', title: 'Rolling Without Slipping', group: 'energy',
  body: `
# What "without slipping" means
The bit of the wheel touching the ground is **momentarily at rest** (it isn't skidding). That gives the rolling constraint:
$$ v = ω r     and     a = α r      (r = radius touching the ground)
Because the contact point doesn't slide, the friction there is **static** friction ([[f23-2]]). Rolling down a ramp, static friction points **up** the ramp: it's what supplies the torque that spins the object up.

# The ramp race (asked constantly)
Who reaches the bottom first? Energy: mgh = ½mv² + ½(k m r²)(v/r)² gives
$$ v = √( 2gh / (1 + k) )
**Mass and radius cancel!** Only the shape factor k (from I = k m r²) matters.
- Any two **solid spheres** tie, whatever their mass or size ([[s25-6]], [[s26-4]]).
- Solid beats hollow: smaller k → less energy "wasted" on spinning → faster ([[f24-7]]).
- Order: solid sphere (0.4) > solid cylinder (0.5) > hollow sphere (0.67) > hoop (1).

{{w:race}}

# Hollow cylinders
The radius in v = ωr is the one touching the ground: the **outer** radius r₂ ([[s24-6]]).

For full energy problems with losses or forces, see [[energy-rotation]].
`,
  cards: [
    ['Rolling constraint', 'v = ωr (r touching the ground)'],
    ['Friction on a rolling (no-slip) object is...', 'Static'],
    ['Do mass and radius matter in a rolling race?', 'No, only the shape factor k'],
    ['Which wins: solid or hollow sphere?', 'Solid (smaller I relative to mr²)'],
  ],
},
{
  id: 'energy-rotation', title: 'Conservation of Energy (with Rotation)', group: 'energy',
  body: `
# The master equation
Exactly Module 3's energy equation, plus a rotational KE term on each side:
$$ KE_t,i + KE_r,i + U_g,i + W_in = KE_t,f + KE_r,f + U_g,f + E_loss
- KE_t = ½mv² (translational)
- KE_r = ½Iω² (rotational, [[rot-ke]])
- U_g = mgh (height above your chosen datum)
- W_in = work put in: a push F over distance d → F·d ([[f24-13]])
- E_loss = energy lost to friction/drag. A resistive **torque** τ_r over angle θ loses τ_r·θ ([[f25-14]])

# Recipe (14 to 16 pts every exam)
1. Draw initial and final states. **Pick a datum** (h = 0) at the lowest point.
2. Write the full equation, then **cross out the zeros** (starts at rest → KE_i = 0; at the datum → U = 0). The keys literally strike them out in red; do the same.
3. Use the [[rolling]] constraint ω = v/r to turn KE_r into something with v.
4. On an incline: h = d·sin θ.
5. Solve.

> [!example] Spring 2025 #11 (find the loss)
> 4 kg ball, r = 0.06 m, I = 0.007, v = 3 m/s at the bottom, rolls 2.2 m up a 15° hill and stops.
> ω₁ = 3/0.06 = 50 rad/s. h₂ = 2.2 sin 15° = 0.5694 m.
> ½(4)(3²) + ½(0.007)(50²) = 4(9.81)(0.5694) + E_loss → 18 + 8.75 = 22.34 + E_loss → **E_loss = 4.41 J**.

> [!example] Spring 2026 #14 (find the height)
> mgh = ½mv² + ½(2/5 m r²)(v/r)² → gh = (7/10)v². Mass and radius cancel.
> h = 0.7(15²)/32.2 = **4.891 ft**.

> [!example] Fall 2025 #14 (resistive torque)
> mgh = ½mv² + ½I(v/r)² + τ_r·(h/r). 1324.35 = 4.5v² + 2.222v² + 1000 → **v = 6.95 m/s**.

{{w:energy}}
`,
  cards: [
    ['Energy equation with rotation', 'KE_t + KE_r + U_g + W_in (initial) = KE_t + KE_r + U_g + E_loss (final)'],
    ['Work lost to a resistive torque', 'τ_r × θ (θ in radians)'],
    ['Height on an incline', 'h = d sin θ'],
  ],
},
{
  id: 'rolling-resistance', title: 'Rolling Resistance', group: 'energy',
  body: `
# What it is
Even a perfectly rolling wheel slowly loses energy because the wheel and ground **squish** at the contact patch. The more they deform, the more energy is lost. This is measured by the **coefficient of rolling resistance**: lower = rolls more easily.

# The rule
**Hard on hard rolls best. Soft or squishy rolls worst.**
- Steel wheels on steel rails: tiny deformation → **lowest** ([[s25-5]]).
- Car tires on asphalt: medium.
- Car tires on sand: the sand gives way → highest.
- A **high-pressure** tire is stiffer, flattens less → less rolling resistance than a low-pressure one ([[f23-8]]).
`,
  cards: [['Lowest rolling resistance pair', 'Steel wheel on steel rail'], ['Higher tire pressure → rolling resistance?', 'Lower']],
},
{
  id: 'power-rotation', title: 'Rotational Power', group: 'energy',
  body: `
# What it is
Power is how fast work is done. For sliding, P = F·v. For spinning, swap in the twins:
$$ P = τ · ω      (watts = N·m × rad/s)
Not τ·α ([[s24-2]]). Quick check: τ·ω has units N·m/s = J/s = W. ✓

Work done by a constant torque: W = τ·θ (twin of F·d), which is the same idea as the resistive-torque loss in [[energy-rotation]].
`,
  cards: [['Rotational power', 'P = τω'], ['Work by a torque', 'W = τθ']],
},
{
  id: 'angular-momentum', title: 'Angular Momentum', group: 'momentum',
  body: `
# What it is
Angular momentum (L) is "how much spin" something has, the rotational twin of p = mv.
$$ L = I ω              (spinning rigid body)
$$ L = r × p = m v r⊥   (a particle moving past a point)
Units: kg·m²/s (same as N·m·s).

# A particle moving in a straight line has angular momentum too!
A ball flying past a pivot has L = m·v·r⊥ about that pivot, where r⊥ is the perpendicular distance from the pivot to the ball's path. So an object moving in a straight line can have **both linear and angular momentum** ([[s26-6]]). This is the key to every ball-hits-rod or ball-hits-door problem ([[coam]]).

# Composite bodies
Add up I first ([[moment-of-inertia]], [[parallel-axis]]), then L = I_total·ω.
> [!example] Fall 2023 #13
> Rod (15 kg, 3.4 m, pivot at its center): I = (1/12)(15)(3.4²) = 14.45. Plate (5.2 kg, 1.6 × 0.64 m, center 2.02 m below the pivot): I = (1/12)(5.2)(0.64² + 1.6²) + 5.2(2.02²) = 22.51. ω = 27 rpm = 2.827 rad/s.
> L = (36.96)(2.827) = **104.5 kg·m²/s**.

# Torque changes L
$$ Στ = ΔL / Δt
No net external torque → L can't change → [[coam]].
`,
  cards: [
    ['Angular momentum of a spinning body', 'L = Iω'],
    ['Angular momentum of a particle', 'L = m v r⊥'],
    ['Can something moving in a straight line have angular momentum?', 'Yes, about any point not on its path'],
  ],
},
{
  id: 'coam', title: 'Conservation of Angular Momentum', group: 'momentum',
  body: `
# The rule
If **no net external torque** acts on a system, its total angular momentum stays constant ([[f25-4]]):
$$ Σ L_initial = Σ L_final      →     I₁ω₁ = I₂ω₂
Note: it's torque, not force. A spinning thing on a frictionless axle can have forces from the axle and still conserve L, because those forces act through the axis.

{{w:skater}}

# Four flavors you'll see

**1. Something changes its shape (I changes)**
I goes up → ω goes down, and vice versa.
- Skater pulls arms in: I ↓ → ω ↑ ([[f23-5]]). Energy is **not** conserved (KE = L²/2I goes up; her muscles do work).
- Satellite opens solar panels, I triples → ω drops to **1/3 rpm** ([[s25-4]]).
- Kid walks to the middle of a merry-go-round: I ↓ → spins faster ([[f24-14]]).

**2. Mass lands on a spinning thing (I increases)**
Rain filling the buckets, clay dropped on a potter's wheel. More I, same L → **slows down** ([[f24-4]], [[f25-13]]).

**3. Ball hits a pivoted rod/door**
Use L = m·v·r for the ball (r = distance from the pivot to the impact point) and Iω for the rod:
$$ m v r + I ω = m v′ r + I ω′
> [!warn] Bounce-back sign
> A ball that **bounces back** has a **negative** final velocity. Bouncing back gives the rod **more** spin than sticking would ([[s25-9]], [[s26-11]]).

**4. Spinning wheel flipped on a free platform**
Total L starts as L_wheel. Flip the wheel → it now has −L_wheel, so the person + platform must pick up **+2L_wheel**: they rotate in the wheel's **original** direction ([[s24-5]]).

# Recipe
1. Draw/label **initial and final** states (required for full credit).
2. List each object's I in both states (point mass: I = m r²; a mass at the center has I = 0).
3. ω in rad/s (or keep rpm on both sides; the conversion cancels if ω is the only rotational unit).
4. Write ΣL_i = ΣL_f, solve.

> [!example] Fall 2024 #14
> Jackson (60 kg) at the edge, r = 6.2: I_J = 2306.4. Disk (600 kg): I = ½(600)(6.2²) = 11532. ω_i = 4.5 rpm = 0.4712 rad/s.
> (2306.4 + 11532)(0.4712) = (0 + 11532)ω_f → **ω_f = 0.565 rad/s**.
`,
  cards: [
    ['When is angular momentum conserved?', 'When no net external torque acts'],
    ['Skater pulls arms in: what happens to ω and KE?', 'ω increases, KE increases (L constant)'],
    ['Ball bounces back off a rod: sign of v′?', 'Negative'],
    ['Satellite I triples: new ω?', 'ω / 3'],
  ],
},
];
