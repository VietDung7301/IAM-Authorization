export default defineNuxtRouteMiddleware(async (to) => {
    const config = useRuntimeConfig()

    const access_token = useCookie('access_token');
    const refresh_token = useCookie('refresh_token');
    const id_token = useCookie('id_token');

    const { data, error, pending } = await useFetch(`${config.public.AUTH_SERVER}/api/auth/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams ({
            Authorization: `Bearer ${access_token.value}`
        })
    })

    if (data.value) {
        access_token.value = null;
        refresh_token.value = null;
        id_token.value = null;
    } else {
        console.log(error)
    }
})