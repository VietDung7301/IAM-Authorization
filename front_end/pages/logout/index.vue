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
                            You are attempting to log out
                        </h1>
                    </div>
					<div class="flex items-center justify-center">
						Are you sure?
					</div>
					<div class="space-y-4 md:space-y-6 pt-32">
						<div class="flex items-center justify-between">
							<div class="flex items-start">
								<button class="ml-3 text-blue-600" @click="logout">
									Sign out
                                </button>
							</div>
							<button
                                class="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
								@click="logoutAll">
                                Sign out on all devices
						    </button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>  
</template>

<script setup>
const params = useRoute().query
const config = useRuntimeConfig()

const access_token = useCookie('access_token');
const refresh_token = useCookie('refresh_token');
const id_token = useCookie('id_token');

const redirectToOriginal = () => {
    navigateTo({
		path: params.redirect_uri, 
	}, {
		external: true
	})
}

const logout = async () => {
    const { data, error } = await useFetch(`${config.public.AUTH_SERVER}/api/auth/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams ({
            Authorization: `Bearer ${access_token.value}`
        })
    })

    if (data.value) {
        access_token.value = null;
        refresh_token.value = null;
        id_token.value = null;

        navigateTo({
            path: '/logout/success', 
            query: {
                'redirect_uri': params.redirect_uri
            }
        })
    } else {
        console.log(error)
    }
}

const logoutAll = async () => {
    const { data, error } = await useFetch(`${config.public.AUTH_SERVER}/api/auth/logout_all`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams ({
            Authorization: `Bearer ${access_token.value}`
        })
    })

    if (data.value) {
        access_token.value = null;
        refresh_token.value = null;
        id_token.value = null;

        navigateTo({
            path: '/logout/success', 
            query: {
                'redirect_uri': params.redirect_uri
            }
        })
    } else {
        console.log(error)
    }
}
</script>