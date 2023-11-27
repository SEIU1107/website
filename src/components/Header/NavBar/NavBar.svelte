<script>
    import Dropdown from "./Dropdown.svelte";
    import { all_dropdowns } from "../NavData"; 
</script>

<nav>
    <ul class="flex flex-row m-5 font-Trebuchet">
        {#each all_dropdowns as dropdown}
        <li class="px-2">
            <Dropdown title={dropdown.title} titleHref={dropdown.titleHref ?? undefined} content={dropdown.content ?? undefined}/>
        </li>
        {/each}
    </ul>
</nav>