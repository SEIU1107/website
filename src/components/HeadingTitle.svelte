<script>
  export let text = "text";
  export let styling =
    "m-auto font-Trebuchet font-bold text-center text-honey-flower-800 py-5";

  let size =
    text.length <= 50 ? " text-4xl lg:text-5xl" : " text-3xl lg:text-4xl";
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
