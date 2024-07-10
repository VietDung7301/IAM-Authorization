<template>
    <div class="lg:w-[80%] md:w-[90%] xs:w-[96%] mx-auto flex gap-4">
        <div
            class="lg:w-[88%] md:w-[80%] sm:w-[88%] xs:w-full mx-auto shadow-2xl p-4 rounded-xl h-fit self-center">
            <!--  -->
            <div class="">
                <h1
                    class="lg:text-3xl md:text-2xl sm:text-xl xs:text-xl font-bold mb-2">
                    Your profile
                </h1>
                <h2 class="text-grey text-sm mb-4"></h2>
                <form>
                    <!-- Cover Image -->
                    <div
                        class="w-full rounded-sm bg-cover bg-center bg-no-repeat items-center"
                        :style="{ 'background-image': 'url(' + userInformation.cover_picture + ')' }">
                        <!-- Profile Image -->
                        <div
                            class="mx-auto flex justify-center w-[141px] h-[141px] bg-blue-300/20 rounded-full bg-cover bg-center bg-no-repeat"
                            :style="{ 'background-image': 'url(' + userInformation.profile_picture + ')' }">

                            <div class="bg-white/90 rounded-full w-6 h-6 text-center ml-28 mt-4">

                                <input type="file" name="profile" id="upload_profile" hidden required>

                                <label for="upload_profile">
                                        <svg data-slot="icon" class="w-6 h-5 text-blue-700" fill="none"
                                            stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z">
                                            </path>
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z">
                                            </path>
                                        </svg>
                                    </label>
                            </div>
                        </div>
                        <div class="flex justify-end">
                            <!--  -->
                            <input type="file" name="profile" id="upload_cover" hidden required>

                            <div
                                class="bg-white flex items-center gap-1 rounded-tl-md px-2 text-center font-semibold">
                                <label for="upload_cover" class="inline-flex items-center gap-1 cursor-pointer">Cover
                                    
                                <svg data-slot="icon" class="w-6 h-5 text-blue-700" fill="none" stroke-width="1.5"
                                    stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z">
                                    </path>
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z">
                                    </path>
                                </svg>
                                </label>
                            </div>

                        </div>
                    </div>
                    <h2 class="text-center mt-1 font-semibold text-2xl">{{ userInformation.name }}
                    </h2>
                    <div class="flex lg:flex-row md:flex-col sm:flex-col xs:flex-col gap-2 justify-center w-full">
                        <div class="w-full  mb-4 mt-6">
                            <label for="" class="mb-2">Full name</label>
                            <input type="text"
                                    class="mt-2 p-4 w-full border-2 rounded-lg"
                                    :value="userInformation.name"
                                    disabled="true">
                        </div>
                        <div class="w-full  mb-4 lg:mt-6">
                            <label for="" class="">Date of birth</label>
                            <input type="text"
                                    class="mt-2 p-4 w-full border-2 rounded-lg"
                                    :value="userInformation.date_of_birth"
                                    disabled="true">
                        </div>
                    </div>

                    <div class="flex lg:flex-row md:flex-col sm:flex-col xs:flex-col gap-2 justify-center w-full">
                        <div class="w-full  mb-4 mt-6">
                            <label for="" class="mb-2">Email</label>
                            <input type="text"
                                    class="mt-2 p-4 w-full border-2 rounded-lg"
                                    :value="userInformation.email"
                                    disabled="true">
                        </div>
                        <div class="w-full  mb-4 lg:mt-6">
                            <label for="" class="">Phone number</label>
                            <input type="text"
                                    class="mt-2 p-4 w-full border-2 rounded-lg"
                                    :value="userInformation.phone_number"
                                    disabled="true">
                        </div>
                    </div>
                    <div class="flex lg:flex-row md:flex-col sm:flex-col xs:flex-col gap-2 justify-center w-full">
                        <div class="w-full  mb-4 mt-6">
                            <label for="" class="mb-2">Sex</label>
                            <input type="text"
                                    class="mt-2 p-4 w-full border-2 rounded-lg"
                                    :value="userInformation.sex"
                                    disabled="true">
                        </div>
                        <div class="w-full  mb-4 lg:mt-6">
                            <label for="" class="">Address</label>
                            <input type="text"
                                    class="mt-2 p-4 w-full border-2 rounded-lg"
                                    :value="userInformation.address"
                                    disabled="true">
                        </div>
                    </div>
                    <div class="w-full rounded-lg bg-blue-500 mt-4 text-white text-lg font-semibold">
                        <button type="submit" class="w-full p-4">Back to home</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="js">
import { useAuthStore } from '~/store/auth'
const { refreshToken, logUserOut } = useAuthStore()
const { user_id } = storeToRefs(useAuthStore());
const config = useRuntimeConfig()
const access_token = useCookie('access_token', {
	default: () => {},
	watch: true
})

let userInformation = ref({})

const { data, error } = await useFetch(config.public.RESOURCE_ENDPOINT, 
	{
		onRequest({ request, options }) {
			options.method = 'POST',
			options.headers = {
                ...options.headers,
                Authorization: `Bearer ${access_token.value}`
            }
			options.body = new URLSearchParams({
								method: 'GET',
                                url: `${config.public.EX_RESOURCE_2}?id=${user_id.value}`,
                                content_type: 'application/json',
							})
		},
		async onResponseError({ request, response, options }) {
            console.log('message', response._data.message)
			if (response._data.message === 'token expired!') {
                let newToken = await refreshToken(
                    config.public.TOKEN_ENDPOINT, 
                    config.public.AUTH_SCOPES, 
                    config.public.CLIENT_ID,
                    config.public.CLIENT_SECRET
                )
                if (!newToken) {
                    logUserOut()
                    navigateTo('/login')
                } else {
                    const { data } = await useFetch(config.public.RESOURCE_ENDPOINT,{
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${newToken}`
                        },
                        body: new URLSearchParams({
								method: 'GET',
                                url: `${config.public.EX_RESOURCE_2}?id=${user_id.value}`,
                                content_type: 'application/json',
							})
                    })
                    if (data.value) {
                        console.log('get data', data.value.data)
                        userInformation = data.value.data
                    }
                }
            }
		},
		onResponse({ request, response, options }) {
            if (response.status == 200) {
                console.log('get data', response._data.data)
                userInformation = response._data.data
            }
		},
	})
</script>