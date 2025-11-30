import { z } from "zod";
import { router, publicProcedure } from "../index";

function calculateNextReview(
	rating: number,
	currentInterval: number,
	currentEaseFactor: number,
	currentRepetition: number,
) {
	let interval = currentInterval;
	let easeFactor = currentEaseFactor;
	let repetition = currentRepetition;

	if (rating < 2) {
		repetition = 0;
		interval = 1;
	} else {
		if (repetition === 0) {
			interval = 1;
		} else if (repetition === 1) {
			interval = 6;
		} else {
			interval = Math.round(currentInterval * easeFactor);
		}
		repetition += 1;
	}

	easeFactor = Math.max(1.3, easeFactor + (0.1 - (4 - rating) * (0.08 + (4 - rating) * 0.02)));

	const nextReview = new Date();
	nextReview.setDate(nextReview.getDate() + interval);

	return { interval, easeFactor, repetition, nextReview };
}

export const reviewRouter = router({
	getDue: publicProcedure.query(async ({ ctx }) => {
		return ctx.prisma.wordReview.findMany({
			where: {
				nextReview: { lte: new Date() },
			},
			include: {
				word: { include: { examples: true } },
			},
			orderBy: { nextReview: "asc" },
		});
	}),

	submit: publicProcedure
		.input(
			z.object({
				reviewId: z.string(),
				rating: z.number().min(1).max(4),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const review = await ctx.prisma.wordReview.findUnique({
				where: { id: input.reviewId },
			});

			if (!review) {
				throw new Error("Review not found");
			}

			const { interval, easeFactor, repetition, nextReview } = calculateNextReview(
				input.rating,
				review.interval,
				review.easeFactor,
				review.repetition,
			);

			return ctx.prisma.wordReview.update({
				where: { id: input.reviewId },
				data: {
					interval,
					easeFactor,
					repetition,
					nextReview,
					logs: {
						create: { rating: input.rating },
					},
				},
				include: { word: true },
			});
		}),

	stats: publicProcedure.query(async ({ ctx }) => {
		const total = await ctx.prisma.word.count();
		const dueToday = await ctx.prisma.wordReview.count({
			where: { nextReview: { lte: new Date() } },
		});
		const reviewedToday = await ctx.prisma.wordReviewLog.count({
			where: {
				createdAt: {
					gte: new Date(new Date().setHours(0, 0, 0, 0)),
				},
			},
		});

		return { total, dueToday, reviewedToday };
	}),
});
