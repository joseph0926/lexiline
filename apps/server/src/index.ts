import { buildApp } from "./app";
import type { Env } from "./config/env";

async function main() {
	const app = await buildApp();

	const { HOST, PORT } = app.getEnvs<Env>();

	await app.listen({ port: PORT, host: HOST });
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
