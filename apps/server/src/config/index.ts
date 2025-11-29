import type { FastifyEnvOptions } from "@fastify/env";
import { envSchema } from "./env";

export const envOptions = {
	schema: envSchema,
	dotenv: true,
} satisfies FastifyEnvOptions;
