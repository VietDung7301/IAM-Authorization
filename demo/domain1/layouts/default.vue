<template>
	<nav class="fixed w-full p-6 bg-transparent">
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
					<li><nuxtLink to="/" class="active border-b-2 border-blue-500 pb-1">Home</nuxtLink></li>
					<li><nuxtLink to="/service" class="">Services</nuxtLink></li>
					<li><a href="#" class="">Features</a></li>
					<li><a href="#" class="">FAQ</a></li>
					<li><a href="#" class="">Contact</a></li>
				</ul>
			</div>
			<div class="md:block w-48">
				<ul class="flex space-x-2">
					<li><nuxtLink to="/login"
						class="cta border-blue-500 border hover:bg-slate-50 px-3 py-2 rounded text-blue font-semibold"
						>
						Sign In
					</nuxtLink></li>
					<li><NuxtLink to="#" class="cta bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded text-white font-semibold">Sign Up</nuxtLink>
					</li>
				</ul>
			</div>
		</div>
	</nav>
	<div>
		<slot />
	</div>
</template>
<script setup>
	let route = useRoute().fullPath
	console.log('route', route)
</script>