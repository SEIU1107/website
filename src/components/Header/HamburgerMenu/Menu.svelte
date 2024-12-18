<script lang="ts">
  import { slide, fly } from "svelte/transition";

  import AnimatedHamburger from "./AnimatedHamburger.svelte";

  export let open = false;
  export let hamburgerShadow = false;

  export let onClick = (): void => {
    open = !open;
    hamburgerShadow = !hamburgerShadow;
    activeMenu = "main";
  };

  import { all_dropdowns } from "../NavData.ts";

  let activeMenu = "main";
  let whiteText = "text-white hover:underline active:no-underline";
</script>

<div
  class="fixed bg-gray-50 ml-2 rounded-3xl right-5 shadow-md shadow-black z-20"
  class:hamburgerShadow
>
  <AnimatedHamburger {open} {onClick} />
</div>

<aside
  class="fixed overflow-hidden max-w-2xl h-fit bg-gray-50 rounded-l-lg shadow-lg shadow-black z-10"
  class:open
  transition:slide
>
  <div class="flex justify-end mx-2 mt-20 mb-2">
    {#if activeMenu === "main"}
      <div class="text-2xl m-2" in:fly={{ x: -300 }}>
        {#each all_dropdowns as dropdown}
          {#if dropdown.content}
            <button
              on:click={() => (activeMenu = dropdown.title)}
              transition:fly={{ y: -200, duration: 200 }}
              class="flex flex-col h-12 text-left align-middle w-full p-2 m-2 rounded-md transition-all ease-in-out duration-300 text-honey-flower-800 hover:scale-110 hover:bg-gray-300 hover:underline active:no-underline active:bg-gray-400"
            >
              {dropdown.title}
            </button>
          {:else}
            <a class={whiteText} href={dropdown.titleHref}>
              <button
                class="h-12 flex flex-col py-2 my-2 align-middle rounded-md transition-colors ease-in-out duration-300 p-2 bg-honey-flower-950 hover:bg-honey-flower-950 hover:underline active:no-underline active:bg-honey-flower-950"
              >
                {dropdown.title}
              </button>
            </a>
          {/if}
        {/each}
      </div>
    {/if}

    {#each all_dropdowns as dropdown}
      {#if activeMenu === dropdown.title}
        <div class="text-lg m-2" in:fly={{ x: 300 }}>
          <button
            on:click={() => (activeMenu = "main")}
            class="h-12 flex flex-row py-2 my-1 text-2xl w-full font-bold align-middle rounded-md transition-all ease-in-out duration-300 p-2 text-black hover:scale-110 hover:bg-gray-300 active:bg-gray-400 hover:underline active:no-underline"
          >
            <span class="px-2">&larr;</span>Back
          </button>

          {#if dropdown.content}
            {#each dropdown.content as content}
              <a class={whiteText} href={content.href}>
                <button
                  class="h-12 flex flex-col py-2 my-2 align-middle w-full rounded-md transition-all ease-in-out duration-300 p-2 bg-honey-flower-950 hover:scale-110 hover:bg-honey-flower-800 active:bg-honey-flower-950"
                >
                  {content.pageName}
                </button>
              </a>
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
