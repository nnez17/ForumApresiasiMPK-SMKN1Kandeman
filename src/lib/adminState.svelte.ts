export const adminState = $state({
	isAuthenticated: false,
	apiKey: "",
	toastAlerts: [] as {
		id: number;
		variant: "default" | "destructive";
		title: string;
		description: string;
	}[],
	toastId: 0,
});

export function addToast(
	title: string,
	description: string,
	variant: "default" | "destructive" = "default",
) {
	const id = adminState.toastId++;
	adminState.toastAlerts = [
		...adminState.toastAlerts,
		{ id, title, description, variant },
	];
	setTimeout(() => {
		adminState.toastAlerts = adminState.toastAlerts.filter((t) => t.id !== id);
	}, 5000);
}

export function removeToast(id: number) {
	adminState.toastAlerts = adminState.toastAlerts.filter((t) => t.id !== id);
}

export function initAuth() {
	const savedKey =
		typeof window !== "undefined" ? localStorage.getItem("admin_xkey") : null;
	if (savedKey) {
		adminState.apiKey = savedKey;
		adminState.isAuthenticated = true;
	}
}

export function logout() {
	if (typeof window !== "undefined") {
		localStorage.removeItem("admin_xkey");
		localStorage.removeItem("admin_authenticated");
	}
	adminState.isAuthenticated = false;
	adminState.apiKey = "";
}
