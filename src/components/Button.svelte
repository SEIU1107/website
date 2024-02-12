<script lang="ts">
  export let text = "Enter text";
  export let href = "/";
  export let styling = "text-white bg-honey-flower-800 hover:bg-honey-flower-950 active:bg-purple-darkest";
  export let target: string | undefined = undefined;

  const classString =
    "inline-block rounded-md px-2 py-2 text-center uppercase tracking-wide focus:outline-none focus:ring focus:ring-offset-white transition duration-200".concat(
        " ".concat(styling)
    );
</script>


<a href={href} class={classString} target={target}>{text}</a>