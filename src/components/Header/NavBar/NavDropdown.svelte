<script lang="ts">
  const {
    title = "Dropdown",
    titleHref = undefined,
    content = undefined,
  } = $props();

  let open = false;

  const onClick = (): void => {
    open = !open;
  };

  const clickable =
    "text-honey-flower-800 bg-honey-flower-300 transition ease-in-out duration-250 p-4 text-base border-none cursor-pointer hover:underline hover:bg-supernova-500 active:bg-supernova-600 active:no-underline";

  const joinNowClass =
    "text-honey-flower-800 bg-supernova-300 font-bold transition ease-in-out duration-250 p-4 text-base border-none cursor-pointer hover:bg-supernova-500 hover:underline active:no-underline active:bg-supernova-600 ";
</script>

<div class="group relative inline-block z-50">
  {#if titleHref}
    <a href={titleHref}>
      <div class={titleHref === "/join" ? joinNowClass : clickable}>
        {title}
      </div>
    </a>
  {:else if content}
    <button
      class="shadow-black shadow-md text-honey-flower-800 bg-honey-flower-300 text-center transition ease-in-out duration-250 p-4 text-base border-none cursor-pointer group-hover:bg-supernova-300 group-hover:shadow-none group-hover:translate-y-0.5"
      onclick={onClick}
      onkeypress={onClick}
      aria-label={title.concat(" Toggle")}
    >
      {title}
    </button>
    <div
      class="hidden absolute shadow-lg shadow-black text-white bg-honey-flower-950 min-w-[160px] z-1 group-hover:block"
    >
      {#each content as dropdown}
        <a
          class="bg-honey-flower-950 text-white p-4 text-base block transition ease-in-out duration-250 hover:underline hover:bg-supernova-500 hover:text-honey-flower-950 active:no-underline"
          href={dropdown.href}
        >
          {dropdown.pageName}
        </a>
      {/each}
    </div>
  {:else}
    <div class={clickable}>NAVBAR_ERROR CHECK NAVDATA.TS</div>
  {/if}
</div>
