/**
 * CAPS Curriculum Reference
 * South African Curriculum and Assessment Policy Statement
 * Grades 10-12: Mathematics, Physical Sciences, Life Sciences
 *
 * Sources:
 * - Department of Basic Education (education.gov.za)
 * - WCED ePortal (wcedeportal.co.za)
 * - South African History Online (sahistory.org.za)
 */

export const capsCurriculum = {
    mathematics: {
        subject: "Mathematics",
        description: "Mathematics is a language that makes use of symbols and notations for describing numerical, geometric and graphical relationships. It is a human activity that involves observing, representing and investigating patterns and relationships.",
        timeAllocation: "4.5 hours per week",
        papers: {
            paper1: "Algebra, Functions, Calculus, Probability, Finance",
            paper2: "Geometry, Trigonometry, Statistics, Analytical Geometry"
        },
        grades: {
            grade10: {
                grade: 10,
                topics: [
                    {
                        name: "Algebraic Expressions",
                        subtopics: [
                            "Simplify algebraic expressions",
                            "Factorisation (common factor, difference of squares, trinomials, grouping)",
                            "Algebraic fractions (simplify, multiply, divide, add, subtract)"
                        ],
                        term: 1
                    },
                    {
                        name: "Exponents",
                        subtopics: [
                            "Laws of exponents (integer exponents)",
                            "Rational exponents",
                            "Exponential equations",
                            "Scientific notation"
                        ],
                        term: 1
                    },
                    {
                        name: "Number Patterns",
                        subtopics: [
                            "Linear number patterns",
                            "General term of linear sequence (Tn = an + b)",
                            "Describing patterns"
                        ],
                        term: 1
                    },
                    {
                        name: "Equations and Inequalities",
                        subtopics: [
                            "Linear equations",
                            "Quadratic equations (factorisation)",
                            "Simultaneous linear equations",
                            "Linear inequalities",
                            "Word problems"
                        ],
                        term: 1
                    },
                    {
                        name: "Trigonometry",
                        subtopics: [
                            "Trigonometric ratios (sin, cos, tan)",
                            "Reciprocal ratios (cosec, sec, cot)",
                            "Special angles (30°, 45°, 60°)",
                            "Solving right-angled triangles",
                            "Trigonometric equations (basic)",
                            "Two-dimensional problems"
                        ],
                        term: 2
                    },
                    {
                        name: "Functions",
                        subtopics: [
                            "Function notation",
                            "Linear functions (y = ax + q)",
                            "Quadratic functions (y = ax²)",
                            "Hyperbolic functions (y = a/x)",
                            "Exponential functions (y = aˣ)",
                            "Graphs: sketching, domain, range, intercepts"
                        ],
                        term: 2
                    },
                    {
                        name: "Euclidean Geometry",
                        subtopics: [
                            "Angle relationships (straight line, vertically opposite)",
                            "Parallel lines and transversals",
                            "Triangle geometry (sum of angles, exterior angles)",
                            "Congruency (SSS, SAS, AAS, RHS)",
                            "Similarity",
                            "Midpoint theorem",
                            "Quadrilaterals (properties)"
                        ],
                        term: 3
                    },
                    {
                        name: "Analytical Geometry",
                        subtopics: [
                            "Distance formula",
                            "Gradient formula",
                            "Midpoint formula",
                            "Equation of a straight line",
                            "Parallel and perpendicular lines",
                            "Inclination of a line"
                        ],
                        term: 3
                    },
                    {
                        name: "Finance and Growth",
                        subtopics: [
                            "Simple interest",
                            "Compound interest",
                            "Hire purchase",
                            "Inflation",
                            "Exchange rates"
                        ],
                        term: 3
                    },
                    {
                        name: "Statistics",
                        subtopics: [
                            "Measures of central tendency (mean, median, mode)",
                            "Measures of dispersion (range, quartiles, IQR)",
                            "Five number summary",
                            "Box and whisker diagrams",
                            "Histograms, frequency polygons, ogives"
                        ],
                        term: 4
                    },
                    {
                        name: "Probability",
                        subtopics: [
                            "Theoretical probability",
                            "Relative frequency",
                            "Venn diagrams",
                            "Mutually exclusive events",
                            "Complementary events"
                        ],
                        term: 4
                    }
                ]
            },
            grade11: {
                grade: 11,
                topics: [
                    {
                        name: "Exponents and Surds",
                        subtopics: [
                            "Rational exponents and surds",
                            "Simplifying surds",
                            "Equations with surds",
                            "Laws of exponents (rational exponents)"
                        ],
                        term: 1
                    },
                    {
                        name: "Equations and Inequalities",
                        subtopics: [
                            "Quadratic equations (completing the square, formula)",
                            "Quadratic inequalities",
                            "Simultaneous equations (one linear, one quadratic)",
                            "Nature of roots (discriminant)"
                        ],
                        term: 1
                    },
                    {
                        name: "Number Patterns",
                        subtopics: [
                            "Quadratic sequences",
                            "Second difference constant",
                            "General term of quadratic sequence"
                        ],
                        term: 1
                    },
                    {
                        name: "Analytical Geometry",
                        subtopics: [
                            "Equation of a circle (centre at origin)",
                            "Equation of a tangent to a circle"
                        ],
                        term: 1
                    },
                    {
                        name: "Functions",
                        subtopics: [
                            "Inverse functions",
                            "Quadratic functions (y = a(x-p)² + q)",
                            "Exponential functions (y = ab^(x+p) + q)",
                            "Logarithmic functions",
                            "Hyperbolic functions (y = a/(x+p) + q)",
                            "Average gradient"
                        ],
                        term: 2
                    },
                    {
                        name: "Trigonometry",
                        subtopics: [
                            "Trigonometric identities",
                            "Reduction formulae",
                            "Negative angles",
                            "Co-functions",
                            "Trigonometric equations (general solutions)",
                            "Sine, cosine and area rules",
                            "2D and 3D problems"
                        ],
                        term: 2
                    },
                    {
                        name: "Euclidean Geometry",
                        subtopics: [
                            "Circle theorems",
                            "Angle at centre = 2 × angle at circumference",
                            "Angles in same segment",
                            "Cyclic quadrilaterals",
                            "Tangent theorems",
                            "Proving theorems"
                        ],
                        term: 3
                    },
                    {
                        name: "Finance, Growth and Decay",
                        subtopics: [
                            "Compound growth and decay",
                            "Different compounding periods",
                            "Effective and nominal interest rates",
                            "Depreciation (straight line, reducing balance)"
                        ],
                        term: 3
                    },
                    {
                        name: "Probability",
                        subtopics: [
                            "Dependent and independent events",
                            "Venn diagrams (three events)",
                            "Tree diagrams",
                            "Contingency tables"
                        ],
                        term: 4
                    },
                    {
                        name: "Statistics",
                        subtopics: [
                            "Histograms and frequency polygons",
                            "Ogives (cumulative frequency curves)",
                            "Variance and standard deviation",
                            "Symmetric and skewed data",
                            "Outliers"
                        ],
                        term: 4
                    }
                ]
            },
            grade12: {
                grade: 12,
                topics: [
                    {
                        name: "Patterns, Sequences and Series",
                        subtopics: [
                            "Arithmetic sequences and series",
                            "Geometric sequences and series",
                            "Sigma notation",
                            "Sum to n terms",
                            "Sum to infinity (convergent series)"
                        ],
                        term: 1
                    },
                    {
                        name: "Functions and Inverse Functions",
                        subtopics: [
                            "Revision of functions",
                            "Inverse functions (f⁻¹)",
                            "Restricting domain for inverse to be a function"
                        ],
                        term: 1
                    },
                    {
                        name: "Exponential and Logarithmic Functions",
                        subtopics: [
                            "Logarithmic functions as inverses",
                            "Logarithm laws",
                            "Solving exponential equations using logs",
                            "Graphs of logarithmic functions"
                        ],
                        term: 1
                    },
                    {
                        name: "Finance, Growth and Decay",
                        subtopics: [
                            "Future value annuities",
                            "Present value annuities",
                            "Loan calculations",
                            "Sinking funds",
                            "Deferred payments"
                        ],
                        term: 1
                    },
                    {
                        name: "Trigonometry - Compound Angles",
                        subtopics: [
                            "Compound angle identities (sin(A±B), cos(A±B))",
                            "Double angle identities (sin2A, cos2A)",
                            "Proving identities",
                            "Solving equations using compound angles"
                        ],
                        term: 2
                    },
                    {
                        name: "Trigonometry - Problem Solving",
                        subtopics: [
                            "2D problems with compound angles",
                            "3D trigonometry problems",
                            "Heights and distances"
                        ],
                        term: 2
                    },
                    {
                        name: "Polynomials",
                        subtopics: [
                            "Remainder theorem",
                            "Factor theorem",
                            "Factorising cubic polynomials",
                            "Solving cubic equations"
                        ],
                        term: 2
                    },
                    {
                        name: "Differential Calculus",
                        subtopics: [
                            "Limits and continuity",
                            "Differentiation from first principles",
                            "Differentiation rules",
                            "Equations of tangents",
                            "Second derivative",
                            "Sketching cubic graphs",
                            "Optimization (maxima and minima)",
                            "Rates of change"
                        ],
                        term: 2
                    },
                    {
                        name: "Analytical Geometry",
                        subtopics: [
                            "Equation of a circle (any centre)",
                            "Equation of a tangent to a circle",
                            "Length of a tangent"
                        ],
                        term: 3
                    },
                    {
                        name: "Euclidean Geometry",
                        subtopics: [
                            "Proportionality theorems",
                            "Similar triangles (proof)",
                            "Theorem of Pythagoras (proof)",
                            "Riders and proofs"
                        ],
                        term: 3
                    },
                    {
                        name: "Statistics",
                        subtopics: [
                            "Revision of Grade 11 statistics",
                            "Bivariate data",
                            "Scatter plots",
                            "Correlation",
                            "Regression (least squares line)"
                        ],
                        term: 4
                    },
                    {
                        name: "Counting Principles and Probability",
                        subtopics: [
                            "Fundamental counting principle",
                            "Factorial notation",
                            "Permutations",
                            "Probability using counting principles"
                        ],
                        term: 4
                    }
                ]
            }
        }
    },

    physicalSciences: {
        subject: "Physical Sciences",
        description: "Physical Sciences investigates physical and chemical phenomena through scientific inquiry, application of scientific models, theories and laws. It deals with society's need to understand how the physical environment works.",
        timeAllocation: "4 hours per week",
        papers: {
            paper1: "Physics (Mechanics, Waves, Electricity & Magnetism)",
            paper2: "Chemistry (Matter, Reactions, Organic Chemistry)"
        },
        grades: {
            grade10: {
                grade: 10,
                topics: [
                    // PHYSICS
                    {
                        name: "Mechanics",
                        subtopics: [
                            "Introduction to vectors and scalars",
                            "Motion in one dimension (position, displacement, velocity, acceleration)",
                            "Instantaneous and average values",
                            "Description of motion (graphs)",
                            "Equations of motion"
                        ],
                        term: 1,
                        paper: 1
                    },
                    {
                        name: "Energy",
                        subtopics: [
                            "Gravitational potential energy",
                            "Kinetic energy",
                            "Mechanical energy",
                            "Conservation of mechanical energy (no friction)"
                        ],
                        term: 2,
                        paper: 1
                    },
                    {
                        name: "Waves, Sound and Light",
                        subtopics: [
                            "Transverse pulses on a string",
                            "Transverse waves",
                            "Longitudinal waves",
                            "Sound waves",
                            "Electromagnetic radiation (nature, properties, uses)"
                        ],
                        term: 2,
                        paper: 1
                    },
                    {
                        name: "Electricity and Magnetism",
                        subtopics: [
                            "Magnetism (magnetic field, poles)",
                            "Electrostatics (charges, conservation, quantisation)",
                            "Electric circuits (emf, current, resistance)",
                            "Series and parallel circuits",
                            "Ohm's law",
                            "Power and energy"
                        ],
                        term: 3,
                        paper: 1
                    },
                    // CHEMISTRY
                    {
                        name: "Matter and Materials",
                        subtopics: [
                            "Classification of matter (pure substances, mixtures)",
                            "Atomic structure (models)",
                            "Periodic table",
                            "Chemical bonding (covalent, ionic, metallic)",
                            "Particles and interactions"
                        ],
                        term: 1,
                        paper: 2
                    },
                    {
                        name: "Chemical Change",
                        subtopics: [
                            "Physical and chemical change",
                            "Law of conservation of mass",
                            "Law of constant composition",
                            "Balancing chemical equations",
                            "Types of reactions",
                            "Quantitative aspects (mole concept)",
                            "Energy changes in reactions"
                        ],
                        term: 4,
                        paper: 2
                    },
                    {
                        name: "Hydrosphere",
                        subtopics: [
                            "Water cycle",
                            "Water quality",
                            "Electrolytes"
                        ],
                        term: 4,
                        paper: 2
                    }
                ]
            },
            grade11: {
                grade: 11,
                topics: [
                    // PHYSICS
                    {
                        name: "Vectors in Two Dimensions",
                        subtopics: [
                            "Resultant of perpendicular vectors",
                            "Resolution of vectors into components"
                        ],
                        term: 1,
                        paper: 1
                    },
                    {
                        name: "Newton's Laws",
                        subtopics: [
                            "Newton's First Law (inertia)",
                            "Newton's Second Law (F = ma)",
                            "Newton's Third Law (action-reaction)",
                            "Applications (connected objects, inclined planes)",
                            "Free body diagrams"
                        ],
                        term: 1,
                        paper: 1
                    },
                    {
                        name: "Newton's Law of Universal Gravitation",
                        subtopics: [
                            "Gravitational force",
                            "Weight and mass"
                        ],
                        term: 2,
                        paper: 1
                    },
                    {
                        name: "Electrostatics",
                        subtopics: [
                            "Coulomb's Law",
                            "Electric field",
                            "Electric field strength"
                        ],
                        term: 2,
                        paper: 1
                    },
                    {
                        name: "Electromagnetism",
                        subtopics: [
                            "Magnetic field around current-carrying conductors",
                            "Faraday's Law (qualitative)",
                            "DC motors"
                        ],
                        term: 3,
                        paper: 1
                    },
                    {
                        name: "Electric Circuits",
                        subtopics: [
                            "Ohm's Law (revision)",
                            "Power and energy in circuits",
                            "Circuit calculations (series-parallel)"
                        ],
                        term: 3,
                        paper: 1
                    },
                    // CHEMISTRY
                    {
                        name: "Atomic Structure",
                        subtopics: [
                            "Atomic models (Bohr model)",
                            "Energy levels",
                            "Electron configuration",
                            "Aufbau principle, Hund's rule, Pauli exclusion"
                        ],
                        term: 1,
                        paper: 2
                    },
                    {
                        name: "Periodic Table",
                        subtopics: [
                            "Physical and chemical properties",
                            "Trends (ionisation energy, electronegativity, atomic radius)"
                        ],
                        term: 1,
                        paper: 2
                    },
                    {
                        name: "Chemical Bonding",
                        subtopics: [
                            "Ionic bonding",
                            "Covalent bonding",
                            "Metallic bonding",
                            "Bond polarity",
                            "Molecular shape (VSEPR)",
                            "Electronegativity"
                        ],
                        term: 2,
                        paper: 2
                    },
                    {
                        name: "Intermolecular Forces",
                        subtopics: [
                            "Types (ion-dipole, dipole-dipole, London forces, hydrogen bonding)",
                            "Effect on physical properties"
                        ],
                        term: 2,
                        paper: 2
                    },
                    {
                        name: "Stoichiometry",
                        subtopics: [
                            "Molar mass and molar volume",
                            "Concentration",
                            "Limiting reagents",
                            "Percentage yield and purity"
                        ],
                        term: 3,
                        paper: 2
                    },
                    {
                        name: "Energy and Chemical Change",
                        subtopics: [
                            "Exothermic and endothermic reactions",
                            "Activation energy",
                            "Enthalpy"
                        ],
                        term: 4,
                        paper: 2
                    },
                    {
                        name: "Types of Reactions",
                        subtopics: [
                            "Acid-base reactions",
                            "Redox reactions",
                            "Oxidation numbers"
                        ],
                        term: 4,
                        paper: 2
                    }
                ]
            },
            grade12: {
                grade: 12,
                topics: [
                    // PHYSICS
                    {
                        name: "Momentum and Impulse",
                        subtopics: [
                            "Linear momentum",
                            "Newton's Second Law in terms of momentum",
                            "Conservation of momentum",
                            "Elastic and inelastic collisions",
                            "Impulse"
                        ],
                        term: 1,
                        paper: 1
                    },
                    {
                        name: "Vertical Projectile Motion",
                        subtopics: [
                            "Motion in a gravitational field",
                            "Equations of motion",
                            "Graphs of position, velocity, acceleration"
                        ],
                        term: 1,
                        paper: 1
                    },
                    {
                        name: "Work, Energy and Power",
                        subtopics: [
                            "Work done by a force",
                            "Work-energy theorem",
                            "Conservation of mechanical energy (with friction)",
                            "Power"
                        ],
                        term: 2,
                        paper: 1
                    },
                    {
                        name: "Doppler Effect",
                        subtopics: [
                            "Doppler effect for sound",
                            "Applications (radar, medical)",
                            "Red shift (qualitative)"
                        ],
                        term: 2,
                        paper: 1
                    },
                    {
                        name: "Electrodynamics",
                        subtopics: [
                            "Faraday's Law (quantitative)",
                            "AC and DC generators",
                            "AC and DC motors",
                            "Alternating current (RMS values)"
                        ],
                        term: 2,
                        paper: 1
                    },
                    {
                        name: "Electric Circuits",
                        subtopics: [
                            "Internal resistance",
                            "Series-parallel networks",
                            "emf and terminal potential difference"
                        ],
                        term: 3,
                        paper: 1
                    },
                    {
                        name: "Photoelectric Effect",
                        subtopics: [
                            "Photon model of light",
                            "Threshold frequency",
                            "Work function",
                            "Photoelectric equation"
                        ],
                        term: 3,
                        paper: 1
                    },
                    {
                        name: "Emission and Absorption Spectra",
                        subtopics: [
                            "Atomic energy levels",
                            "Line spectra"
                        ],
                        term: 3,
                        paper: 1
                    },
                    // CHEMISTRY
                    {
                        name: "Organic Chemistry - Molecules",
                        subtopics: [
                            "IUPAC naming",
                            "Functional groups (alcohols, carboxylic acids, esters, aldehydes, ketones, amines)",
                            "Structural and molecular formulae",
                            "Isomers",
                            "Physical properties"
                        ],
                        term: 1,
                        paper: 2
                    },
                    {
                        name: "Organic Chemistry - Reactions",
                        subtopics: [
                            "Addition reactions",
                            "Elimination reactions",
                            "Substitution reactions",
                            "Oxidation reactions",
                            "Esterification",
                            "Plastics and polymers"
                        ],
                        term: 1,
                        paper: 2
                    },
                    {
                        name: "Chemical Equilibrium",
                        subtopics: [
                            "Equilibrium constant (Kc)",
                            "Le Chatelier's Principle",
                            "Application to industrial processes (Haber, Contact)"
                        ],
                        term: 2,
                        paper: 2
                    },
                    {
                        name: "Acids and Bases",
                        subtopics: [
                            "Arrhenius, Brønsted-Lowry theories",
                            "Strong and weak acids/bases",
                            "pH calculations",
                            "Hydrolysis",
                            "Titrations",
                            "Indicators"
                        ],
                        term: 3,
                        paper: 2
                    },
                    {
                        name: "Electrochemistry",
                        subtopics: [
                            "Oxidation and reduction",
                            "Standard electrode potentials",
                            "Galvanic cells",
                            "Electrolytic cells",
                            "Applications"
                        ],
                        term: 3,
                        paper: 2
                    },
                    {
                        name: "Chemical Kinetics",
                        subtopics: [
                            "Rate of reaction",
                            "Factors affecting rate",
                            "Collision theory",
                            "Mechanism and rate determining step"
                        ],
                        term: 4,
                        paper: 2
                    }
                ]
            }
        }
    },

    lifeSciences: {
        subject: "Life Sciences",
        description: "Life Sciences is the scientific study of living things from molecular level to their interactions with the environment. It encompasses biodiversity, human biology, and the interconnectedness of all living systems.",
        timeAllocation: "4 hours per week",
        papers: {
            paper1: "Human Biology (Nervous System, Endocrine System, Reproduction)",
            paper2: "Genetics, Evolution, Plant Biology, Environmental Studies"
        },
        knowledgeStrands: [
            "Life at Molecular, Cellular and Tissue Level",
            "Life Processes in Plants and Animals",
            "Environmental Studies",
            "Diversity, Change and Continuity"
        ],
        grades: {
            grade10: {
                grade: 10,
                topics: [
                    {
                        name: "Chemistry of Life",
                        subtopics: [
                            "Inorganic compounds (water, minerals)",
                            "Organic compounds (carbohydrates, lipids, proteins, nucleic acids)",
                            "Importance of each compound"
                        ],
                        term: 1
                    },
                    {
                        name: "Cell Structure",
                        subtopics: [
                            "Cell theory",
                            "Prokaryotic and eukaryotic cells",
                            "Plant and animal cell structures",
                            "Functions of organelles",
                            "Cell size and surface area"
                        ],
                        term: 1
                    },
                    {
                        name: "Cell Division",
                        subtopics: [
                            "Chromosomes and genes",
                            "Mitosis",
                            "Cancer"
                        ],
                        term: 1
                    },
                    {
                        name: "Plant and Animal Tissues",
                        subtopics: [
                            "Plant tissues (meristematic, permanent)",
                            "Animal tissues (epithelial, connective, muscle, nervous)"
                        ],
                        term: 2
                    },
                    {
                        name: "Support and Transport in Plants",
                        subtopics: [
                            "Support in plants",
                            "Xylem and phloem",
                            "Transpiration",
                            "Translocation"
                        ],
                        term: 2
                    },
                    {
                        name: "Support and Transport in Animals",
                        subtopics: [
                            "Human skeleton",
                            "Joints and movement",
                            "Circulatory system",
                            "Heart structure and function",
                            "Blood vessels",
                            "Blood components"
                        ],
                        term: 2
                    },
                    {
                        name: "Biosphere to Ecosystems",
                        subtopics: [
                            "Biosphere, biomes, ecosystems",
                            "Abiotic and biotic factors",
                            "Energy flow",
                            "Food chains and webs",
                            "Nutrient cycles (water, carbon, nitrogen)"
                        ],
                        term: 3
                    },
                    {
                        name: "Biodiversity and Classification",
                        subtopics: [
                            "Biodiversity",
                            "Classification systems",
                            "Five kingdom system",
                            "Binomial nomenclature"
                        ],
                        term: 3
                    },
                    {
                        name: "History of Life on Earth",
                        subtopics: [
                            "Origin of life",
                            "Geological timescale",
                            "Mass extinctions",
                            "Continental drift"
                        ],
                        term: 4
                    }
                ]
            },
            grade11: {
                grade: 11,
                topics: [
                    {
                        name: "Biodiversity of Plants",
                        subtopics: [
                            "Plant kingdom overview",
                            "Bryophytes, ferns, gymnosperms, angiosperms",
                            "Life cycles"
                        ],
                        term: 1
                    },
                    {
                        name: "Biodiversity of Animals",
                        subtopics: [
                            "Animal kingdom overview",
                            "Invertebrates",
                            "Vertebrates (fish, amphibians, reptiles, birds, mammals)"
                        ],
                        term: 1
                    },
                    {
                        name: "Photosynthesis",
                        subtopics: [
                            "Requirements for photosynthesis",
                            "Light and dark reactions",
                            "Factors affecting photosynthesis"
                        ],
                        term: 2
                    },
                    {
                        name: "Cellular Respiration",
                        subtopics: [
                            "Glycolysis",
                            "Krebs cycle",
                            "Electron transport chain",
                            "Aerobic vs anaerobic respiration"
                        ],
                        term: 2
                    },
                    {
                        name: "Animal Nutrition",
                        subtopics: [
                            "Nutrients",
                            "Human digestive system",
                            "Mechanical and chemical digestion",
                            "Absorption"
                        ],
                        term: 2
                    },
                    {
                        name: "Gaseous Exchange",
                        subtopics: [
                            "Gaseous exchange in plants",
                            "Human respiratory system",
                            "Mechanism of breathing",
                            "Gaseous exchange in alveoli",
                            "Respiratory disorders"
                        ],
                        term: 3
                    },
                    {
                        name: "Excretion",
                        subtopics: [
                            "Excretion in plants",
                            "Human urinary system",
                            "Kidney structure and function",
                            "Nephron function",
                            "Homeostasis"
                        ],
                        term: 3
                    },
                    {
                        name: "Population Ecology",
                        subtopics: [
                            "Population size and growth",
                            "Factors affecting population",
                            "Human population"
                        ],
                        term: 4
                    },
                    {
                        name: "Human Impact on Environment",
                        subtopics: [
                            "Atmosphere (greenhouse effect, ozone depletion)",
                            "Water (pollution, eutrophication)",
                            "Food security",
                            "Solid waste management"
                        ],
                        term: 4
                    }
                ]
            },
            grade12: {
                grade: 12,
                topics: [
                    {
                        name: "DNA: Code of Life",
                        subtopics: [
                            "DNA structure (Watson & Crick)",
                            "DNA replication",
                            "RNA structure and types",
                            "Protein synthesis (transcription, translation)",
                            "Genetic code"
                        ],
                        term: 1,
                        paper: 2
                    },
                    {
                        name: "Meiosis",
                        subtopics: [
                            "Meiosis I and II",
                            "Crossing over",
                            "Sources of genetic variation",
                            "Comparison with mitosis"
                        ],
                        term: 1,
                        paper: 2
                    },
                    {
                        name: "Genetics and Inheritance",
                        subtopics: [
                            "Mendel's laws",
                            "Monohybrid crosses",
                            "Dihybrid crosses",
                            "Complete and incomplete dominance",
                            "Co-dominance",
                            "Multiple alleles (blood groups)",
                            "Sex-linked inheritance",
                            "Genetic disorders"
                        ],
                        term: 1,
                        paper: 2
                    },
                    {
                        name: "Human Reproduction",
                        subtopics: [
                            "Male reproductive system",
                            "Female reproductive system",
                            "Gametogenesis (spermatogenesis, oogenesis)",
                            "Menstrual cycle",
                            "Fertilisation and implantation",
                            "Pregnancy and birth",
                            "Contraception",
                            "STIs and HIV/AIDS"
                        ],
                        term: 2,
                        paper: 1
                    },
                    {
                        name: "Human Nervous System",
                        subtopics: [
                            "Central and peripheral nervous system",
                            "Brain structure and function",
                            "Spinal cord",
                            "Neuron structure",
                            "Nerve impulse transmission",
                            "Synapse",
                            "Reflex arc",
                            "Sense organs (eye, ear)"
                        ],
                        term: 2,
                        paper: 1
                    },
                    {
                        name: "Endocrine System",
                        subtopics: [
                            "Endocrine glands and hormones",
                            "Homeostasis",
                            "Feedback mechanisms",
                            "Regulation of blood glucose",
                            "Regulation of body temperature",
                            "Abnormalities (diabetes, thyroid disorders)"
                        ],
                        term: 3,
                        paper: 1
                    },
                    {
                        name: "Plant Responses",
                        subtopics: [
                            "Tropisms (phototropism, geotropism)",
                            "Plant hormones (auxins)",
                            "Photoperiodism"
                        ],
                        term: 3,
                        paper: 1
                    },
                    {
                        name: "Evolution",
                        subtopics: [
                            "Evidence for evolution (fossils, biogeography, anatomy, molecular)",
                            "Darwin's theory of natural selection",
                            "Artificial selection",
                            "Speciation",
                            "Punctuated equilibrium vs gradualism",
                            "Human evolution (hominid fossils, Out of Africa)"
                        ],
                        term: 4,
                        paper: 2
                    }
                ]
            }
        }
    }
};

// Helper function to get all topics for a grade
export const getTopicsForGrade = (subject, grade) => {
    const subjectData = capsCurriculum[subject];
    if (!subjectData) return null;
    return subjectData.grades[`grade${grade}`]?.topics || null;
};

// Helper function to get curriculum overview
export const getCurriculumOverview = () => {
    return {
        mathematics: {
            name: capsCurriculum.mathematics.subject,
            description: capsCurriculum.mathematics.description,
            grades: [10, 11, 12],
            papers: capsCurriculum.mathematics.papers
        },
        physicalSciences: {
            name: capsCurriculum.physicalSciences.subject,
            description: capsCurriculum.physicalSciences.description,
            grades: [10, 11, 12],
            papers: capsCurriculum.physicalSciences.papers
        },
        lifeSciences: {
            name: capsCurriculum.lifeSciences.subject,
            description: capsCurriculum.lifeSciences.description,
            grades: [10, 11, 12],
            papers: capsCurriculum.lifeSciences.papers
        }
    };
};

export default capsCurriculum;
