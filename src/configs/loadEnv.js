import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const backendRoot = path.resolve(__dirname, '../../');
const envPath = path.join(backendRoot, '.env');


const result = dotenv.config({ path: envPath });
if (result.error) {
 
  console.debug(`dotenv: no .env loaded from ${envPath} (${result.error.message})`);
} else {
  
  console.debug(`dotenv: loaded env from ${envPath}`);
}

export default {};
