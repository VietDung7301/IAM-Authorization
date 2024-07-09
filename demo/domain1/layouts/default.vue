<template>
	<nav class="fixed w-full py-2 px-10 bg-white z-50">
		<div class="flex items-center justify-between">
			<!-- Header logo -->
			<div>
				<nuxtLink to="/" class="flex items-center text-2xl font-semibold text-gray-900">
					<img class="w-8 h-auto mr-4" src="/logo_hust.png" alt="logo">
					HUST
				</nuxtLink>
			</div>
			<!-- Navbar -->
			<div class="md:block">
				<ul class="flex space-x-8 font-sans">
					<template v-for="item in navItems">
						<li v-if="item.link == router.currentRoute.value.fullPath">
							<nuxtLink :to="item.link" class="active border-b-2 border-blue-500 pb-1">{{ item.title }}</nuxtlink>
						</li>
						<li v-else><nuxtLink :to="item.link">{{ item.title }}</nuxtlink></li>
  					</template>

					<!-- <li><nuxtLink to="/" class="active border-b-2 border-blue-500 pb-1">Home</nuxtLink></li>
					<li><nuxtLink to="/students" class="">Students</nuxtLink></li>
					<li><a href="#" class="">Features</a></li>
					<li><a href="#" class="">FAQ</a></li>
					<li><a href="#" class="">Contact</a></li> -->
				</ul>
			</div>
			<div class="md:block w-48">
				<ul class="flex space-x-2">
					<li v-if="!authenticated">
						<nuxtLink 
							to="/login"
							class="cta border-blue-500 border hover:bg-slate-50 px-3 py-2 rounded text-blue font-semibold"
						>
							Sign In
					</nuxtLink></li>
					<li v-if="!authenticated"><NuxtLink to="#" class="cta bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded text-white font-semibold">Sign Up</nuxtLink>
					</li>
					<li v-if="authenticated">
						<button 
							@click="logout"
							class="cta border-blue-500 border hover:bg-slate-50 px-3 py-2 rounded text-blue font-semibold"
						> Sign out</button>
					</li>
				</ul>
			</div>
		</div>
	</nav>
	<div class="pt-20">
		<slot />
	</div>
</template>


<script setup>
	import { storeToRefs } from 'pinia'; // import storeToRefs helper hook from pinia
	import { useAuthStore } from '~/store/auth'; // import the auth store we just created
	const config = useRuntimeConfig()
	const url = useRequestURL()

	const router = useRouter();

	const { authenticated } = storeToRefs(useAuthStore()); // make authenticated state reactive with storeToRefs

	const navItems = ref([
		{ link: '/', title: 'Home' },
		{ link: '/students', title: 'Manage students' },
		{ link: '/profile', title: 'Profile' },
		{ link: '#', title: 'FAQ' },
		{ link: '#', title: 'Contact' }
	])

	console.log(router.currentRoute.value.path)

	const logout = () => {
		navigateTo({
			path: config.public.LOGOUT_ENDPOINT, 
			query: {
				redirect_uri: url.origin
			}
		}, {
			external: true
		})
	}
</script>