<script lang="ts">
import { onMount } from "svelte";
import Loader2 from "@lucide/svelte/icons/loader-2";
import Newspaper from "@lucide/svelte/icons/newspaper";
import MessageSquare from "@lucide/svelte/icons/message-square";
import Users from "@lucide/svelte/icons/users";
import { api } from "@/lib/eden/client";
import { adminState } from "@/lib/adminState.svelte";
import AdminLayout from "./AdminLayout.svelte";

let isLoadingData = $state(false);
let aspirationsCount = $state(0);
let newsCount = $state(0);
let fetched = false;

onMount(async () => {
	if (adminState.apiKey) {
		fetchData();
	}
});

$effect(() => {
	if (adminState.apiKey && !fetched) {
		fetchData();
	}
});

async function fetchData() {
	if (fetched || isLoadingData) return;
	isLoadingData = true;
	fetched = true;
	try {
		const aspRes = await api.aspirasi.get({
			headers: { "x-api-key": adminState.apiKey },
		});
		if (aspRes.data && "data" in aspRes.data && aspRes.data.data) {
			aspirationsCount = aspRes.data.data.length;
		}
		const newsRes = await api.news.get();
		if (newsRes.data && "data" in newsRes.data && newsRes.data.data) {
			newsCount = newsRes.data.data.length;
		}
	} catch (err) {
		console.error(err);
	} finally {
		isLoadingData = false;
	}
}
</script>

<AdminLayout activeSection="dashboard">
  <div class="mb-8">
    <h2 class="text-2xl font-black text-foreground flex items-center gap-2">
      <Newspaper class="w-6 h-6 text-primary" />
      Dashboard Recap
    </h2>
    <p class="text-muted-foreground mt-1">Ringkasan semua data di sistem.</p>
  </div>

  {#if isLoadingData}
    <div class="flex items-center justify-center py-20">
      <Loader2 class="w-10 h-10 animate-spin text-primary" />
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-muted p-6 rounded-2xl flex items-center gap-4 border border-border">
        <div class="p-4 bg-primary/10 rounded-xl text-primary">
          <Newspaper class="w-8 h-8" />
        </div>
        <div>
          <p class="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Berita</p>
          <p class="text-4xl font-black text-foreground">{newsCount}</p>
        </div>
      </div>
      <div class="bg-muted p-6 rounded-2xl flex items-center gap-4 border border-border">
        <div class="p-4 bg-primary/10 rounded-xl text-primary">
          <MessageSquare class="w-8 h-8" />
        </div>
        <div>
          <p class="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Aspirasi</p>
          <p class="text-4xl font-black text-foreground">{aspirationsCount}</p>
        </div>
      </div>
      <div class="bg-muted p-6 rounded-2xl flex items-center gap-4 border border-border">
        <div class="p-4 bg-primary/10 rounded-xl text-primary">
          <Users class="w-8 h-8" />
        </div>
        <div>
          <p class="text-sm font-bold text-muted-foreground uppercase tracking-wider">Struktur</p>
          <p class="text-xl font-black text-foreground">Dikonfigurasi</p>
        </div>
      </div>
    </div>
  {/if}
</AdminLayout>
