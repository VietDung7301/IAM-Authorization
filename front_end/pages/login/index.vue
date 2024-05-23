<template>
	<section class="bg-gray-50">
		<div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
			<a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900">
				<img class="w-8 h-auto mr-2" src="/logo_hust.png" alt="logo">
				HUST
			</a>
			<div
				class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
				<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
					<h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
						Sign in to your account
					</h1>
					<form class="space-y-4 md:space-y-6" @submit.prevent="submitForm">
						<div>
							<label for="email" class="block mb-2 text-sm font-medium text-gray-900">Your email</label>
							<input type="email" name="email" id="email" v-model="formData.email"
								class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
								placeholder="name@company.com" required="">
						</div>
						<div>
							<label for="password" class="block mb-2 text-sm font-medium text-gray-900">Password</label>
							<input type="password" name="password" id="password" placeholder="••••••••" v-model="formData.password"
								class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
								required="">
						</div>
						<div class="flex items-center justify-between">
							<div class="flex items-start">
								<div class="flex items-center h-5">
									<input id="remember" aria-describedby="remember" type="checkbox" v-model="formData.remember"
										class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300">
								</div>
								<div class="ml-3 text-sm">
									<label for="remember" class="text-gray-500">Remember me</label>
								</div>
							</div>
							<a href="#" class="text-sm font-medium text-primary-600 hover:underline">Forgot
								password?</a>
						</div>
						<button type="submit"
							class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
							Sign in
						</button>
						
					</form>
				</div>
			</div>
		</div>
	</section>
</template>
  
<script setup>
import { ref } from 'vue'
import VueJwtDecode from 'vue-jwt-decode'

// Check if user was logged in
const params = useRoute().query
const access_token = useCookie('access_token', {
	default: () => {},
	watch: true
})
const refresh_token = useCookie('refresh_token', {
	default: () => {},
	watch: true
})


if (access_token.value && access_token.value != null) {
	console.log('access_token', access_token.value)
	// let decoded_token = VueJwtDecode.decode(access_token)
	navigateTo({
		path: params.redirect_uri, 
		query: {
			access_token: access_token.value,
			refresh_token: refresh_token.value
		}
	}, {
		external: true
	})
}

const config = useRuntimeConfig()

const BASE_URL = `${config.public.AUTH_SERVER}/api/auth/code`


const formData = ref({
	email: '',
	password: '',
	remember: ''
})

const submitForm = async () => {
	const { data, error } = await useFetch(BASE_URL, 
	{
		onRequest({ request, options }) {
			options.method = 'POST',
			options.headers = {...options.headers, 'Content-Type': 'application/x-www-form-urlencoded'}
			options.body = new URLSearchParams({
								username: formData.value.email,
								password: formData.value.password,
								...params
							})
		},
		onResponse({ request, response, options }) {
			console.log('response ne: ', response._data)
			if (response.status == 200) {
				navigateTo({
					path: params.redirect_uri, 
					query: {
						code: response._data.data.code
					}
				}, {
					external: true
				})	
			}
		},
		onResponseError({ request, response, options }) {
			console.log('error roiiii')
		},
	})
	
}
</script>
  