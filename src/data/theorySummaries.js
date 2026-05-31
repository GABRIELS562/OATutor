/**
 * Theory Summaries - CAPS Mathematics Topic Notes
 *
 * Comprehensive theory summaries for Grade 10-12 Mathematics
 * Following JSDT Solutions style
 */

export const THEORY_CATEGORIES = [
    { id: 'algebra', name: 'Algebra', icon: 'functions', color: '#1a237e' },
    { id: 'functions', name: 'Functions & Graphs', icon: 'show_chart', color: '#58CC02' },
    { id: 'calculus', name: 'Calculus', icon: 'trending_up', color: '#00897b' },
    { id: 'trigonometry', name: 'Trigonometry', icon: 'architecture', color: '#f4511e' },
    { id: 'geometry', name: 'Euclidean Geometry', icon: 'category', color: '#6a1b9a' },
    { id: 'analytical', name: 'Analytical Geometry', icon: 'grid_on', color: '#0288d1' },
    { id: 'finance', name: 'Financial Mathematics', icon: 'account_balance', color: '#388e3c' },
    { id: 'statistics', name: 'Statistics & Probability', icon: 'bar_chart', color: '#ffa000' },
    { id: 'sequences', name: 'Sequences & Series', icon: 'format_list_numbered', color: '#c62828' },
];

export const THEORY_SUMMARIES = [
    // ALGEBRA
    {
        id: 'algebra-expressions',
        category: 'algebra',
        title: 'Algebraic Expressions',
        grade: [10, 11, 12],
        keyPoints: [
            'Factorisation: common factor, grouping, difference of squares, trinomials, sum/difference of cubes',
            'Simplification of algebraic fractions',
            'Laws of exponents: multiplication, division, power of a power, negative exponents',
            'Surds: simplification, rationalisation of denominators',
        ],
        formulas: [
            { name: 'Difference of Squares', formula: 'a² - b² = (a + b)(a - b)' },
            { name: 'Perfect Square', formula: 'a² ± 2ab + b² = (a ± b)²' },
            { name: 'Sum of Cubes', formula: 'a³ + b³ = (a + b)(a² - ab + b²)' },
            { name: 'Difference of Cubes', formula: 'a³ - b³ = (a - b)(a² + ab + b²)' },
            { name: 'Exponent Laws', formula: 'aᵐ × aⁿ = aᵐ⁺ⁿ; aᵐ ÷ aⁿ = aᵐ⁻ⁿ; (aᵐ)ⁿ = aᵐⁿ' },
        ],
        tips: [
            'Always look for a common factor first',
            'Check your factorisation by expanding',
            'Remember: √a × √b = √(ab) only if a,b ≥ 0',
        ],
        examWeight: 'High - appears in Paper 1',
    },
    {
        id: 'equations-inequalities',
        category: 'algebra',
        title: 'Equations & Inequalities',
        grade: [10, 11, 12],
        keyPoints: [
            'Linear equations: ax + b = c',
            'Quadratic equations: factorisation, completing the square, quadratic formula',
            'Simultaneous equations: substitution and elimination methods',
            'Exponential equations: same base method, quadratic form',
            'Inequalities: linear, quadratic (critical values method)',
        ],
        formulas: [
            { name: 'Quadratic Formula', formula: 'x = (-b ± √(b² - 4ac)) / 2a' },
            { name: 'Discriminant', formula: 'Δ = b² - 4ac' },
            { name: 'Nature of Roots', formula: 'Δ > 0: two real roots; Δ = 0: one root; Δ < 0: no real roots' },
            { name: 'Sum of Roots', formula: 'x₁ + x₂ = -b/a' },
            { name: 'Product of Roots', formula: 'x₁ × x₂ = c/a' },
        ],
        tips: [
            'Always check solutions by substituting back',
            'For inequalities, flip the sign when multiplying/dividing by negative',
            'Draw a number line for quadratic inequalities',
        ],
        examWeight: 'Very High - foundation of Paper 1',
    },

    // FUNCTIONS
    {
        id: 'parabola',
        category: 'functions',
        title: 'The Parabola (Quadratic Function)',
        grade: [10, 11, 12],
        keyPoints: [
            'Standard form: y = ax² + bx + c',
            'Turning point form: y = a(x - p)² + q where (p,q) is the turning point',
            'a > 0: minimum turning point (smile); a < 0: maximum (frown)',
            'Axis of symmetry: x = -b/2a or x = p',
            'y-intercept: c; x-intercepts: solve ax² + bx + c = 0',
        ],
        formulas: [
            { name: 'Turning Point', formula: 'x = -b/2a, then y = f(-b/2a)' },
            { name: 'Axis of Symmetry', formula: 'x = -b/2a or x = (x₁ + x₂)/2' },
            { name: 'Range (a > 0)', formula: 'y ≥ q (minimum)' },
            { name: 'Range (a < 0)', formula: 'y ≤ q (maximum)' },
        ],
        tips: [
            'Sketch by finding: shape, TP, y-int, x-ints (if real)',
            'The larger |a|, the narrower the parabola',
            'Domain is always x ∈ ℝ for quadratics',
        ],
        examWeight: 'High - Paper 1 Functions',
    },
    {
        id: 'hyperbola',
        category: 'functions',
        title: 'The Hyperbola (Reciprocal Function)',
        grade: [10, 11, 12],
        keyPoints: [
            'Standard form: y = a/(x - p) + q or y = (ax + b)/(x + c)',
            'Asymptotes: vertical at x = p; horizontal at y = q',
            'Shape: a > 0 (quadrants 1 & 3); a < 0 (quadrants 2 & 4)',
            'Domain: x ∈ ℝ, x ≠ p',
            'Range: y ∈ ℝ, y ≠ q',
        ],
        formulas: [
            { name: 'Vertical Asymptote', formula: 'x = p (denominator = 0)' },
            { name: 'Horizontal Asymptote', formula: 'y = q' },
            { name: 'Axes of Symmetry', formula: 'y = x - p + q and y = -x + p + q' },
        ],
        tips: [
            'The hyperbola never touches its asymptotes',
            'To find intercepts, set x=0 and y=0 separately',
            'The asymptotes are the "shifted axes"',
        ],
        examWeight: 'Medium - Paper 1',
    },
    {
        id: 'exponential',
        category: 'functions',
        title: 'Exponential Function',
        grade: [10, 11, 12],
        keyPoints: [
            'Standard form: y = abˣ + q or y = a.bˣ⁻ᵖ + q',
            'b > 1: growth curve; 0 < b < 1: decay curve',
            'Horizontal asymptote: y = q',
            'a > 0: above asymptote; a < 0: below asymptote (reflected)',
            'Domain: x ∈ ℝ; Range: y > q or y < q',
        ],
        formulas: [
            { name: 'Growth/Decay', formula: 'A = P(1 + r)ⁿ or A = P(1 - r)ⁿ' },
            { name: 'Horizontal Asymptote', formula: 'y = q' },
            { name: 'y-intercept', formula: 'y = a.b⁰ + q = a + q' },
        ],
        tips: [
            'The exponential never touches the asymptote',
            'Exponentials have no x-intercept if a > 0 and q ≥ 0',
            'For solving, try to get same base on both sides',
        ],
        examWeight: 'Medium - Paper 1',
    },
    {
        id: 'inverse-functions',
        category: 'functions',
        title: 'Inverse Functions',
        grade: [12],
        keyPoints: [
            'Inverse: swap x and y, then solve for y',
            'Inverse is reflection in line y = x',
            'For f⁻¹ to exist, f must be one-to-one (restrict domain if needed)',
            'f(f⁻¹(x)) = x and f⁻¹(f(x)) = x',
            'Domain of f⁻¹ = Range of f; Range of f⁻¹ = Domain of f',
        ],
        formulas: [
            { name: 'Inverse of y = ax + q', formula: 'y = (x - q)/a' },
            { name: 'Inverse of y = ax²', formula: 'y = ±√(x/a) (restrict domain)' },
            { name: 'Inverse of y = aˣ', formula: 'y = logₐx' },
            { name: 'Log form', formula: 'y = logₐx ⟺ x = aʸ' },
        ],
        tips: [
            'Always restrict domain for parabola inverses',
            'The log function is the inverse of the exponential',
            'Check: (f ∘ f⁻¹)(x) = x',
        ],
        examWeight: 'High - Paper 1 Grade 12',
    },

    // CALCULUS
    {
        id: 'differentiation',
        category: 'calculus',
        title: 'Differentiation',
        grade: [12],
        keyPoints: [
            'First principles: f\'(x) = lim[h→0] (f(x+h) - f(x))/h',
            'Power rule: d/dx[xⁿ] = nxⁿ⁻¹',
            'Constant rule: d/dx[c] = 0',
            'Sum rule: d/dx[f + g] = f\' + g\'',
            'Gradient of tangent = f\'(a) at x = a',
        ],
        formulas: [
            { name: 'Power Rule', formula: 'd/dx[xⁿ] = nxⁿ⁻¹' },
            { name: 'First Principles', formula: 'f\'(x) = lim(h→0) [f(x+h) - f(x)]/h' },
            { name: 'Tangent Equation', formula: 'y - y₁ = m(x - x₁) where m = f\'(x₁)' },
        ],
        tips: [
            'Rewrite roots as fractional exponents before differentiating',
            'Rewrite fractions as negative exponents',
            'f\'(x) = 0 gives stationary points',
        ],
        examWeight: 'Very High - Major Paper 1 topic',
    },
    {
        id: 'applications-calculus',
        category: 'calculus',
        title: 'Applications of Calculus',
        grade: [12],
        keyPoints: [
            'Stationary points: f\'(x) = 0',
            'Nature of stationary points: second derivative test or gradient analysis',
            'f\'\'(x) > 0: local minimum; f\'\'(x) < 0: local maximum',
            'Points of inflection: f\'\'(x) = 0 and changes sign',
            'Rate of change and optimization problems',
        ],
        formulas: [
            { name: 'Local Max', formula: 'f\'(x) = 0 and f\'\'(x) < 0' },
            { name: 'Local Min', formula: 'f\'(x) = 0 and f\'\'(x) > 0' },
            { name: 'Inflection Point', formula: 'f\'\'(x) = 0 and sign change' },
        ],
        tips: [
            'Draw a sign diagram for f\'(x) to find intervals of increase/decrease',
            'For optimization: define variables, write equation, differentiate, solve f\'(x)=0',
            'Always verify with second derivative or nature table',
        ],
        examWeight: 'Very High - Graph sketching & word problems',
    },

    // TRIGONOMETRY
    {
        id: 'trig-ratios',
        category: 'trigonometry',
        title: 'Trigonometric Ratios & Identities',
        grade: [10, 11, 12],
        keyPoints: [
            'Basic ratios: sin θ = opp/hyp, cos θ = adj/hyp, tan θ = opp/adj',
            'Reciprocals: cosec θ = 1/sin θ, sec θ = 1/cos θ, cot θ = 1/tan θ',
            'CAST diagram for signs in each quadrant',
            'Special angles: 30°, 45°, 60°, 90°',
            'Reduction formulae: (180° ± θ), (360° ± θ), (-θ)',
        ],
        formulas: [
            { name: 'Pythagorean Identity', formula: 'sin²θ + cos²θ = 1' },
            { name: 'Quotient Identity', formula: 'tan θ = sin θ / cos θ' },
            { name: 'Co-functions', formula: 'sin(90° - θ) = cos θ; cos(90° - θ) = sin θ' },
            { name: 'Negative Angles', formula: 'sin(-θ) = -sin θ; cos(-θ) = cos θ' },
        ],
        tips: [
            'CAST: All, Sin, Tan, Cos (quadrants 1,2,3,4)',
            'Draw a reference triangle for special angles',
            'Always reduce to acute angles first',
        ],
        examWeight: 'Very High - Both papers',
    },
    {
        id: 'compound-angles',
        category: 'trigonometry',
        title: 'Compound & Double Angles',
        grade: [12],
        keyPoints: [
            'Compound angle formulae for sin(A±B), cos(A±B)',
            'Double angle: sin 2A, cos 2A (three forms)',
            'Used in proving identities and solving equations',
        ],
        formulas: [
            { name: 'sin(A + B)', formula: 'sin A cos B + cos A sin B' },
            { name: 'sin(A - B)', formula: 'sin A cos B - cos A sin B' },
            { name: 'cos(A + B)', formula: 'cos A cos B - sin A sin B' },
            { name: 'cos(A - B)', formula: 'cos A cos B + sin A sin B' },
            { name: 'sin 2A', formula: '2 sin A cos A' },
            { name: 'cos 2A', formula: 'cos²A - sin²A = 2cos²A - 1 = 1 - 2sin²A' },
        ],
        tips: [
            'For cos 2A, choose the form that simplifies best',
            'sin 2A is useful for equations like sin A cos A = ...',
            'These formulae MUST be memorised',
        ],
        examWeight: 'High - Paper 2',
    },

    // GEOMETRY
    {
        id: 'circle-geometry',
        category: 'geometry',
        title: 'Circle Geometry',
        grade: [11, 12],
        keyPoints: [
            'Angle at centre = 2 × angle at circumference',
            'Angles in same segment are equal',
            'Angle in semicircle = 90°',
            'Opposite angles of cyclic quad = 180°',
            'Tangent perpendicular to radius at point of contact',
            'Tan-chord angle = angle in alternate segment',
        ],
        formulas: [
            { name: 'Centre-Circumference', formula: '∠ at centre = 2 × ∠ at circumference' },
            { name: 'Cyclic Quad', formula: 'Opposite angles sum to 180°' },
            { name: 'Tan-Chord Theorem', formula: '∠ between tangent and chord = ∠ in alt segment' },
        ],
        tips: [
            'Always mark all equal angles on your diagram',
            'Look for isoceles triangles (radii equal)',
            'State theorem names clearly in proofs',
        ],
        examWeight: 'Very High - Paper 2',
    },
    {
        id: 'similarity-proportionality',
        category: 'geometry',
        title: 'Similarity & Proportionality',
        grade: [12],
        keyPoints: [
            'Proportionality theorem: line parallel to one side divides other two proportionally',
            'Similar triangles: equal angles OR proportional sides',
            'AAA, SSS (proportional), SAS (included angle, proportional sides)',
            'Ratio of areas = (ratio of sides)²',
        ],
        formulas: [
            { name: 'Proportionality', formula: 'If DE || BC, then AD/DB = AE/EC' },
            { name: 'Similar Triangles', formula: 'Corresponding sides in same ratio' },
            { name: 'Area Ratio', formula: 'Area₁/Area₂ = (side₁/side₂)²' },
        ],
        tips: [
            'Name similar triangles in corresponding order',
            'Set up proportions carefully - corresponding sides',
            'Mid-point theorem is a special case',
        ],
        examWeight: 'High - Paper 2 Grade 12',
    },

    // ANALYTICAL GEOMETRY
    {
        id: 'analytical-basics',
        category: 'analytical',
        title: 'Analytical Geometry Basics',
        grade: [10, 11, 12],
        keyPoints: [
            'Distance formula between two points',
            'Midpoint formula',
            'Gradient of a line',
            'Equation of a line: y = mx + c or y - y₁ = m(x - x₁)',
            'Parallel lines: equal gradients; Perpendicular: m₁ × m₂ = -1',
        ],
        formulas: [
            { name: 'Distance', formula: 'd = √[(x₂-x₁)² + (y₂-y₁)²]' },
            { name: 'Midpoint', formula: 'M = ((x₁+x₂)/2, (y₁+y₂)/2)' },
            { name: 'Gradient', formula: 'm = (y₂-y₁)/(x₂-x₁)' },
            { name: 'Perpendicular', formula: 'm₁ × m₂ = -1' },
            { name: 'Inclination', formula: 'θ = tan⁻¹(m)' },
        ],
        tips: [
            'Draw a diagram for every question',
            'Use midpoint to find centre of circle from diameter',
            'Gradient undefined when vertical (x₁ = x₂)',
        ],
        examWeight: 'High - Paper 2',
    },
    {
        id: 'circle-equation',
        category: 'analytical',
        title: 'Circle Equation',
        grade: [12],
        keyPoints: [
            'Standard form: (x - a)² + (y - b)² = r²',
            'General form: x² + y² + Dx + Ey + F = 0',
            'Centre: (a, b); Radius: r',
            'Tangent to circle is perpendicular to radius',
        ],
        formulas: [
            { name: 'Standard Form', formula: '(x - a)² + (y - b)² = r²' },
            { name: 'Centre from General', formula: 'Centre = (-D/2, -E/2)' },
            { name: 'Radius from General', formula: 'r = √(D²/4 + E²/4 - F)' },
            { name: 'Tangent Gradient', formula: 'm(tangent) × m(radius) = -1' },
        ],
        tips: [
            'Complete the square to convert general to standard form',
            'The tangent at point P is perpendicular to CP (C = centre)',
            'Check if point lies on circle by substitution',
        ],
        examWeight: 'High - Paper 2 Grade 12',
    },

    // FINANCIAL MATHEMATICS
    {
        id: 'simple-compound',
        category: 'finance',
        title: 'Simple & Compound Interest',
        grade: [10, 11, 12],
        keyPoints: [
            'Simple interest: interest on principal only',
            'Compound interest: interest on principal + accumulated interest',
            'Effective vs nominal interest rates',
            'Depreciation: straight-line (simple) vs reducing balance (compound)',
        ],
        formulas: [
            { name: 'Simple Interest', formula: 'A = P(1 + in)' },
            { name: 'Compound Interest', formula: 'A = P(1 + i)ⁿ' },
            { name: 'Depreciation (Straight Line)', formula: 'A = P(1 - in)' },
            { name: 'Depreciation (Reducing Balance)', formula: 'A = P(1 - i)ⁿ' },
            { name: 'Effective Rate', formula: 'iₑff = (1 + i/m)ᵐ - 1' },
        ],
        tips: [
            'Compounding: n = number of periods, i = rate per period',
            'For monthly: n = 12 × years, i = annual rate / 12',
            'Draw a timeline for complex problems',
        ],
        examWeight: 'Medium-High - Paper 1',
    },
    {
        id: 'annuities',
        category: 'finance',
        title: 'Future Value & Present Value Annuities',
        grade: [12],
        keyPoints: [
            'Future value: saving for a goal (regular deposits)',
            'Present value: loan repayments (regular payments)',
            'Payments usually at end of period',
            'Sinking fund: saving to replace asset',
        ],
        formulas: [
            { name: 'Future Value Annuity', formula: 'F = x[(1+i)ⁿ - 1] / i' },
            { name: 'Present Value Annuity', formula: 'P = x[1 - (1+i)⁻ⁿ] / i' },
            { name: 'Balance after k payments', formula: 'Use timeline approach' },
        ],
        tips: [
            'x = regular payment, i = interest per period, n = number of payments',
            'Draw a timeline showing all cash flows',
            'For balance outstanding, calculate PV of remaining payments',
        ],
        examWeight: 'High - Paper 1 Grade 12',
    },

    // SEQUENCES
    {
        id: 'arithmetic-sequence',
        category: 'sequences',
        title: 'Arithmetic Sequences & Series',
        grade: [11, 12],
        keyPoints: [
            'Common difference: d = T₂ - T₁',
            'Linear pattern: Tₙ = a + (n-1)d',
            'Sum of n terms: Sₙ = n/2[2a + (n-1)d] or n/2[a + l]',
            'Arithmetic mean: b = (a + c)/2',
        ],
        formulas: [
            { name: 'nth Term', formula: 'Tₙ = a + (n-1)d' },
            { name: 'Sum (n terms)', formula: 'Sₙ = n/2[2a + (n-1)d]' },
            { name: 'Sum (first & last)', formula: 'Sₙ = n/2[a + l]' },
        ],
        tips: [
            'Tₙ = Sₙ - Sₙ₋₁',
            'If given Sₙ formula, find Tₙ by subtraction',
            'd can be positive, negative, or zero',
        ],
        examWeight: 'High - Paper 1',
    },
    {
        id: 'geometric-sequence',
        category: 'sequences',
        title: 'Geometric Sequences & Series',
        grade: [12],
        keyPoints: [
            'Common ratio: r = T₂/T₁',
            'Exponential pattern: Tₙ = arⁿ⁻¹',
            'Sum to n terms: Sₙ = a(rⁿ - 1)/(r - 1) or a(1 - rⁿ)/(1 - r)',
            'Convergent series: -1 < r < 1, sum to infinity = a/(1-r)',
        ],
        formulas: [
            { name: 'nth Term', formula: 'Tₙ = ar^(n-1)' },
            { name: 'Sum (n terms)', formula: 'Sₙ = a(rⁿ - 1)/(r - 1)' },
            { name: 'Sum to Infinity', formula: 'S∞ = a/(1-r), where |r| < 1' },
        ],
        tips: [
            'r can be negative (alternating signs)',
            'For sum to infinity, |r| must be less than 1',
            'Sigma notation: Σ indicates summation',
        ],
        examWeight: 'High - Paper 1 Grade 12',
    },

    // STATISTICS
    {
        id: 'statistics-measures',
        category: 'statistics',
        title: 'Measures of Central Tendency & Spread',
        grade: [10, 11, 12],
        keyPoints: [
            'Mean: sum of values / number of values',
            'Median: middle value (Q2)',
            'Mode: most frequent value',
            'Range: max - min',
            'Standard deviation: measure of spread from mean',
            'Five number summary: min, Q1, Q2, Q3, max',
        ],
        formulas: [
            { name: 'Mean', formula: 'x̄ = Σx / n' },
            { name: 'Variance', formula: 'σ² = Σ(x - x̄)² / n' },
            { name: 'Standard Deviation', formula: 'σ = √[Σ(x - x̄)² / n]' },
            { name: 'IQR', formula: 'IQR = Q3 - Q1' },
        ],
        tips: [
            'Use calculator for standard deviation (check mode: σn or σn-1)',
            'Outliers affect mean more than median',
            'Box and whisker shows 5-number summary',
        ],
        examWeight: 'Medium - Paper 2',
    },
    {
        id: 'regression',
        category: 'statistics',
        title: 'Regression & Correlation',
        grade: [12],
        keyPoints: [
            'Scatter plot shows relationship between variables',
            'Correlation coefficient (r): -1 ≤ r ≤ 1',
            'r close to 1: strong positive; r close to -1: strong negative',
            'Regression line: ŷ = a + bx (line of best fit)',
            'Use regression to interpolate (within data range)',
        ],
        formulas: [
            { name: 'Regression Line', formula: 'ŷ = a + bx' },
            { name: 'Correlation', formula: 'r = Σ[(x-x̄)(y-ȳ)] / √[Σ(x-x̄)²·Σ(y-ȳ)²]' },
        ],
        tips: [
            'r² tells you % of variation explained',
            'Use calculator to find a, b, and r',
            'Extrapolation (outside data range) is unreliable',
        ],
        examWeight: 'Medium - Paper 2 Grade 12',
    },
    {
        id: 'probability',
        category: 'statistics',
        title: 'Probability & Counting',
        grade: [10, 11, 12],
        keyPoints: [
            'P(A) = favourable outcomes / total outcomes',
            'P(A or B) = P(A) + P(B) - P(A and B)',
            'P(A and B) = P(A) × P(B|A)',
            'Independent events: P(A and B) = P(A) × P(B)',
            'Fundamental counting principle: n₁ × n₂ × ...',
        ],
        formulas: [
            { name: 'Addition Rule', formula: 'P(A or B) = P(A) + P(B) - P(A and B)' },
            { name: 'Independent Events', formula: 'P(A and B) = P(A) × P(B)' },
            { name: 'Permutations', formula: 'nPr = n!/(n-r)!' },
            { name: 'Combinations', formula: 'nCr = n!/[r!(n-r)!]' },
        ],
        tips: [
            '"Or" usually means add; "And" usually means multiply',
            'Draw tree diagrams for sequential events',
            'Use Venn diagrams for overlapping events',
        ],
        examWeight: 'High - Paper 1 (Grade 12)',
    },
];

/**
 * Get summaries by category
 */
export function getSummariesByCategory(categoryId) {
    return THEORY_SUMMARIES.filter(s => s.category === categoryId);
}

/**
 * Get summaries by grade
 */
export function getSummariesByGrade(grade) {
    return THEORY_SUMMARIES.filter(s => s.grade.includes(grade));
}

/**
 * Get summary by ID
 */
export function getSummaryById(id) {
    return THEORY_SUMMARIES.find(s => s.id === id);
}

/**
 * Search summaries
 */
export function searchSummaries(query) {
    const lowerQuery = query.toLowerCase();
    return THEORY_SUMMARIES.filter(s =>
        s.title.toLowerCase().includes(lowerQuery) ||
        s.keyPoints.some(p => p.toLowerCase().includes(lowerQuery)) ||
        s.formulas?.some(f => f.name.toLowerCase().includes(lowerQuery))
    );
}

const TheorySummaries = {
    THEORY_CATEGORIES,
    THEORY_SUMMARIES,
    getSummariesByCategory,
    getSummariesByGrade,
    getSummaryById,
    searchSummaries,
};

export default TheorySummaries;
