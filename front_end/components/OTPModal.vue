<template>
	<div class="p-10 bg-stone-500/30 fixed inset-0 text-center">
		<v-card class="mt-40 py-10 px-6 text-center mx-auto ma-4" elevation="12" max-width="400" width="100%">
			<h3 class="text-h6 mb-4">Verify Your Account</h3>

			<div class="text-body-2">
				We sent a verification code to {{ email }} <br>

				Please check your email and paste the code below.
			</div>

			<v-sheet color="surface">
				<v-otp-input v-model="otp" variant="solo" type="text" length="6"></v-otp-input>
			</v-sheet>

			<v-btn class="my-4" color="purple" height="40" text="Verify" variant="flat" width="70%" @click="send_otp"></v-btn>

			<div class="text-caption">
				Didn't receive the code? <a href="#" @click.prevent="otp = ''">Resend</a>
			</div>
		</v-card>
	</div>
</template>


<script setup>
	const props = defineProps(['user_id', 'email'])
	const emit = defineEmits(['send-otp-success'])

	const config = useRuntimeConfig()
	const OTP_ENDPOINT = `${config.public.AUTH_SERVER}/api/auth/otp/authenticate`
	const otp = ref('')

	const send_otp = async() => {
		const { data, error } = await useFetch(OTP_ENDPOINT, 
		{
			onRequest({ request, options }) {
				options.method = 'POST',
				options.headers = {...options.headers, 'Content-Type': 'application/x-www-form-urlencoded'}
				options.body = new URLSearchParams({
									otp: otp.value,
									user_id: props.user_id
								})
			},
			onResponse({ request, response, options }) {
				console.log('otp_response: ', response._data)
				emit('send-otp-success')
			},
			onResponseError({ request, response, options }) {
				console.log('send_otp error')
			},
		})
	}
</script>