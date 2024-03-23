<template>
	<iframe id="save-iframe" src="http://localhost:3000/login/save_token" title="iam"></iframe>
	<iframe id="get-iframe" src="http://localhost:3000/login/send_token" title="iam"></iframe>
</template>
<script setup>
const config = useRuntimeConfig()
let access_token = useCookie('access_token', {
	default: () => {},
	watch: true
})
let refresh_token = useCookie('refresh_token', {
	default: () => {},
	watch: true
})

const params = useRoute().query
console.log('code', params.code)
if (params.code) {
    const { data, error } = await useAsyncData(
		'access_token', 
		() => $fetch(config.public.TOKEN_ENDPOINT, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Basic ${config.public.CLIENT_SECRET}`
			},
			method: 'POST',
			body: new URLSearchParams ({
				code: params.code,
				client_id: config.public.CLIENT_ID,
				redirect_uri: config.public.REDIRECT_URI,
				grant_type: 'authorization_code',
				user_id: '123'
			})
		})
	)
	if (error.value) {
		console.log('lay token error roi', error)
	} else {
		access_token.value = data.value.access_token;
		refresh_token.value = data.value.refresh_token;

		if (process.browser) {
			const iframe = document.querySelector("#save-iframe")
			
			const token = {
				access_token: access_token.value,
				refresh_token: refresh_token.value
			}

			const token_message = JSON.parse(JSON.stringify(token))

			console.log('token_message', token_message)

			iframe.contentWindow.postMessage(token_message, '*');
		}
	}
} else if (params.access_token) {
	console.log('chay vao day roi')
	if (process.browser) {
		window.onmessage = function(e) {
			console.log('day la token nhan tu central', e)
			if (e.data.access_token) {
				access_token.value = e.data.access_token
			}
			if (e.data.refresh_token) {
				refresh_token.value = e.data.refresh_token
			}
		};
	}
}
</script>