<script>
    import NavBar from "../lib/Navbar.svelte";
    import "../app.css";
</script>

<NavBar />
<div class="overflow-y-auto" style="height: calc(100vh - 4rem);">
    <div class="flex flex-col items-center text-base-content bg-base-300 overflow-hidden">
        <slot />
    </div>
</div>