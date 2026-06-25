"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '../.env') });
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../.env') });
const envSchema = zod_1.z.object({
    PORT: zod_1.z.coerce.number().default(5000),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    SUPABASE_URL: zod_1.z.string().url('SUPABASE_URL must be a valid URL'),
    SUPABASE_ANON_KEY: zod_1.z.string().min(1, 'SUPABASE_ANON_KEY is required'),
    SUPABASE_SERVICE_ROLE_KEY: zod_1.z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),
    JWT_SECRET: zod_1.z.string().min(1, 'JWT_SECRET is required'),
    CORS_ORIGIN: zod_1.z.string().default('http://localhost:3000'),
});
const result = envSchema.safeParse(process.env);
if (!result.success) {
    console.error('Invalid environment variables:', result.error.format());
    process.exit(1);
}
exports.env = result.data;
//# sourceMappingURL=env.js.map