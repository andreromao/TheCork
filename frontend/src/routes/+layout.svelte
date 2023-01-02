<script>
    import NavBar from "../lib/Navbar.svelte";
    import "../app.css";
</script>

<NavBar />
<div class="flex flex-col items-center text-base-content bg-base-300 overflow-hidden">
    <slot />
</div>