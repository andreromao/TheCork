import { writable } from 'svelte/store'
import { browser } from '$app/environment'
import { AUTH_URL } from '$env/static/public'
import { goto } from '$app/navigation';

let persistedUser = browser && localStorage.getItem('user')
export let user = writable(persistedUser ? JSON.parse(persistedUser) : '')
let userValue;
user.subscribe(u => userValue = u);

if (browser) {
    user.subscribe(u => localStorage.user = JSON.stringify(u))
    if (persistedUser) refresh();
    setInterval(refresh, 1000 * 60 * 2);
}

async function refresh() {
    if (!userValue) return;
    const res = await fetch(`${AUTH_URL}/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            token: userValue.refreshToken,
            username: userValue.username,
        }),
    });
    
    if (res.ok) {
        user.set({ ...userValue, accessToken: await res.text() });
    } else {
        goto('/login');
    }
};

export async function checkExpiration(res: Response) {
    if (res.status === 401 && await res.text() === 'Token expired') {
        await refresh();
        console.log('refreshed');
        location.reload();
    }
    return res;
}