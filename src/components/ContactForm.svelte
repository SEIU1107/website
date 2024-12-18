<script lang="ts">
  import { onMount } from "svelte";
  import HeadingTitle from "../components/HeadingTitle.svelte";
  import Quill from "quill";
  import Button from "./Button.svelte";

  // https://quilljs.com/
  let quill: Quill;
  onMount(() => {
    quill = new Quill("#editor", {
      placeholder: "Enter Message Here...",
      theme: "snow",

      // Determines what's allowed, in particular, NO LINKS!
      formats: [
        "bold",
        "italic",
        "underline",
        "header",
        "list",
        "strike",
        "align",
      ],

      // Defines the toolbar options
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
        ],
      },
    });
  });
</script>

<div class="flex flex-col justify-center m-auto max-w-screen-xl py-2">
  <HeadingTitle text="Contact Us" />
  <div class="m-auto flex flex-col items-start">
    <div
      class="bg-honey-flower-50 max-w-[90vw] md:max-w-screen-md lg:max-w-screen-lg"
    >
      <div class="" id="editor"></div>
    </div>
  </div>

  <Button
    text="Fuck"
    onClick={() => {
      console.log(quill.getSemanticHTML());
    }}
  />
</div>
