<template>
	<section class="bg-gray-50">
		<div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
			<div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 h-2/3">
				<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <div class="flex items-center justify-center">
                        <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900">
                            <img class="w-8 h-auto mr-2" src="/logo_hust.png" alt="logo">
                            HUST
                        </a>
                    </div>
                    <div class="flex items-center justify-center">
                        <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Signed out success
                        </h1>
                    </div>
					<div class="space-y-4 md:space-y-6 pt-32">
						<div class="flex items-center justify-between">
							<div class="flex items-start">
								<button class="ml-3 text-blue-600" v-on:click="redirectToOriginal">
									Continue
                                </button>
							</div>
							<button
                                class="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                Sign in again
						    </button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>  
</template>

<script setup>
definePageMeta({
	middleware: ["logout"]
})
const params = useRoute().query

const redirectToOriginal = () => {
    navigateTo({
		path: params.redirect_uri, 
	}, {
		external: true
	})
}
</script>