<script lang="ts">
  import * as Sidebar from "@/components/ui/sidebar";
  import MobileMenuTrigger from "./MobileMenuTrigger.svelte";
  import SidebarCloseLink from "./SidebarCloseLink.svelte";
  import { commissions } from "@/data/Commission";
  import { leader, assistants, administration } from "@/data/Executive";
  import { 
    ChevronDown, 
    Users, 
    ShieldCheck, 
    Home, 
    Newspaper, 
    Phone, 
    Lock,
    UserCircle
  } from "@lucide/svelte";
  import { slide } from "svelte/transition";

  let { 
    links = [
      { name: "Beranda", href: "#home", icon: Home },
      { name: "Berita", href: "#berita", icon: Newspaper },
      { name: "Kontak", href: "#kontak", icon: Phone },
      { name: "Admin", href: "/admin", icon: Lock },
    ] 
  } = $props();

  let expandedGroups = $state<Record<string, boolean>>({
    executive: false,
    komisi: false
  });

  const executiveMembers = [
    leader,
    ...assistants,
    ...administration
  ];

  function toggleGroup(group: string) {
    expandedGroups[group] = !expandedGroups[group];
  }
</script>

<Sidebar.Provider class="contents">
  <Sidebar.Root side="left" class="z-110">
    <Sidebar.Header class="p-6 border-b border-sidebar-border bg-primary/5">
      <div class="flex flex-col gap-1">
        <h2 class="text-primary font-black text-2xl tracking-tighter leading-none">
          MPK
        </h2>
        <p class="text-[10px] font-bold text-muted-foreground tracking-widest uppercase opacity-70">
          SMKN 1 KANDEMAN
        </p>
      </div>
    </Sidebar.Header>
    
    <Sidebar.Content class="p-2 bg-background">
      <Sidebar.Group>
        <Sidebar.Menu class="space-y-1">
          <!-- Main Links -->
          {#each links as link}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton 
                size="lg" 
                class="h-12 px-4 rounded-xl text-sm font-bold transition-all hover:bg-primary/10 group"
              >
                {#snippet child({ props })}
                  <div class="flex items-center gap-3 w-full">
                    <link.icon class="size-4 text-primary/60 group-hover:text-primary transition-colors" />
                    <SidebarCloseLink {...props} href={link.href} name={link.name} />
                  </div>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}

          <div class="my-4 border-t border-sidebar-border/50 mx-2"></div>

          <!-- Executive Collapsible -->
          <Sidebar.MenuItem>
            <button 
              onclick={() => toggleGroup('executive')}
              class="flex items-center justify-between w-full h-12 px-4 rounded-xl text-sm font-bold transition-all hover:bg-primary/5 group"
            >
              <div class="flex items-center gap-3">
                <ShieldCheck class="size-4 text-primary/60 group-hover:text-primary transition-colors" />
                <span>Executive</span>
              </div>
              <ChevronDown 
                class="size-4 text-muted-foreground transition-transform duration-300 {expandedGroups.executive ? 'rotate-180' : ''}" 
              />
            </button>
            
            {#if expandedGroups.executive}
              <div transition:slide={{ duration: 300 }} class="pl-4 mt-1 space-y-1 border-l-2 border-primary/10 ml-6">
                {#each executiveMembers as member}
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton 
                      size="sm"
                      class="h-10 px-4 rounded-lg text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/5"
                    >
                      {#snippet child({ props })}
                        <SidebarCloseLink 
                          {...props}
                          href="#pengurus" 
                          name={member.role} 
                        />
                      {/snippet}
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                {/each}
              </div>
            {/if}
          </Sidebar.MenuItem>

          <!-- Komisi Collapsible -->
          <Sidebar.MenuItem>
            <button 
              onclick={() => toggleGroup('komisi')}
              class="flex items-center justify-between w-full h-12 px-4 rounded-xl text-sm font-bold transition-all hover:bg-primary/5 group"
            >
              <div class="flex items-center gap-3">
                <Users class="size-4 text-primary/60 group-hover:text-primary transition-colors" />
                <span>Komisi</span>
              </div>
              <ChevronDown 
                class="size-4 text-muted-foreground transition-transform duration-300 {expandedGroups.komisi ? 'rotate-180' : ''}" 
              />
            </button>
            
            {#if expandedGroups.komisi}
              <div transition:slide={{ duration: 300 }} class="pl-4 mt-1 space-y-1 border-l-2 border-primary/10 ml-6">
                {#each commissions as komisi}
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton 
                      size="sm"
                      class="h-10 px-4 rounded-lg text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/5"
                    >
                      {#snippet child({ props })}
                        <SidebarCloseLink 
                          {...props}
                          href="#komisi" 
                          name={komisi.title} 
                        />
                      {/snippet}
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                {/each}
              </div>
            {/if}
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.Group>
    </Sidebar.Content>

    <Sidebar.Footer class="p-4 border-t border-sidebar-border bg-primary/5">
      <div class="flex items-center gap-3 px-2">
        <div class="size-8 rounded-full bg-primary/20 flex items-center justify-center">
          <UserCircle class="size-5 text-primary" />
        </div>
        <div class="flex flex-col">
          <span class="text-xs font-bold leading-none">Guest User</span>
          <span class="text-[10px] text-muted-foreground uppercase tracking-wider">Visitor</span>
        </div>
      </div>
    </Sidebar.Footer>
  </Sidebar.Root>

  <MobileMenuTrigger />
</Sidebar.Provider>
