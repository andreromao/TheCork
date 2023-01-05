<script>
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { API_URL } from '$env/static/public'
    import { user } from '$lib/stores';

    let reservations = [], restaurants = [];
    
    onMount(async () => {
        if ($user) {
            reservations = await fetch(`${API_URL}/user-reservations?username=${$user.username}`, { headers: { 'Authorization': `Bearer ${$user.accessToken}` } }).then((res) => res.json());
        }
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

<div class="flex-col">
    {#if reservations.length > 0}
        <h1 class="col-span-full m-5 mt-10 text-4xl font-bold">Your Reservations</h1>
        <div class="flex flex-col gap-2 p-4">
            {#each reservations as reservation}
                <div class="px-5 py-3 rounded-xl bg-base-100 relative">
                    <h1 class="text-xl font-bold">{reservation.restaurant}</h1>
                    <p>Table for <b>{reservation.people}</b> on <b>{new Date(reservation.date).toLocaleDateString("en-US", { month: 'long', day: 'numeric' })}</b> at <b>{new Date(reservation.date).toLocaleTimeString("pt-PT", { hour: 'numeric', minute: '2-digit' })}</b></p>
                    <p>Reserved for <b>{reservation.name}</b></p>
                    {#if reservation.status === 'pending'}
                        <span class="absolute top-4 right-4 badge badge-warning">Pending</span>
                    {:else if reservation.status === 'accepted'}
                        <span class="absolute top-4 right-4 badge badge-success">Accepted</span>
                    {:else if reservation.status === 'rejected'}
                        <span class="absolute top-4 right-4 badge badge-error">Rejected</span>
                    {/if}
                </div>
            {/each}
        </div>
    {/if}
    <h1 class="col-span-full m-5 text-4xl font-bold">Restaurants</h1>
    <div class="grid gap-3 p-4 w-full xl:w-[1200px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {#each restaurants as restaurant}
            <a href="/restaurant/{restaurant.slug}">
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
</div>