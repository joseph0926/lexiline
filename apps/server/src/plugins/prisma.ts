import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import type { FastifyInstance } from "fastify";
import type { Env } from "../config/env";

export default async function (app: FastifyInstance) {
	const { DATABASE_URL } = app.getEnvs<Env>();

	const adapter = new PrismaPg({
		connectionString: DATABASE_URL,
	});

	const prisma = new PrismaClient({ adapter });

	app.decorate("prisma", prisma);

	app.addHook("onClose", async () => {
		await prisma.$disconnect();
	});
}
