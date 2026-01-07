import dotenv from 'dotenv';

let loaded = false;

const REQUIRED_DB_VARS = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];

export function loadEnv() {
  if (loaded) return;

  dotenv.config();
  loaded = true;

  const missing = REQUIRED_DB_VARS.filter((key) => {
    const value = process.env[key];
    return value === undefined || value.trim() === '';
  });

  if (missing.length > 0) {
    throw new Error(`Missing required database environment variables: ${missing.join(', ')}`);
  }
}

function ensureLoaded() {
  if (!loaded) {
    loadEnv();
  }
}

export function getEnv(key, defaultValue = undefined) {
  ensureLoaded();
  const value = process.env[key];
  if (value === undefined || value === '') {
    return defaultValue;
  }
  return value;
}

export const env = (() => {
  ensureLoaded();
  return {
    PORT: process.env.PORT || '5000',
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
  };
})();
