import { t } from "elysia";

export const executiveSchema = t.Object({
	leader: t.Object({
		role: t.String(),
		name: t.String(),
		class: t.String(),
		description: t.String(),
		image: t.String(),
	}),
	assistants: t.Array(
		t.Object({
			role: t.String(),
			name: t.String(),
			class: t.String(),
			description: t.String(),
			image: t.String(),
		}),
	),
	administration: t.Array(
		t.Object({
			role: t.String(),
			name: t.String(),
			class: t.String(),
			description: t.String(),
			image: t.String(),
		}),
	),
});

export const commissionSchema = t.Array(
	t.Object({
		id: t.String(),
		name: t.String(),
		fullName: t.String(),
		description: t.String(),
		image: t.String(),
		coordinator: t.Object({
			name: t.String(),
			class: t.String(),
		}),
		members: t.Array(
			t.Object({
				name: t.String(),
				class: t.String(),
			}),
		),
	}),
);

export const periodSchema = t.Object({
	years: t.String(),
});

export const heroSchema = t.Object({
	image: t.String(),
});
