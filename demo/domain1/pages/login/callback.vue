<template>
	<iframe id="save-iframe" :src="SAVE_TOKEN_ENDPOINT" title="iam"></iframe>
	<iframe id="get-iframe" :src="GET_TOKEN_ENDPOINT" title="iam"></iframe>
</template>

<script setup>
import { storeToRefs } from 'pinia'; // import storeToRefs helper hook from pinia
import { useAuthStore } from '~/store/auth'; // import the auth store we just created

const { authenticateUser } = useAuthStore(); // use authenticateUser action from  auth store

const { authenticated } = storeToRefs(useAuthStore()); // make authenticated state reactive with storeToRefs

const config = useRuntimeConfig()
let SAVE_TOKEN_ENDPOINT = config.public.SAVE_TOKEN_ENDPOINT;
let GET_TOKEN_ENDPOINT = config.public.GET_TOKEN_ENDPOINT;

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
			path: '/', 
		})
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