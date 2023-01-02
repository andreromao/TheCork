<script>
    import { goto } from '$app/navigation';
    import { AUTH_URL } from '$env/static/public'

    let username = "", password = "", error = "";

    async function login() {
        const res = await fetch(`${AUTH_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });

        if (res.ok) {
            goto("/");
        } else {
            error = await res.text();
        }
    };
</script>

{#if error}
    <div class="fixed alert alert-error shadow-lg">
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{error}</span>
        </div>
    </div>
{/if}
<div class="mt-20 card flex-shrink-0 w-[90%] max-w-sm shadow-2xl bg-base-100">
    <form class="card-body" on:submit={login}>
        <h1 class="text-2xl font-bold">Login</h1>
        <div class="form-control">
            <label class="label">
                <span class="label-text">Username</span>
            </label>
            <input
                type="text"
                placeholder="username"
                bind:value={username}
                class="input input-bordered"
            />
        </div>
        <div class="form-control">
            <label class="label">
                <span class="label-text">Password</span>
            </label>
            <input
                type="password"
                placeholder="password"
                bind:value={password}
                class="input input-bordered"
            />
            <label class="label">
                <a href="/signup" class="label-text-alt link link-hover"
                    >Don't have an account yet?</a
                >
            </label>
        </div>
        <div class="form-control mt-6">
            <button type="submit" class="btn btn-primary {username && password ? "" : "btn-disabled"}">Login</button>
        </div>
    </form>
</div>
