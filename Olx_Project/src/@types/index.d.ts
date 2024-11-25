import { File } from 'multer';
import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        export interface Request {
            files?: File[];
            user?: JwtPayload;
        }
    }
}