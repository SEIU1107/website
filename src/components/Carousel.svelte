<script lang="ts">
  import type { ImageMetadata } from "astro";
  import { Carousel } from "flowbite";
  import { onDestroy, onMount } from "svelte";

  let carousel: Carousel | null = null;

  let maxHeight = $state(0);

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

    // Height override (as a TailwindCSS class)
    // When true, the div is set to this height rather than determined by images
    heightOverride?: string;

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

    // Carousel Bg Color (as a TailwindCSS class)
    bgColor?: string;
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
    heightOverride = "",
    imageOptions = {
      rounded: false,
      translateUp: false,
      height: "h-full",
    },
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

  function updateHeight(event: Event) {
    const target = event.target as HTMLImageElement;

    // Ensure styles are applied before measuring
    requestAnimationFrame(() => {
      const rect = target.getBoundingClientRect();
      if (rect.height > maxHeight) {
        maxHeight = rect.height;
      }
    });
  }

  onMount(() => {
    const carouselElement = document.getElementById(
      `default-carousel-${carouselID}`
    );

    // Indicate carousel-item-ids
    const items = images
      .map((item, i) => {
        const el = document.getElementById(`carousel-item-${carouselID}-${i}`);
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
        items: images
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

    // Initialize the carousel
    carousel = new Carousel(carouselElement, items, options);

    startAutoPlay(carousel);
  });

  onDestroy(() => {
    stopAutoPlay();
  });
</script>

<menu
  id="default-carousel-{carouselID}"
  class="relative w-full"
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
    class={`relative top-0 ${bgColor} overflow-hidden ${heightOverride ?? ""}`}
    style={heightOverride ? "" : `height: ${maxHeight}px;`}
  >
    <!-- Items -->
    {#each images as srcObject, i}
      <div
        class="{animationSpeed} ease-in-out w-full h-full"
        id="carousel-item-{carouselID}-{i}"
      >
        <img
          src={typeof srcObject === "object" &&
          srcObject !== null &&
          "src" in srcObject
            ? srcObject.src
            : srcObject}
          class={`w-full ${imageOptions.height} object-cover ${imageOptions.rounded ? "rounded-md" : ""}`}
          style={imageOptions.translateUp
            ? "transform: translateY(-8.5%);"
            : ""}
          alt=""
          onload={updateHeight}
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
