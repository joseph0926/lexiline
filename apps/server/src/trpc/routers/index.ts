import { router, publicProcedure } from "../index";
import { wordRouter } from "./word";
import { reviewRouter } from "./review";

export const appRouter = router({
	health: publicProcedure.query(() => {
		return { status: "ok" };
	}),
	word: wordRouter,
	review: reviewRouter,
});

export type AppRouter = typeof appRouter;
