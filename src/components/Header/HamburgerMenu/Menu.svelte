<script lang="ts">
    import { slide, fly } from 'svelte/transition'
  
    import AnimatedHamburger from "./AnimatedHamburger.svelte"

    export let open = false
    export let hamburgerShadow = false;

    export let onClick = (): void => {
      open = !open
      hamburgerShadow = !hamburgerShadow
      activeMenu = 'main'
    }

    import { all_dropdowns } from "../NavData.ts";

    let activeMenu = 'main';
    let whiteText = "text-white hover:underline active:no-underline";
</script>
 
<div class="fixed bg-gray-50 ml-2 rounded-3xl right-5 shadow-md shadow-black z-20" class:hamburgerShadow>
    <AnimatedHamburger {open} {onClick} />
</div>

<aside class="fixed overflow-hidden max-w-2xl h-fit bg-gray-50 rounded-l-lg shadow-md shadow-black z-10" class:open transition:slide>
    <div class="flex justify-end mx-6 mt-20 mb-2">
        {#if activeMenu === 'main'}
        <div class="text-2xl" in:fly={{ x: -300 }} >
            {#each all_dropdowns as dropdown}
            {#if dropdown.content}
            <button 
            on:click={() => activeMenu = dropdown.title} 
            transition:fly={{ y: -200, duration: 200 }}
            class="h-12 grid grid-cols-1 text-left gap-3 align-middle w-full rounded-md transition-colors ease-in-out duration-300 p-2 text-purple-700 hover:bg-gray-300 hover:underline active:no-underline active:bg-gray-400">
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
    <div class="text-lg" in:fly={{ x: 300 }} >
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
</aside>


<style>

    aside {
		right: -100%;
		transition: right 0.3s ease-in-out;
        overflow-y: hidden;
	}   
	
	.open {
		right: 0;
	}

    .hamburgerShadow {
        box-shadow: none;
        transition: all;
        transition-duration: 300ms;
    }
</style>