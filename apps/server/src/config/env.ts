export const envSchema = {
	type: "object",
	required: ["NODE_ENV", "DATABASE_URL"],
	properties: {
		NODE_ENV: {
			type: "string",
			enum: ["development", "production"],
			default: "development",
		},
		PORT: { type: "number", default: 4001 },
		HOST: { type: "string", default: "localhost" },
		DATABASE_URL: { type: "string" },
	},
} as const;

export interface Env {
	NODE_ENV: "development" | "production";
	PORT: number;
	HOST: string;
	DATABASE_URL: string;
}
