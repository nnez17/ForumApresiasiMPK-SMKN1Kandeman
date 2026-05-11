<script lang="ts">
import { onMount } from "svelte";
import ShieldCheck from "@lucide/svelte/icons/shield-check";
import LogOut from "@lucide/svelte/icons/log-out";
import Plus from "@lucide/svelte/icons/plus";
import Save from "@lucide/svelte/icons/save";
import MessageSquare from "@lucide/svelte/icons/message-square";
import Newspaper from "@lucide/svelte/icons/newspaper";
import Trash2 from "@lucide/svelte/icons/trash-2";
import Edit from "@lucide/svelte/icons/edit";
import ChevronRight from "@lucide/svelte/icons/chevron-right";
import Loader2 from "@lucide/svelte/icons/loader-2";

import * as Alert from "@/components/ui/alert/index.js";
import { api } from "@/lib/eden";

let isAuthenticated = $state(false);
let passwordInput = $state("");
let loginError = $state("");
let isLoggingIn = $state(false);

let activeSection = $state("publish-content");
let kategori = $state("berita");

let aspirations: any[] = $state([]);
let isLoadingData = $state(false);

onMount(() => {
	if (localStorage.getItem("admin_authenticated") === "true") {
		isAuthenticated = true;
		fetchData();
	}

	const sections = document.querySelectorAll("section[id]");
	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					activeSection = entry.target.id;
				}
			}
		},
		{ rootMargin: "-30% 0px -60% 0px" },
	);

	for (const section of sections) {
		observer.observe(section);
	}

	return () => observer.disconnect();
});

const correctPassword = "[PASSWORD]";

function handleLogin(e: Event) {
	e.preventDefault();
	loginError = "";
	isLoggingIn = true;

	setTimeout(() => {
		if (passwordInput === correctPassword) {
			localStorage.setItem("admin_authenticated", "true");
			localStorage.setItem("x-api-key", passwordInput);
			isAuthenticated = true;
			fetchData();
		} else {
			loginError = "Password yang Anda masukkan salah.";
		}
		isLoggingIn = false;
	}, 800);
}

function handleLogout() {
	localStorage.removeItem("admin_authenticated");
	localStorage.removeItem("x-api-key");
	isAuthenticated = false;
	passwordInput = "";
}

async function fetchData() {
	try {
		isLoadingData = true;
		const { data, error } = await api.api.aspirasi.index.get({
			headers: {
				"x-api-key": localStorage.getItem("x-api-key"),
			},
		});

		if (!error && data?.success) {
			aspirations = data.data ?? [];
		}
	} catch (err) {
		console.error("Failed to fetch aspirations:", err);
	} finally {
		isLoadingData = false;
	}
}
</script>

{#if !isAuthenticated}
    <div class="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <div class="w-full max-w-md space-y-8">
            <div class="text-center space-y-2">
                <img src="/images/logo-mpk.png" alt="Logo" class="w-32 h-32 mx-auto" />
                <h1 class="text-4xl font-black tracking-tight text-foreground">Admin Access</h1>
                <p class="text-muted-foreground">Otorisasi diperlukan untuk masuk ke dalam sistem.</p>
            </div>
            
            {#if loginError}
                <Alert.Root variant="destructive">
                    <Alert.Title>Gagal Masuk</Alert.Title>
                    <Alert.Description>{loginError}</Alert.Description>
                </Alert.Root>
            {/if}

            <form onsubmit={handleLogin} class="space-y-4">
                <input 
                    type="password" 
                    bind:value={passwordInput} 
                    placeholder="Masukkan Password..." 
                    class="w-full px-5 py-4 rounded-xl bg-muted border border-transparent focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground font-medium text-center text-lg" 
                    required 
                    disabled={isLoggingIn}
                />
                <button 
                    type="submit" 
                    class="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all shadow-lg flex items-center justify-center gap-2"
                    disabled={isLoggingIn}
                >
                    {#if isLoggingIn}
                        <Loader2 class="w-6 h-6 animate-spin" />
                        Memeriksa...
                    {:else}
                        Masuk
                    {/if}
                </button>
            </form>
        </div>
    </div>
{:else}
    <main class="min-h-screen bg-background pt-28 pb-20">
        <div class="container mx-auto px-4 max-w-6xl">
            <div class="border-b border-border pb-8 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div class="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider mb-2">
                        <ShieldCheck class="w-4 h-4" />
                        Administrator Panel
                    </div>
                    <h1 class="text-4xl md:text-5xl font-black text-foreground tracking-tight">
                        Kelola <span class="text-primary">Konten</span>
                    </h1>
                </div>
                <button onclick={handleLogout} class="flex items-center gap-2 text-destructive hover:bg-destructive/10 px-4 py-2 rounded-lg transition-colors font-bold text-sm">
                    <LogOut class="w-4 h-4" />
                    Logout
                </button>
            </div>

            <div class="flex flex-col lg:flex-row gap-12">
                <div class="w-full lg:w-64 shrink-0">
                    <nav class="sticky top-28 space-y-2">
                    <a href="#publish-content" class={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all no-underline ${activeSection === 'publish-content' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
                        <Newspaper class="w-5 h-5" />
                        Publish Konten
                    </a>
                    <a href="#aspirasi" class={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all no-underline ${activeSection === 'aspirasi' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
                        <MessageSquare class="w-5 h-5" />
                        Aspirasi Siswa
                    </a>
                    </nav>
                </div>

                <div class="flex-1">
                    <!-- Publish Konten -->
                    <section id="publish-content" class="scroll-mt-32">
                            <div class="mb-8">
                                <h2 class="text-2xl font-black text-foreground flex items-center gap-2">
                                    <Plus class="w-6 h-6 text-primary" />
                                    Form Publikasi
                                </h2>
                                <p class="text-muted-foreground mt-1">Tambahkan berita atau informasi penting untuk halaman utama.</p>
                            </div>

                            <form class="space-y-6 max-w-3xl">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div class="space-y-2 md:col-span-2">
                                        <label for="kategori" class="text-sm font-bold text-foreground">Kategori Konten</label>
                                        <div class="relative">
                                            <select bind:value={kategori} class="w-full px-5 py-3 rounded-xl bg-muted border border-transparent focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-foreground appearance-none">
                                                <option value="berita">BERITA</option>
                                                <option value="info">INFO PENTING</option>
                                            </select>
                                            <ChevronRight class="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground rotate-90 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div class="space-y-2 md:col-span-2">
                                        <label for="judul" class="text-sm font-bold text-foreground">Judul</label>
                                        <input id="judul" type="text" placeholder="Masukkan judul..." class="w-full px-5 py-3 rounded-xl bg-muted border border-transparent focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-foreground" />
                                    </div>

                                    {#if kategori === 'berita'}
                                        <div class="space-y-2 md:col-span-2">
                                            <label for="ringkasan" class="text-sm font-bold text-foreground">Ringkasan Berita</label>
                                            <textarea id="ringkasan" rows="4" placeholder="Tulis ringkasan berita..." class="w-full px-5 py-3 rounded-xl bg-muted border border-transparent focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-foreground"></textarea>
                                        </div>

                                        <div class="space-y-2 md:col-span-2">
                                            <label for="foto" class="text-sm font-bold text-foreground">Foto Berita</label>
                                            <input id="foto" type="file" accept="image/*" class="w-full px-5 py-2.5 rounded-xl bg-muted border border-transparent focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer cursor-pointer" />
                                        </div>

                                        <div class="space-y-2 md:col-span-2">
                                            <label for="penulis" class="text-sm font-bold text-foreground">Nama Penulis</label>
                                            <input id="penulis" type="text" placeholder="Misal: Admin MPK" class="w-full px-5 py-3 rounded-xl bg-muted border border-transparent focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-foreground" />
                                        </div>
                                    {/if}
                                </div>

                                <div class="pt-4">
                                    <button type="submit" class="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                                        <Save class="w-5 h-5" />
                                        Publish Sekarang
                                    </button>
                                </div>
                            </form>
                        </section>

                        <hr class="my-12 border-border" />

                        <!-- Aspirasi -->
                        <section id="aspirasi" class="scroll-mt-32">
                            <div class="mb-8">
                                <h2 class="text-2xl font-black text-foreground flex items-center gap-2">
                                    <MessageSquare class="w-6 h-6 text-primary" />
                                    Aspirasi Masuk
                                </h2>
                                <p class="text-muted-foreground mt-1">Daftar aspirasi dari siswa yang perlu ditinjau.</p>
                            </div>

                            {#if isLoadingData}
                                <div class="flex flex-col items-center justify-center py-20 space-y-4">
                                    <Loader2 class="w-10 h-10 animate-spin text-primary" />
                                    <p class="font-bold text-muted-foreground">Memuat data aspirasi...</p>
                                </div>
                            {:else}
                                <div class="overflow-x-auto">
                                    <table class="w-full text-left border-collapse">
                                        <thead>
                                            <tr class="border-b-2 border-border">
                                                <th class="py-4 pr-4 text-xs font-black text-muted-foreground uppercase tracking-widest">Siswa</th>
                                                <th class="py-4 px-4 text-xs font-black text-muted-foreground uppercase tracking-widest">Pesan</th>
                                                <th class="py-4 px-4 text-xs font-black text-muted-foreground uppercase tracking-widest">Status</th>
                                                <th class="py-4 pl-4 text-xs font-black text-muted-foreground uppercase tracking-widest text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-border">
                                            {#each aspirations as item}
                                                <tr class="hover:bg-muted/50 transition-colors group">
                                                    <td class="py-4 pr-4">
                                                        <div class="font-bold text-foreground whitespace-nowrap">{item.name}</div>
                                                        <div class="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{item.class}</div>
                                                    </td>
                                                    <td class="py-4 px-4 text-sm text-muted-foreground max-w-[200px] md:max-w-[300px]">
                                                        <p class="truncate">{item.content}</p>
                                                    </td>
                                                    <td class="py-4 px-4">
                                                        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap bg-muted">
                                                            <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                                                            {item.status || 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td class="py-4 pl-4 text-right">
                                                        <div class="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                            <button class="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors" title="Edit">
                                                                <Edit class="w-4 h-4" />
                                                            </button>
                                                            <button class="w-8 h-8 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors" title="Hapus">
                                                                <Trash2 class="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            {/each}
                                            
                                            {#if aspirations.length === 0}
                                                <tr>
                                                    <td colspan="4" class="text-center py-8 text-muted-foreground font-medium">
                                                        Belum ada aspirasi yang masuk.
                                                    </td>
                                                </tr>
                                            {/if}
                                        </tbody>
                                    </table>
                                </div>
                            {/if}
                        </section>
                </div>
            </div>
        </div>
    </main>
{/if}
