import fastifyEnv from "@fastify/env";
import type { FastifyInstance } from "fastify";
import { envOptions } from "../config";

export default async function (app: FastifyInstance) {
	await app.register(fastifyEnv, envOptions);
}
