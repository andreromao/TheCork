<script>
    import NavBar from "../lib/Navbar.svelte";
    import "../app.css";
</script>

<NavBar />
<div class="flex justify-center text-base-content bg-base-300">
    <slot />
</div>