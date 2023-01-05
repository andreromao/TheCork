<script>
    import { API_URL } from '$env/static/public'
    import { onMount } from 'svelte';
    import { user } from '$lib/stores';

    if (browser && !$user) goto('/login');
    
    const weekDays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    
    let slug;
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 2);
    let dates = [], times = [], schedule;
    $: if (currentDate) {
        dates = [];
        for (let i = -2; i < 3; i++) {
            let date = new Date(currentDate);
            date.setDate(date.getDate() + i);
            dates.push(date);
        }
    }
    let selectedTime, selectedDate, name, people = 2;
    $: people = Math.max(people, 1);

    onMount(async () => {
        slug = location.pathname.split("/")[2];
        const res = await fetch(`${API_URL}/schedule?restaurant=${slug}`);
        if (res.ok) {
            schedule = await res.json();
            for (let day of weekDays) {
                if (schedule[day]) {
                    for (let time of schedule[day]) {
                        if (!times.includes(time)) times.push(time);
                    }
                    times.sort();
                    times = times;
                }
            }
        }
    });
    
    let toast = "", error = "";
    async function book() {
        const date = new Date(Date.parse(`${selectedDate.toISOString().split("T")[0]}T${selectedTime}`));
        const res = await fetch(`${API_URL}/reserve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${$user.accessToken}`
            },
            body: JSON.stringify({
                name,
                username: $user.username,
                people,
                date: date.toISOString(),
                restaurant: slug,
            })
        });
        if (res.ok) {
            toast = await res.text();
            setTimeout(() => { toast = ""; }, 2000);
        } else {
            error = await res.text();
            setTimeout(() => { error = ""; }, 5000);
        }
    }
</script>

{#if $user.role === "admin"}
    <a class="btn btn-outline fixed top-2 right-16 z-20" on:click={() => {location.href = `/backoffice/${slug}`}}>Backoffice</a>
{/if}
<div class="flex flex-col items-center gap-5 my-10 overflow-hidden">
    <h1 class="text-4xl font-bold">Book a table</h1>
    <input
        type="date"
        class="input"
        bind:value={currentDate}
        min={new Date().toISOString().split("T")[0]}
    />
    <div class="max-w-[100vw] px-4 overflow-scroll no-scrollbar">
        <table class="table">
            <thead>
                <tr>
                    <th style="position: unset !important" />
                    {#each dates as date}
                        <th class="text-lg text-center">{date.toLocaleDateString("pt-PT", { day: "numeric", month: "short" })}</th>
                    {/each}
                </tr>
            </thead>
            <tbody>
                {#each times as time}
                    <tr>
                        <td>{time}</td>
                        {#each dates as date}
                            <td>
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                {#if schedule[weekDays[date.getDay()]]?.includes(time) && Date.parse(`${date.toISOString().split("T")[0]}T${time}`) > Date.now()}
                                <label
                                    class="btn btn-outline btn-sm hover:scale-105"
                                    on:click={() => {
                                        selectedTime = time;
                                        selectedDate = date;
                                    }}
                                    for="confirmation">Book</label
                                >
                                {/if}
                            </td>
                        {/each}
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

<input type="checkbox" id="confirmation" class="modal-toggle" />
<div class="modal">
    <div class="modal-box m-4 w-[350px] text-xl">
        <label for="confirmation" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
        <h2 class="mb-4 font-bold text-3xl ">Book a table</h2>
        <p class="py-3">You have selected a table for <b>{selectedDate?.toLocaleDateString("pt-PT")}</b> at <b>{selectedTime}</b>.</p>
        <label class="label"><span class="label-text">Your name</span></label>
        <input type="text" placeholder="Name" class="input text-xl bg-base-300 mb-2" bind:value={name} />
        <label class="label"><span class="label-text">Number of people</span></label>
        <div class="input-group input-group-lg">
            <button class="btn" on:click={() => {people--}}>-</button>
            <span class="text-center w-[50px] justify-center">{people}</span>
            <button class="btn" on:click={() => {people++}}>+</button>
          </div>
        <div class="modal-action">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <label for="confirmation" class="btn {name ? "btn-primary" : "btn-disabled"} btn-block" on:click={book}>Book</label>
        </div>
    </div>
</div>

{#if toast}
    <div class="toast">
        <div class="alert alert-info shadow-lg">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current flex-shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>{toast}</span>
            </div>
        </div>
    </div>
{/if}

{#if error}
    <div class="fixed alert alert-error shadow-lg">
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{error}</span>
        </div>
    </div>
{/if}