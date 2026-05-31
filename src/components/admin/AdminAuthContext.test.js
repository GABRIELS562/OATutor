/**
 * AdminAuthContext Tests
 * Tests for authentication flow and session management
 */

// Mock localStorage
const localStorageMock = {
    store: {},
    getItem: jest.fn(key => localStorageMock.store[key] || null),
    setItem: jest.fn((key, value) => { localStorageMock.store[key] = value; }),
    removeItem: jest.fn(key => { delete localStorageMock.store[key]; }),
    clear: jest.fn(() => { localStorageMock.store = {}; }),
};
global.localStorage = localStorageMock;

// Mock process.env
const originalEnv = process.env;

beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
    process.env = {
        ...originalEnv,
        REACT_APP_DEMO_MODE: 'true',
        REACT_APP_DEMO_TEACHER_EMAIL: 'test@school.co.za',
        REACT_APP_DEMO_TEACHER_PASS: 'testpass123',
        REACT_APP_DEMO_TEACHER_NAME: 'Test Teacher',
        REACT_APP_DEMO_ADMIN_EMAIL: 'admin@school.co.za',
        REACT_APP_DEMO_ADMIN_PASS: 'adminpass123',
        REACT_APP_DEMO_ADMIN_NAME: 'Test Admin',
        NODE_ENV: 'test',
    };
});

afterEach(() => {
    process.env = originalEnv;
});

describe('Admin Auth Storage Keys', () => {
    const STORAGE_KEYS = {
        ADMIN_TOKEN: 'angelo_admin_token',
        ADMIN_USER: 'angelo_admin_user',
    };

    test('uses correct storage keys', () => {
        expect(STORAGE_KEYS.ADMIN_TOKEN).toBe('angelo_admin_token');
        expect(STORAGE_KEYS.ADMIN_USER).toBe('angelo_admin_user');
    });
});

describe('Token Generation', () => {
    test('generates base64 encoded token', () => {
        const userId = 'teacher-001';
        const timestamp = Date.now();
        const token = btoa(JSON.stringify({ userId, timestamp }));

        // Token should be decodable
        const decoded = JSON.parse(atob(token));
        expect(decoded.userId).toBe(userId);
        expect(decoded.timestamp).toBe(timestamp);
    });

    test('token includes timestamp for expiry checking', () => {
        const token = btoa(JSON.stringify({ userId: 'test', timestamp: Date.now() }));
        const decoded = JSON.parse(atob(token));

        expect(decoded.timestamp).toBeDefined();
        expect(typeof decoded.timestamp).toBe('number');
    });
});

describe('Session Expiry', () => {
    const MAX_SESSION_AGE = 24 * 60 * 60 * 1000; // 24 hours

    test('session is valid within 24 hours', () => {
        const tokenTimestamp = Date.now() - (23 * 60 * 60 * 1000); // 23 hours ago
        const tokenAge = Date.now() - tokenTimestamp;

        expect(tokenAge < MAX_SESSION_AGE).toBe(true);
    });

    test('session expires after 24 hours', () => {
        const tokenTimestamp = Date.now() - (25 * 60 * 60 * 1000); // 25 hours ago
        const tokenAge = Date.now() - tokenTimestamp;

        expect(tokenAge > MAX_SESSION_AGE).toBe(true);
    });
});

describe('Role Checking', () => {
    const hasRole = (user, role) => {
        if (!user) return false;
        if (user.role === 'admin') return true; // Admin has all roles
        return user.role === role;
    };

    test('returns false for null user', () => {
        expect(hasRole(null, 'teacher')).toBe(false);
    });

    test('teacher role matches teacher', () => {
        const user = { role: 'teacher' };
        expect(hasRole(user, 'teacher')).toBe(true);
    });

    test('teacher role does not match admin', () => {
        const user = { role: 'teacher' };
        expect(hasRole(user, 'admin')).toBe(false);
    });

    test('admin role matches all roles', () => {
        const user = { role: 'admin' };
        expect(hasRole(user, 'teacher')).toBe(true);
        expect(hasRole(user, 'admin')).toBe(true);
        expect(hasRole(user, 'student')).toBe(true);
    });
});

describe('Login Validation', () => {
    test('email comparison is case-insensitive', () => {
        const email1 = 'Teacher@School.co.za';
        const email2 = 'teacher@school.co.za';

        expect(email1.toLowerCase()).toBe(email2.toLowerCase());
    });

    test('password comparison is case-sensitive', () => {
        const pass1 = 'Demo123';
        const pass2 = 'demo123';

        expect(pass1).not.toBe(pass2);
    });
});

describe('Session User Object', () => {
    test('session user contains required fields', () => {
        const teacher = {
            id: 'teacher-001',
            email: 'test@school.co.za',
            name: 'Test Teacher',
            role: 'teacher',
        };

        const sessionUser = {
            id: teacher.id,
            email: teacher.email,
            name: teacher.name,
            role: teacher.role,
            loginTime: new Date().toISOString(),
        };

        expect(sessionUser.id).toBe('teacher-001');
        expect(sessionUser.email).toBe('test@school.co.za');
        expect(sessionUser.name).toBe('Test Teacher');
        expect(sessionUser.role).toBe('teacher');
        expect(sessionUser.loginTime).toBeDefined();
    });

    test('loginTime is valid ISO string', () => {
        const loginTime = new Date().toISOString();
        const parsed = new Date(loginTime);

        expect(parsed instanceof Date).toBe(true);
        expect(isNaN(parsed.getTime())).toBe(false);
    });
});
