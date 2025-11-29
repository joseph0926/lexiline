export const envSchema = {
	type: "object",
	required: ["NODE_ENV"],
	properties: {
		NODE_ENV: {
			type: "string",
			enum: ["development", "production"],
			default: "development",
		},
		PORT: { type: "number", default: 4001 },
		HOST: { type: "string", default: "localhost" },
	},
} as const;

export interface Env {
	NODE_ENV: "development" | "production";
	PORT: number;
	HOST: string;
}
