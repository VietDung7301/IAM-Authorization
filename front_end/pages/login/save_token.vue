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
const id_token = useCookie('id_token', {
	default: () => {},
	watch: true
})
const params = useRoute().query

if (params.code1) {
	console.log('saving token')
	access_token.value = params.code1
	refresh_token.value = params.code2
	id_token.value = params.code3
}

if (params.redirect_uri) {
	navigateTo({
		path: params.redirect_uri
	}, {
		external: true
	})
}

</script>
  