<script>
    import { API_URL } from '$env/static/public'

    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 2);
    let dates = [];
    $: if (currentDate) {
        dates = [];
        for (let i = -2; i < 3; i++) {
            let date = new Date(currentDate);
            date.setDate(date.getDate() + i);
            dates.push(date);
        }
    }
    let times = ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'];
    let selectedTime, selectedDate, name, people = 2;
    $: people = Math.max(people, 1);
    
    let toast = "", error = "";
    async function book() {
        const date = new Date(Date.parse(`${selectedDate.toISOString().split("T")[0]}T${selectedTime}`));
        const res = await fetch(`${API_URL}/reserve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                people,
                date: date.toISOString(),
                restaurant: location.pathname.split("/")[2],
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

<div class="flex flex-col items-center gap-5 my-10">
    <h1 class="text-4xl font-bold">Book a table</h1>
    <input
        type="date"
        class="input"
        bind:value={currentDate}
        min={new Date().toISOString().split("T")[0]}
    />
    <table class="table w-[200px] overflow-auto">
        <thead>
            <tr>
                <th />
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
                            <label
                                class="btn btn-outline btn-sm hover:scale-105"
                                on:click={() => {
                                    selectedTime = time;
                                    selectedDate = date;
                                }}
                                for="confirmation">Book</label
                            >
                        </td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<input type="checkbox" id="confirmation" class="modal-toggle" />
<div class="modal">
    <div class="modal-box w-[400px] text-xl">
        <label for="confirmation" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
        <h2 class="mb-4 font-bold text-3xl ">Book a table</h2>
        <p class="py-3">You have selected a table for <b>{selectedDate?.toLocaleDateString("pt-PT")}</b> at <b>{selectedTime}</b>.</p>
        <p class="py-3">Your name</p>
        <input type="text" class="input text-xl bg-base-300 mb-2" bind:value={name} />
        <p class="py-3">How many people?</p>
        <div class="input-group input-group-lg">
            <button class="btn" on:click={() => {people--}}>-</button>
            <span class="text-center w-[50px] justify-center">{people}</span>
            <button class="btn" on:click={() => {people++}}>+</button>
          </div>
        <div class="modal-action">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <label for="confirmation" class="btn {name ? "btn-primary" : "btn-disabled"} btn-lg" on:click={book}>Book</label>
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
    <div class="absolute alert alert-error shadow-lg">
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{error}</span>
        </div>
    </div>
{/if}