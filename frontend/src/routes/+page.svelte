<script>
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { API_URL } from '$env/static/public'

    let restaurants = [];
    
    onMount(async () => {
        restaurants = await fetch(`${API_URL}/restaurants`).then((res) => res.json());
        if (browser) {
            navigator.geolocation.getCurrentPosition((position) => {
                const coords = position.coords;
                // sort restaurants by distance
                restaurants.sort((a, b) => {
                    const aDistance = Math.sqrt(Math.pow(a.lat - coords.latitude, 2) + Math.pow(a.long - coords.longitude, 2));
                    const bDistance = Math.sqrt(Math.pow(b.lat - coords.latitude, 2) + Math.pow(b.long - coords.longitude, 2));
                    return aDistance - bDistance;
                });
                restaurants = restaurants;
            });
        }
    });
</script>

<div class="grid gap-3 mt-10 m-5 w-[1000px] xl:w-[1200px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    <h1 class="col-span-full m-5 font-serif text-4xl font-thin">TheCork</h1>
    {#each restaurants as restaurant}
        <a href="/restaurant/{restaurant.id}">
            <div class="card bg-base-100 h-full">
                <img src="{restaurant.image}" class="rounded-t-lg w-full h-[150px] object-cover" />
                <div class="card-body">
                    <h1 class="card-title">{restaurant.name}</h1>
                    <p>{restaurant.address}</p>
                </div>
            </div>
        </a>
    {/each}
</div>