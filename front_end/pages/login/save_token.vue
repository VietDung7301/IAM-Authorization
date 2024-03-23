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
	window.onmessage = function(e) {
		if (e.data.access_token) {
			access_token.value = e.data.access_token
		}
		if (e.data.refresh_token) {
			refresh_token.value = e.data.refresh_token
		}
	};
}
</script>
  