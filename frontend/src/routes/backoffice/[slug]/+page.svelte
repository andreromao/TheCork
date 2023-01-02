<script>
    import { API_URL } from '$env/static/public'
    import { onMount } from 'svelte';

    let weekDays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    let times = ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'];
    let schedule, reservations;
    let slug;

    onMount(async () => {
        slug = location.pathname.split("/")[2];

        const res = await fetch(`${API_URL}/schedule?restaurant=${slug}`);
        if (res.ok) {
            schedule = await res.json();
        }

        const res2 = await fetch(`${API_URL}/reservations?restaurant=${slug}`);
        if (res2.ok) {
            reservations = await res2.json();
            console.log(reservations);
        }
    });

    function toggle(day, time) {
        if (schedule[day].includes(time)) {
            schedule[day] = schedule[day].filter(t => t !== time);
        } else {
            schedule[day].push(time);
        }
        schedule = schedule;
        fetch(`${API_URL}/schedule?restaurant=${slug}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(schedule)
            }
        );
    }

    async function changeStatus(id, status) {
        console.log(id);
        const res = await fetch(`${API_URL}/change-status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, status })
        });
        if (res.ok) {
            reservations = reservations.map(r => r._id === id ? { ...r, status: status } : r);
        }
    }
</script>

{#if reservations}
    <div class="flex flex-col items-center gap-5 my-10">
        <h1 class="text-4xl font-bold">Reservations</h1>
        <table class="table table-zebra w-[200px] overflow-auto">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>People</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {#if reservations.length === 0}
                    <tr>
                        <td colspan="5" class="text-center">No reservations</td>
                    </tr>
                {/if}
                {#each reservations as reservation}
                    <tr>
                        <td>{reservation.name}</td>
                        <td>{reservation.date.split("T")[0]}</td>
                        <td>{new Date(reservation.date).toLocaleTimeString("pt-PT", { hour: 'numeric', minute: '2-digit' })}</td>
                        <td>{reservation.people}</td>
                        <td>
                            {#if reservation.status === "pending"}
                                <button class="btn btn-sm btn-error" on:click={() => changeStatus(reservation._id, "declined")}>Decline</button>
                                <button class="btn btn-sm btn-success" on:click={() => changeStatus(reservation._id, "accepted")}>Accept</button>
                            {:else if reservation.status === "accepted"}
                                <span class="badge badge-success">Accepted</span>
                            {:else}
                                <span class="badge badge-error">Declined</span>
                            {/if}
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
{/if}
{#if schedule}
    <div class="flex flex-col items-center gap-5 my-10">
        <h1 class="text-4xl font-bold">Schedule</h1>
        <table class="table w-[200px] overflow-auto">
            <thead>
                <tr>
                    <th />
                    {#each weekDays as day}
                        <th class="text-lg text-center">{day.slice(0, 3)}</th>
                    {/each}
                </tr>
            </thead>
            <tbody>
                {#each times as time}
                    <tr>
                        <td class="border-none">{time}</td>
                        {#each weekDays as day}
                            <td class="p-0 border-none">
                                <button
                                    class="w-20 h-16 font-bold {schedule[day].includes(time) ? "bg-success text-base-300" : "bg-transparent hover:bg-base-200"} transition-colors"
                                    on:click={() => toggle(day, time)}>
                                    {schedule[day].includes(time) ? "✓" : "✕"}
                                </button>
                            </td>
                        {/each}
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
{/if}