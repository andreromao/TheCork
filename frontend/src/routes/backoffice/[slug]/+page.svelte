<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';
    import { checkExpiration, user } from '$lib/stores';

    if (browser && !$user) goto('/login');
    if (browser && $user.role !== "admin") goto('/');

    let weekDays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    let times = ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'];
    let schedule, reservations;
    let slug;

    onMount(async () => {
        slug = location.pathname.split("/")[2];

        const res = await fetch(`/api/schedule?restaurant=${slug}`);
        if (res.ok) {
            schedule = await res.json();
        }

        const res2 = await fetch(`/api/reservations?restaurant=${slug}`, { headers: { 'Authorization': `Bearer ${$user.accessToken}` } }).then(checkExpiration);
        if (res2.ok) {
            reservations = await res2.json();
        }
    });

    function toggle(day, time) {
        if (schedule[day].includes(time)) {
            schedule[day] = schedule[day].filter(t => t !== time);
        } else {
            schedule[day].push(time);
        }
        schedule = schedule;
        fetch(`/api/schedule?restaurant=${slug}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${$user.accessToken}`
                },
                body: JSON.stringify(schedule)
            }
        );
    }

    async function changeStatus(id, status) {
        const res = await fetch(`/api/change-status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${$user.accessToken}`
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
                    <th>Discount</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {#if reservations.length === 0}
                    <tr>
                        <td colspan="6" class="text-center">No reservations</td>
                    </tr>
                {/if}
                {#each reservations as reservation}
                    <tr>
                        <td>{reservation.name}</td>
                        <td>{reservation.date.split("T")[0]}</td>
                        <td>{new Date(reservation.date).toLocaleTimeString("pt-PT", { hour: 'numeric', minute: '2-digit' })}</td>
                        <td>{reservation.people}</td>
                        <td>{reservation.discount ? reservation.discount.discount + "%" : "-"}</td>
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
                    <th style="position: unset !important" />
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