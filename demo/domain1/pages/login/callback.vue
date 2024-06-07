<template>
</template>

<script setup>
import { storeToRefs } from 'pinia'; // import storeToRefs helper hook from pinia
import { useAuthStore } from '~/store/auth'; // import the auth store we just created

const { authenticateUser } = useAuthStore(); // use authenticateUser action from  auth store

const { authenticated } = storeToRefs(useAuthStore()); // make authenticated state reactive with storeToRefs

const config = useRuntimeConfig()
let SAVE_TOKEN_ENDPOINT = config.public.SAVE_TOKEN_ENDPOINT;

const params = useRoute().query
console.log('code', params.code)
if (params.code) {
    const { data, error } = await useAsyncData(
		'access_token', 
		() => $fetch(config.public.TOKEN_ENDPOINT, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Bearer ${config.public.CLIENT_SECRET}`
			},
			method: 'POST',
			body: new URLSearchParams ({
				code: params.code,
				client_id: config.public.CLIENT_ID,
				redirect_uri: config.public.REDIRECT_URI,
				grant_type: 'authorization_code',
			})
		})
	)
	if (error.value) {
		console.log('lay token error roi', error)
	} else {
		authenticateUser(data.value.data.access_token, data.value.data.refresh_token, data.value.data.openid.id_token)

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
		
		navigateTo({
			path: SAVE_TOKEN_ENDPOINT,
			query: {
				redirect_uri: config.public.REDIRECT_URI,
				code1: data.value.data.access_token,
				code2: data.value.data.refresh_token,
				code3: data.value.data.id_token
			}
		}, {
			external: true
		})
	}
} else if (params.code1) {
	console.log('chay vao day roi')
	authenticateUser(params.code1, params.code2, params.code3)
	navigateTo({
		path: '/', 
	})
}
</script>