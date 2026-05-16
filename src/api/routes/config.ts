import Elysia, { t } from "elysia";
import admin from "../middleware/admin";
import { db } from "@/lib/firebase";
import {
	commissionSchema,
	executiveSchema,
	heroSchema,
	periodSchema,
} from "../schemas/config";

export default new Elysia({ prefix: "/config", tags: ["Config"] })
	// GET /config/executive - Mendapatkan struktur eksekutif
	.get(
		"/executive",
		async ({ status }) => {
			const doc = await db.collection("config").doc("executive").get();
			return status(200, {
				success: true,
				data: (doc.data() as any) ?? {
					leader: {},
					assistants: [],
					administration: [],
				},
			});
		},
		{
			response: {
				200: t.Object({
					success: t.Boolean(),
					data: executiveSchema,
				}),
			},
		},
	)
	// GET /config/commissions - Mendapatkan struktur komisi
	.get(
		"/commissions",
		async ({ status }) => {
			const doc = await db.collection("config").doc("commissions").get();
			return status(200, {
				success: true,
				data: (doc.data()?.commissions as any) ?? [],
			});
		},
		{
			response: {
				200: t.Object({
					success: t.Boolean(),
					data: commissionSchema,
				}),
			},
		},
	)
	// GET /config/hero - Mendapatkan gambar hero
	.get(
		"/hero",
		async ({ status }) => {
			const doc = await db.collection("config").doc("hero").get();
			return status(200, {
				success: true,
				data: (doc.data() as any) ?? {
					image: "/images/hero.webp",
				},
			});
		},
		{
			response: {
				200: t.Object({
					success: t.Boolean(),
					data: heroSchema,
				}),
			},
		},
	)
	// GET /config/period - Mendapatkan periode
	.get(
		"/period",
		async ({ status }) => {
			const doc = await db.collection("config").doc("period").get();
			return status(200, {
				success: true,
				data: (doc.data() as any) ?? {
					years: "2025/2026",
				},
			});
		},
		{
			response: {
				200: t.Object({
					success: t.Boolean(),
					data: periodSchema,
				}),
			},
		},
	)

	.use(admin)
	// PUT /config/executive - Memperbarui struktur eksekutif
	.put(
		"/executive",
		async ({ body, status }) => {
			try {
				await db.collection("config").doc("executive").set(body);
				return status(200, {
					success: true,
					message: "Struktur eksekutif berhasil diperbarui",
				});
			} catch (e: any) {
				return status(500, {
					success: false,
					message: `Gagal memperbarui struktur eksekutif: ${e.message}`,
				});
			}
		},
		{
			body: executiveSchema,
			response: {
				200: t.Object({
					success: t.Boolean(),
					message: t.String(),
				}),
				500: t.Object({
					success: t.Boolean(),
					message: t.String(),
				}),
			},
		},
	)
	// PUT /config/commissions - Memperbarui struktur komisi
	.put(
		"/commissions",
		async ({ body, status }) => {
			try {
				await db
					.collection("config")
					.doc("commissions")
					.set({ commissions: body });
				return status(200, {
					success: true,
					message: "Struktur komisi berhasil diperbarui",
				});
			} catch (e: any) {
				return status(500, {
					success: false,
					message: `Gagal memperbarui struktur komisi: ${e.message}`,
				});
			}
		},
		{
			body: commissionSchema,
			response: {
				200: t.Object({
					success: t.Boolean(),
					message: t.String(),
				}),
				500: t.Object({
					success: t.Boolean(),
					message: t.String(),
				}),
			},
		},
	)
	// PUT /config/hero - Memperbarui gambar hero
	.put(
		"/hero",
		async ({ body, status }) => {
			try {
				await db.collection("config").doc("hero").set(body);
				return status(200, {
					success: true,
					message: "Hero berhasil diperbarui",
				});
			} catch (e: any) {
				return status(500, {
					success: false,
					message: `Gagal memperbarui hero: ${e.message}`,
				});
			}
		},
		{
			body: heroSchema,
			response: {
				200: t.Object({
					success: t.Boolean(),
					message: t.String(),
				}),
				500: t.Object({
					success: t.Boolean(),
					message: t.String(),
				}),
			},
		},
	)
	// PUT /config/period - Memperbarui periode
	.put(
		"/period",
		async ({ body, status }) => {
			try {
				await db.collection("config").doc("period").set(body);
				return status(200, {
					success: true,
					message: "Periode berhasil diperbarui",
				});
			} catch (e: any) {
				return status(500, {
					success: false,
					message: `Gagal memperbarui periode: ${e.message}`,
				});
			}
		},
		{
			body: periodSchema,
			response: {
				200: t.Object({
					success: t.Boolean(),
					message: t.String(),
				}),
				500: t.Object({
					success: t.Boolean(),
					message: t.String(),
				}),
			},
		},
	);
