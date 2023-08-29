<script>
    export let images;
    import Carousel from 'svelte-carousel';
</script>

<Carousel
    autoplay
    autoplayDuration={5000}
    autoplayProgressVisible
    pauseOnFocus>
    {#each images as img}
    <img class="rounded-md object-cover" src={img} alt="">   
    {/each}
</Carousel>