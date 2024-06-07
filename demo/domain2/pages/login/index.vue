<template>
	<section class="bg-gray-50">
		<div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
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
						<NuxtLink to=""></NuxtLink>
						<button class="text-center w-full px-4 py-2 border flex gap-2 border-slate-200 rounded-lg hover:border-slate-400 hover:shadow transition duration-150"
										@click="handle_iam_sign_on">
							<img class="w-6 h-auto mr-4" src="/logo_hust.png" alt="logo">
							<span>Login with HUST-IAM's account</span>
						</button>
					</form>
				</div>
			</div>
		</div>
	</section>
</template>
  
<script setup>
import VueJwtDecode from 'vue-jwt-decode'
const config = useRuntimeConfig()
let current_host = ''

// Check if user was logged in
const access_token = useCookie('access_token', {
	default: () => {},
	watch: true
})
const refresh_token = useCookie('refresh_token', {
	default: () => {},
	watch: true
})

if (process.client) {
	current_host = window.location.origin
}


// if (access_token.value && access_token.value != null) {
// 	let decoded_token = VueJwtDecode.decode(access_token)
// 	navigateTo({
// 		path: params.redirect_uri, 
// 		query: {
// 			access_token: access_token.value,
// 			refresh_token: refresh_token.value
// 		}
// 	}, {
// 		external: true
// 	})
// }

const formData = ref({
	email: '',
	password: '',
	remember: ''
})

const handle_iam_sign_on = async () => {
	navigateTo({
		path: config.public.AUTHORIZATION_ENDPOINT, 
		query: {
			response_type: config.public.OAUTH_RESPONSE_TYPE,
			client_id: config.public.CLIENT_ID,
			redirect_uri: config.public.REDIRECT_URI,
			scope: config.public.AUTH_SCOPES
		}
	}, {
		external: true
	})
}
</script>
