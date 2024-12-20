import bcrypt from 'bcrypt';
import {fileURLToPath} from 'url';
import { dirname } from 'path';

export const createHash = async(password) =>{
    const salts = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password,salts);
    return hash
}

export const passwordValidation = async(user,password) => await bcrypt.compare(password,user.password);

export const documentUserFields = ["certified", "identification", "cv-pet", "picture"]

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;