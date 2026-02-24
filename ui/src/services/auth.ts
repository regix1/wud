/**
 * Authentication service.
 */

// Current logged user
let user = undefined;

// Cache timestamp for user auth check
let userFetchedAt = 0;
const USER_CACHE_TTL = 30000; // 30 seconds

/**
 * Get auth strategies.
 * @returns {Promise<any>}
 */
async function getStrategies() {
  const response = await fetch("/auth/strategies", { credentials: "include" });
  return response.json();
}

/**
 * Get current user (cached for 30s to avoid blocking every navigation).
 * @param forceRefresh - bypass the cache
 * @returns {Promise<*>}
 */
async function getUser(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && user !== undefined && now - userFetchedAt < USER_CACHE_TTL) {
    return user;
  }
  try {
    const response = await fetch("/auth/user", {
      redirect: "manual",
      credentials: "include",
    });
    if (response.ok) {
      user = await response.json();
      userFetchedAt = now;
      return user;
    } else {
      user = undefined;
      userFetchedAt = now;
      return undefined;
    }
  } catch (e) {
    user = undefined;
    userFetchedAt = now;
    return undefined;
  }
}

/**
 * Clear the cached user (call on logout).
 */
function clearUserCache() {
  user = undefined;
  userFetchedAt = 0;
}

/**
 * Perform auth Basic.
 * @param username
 * @param password
 * @returns {Promise<*>}
 */
async function loginBasic(username, password) {
  const base64 = btoa(`${username}:${password}`);
  const response = await fetch(`/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      Authorization: `Basic ${base64}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });
  user = await response.json();
  return user;
}

/**
 * Get Oidc redirection url.
 * @returns {Promise<*>}
 */
async function getOidcRedirection(name) {
  const response = await fetch(`/auth/oidc/${name}/redirect`, { credentials: "include" });
  user = await response.json();
  return user;
}

/**
 * Logout current user.
 * @returns {Promise<any>}
 */
async function logout() {
  const response = await fetch(`/auth/logout`, {
    method: "POST",
    credentials: "include",
    redirect: "manual",
  });
  clearUserCache();
  return response.json();
}

export { getStrategies, getUser, loginBasic, getOidcRedirection, logout, clearUserCache };
