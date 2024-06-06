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
							<label for="username" class="block mb-2 text-sm font-medium text-gray-900">Your username</label>
							<input name="username" id="username" v-model="formData.username"
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
					<div>
						Or sign with
					</div>
					<div class="flex justify-center">
						<GoogleSignInButton
							@success="handleGoogleLoginSuccess"
							@error="handleGoogleLoginError"
						></GoogleSignInButton>
					</div>
				</div>
			</div>
		</div>
	</section>
	<OTPModal 
		v-show="showOtp" 
		@send-otp-success="redirectToClient" 
		:user_id="userId" 
		:email="email" 
		:visitorId="visitorId"/>
</template>
  
<script setup>
import { ref } from 'vue'
import OTPModal from '~/components/OTPModal.vue';
import {
	GoogleSignInButton,
} from "vue3-google-signin";

let showOtp = ref(false)
let userId = ref('')
let email = ref('')
let auth_code = ''
let visitorId = ref('')
const { $getVisitorId } = useNuxtApp()

const config = useRuntimeConfig()
const AUTH_ENDPOINT = `${config.public.AUTH_SERVER}/api/auth/code`
const LINKED_SIGN_IN_ENDPOINT = `${config.public.AUTH_SERVER}/api/auth/login/linked_account`
const REQUEST_OTP_ENDPOINT = `${config.public.AUTH_SERVER}/api/auth/otp/send`

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


const formData = ref({
	username: '',
	password: '',
	remember: ''
})



const redirectToClient = async () => {
	await navigateTo({
		path: params.redirect_uri, 
		query: {
			code: auth_code
		}
	}, {
		external: true
	})
}

const requestSendOTP = async (userId) => {
	await useFetch(REQUEST_OTP_ENDPOINT, {
		onRequest({ request, options }) {
			options.method = 'POST',
			options.headers = {...options.headers, 'Content-Type': 'application/x-www-form-urlencoded'}
			options.body = new URLSearchParams({
								user_id: userId
							})
		},
		onResponse({ request, response, options }) {
			console.log('Request send OTP success')
		},
		onRequestError({ request, response, options }) {
			console.log('Request send OTP error')
		}
	})
}

const submitForm = async () => {
	visitorId = await $getVisitorId()
	const { data, error } = await useFetch(AUTH_ENDPOINT, 
	{
		onRequest({ request, options }) {
			options.method = 'POST',
			options.headers = {...options.headers, 'Content-Type': 'application/x-www-form-urlencoded'}
			options.body = new URLSearchParams({
								username: formData.value.username,
								password: formData.value.password,
								fingerprint: visitorId,
								...params
							})
		},
		onResponse({ request, response, options }) {
			console.log('response ne: ', response._data)
			if (response.status == 200) {
				auth_code = response._data.data.code
				console.log('response otp', response._data.data.otp)
				if (response._data.data.otp == true) {
					requestSendOTP(response._data.data.user_id)
					userId = response._data.data.user_id
					showOtp.value = true
				}
				else redirectToClient()
			}
		},
		onResponseError({ request, response, options }) {
			console.log('error roiiii')
		},
	})
}

const handleGoogleLoginSuccess = async (response) => {
	const { credential } = response;
	visitorId = await $getVisitorId()
	const { data, error } = await useFetch(LINKED_SIGN_IN_ENDPOINT, 
	{
		onRequest({ request, options }) {
			options.method = 'POST',
			options.headers = {...options.headers, 'Content-Type': 'application/x-www-form-urlencoded'}
			options.body = new URLSearchParams({
								credential: credential,
								fingerprint: visitorId,
								...params
							})
		},
		onResponse({ request, response, options }) {
			console.log('response ne: ', response._data)
			if (response.status == 200) {
				auth_code = response._data.data.code
				console.log('response otp', response._data.data.otp)
				if (response._data.data.otp == true) {
					requestSendOTP(response._data.data.user_id)
					userId = response._data.data.user_id
					showOtp.value = true
				}
				else redirectToClient()
			}
		},
		onResponseError({ request, response, options }) {
			console.log('error roiiii')
		},
	})
};

// handle an error event
const handleGoogleLoginError = () => {
	console.error("Login failed");
};
</script>