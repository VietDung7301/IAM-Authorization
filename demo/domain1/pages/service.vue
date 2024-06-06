<template>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const access_token = useCookie('access_token', {
	default: () => {},
	watch: true
})

const { data, error } = await useFetch(config.public.RESOURCE_ENDPOINT, 
	{
		onRequest({ request, options }) {
			options.method = 'POST',
			options.headers = {
                ...options.headers,
                Authorization: `Bearer ${access_token.value}`
            }
			options.body = new URLSearchParams({
								method: 'GET',
                                url: <string> config.public.EX_RESOURCE_1,
                                content_type: 'application/json',
							})
		},
		onResponseError({ request, response, options }) {
			console.log('error roiiii: ', response)
		},
		onResponse({ request, response, options }) {
			console.log('Resource response: ', response._data.data)
		},
	})
</script>