import { z } from "zod";
import { router, publicProcedure } from "../index";

export const wordRouter = router({
	list: publicProcedure.query(async ({ ctx }) => {
		return ctx.prisma.word.findMany({
			include: { examples: true, review: true },
			orderBy: { createdAt: "desc" },
		});
	}),

	get: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
		return ctx.prisma.word.findUnique({
			where: { id: input.id },
			include: { examples: true, review: true },
		});
	}),

	create: publicProcedure
		.input(
			z.object({
				term: z.string().min(1),
				meaning: z.string().min(1),
				partOfSpeech: z.string().optional(),
				memo: z.string().optional(),
				examples: z
					.array(
						z.object({
							sentence: z.string(),
							translation: z.string().optional(),
						}),
					)
					.optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { examples, ...wordData } = input;
			return ctx.prisma.word.create({
				data: {
					...wordData,
					examples: examples ? { create: examples } : undefined,
					review: { create: {} },
				},
				include: { examples: true, review: true },
			});
		}),

	update: publicProcedure
		.input(
			z.object({
				id: z.string(),
				term: z.string().min(1).optional(),
				meaning: z.string().min(1).optional(),
				partOfSpeech: z.string().optional(),
				memo: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { id, ...data } = input;
			return ctx.prisma.word.update({
				where: { id },
				data,
				include: { examples: true, review: true },
			});
		}),

	delete: publicProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
		return ctx.prisma.word.delete({ where: { id: input.id } });
	}),
});
