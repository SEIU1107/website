<script lang="ts">

    export let title = "Dropdown"; /* Name of the Dropdown */
    export let titleHref: string | undefined = undefined;
    export let content: {pageName: string, href: string}[] | undefined  = undefined;


    export let open = false;

    export let onClick = (): void => {
      open = !open
    }

    const clickable = "text-white bg-honey-flower-950 transition ease-in-out duration-250 p-4 text-base border-none cursor-pointer hover:underline hover:bg-supernova-500 active:bg-supernova-600 hover:text-honey-flower-950 active:no-underline";
</script>

<div class="group relative inline-block z-50">
    {#if titleHref}
    <a href={titleHref}>
        <div class={clickable}>{title}</div>
    </a>
    {:else if content}
    <button class="text-honey-flower-800 bg-honey-flower-300 text-center transition ease-in-out duration-250 p-4 text-base border-none cursor-pointer hover:bg-supernova-300" 
    on:click={onClick} 
    on:keypress={onClick} 
    aria-label={title.concat(" Toggle")}>
        {title}
    </button>
    {#if open}
    {#each content as dropdown}
    <a
    class="bg-honey-flower-950 text-white p-4 text-base block transition ease-in-out duration-250 hover:underline hover:bg-supernova-500 hover:text-honey-flower-950 active:no-underline"
    href={dropdown.href}>
        {dropdown.pageName}
    </a>
    {/each}
    {/if}
    {:else}
    <div class={clickable} >
        NAVBAR_ERROR CHECK NAVDATA.TS
    </div>
    {/if}
</div>
