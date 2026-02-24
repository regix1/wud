import { getUser, loginBasic, logout, getStrategies, clearUserCache } from '@/services/auth';

// Mock fetch globally
const fetchMock = jest.fn();
global.fetch = fetchMock;

describe('Auth Service', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    clearUserCache();
  });

  describe('getUser', () => {
    it('returns user data when authenticated', async () => {
      const mockUser = { username: 'testuser', roles: ['admin'] };
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser
      });

      const user = await getUser();

      expect(fetchMock).toHaveBeenCalledWith('/auth/user', {
        redirect: 'manual',
        credentials: 'include'
      });
      expect(user).toEqual(mockUser);
    });

    it('returns undefined when not authenticated', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 401
      });

      const user = await getUser();

      expect(user).toBeUndefined();
    });

    it('handles network errors gracefully', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'));

      const user = await getUser();

      expect(user).toBeUndefined();
    });
  });

  describe('loginBasic', () => {
    it('performs basic authentication successfully', async () => {
      const mockUser = { username: 'testuser' };
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser
      });

      const user = await loginBasic('testuser', 'testpass');

      expect(fetchMock).toHaveBeenCalledWith('/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          Authorization: 'Basic dGVzdHVzZXI6dGVzdHBhc3M=', // base64 of testuser:testpass
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: 'testuser',
          password: 'testpass'
        })
      });
      expect(user).toEqual(mockUser);
    });

    it('handles login failure', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Invalid credentials' })
      });

      const user = await loginBasic('testuser', 'wrongpass');

      expect(user).toEqual({ error: 'Invalid credentials' });
    });
  });

  describe('logout', () => {
    it('logs out user successfully', async () => {
      const mockResponse = { success: true };
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await logout();

      expect(fetchMock).toHaveBeenCalledWith('/auth/logout', {
        method: 'POST',
        credentials: 'include',
        redirect: 'manual'
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getStrategies', () => {
    it('returns available authentication strategies', async () => {
      const mockStrategies = [
        { name: 'basic', type: 'basic' },
        { name: 'oidc', type: 'oidc' }
      ];
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStrategies
      });

      const strategies = await getStrategies();

      expect(fetchMock).toHaveBeenCalledWith('/auth/strategies', {
        credentials: 'include'
      });
      expect(strategies).toEqual(mockStrategies);
    });
  });
});