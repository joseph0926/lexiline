import type { FastifyError, FastifyInstance } from "fastify";
import type { Env } from "../config/env";

interface ErrorResponse {
	statusCode: number;
	code: string;
	message: string;
}

interface DevErrorResponse extends ErrorResponse {
	stack?: string;
	detail?: unknown;
}

export default async function (app: FastifyInstance) {
	app.setErrorHandler((error: FastifyError, request, reply) => {
		request.log.error(error);

		const { NODE_ENV } = app.getEnvs<Env>();

		const errorResponse = {
			statusCode: error.statusCode ?? 500,
			code: error.code,
			message: error.message,
		} satisfies ErrorResponse;
		const devErrorResponse = {
			...errorResponse,
			detail: error.cause,
			stack: error.stack,
		} satisfies DevErrorResponse;

		return reply
			.status(errorResponse.statusCode)
			.send(NODE_ENV === "development" ? devErrorResponse : errorResponse);
	});
}
