/**
 * Bayesian Knowledge Tracing (BKT) Tests
 * Tests for the adaptive learning algorithm
 */

describe('BKT Parameters', () => {
    // Default BKT parameters
    const DEFAULT_PARAMS = {
        probMastery: 0.1,  // Initial probability of mastery
        probTransit: 0.3,  // Probability of learning
        probSlip: 0.1,     // Probability of slip (know but answer wrong)
        probGuess: 0.2,    // Probability of guess (don't know but answer right)
    };

    test('parameters are within valid probability range [0, 1]', () => {
        Object.values(DEFAULT_PARAMS).forEach(param => {
            expect(param).toBeGreaterThanOrEqual(0);
            expect(param).toBeLessThanOrEqual(1);
        });
    });

    test('probSlip + probGuess < 1 for valid model', () => {
        // This constraint ensures the model makes sense
        expect(DEFAULT_PARAMS.probSlip + DEFAULT_PARAMS.probGuess).toBeLessThan(1);
    });
});

describe('BKT Update Equations', () => {
    /**
     * Calculate P(L_n | correct answer)
     * If student answers correctly, update mastery probability
     */
    const updateOnCorrect = (params) => {
        const { probMastery, probTransit, probSlip, probGuess } = params;

        // P(correct) = P(L)(1 - P(S)) + (1 - P(L))P(G)
        const pCorrect = probMastery * (1 - probSlip) + (1 - probMastery) * probGuess;

        // P(L | correct) = P(L)(1 - P(S)) / P(correct)
        const pMasteryGivenCorrect = (probMastery * (1 - probSlip)) / pCorrect;

        // Apply learning: P(L_n) = P(L | obs) + (1 - P(L | obs)) * P(T)
        const newMastery = pMasteryGivenCorrect + (1 - pMasteryGivenCorrect) * probTransit;

        return Math.min(1, Math.max(0, newMastery)); // Clamp to [0, 1]
    };

    /**
     * Calculate P(L_n | incorrect answer)
     * If student answers incorrectly, update mastery probability
     */
    const updateOnIncorrect = (params) => {
        const { probMastery, probTransit, probSlip, probGuess } = params;

        // P(incorrect) = P(L)P(S) + (1 - P(L))(1 - P(G))
        const pIncorrect = probMastery * probSlip + (1 - probMastery) * (1 - probGuess);

        // P(L | incorrect) = P(L)P(S) / P(incorrect)
        const pMasteryGivenIncorrect = (probMastery * probSlip) / pIncorrect;

        // Apply learning: P(L_n) = P(L | obs) + (1 - P(L | obs)) * P(T)
        const newMastery = pMasteryGivenIncorrect + (1 - pMasteryGivenIncorrect) * probTransit;

        return Math.min(1, Math.max(0, newMastery)); // Clamp to [0, 1]
    };

    const DEFAULT_PARAMS = {
        probMastery: 0.1,
        probTransit: 0.3,
        probSlip: 0.1,
        probGuess: 0.2,
    };

    test('correct answer increases mastery probability', () => {
        const newMastery = updateOnCorrect(DEFAULT_PARAMS);
        expect(newMastery).toBeGreaterThan(DEFAULT_PARAMS.probMastery);
    });

    test('incorrect answer has smaller mastery increase than correct', () => {
        const masteryAfterCorrect = updateOnCorrect(DEFAULT_PARAMS);
        const masteryAfterIncorrect = updateOnIncorrect(DEFAULT_PARAMS);

        expect(masteryAfterCorrect).toBeGreaterThan(masteryAfterIncorrect);
    });

    test('mastery never exceeds 1', () => {
        let params = { ...DEFAULT_PARAMS, probMastery: 0.95 };

        // Multiple correct answers
        for (let i = 0; i < 10; i++) {
            const newMastery = updateOnCorrect(params);
            expect(newMastery).toBeLessThanOrEqual(1);
            params = { ...params, probMastery: newMastery };
        }
    });

    test('mastery never goes below 0', () => {
        let params = { ...DEFAULT_PARAMS, probMastery: 0.05 };

        // Multiple incorrect answers
        for (let i = 0; i < 10; i++) {
            const newMastery = updateOnIncorrect(params);
            expect(newMastery).toBeGreaterThanOrEqual(0);
            params = { ...params, probMastery: newMastery };
        }
    });

    test('high initial mastery + correct answer = near 1 mastery', () => {
        const params = { ...DEFAULT_PARAMS, probMastery: 0.8 };
        const newMastery = updateOnCorrect(params);
        expect(newMastery).toBeGreaterThan(0.9);
    });

    test('consecutive correct answers lead to mastery', () => {
        let params = { ...DEFAULT_PARAMS };

        // Simulate 5 consecutive correct answers
        for (let i = 0; i < 5; i++) {
            params = { ...params, probMastery: updateOnCorrect(params) };
        }

        expect(params.probMastery).toBeGreaterThan(0.8);
    });
});

describe('Mastery Threshold', () => {
    const MASTERY_THRESHOLD = 0.95;

    test('mastery threshold is 95%', () => {
        expect(MASTERY_THRESHOLD).toBe(0.95);
    });

    test('student graduates when all skills reach threshold', () => {
        const skills = {
            'algebra': 0.96,
            'geometry': 0.97,
            'calculus': 0.95,
        };

        const allMastered = Object.values(skills).every(m => m >= MASTERY_THRESHOLD);
        expect(allMastered).toBe(true);
    });

    test('student does not graduate if any skill below threshold', () => {
        const skills = {
            'algebra': 0.96,
            'geometry': 0.94, // Below threshold
            'calculus': 0.95,
        };

        const allMastered = Object.values(skills).every(m => m >= MASTERY_THRESHOLD);
        expect(allMastered).toBe(false);
    });
});

describe('Problem Selection Heuristic', () => {
    // Simplified version of the heuristic
    const selectProblem = (problems, completedIds) => {
        // Filter out completed problems
        const available = problems.filter(p => !completedIds.has(p.id));

        if (available.length === 0) return null;

        // Sort by mastery (lowest first - focus on weak areas)
        available.sort((a, b) => (a.probMastery || 0) - (b.probMastery || 0));

        return available[0];
    };

    test('selects problem with lowest mastery', () => {
        const problems = [
            { id: 'p1', probMastery: 0.8 },
            { id: 'p2', probMastery: 0.3 },
            { id: 'p3', probMastery: 0.6 },
        ];

        const selected = selectProblem(problems, new Set());
        expect(selected.id).toBe('p2');
    });

    test('skips completed problems', () => {
        const problems = [
            { id: 'p1', probMastery: 0.3 },
            { id: 'p2', probMastery: 0.5 },
            { id: 'p3', probMastery: 0.8 },
        ];

        const completed = new Set(['p1']);
        const selected = selectProblem(problems, completed);
        expect(selected.id).toBe('p2');
    });

    test('returns null when all problems completed', () => {
        const problems = [
            { id: 'p1', probMastery: 0.8 },
            { id: 'p2', probMastery: 0.9 },
        ];

        const completed = new Set(['p1', 'p2']);
        const selected = selectProblem(problems, completed);
        expect(selected).toBeNull();
    });
});
