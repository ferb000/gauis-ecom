import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Resolve backend root reliably relative to this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// backend/src/configs -> go up two levels to backend/
const backendRoot = path.resolve(__dirname, '../../');
const envPath = path.join(backendRoot, '.env');

// Load .env from backend/.env if present. This ensures scripts run from
// nested folders still load the correct file.
const result = dotenv.config({ path: envPath });
if (result.error) {
  // Do not throw; allow dotenv to continue if env vars are provided by the environment.
  // Log a debug message so the developer knows which file was attempted.
  // Avoid printing secret values.
  // eslint-disable-next-line no-console
  console.debug(`dotenv: no .env loaded from ${envPath} (${result.error.message})`);
} else {
  // eslint-disable-next-line no-console
  console.debug(`dotenv: loaded env from ${envPath}`);
}

export default {};
