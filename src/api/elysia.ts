import { openapi } from "@elysia/openapi";
import { Elysia, redirect } from "elysia";
import aspirasi from "./routes/aspirasi";
import misc from "./routes/misc";
import news from "./routes/news";
import config from "./routes/config";

export const app = new Elysia({ prefix: "/api" })
	.use(
		openapi({
			documentation: {
				info: {
					title: "Forum Apresiasi MPK SMKN 1 Kandeman",
					version: "1.0.0",
					description: "API for Forum Apresiasi MPK SMKN 1 Kandeman",
				},
				components: {
					securitySchemes: {
						"x-api-key": {
							type: "apiKey",
							in: "header",
							name: "x-api-key",
						},
					},
				},
			},
			path: "/docs",
		}),
	)
	.use(aspirasi)
	.use(news)
	.use(misc)
	.use(config)
	.get("/", () => redirect("/api/docs"), { detail: { hide: true } });

export type App = typeof app;

export default app;
