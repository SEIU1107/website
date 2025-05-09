<script lang="ts">
  import type { ImageMetadata } from "astro";
  import { Carousel } from "flowbite";
  import { onDestroy, onMount } from "svelte";
  import { measureImageHeights, preloadImages } from "./util";

  let carousel: Carousel | null = null;

  let maxHeight = $state(0);
  let aspectRatio = $state(1);

  interface CarouselProps {
    // List of image metadata's OR strings
    images: (ImageMetadata | string)[];

    // Carousel ID to make it unique
    carouselID?: number;

    // Whether or not the user can click to move the carousel pages.
    clickablePages?: boolean;

    // Duration for auto-slide, if any
    // 0 Indicates none
    duration?: number;

    // How fast should the page switch? (as a TailwindCSS class)
    animationSpeed?: string;

    // Pause on mouse hover
    pauseOnHover?: boolean;

    // Override the height with a TailwindCSS class
    heightOverride?: string;

    // Default Page index
    defaultPage?: number;

    // Show Slider Indicators
    showSliderIndicators?: boolean;

    // Image Options (see interface below)
    imageOptions?: ImageOptions;

    // Carousel Bg Color (as a TailwindCSS class)
    bgColor?: string;

    // Object property (as a TailwindCSS class such as "object-cover")
    object?: string;
  }

  interface ImageOptions {
    // Should the images be rounded?
    rounded?: boolean;

    // Image's height as a TailwindCSS class
    height?: string;

    // Move the image slightly up within the wrapping div? (Stupid Flowbite bug)
    translateUp?: boolean;
  }

  const {
    images = [],
    carouselID = 0,
    clickablePages = true,
    defaultPage = 0,
    showSliderIndicators = true,
    animationSpeed = "duration-700",
    object = "object-cover",
    heightOverride,
    imageOptions = {
      rounded: false,
      height: "h-full",
    },
    bgColor = "bg-honey-flower-800",
    duration = 0,
    pauseOnHover = true,
  }: CarouselProps = $props();

  let isMouseHovering = $state(false);
  let interval: ReturnType<typeof setInterval> | undefined = undefined;
  let preloadedImages: HTMLImageElement[] = $state([]);

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
    async function setup() {
      // Preload images
      preloadedImages = preloadImages(images);

      // Measure and set max height after images load
      const { height, ratio } = await measureImageHeights(preloadedImages);
      maxHeight = height;
      aspectRatio = ratio;

      // Indicate carousel-item-ids
      const items = preloadedImages
        .map((item, i) => {
          const el = document.getElementById(
            `carousel-item-${carouselID}-${i}`
          );
          if (el) {
            return { position: i, el };
          }
          console.warn(
            `Element with ID carousel-item-${carouselID}-${i} not found.`
          );
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
          items: preloadedImages
            .map((item, i) => {
              const el = document.getElementById(
                `carousel-indicator-${carouselID}-${i}`
              );
              if (el) {
                return { position: i, el };
              }
              console.warn(
                `Element with ID carousel-indicator-${carouselID}-${i} not found.`
              );
              return null;
            })
            .filter(
              (item): item is { position: number; el: HTMLElement } =>
                item !== null
            ),
        },
      };

      // Handle resizes
      const resizeHandler = async () => {
        const { height, ratio } = await measureImageHeights(preloadedImages);
        maxHeight = height;
        aspectRatio = ratio;
      };

      window.addEventListener("resize", resizeHandler);

      // Initialize the carousel
      carousel = new Carousel(carouselElement, items, options);

      startAutoPlay(carousel);
    }

    const carouselElement = document.getElementById(
      `default-carousel-${carouselID}`
    );

    setup();
  });

  onDestroy(() => {
    stopAutoPlay();
  });
</script>

<menu
  id="default-carousel-{carouselID}"
  class={`relative top-0 ${bgColor} overflow-hidden ${heightOverride ? heightOverride : ""}`}
  style={!heightOverride && maxHeight ? `aspect-ratio: ${aspectRatio}` : ""}
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
    class={`relative w-full h-full overflow-hidden ${bgColor} ${imageOptions.rounded ? "rounded-md" : ""}`}
  >
    <!-- Items -->
    {#if preloadedImages}
      {#each preloadedImages as srcObject, i}
        <div
          class="{animationSpeed} ease-in-out w-full h-full flex justify-center items-center"
          id="carousel-item-{carouselID}-{i}"
        >
          <img
            alt=""
            src={typeof srcObject === "object" &&
            srcObject !== null &&
            "src" in srcObject
              ? srcObject.src
              : srcObject}
            class={`w-full h-full ${imageOptions.rounded ? "rounded-md" : ""} ${object ?? "object-contain"}`}
            style={heightOverride ? "" : `aspect-ratio: ${aspectRatio};`}
          />
        </div>
      {/each}
    {:else}
      <span class="font-bold italic">Loading Images Carousel...</span>
    {/if}
  </div>
  <!-- Slider indicators -->
  {#if showSliderIndicators}
    <div
      class="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse"
    >
      {#each images as item, index}
        <button
          id="carousel-indicator-{carouselID}-{index}"
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
      <div
        class={"absolute inset-0 bg-gradient-to-r from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300".concat(
          " ",
          imageOptions.rounded ? "rounded-l-md" : ""
        )}
      ></div>
      <span
        class="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 opacity-0 group-hover:opacity-100 group-focus:ring-4 group-focus:ring-white group-focus:outline-none transition-opacity duration-300"
      >
        <svg
          class="w-4 h-4 text-white"
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
      <div
        class={"absolute inset-0 bg-gradient-to-l from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300".concat(
          " ",
          imageOptions.rounded ? "rounded-r-md" : ""
        )}
      ></div>
      <span
        class="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 opacity-0 group-hover:opacity-100 group-focus:ring-4 group-focus:ring-white group-focus:outline-none transition-opacity duration-300"
      >
        <svg
          class="w-4 h-4 text-white"
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
