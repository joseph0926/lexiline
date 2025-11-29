import Fastify from "fastify";
import env from "./plugins/env";
import cors from "./plugins/cors";
import health from "./routes/health";

export async function buildApp() {
	const app = Fastify({ logger: true });

	await env(app);
	await cors(app);

	await health(app);

	return app;
}
