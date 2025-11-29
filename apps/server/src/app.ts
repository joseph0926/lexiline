import Fastify from "fastify";
import fastifyEnv from "@fastify/env";
import { envOptions } from "./config";

export async function buildApp() {
	const app = Fastify({ logger: true });

	await app.register(fastifyEnv, envOptions);

	return app;
}
