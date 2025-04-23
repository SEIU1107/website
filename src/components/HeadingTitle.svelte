<script>
  const {
    text = "text",
    styling = "m-auto font-Trebuchet font-bold text-center text-honey-flower-800 py-5",
  } = $props();

  let size =
    text.length <= 50
      ? " text-4xl lg:text-5xl xl:text-6xl"
      : " text-3xl lg:text-4xl xl:texl-5xl";
  let classStyle = styling.concat(size);
</script>

<h1 class={classStyle}>
  {text}
</h1>

<style>
  .shadowClass {
    text-shadow: 3px 3px 1px black;
  }
</style>
