<script lang="ts">
    import { fly } from 'svelte/transition'
  
    import AnimatedHamburger from "./AnimatedHamburger.svelte"

    export let open = false
    export let onClick = (): void => {
      open = !open
      activeMenu = 'main'
    }

    import { all_dropdowns } from "../NavData.ts";

    let activeMenu = 'main';
    let whiteText = "text-white hover:underline active:no-underline";
  </script>
  
  <header class="relative z-20">
    <div class="flex justify-between">
      <AnimatedHamburger {open} {onClick} />
    </div>
  
    {#if open}

        <div class="max-w-screen-xl bg-gray-200 p-5 m-5 rounded-md shadow-sm shadow-black" transition:fly={{ y: -200, duration: 400 }}>


            {#if activeMenu === 'main'}
            <div class="text-2xl" in:fly={{ x: -300 }} out:fly={{ x: -300 }}>
                {#each all_dropdowns as dropdown}
                {#if dropdown.content}
                <button on:click={() => activeMenu = dropdown.title} transition:fly={{ y: -200, duration: 400 }} 
                    class="h-12 grid grid-cols-1 gap-3 align-middle rounded-md transition-colors ease-in-out duration-300 p-2 text-purple-700 hover:bg-gray-300 hover:underline active:no-underline active:bg-gray-400">
                    {dropdown.title}
                </button>
                {:else}
                <button 
                class="h-12 flex flex-col py-2 my-2 align-middle rounded-md transition-colors ease-in-out duration-300 p-2 bg-purple-950 hover:bg-purple-900 hover:underline active:no-underline active:bg-purple-950">
                    <a class={whiteText} href={dropdown.titleHref}>{dropdown.title}</a>
                </button>
                {/if}
                {/each}    
            </div>
            {/if}
            
            {#each all_dropdowns as dropdown}
            {#if activeMenu === dropdown.title}
            <div class="text-lg" in:fly={{ x: 300 }} out:fly={{ x: 300 }}>
                <button 
                on:click={() => activeMenu = 'main'} 
                class="h-12 flex flex-col py-2 my-1 text-2xl font-bold align-middle rounded-md transition-colors ease-in-out duration-300 p-2 text-black hover:bg-gray-300 active:bg-gray-400 hover:underline active:no-underline">
                    Back
                </button>
                <button 
                class="h-12 flex flex-col py-2 my-2 align-middle rounded-md transition-colors ease-in-out duration-300 p-2 bg-purple-950 hover:bg-purple-800 active:bg-purple-950 hover:underline active:no-underline">
                    <a class={whiteText} href={dropdown.titleHref}>{dropdown.title}</a>
                </button>
                {#if dropdown.content}
                {#each dropdown.content as content}
                <button 
                class="h-12 flex flex-col py-2 my-2 align-middle rounded-md transition-colors ease-in-out duration-300 p-2  bg-purple-950 hover:bg-purple-800 active:bg-purple-950">
                    <a class={whiteText} href={content.href}>{content.pageName}</a>
                </button>
                {/each}
                {/if}
                    
                    
            </div>
            
            {/if}
            {/each}
            
        </div>

    {/if}
</header>