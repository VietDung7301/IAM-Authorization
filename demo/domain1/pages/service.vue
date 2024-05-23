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
                Authorization: `Bearer ${access_token}`
            }
			options.body = new URLSearchParams({
								method: 'GET',
                                url: 'http://localhost:8005/students',
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