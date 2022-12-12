<script>
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';

    let coords;
    let restaurants = [
        {
            name: 'Restaurant 1',
            address: 'Address 1',
            image: 'https://i.pinimg.com/originals/0e/b9/8b/0eb98b8677f20999ec1bc6f9afe88bdc.jpg',
            id: '0',
            lat: 51.5074,
            long: 0.1278,
        },
        {
            name: 'Restaurant 2',
            address: 'Address 2',
            image: 'https://bacibacirestaurant.files.wordpress.com/2020/02/chairs-cutlery-fork-9315.jpg',
            id: '1',
            lat: 51.9108,
            long: 4.4213,
        },
        {
            name: 'Restaurant 3',
            address: 'Address 3',
            image: 'https://cdn.vox-cdn.com/thumbor/5d_RtADj8ncnVqh-afV3mU-XQv0=/0x0:1600x1067/1200x900/filters:focal(672x406:928x662)/cdn.vox-cdn.com/uploads/chorus_image/image/57698831/51951042270_78ea1e8590_h.7.jpg',
            id: '2',
            lat: 51.5074,
            long: 0.1278,
        },
    ];
    
    onMount(async () => {
        if (browser) {
            navigator.geolocation.getCurrentPosition((position) => {
                coords = position.coords;
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