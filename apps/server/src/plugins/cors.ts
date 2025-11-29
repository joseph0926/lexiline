import type { FastifyInstance } from "fastify";
import cors from "@fastify/cors";

export default async function (app: FastifyInstance) {
	await app.register(cors, {
		origin: true,
	});
}
