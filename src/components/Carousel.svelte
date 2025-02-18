<script lang="ts">
  import type { ImageMetadata } from "astro";
  import { Carousel } from "flowbite";
  import { onDestroy, onMount } from "svelte";

  let carousel: Carousel | null = null;

  interface CarouselProps {
    // List of image metadata's OR strings
    images: (ImageMetadata | string)[];

    // Whether or not the user can click to move the carousel pages.
    clickablePages?: boolean;

    // Duration for auto-slide, if any
    // 0 Indicates none
    duration?: number;

    // How fast should the page switch? (as a TailwindCSS class)
    animationSpeed?: string;

    // Pause on mouse hover
    pauseOnHover?: boolean;

    // Default Page index
    defaultPage?: number;

    // Show Slider Indicators
    showSliderIndicators?: boolean;

    // Image Options (see interface below)
    imageOptions?: ImageOptions;

    // Carousel Height (as a TailwindCSS class)
    height?: string;

    // Carousel Bg Color (as a TailwindCSS class)
    bgColor?: string;
  }

  interface ImageOptions {
    // Should the images be rounded?
    rounded?: boolean;

    // Should the image have a custom object-cover? (as a TailwindCSS class)
    // e.g. "object-right", "object-left-top", etc.
    alignment?: string;
  }

  const {
    images = [],
    clickablePages = true,
    defaultPage = 0,
    showSliderIndicators = true,
    animationSpeed = "duration-700",
    imageOptions = {
      rounded: false,
      alignment: "",
    },
    height = "h-80",
    bgColor = "bg-honey-flower-800",
    duration = 0,
    pauseOnHover = true,
  }: CarouselProps = $props();

  let isMouseHovering = $state(false);
  let interval: ReturnType<typeof setInterval> | undefined = undefined;

  function nextPage() {
    if (carousel) {
      carousel.next();
    } else {
      console.error(
        "The carousel has not been initialized correctly in the mount and therefore the nextPage() function failed."
      );
    }
  }

  function previousPage() {
    if (carousel) {
      carousel.prev();
    } else {
      console.error(
        "The carousel has not been initialized correctly in the mount and therefore the previousPage() function failed."
      );
    }
  }

  function startAutoPlay(carousel: Carousel) {
    if (duration) {
      interval = setInterval(() => {
        if (!isMouseHovering) {
          carousel.next();
        }
      }, duration);
    }
  }

  function stopAutoPlay() {
    clearInterval(interval);
  }

  onMount(() => {
    const carouselElement = document.getElementById("default-carousel");

    // Indicate carousel-item-ids
    const items = images
      .map((item, i) => {
        const el = document.getElementById(`carousel-item-${i}`);
        if (el) {
          return { position: i, el };
        }
        console.warn(`Element with ID carousel-item-${i} not found.`);
        return null;
      })
      .filter(
        (item): item is { position: number; el: HTMLElement } => item !== null
      );

    // Indicate the options which outline the indicator ids
    const options = {
      defaultPosition: defaultPage,
      indicators: {
        activeClasses: "bg-white",
        items: images
          .map((item, i) => {
            const el = document.getElementById(`carousel-indicator-${i}`);
            if (el) {
              return { position: i, el };
            }
            console.warn(`Element with ID carousel-indicator-${i} not found.`);
            return null;
          })
          .filter(
            (item): item is { position: number; el: HTMLElement } =>
              item !== null
          ),
      },
    };

    // Initialize the carousel
    carousel = new Carousel(carouselElement, items, options);

    startAutoPlay(carousel);
  });

  onDestroy(() => {
    stopAutoPlay();
  });
</script>

<menu
  id="default-carousel"
  class="relative w-full {bgColor}"
  onmouseenter={() => {
    if (pauseOnHover) {
      isMouseHovering = true;
    }
  }}
  onmouseleave={() => {
    isMouseHovering = false;
  }}
>
  <!-- Carousel wrapper -->
  <div
    class="relative overflow-hidden {height} {imageOptions.rounded
      ? 'rounded-md'
      : ''}"
  >
    <!-- Items -->
    {#each images as srcObject, i}
      <div
        class="hidden {animationSpeed} ease-in-out w-full h-full"
        id="carousel-item-{i}"
      >
        <img
          src={typeof srcObject === "object" &&
          srcObject !== null &&
          "src" in srcObject
            ? srcObject.src
            : srcObject}
          class="absolute block w-full h-full object-cover {imageOptions.alignment}"
          alt=""
        />
      </div>
    {/each}
  </div>
  <!-- Slider indicators -->
  {#if showSliderIndicators}
    <div
      class="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse"
    >
      {#each images as item, index}
        <button
          id="carousel-indicator-{index}"
          type="button"
          class="w-3 h-3 rounded-full"
          aria-current="true"
          aria-label="Slide {index}"
          data-carousel-slide-to={index}
        ></button>
      {/each}
    </div>
  {/if}
  <!-- Slider controls -->
  {#if clickablePages}
    <button
      type="button"
      class="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
      onclick={previousPage}
    >
      <span
        class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white group-focus:outline-none"
      >
        <svg
          class="w-4 h-4 text-white rtl:rotate-180"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 6 10"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 1 1 5l4 4"
          />
        </svg>
        <span class="sr-only">Previous</span>
      </span>
    </button>
    <button
      type="button"
      class="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
      onclick={nextPage}
    >
      <span
        class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white group-focus:outline-none"
      >
        <svg
          class="w-4 h-4 text-white rtl:rotate-180"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 6 10"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 9 4-4-4-4"
          />
        </svg>
        <span class="sr-only">Next</span>
      </span>
    </button>
  {/if}
</menu>
