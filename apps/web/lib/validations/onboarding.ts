import { z } from "zod";

export const completeOnboardingSchema = z.object({
	dailySmokingRange: z.enum(["UNDER_5", "FROM_5_10", "FROM_10_20", "OVER_20", "UNKNOWN"]),
	targetInterval: z.number().min(30).max(120),
	motivation: z.string().max(500).optional().default(""),
});

export type CompleteOnboardingInput = z.infer<typeof completeOnboardingSchema>;
