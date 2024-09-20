<script lang="ts">
  export let text = "hello";
  export let styling =
    "pb-2 text-center text-honey-flower-800 italic font-Trebuchet";
</script>

<h1
  class={styling.concat(
    " ",
    text.length <= 50 ? "text-2xl lg:text-3xl" : "text-xl"
  )}
>
  {text}
</h1>
