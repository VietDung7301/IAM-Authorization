<template>
	
</template>
  
<script setup>

const access_token = useCookie('access_token', {
	default: () => {},
	watch: true
})
const refresh_token = useCookie('refresh_token', {
	default: () => {},
	watch: true
})

if (process.browser) {
	const token = {
		access_token: access_token.value,
		refresh_token: refresh_token.value
	}
	const token_message = JSON.parse(JSON.stringify(token))

	window.top.postMessage(token_message, '*')
}
</script>
  