<template>
<div class="flex justify-center mt-20 relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-9/12 text-sm text-left rtl:text-right text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
                <th scope="col" class="px-6 py-3">
                    Student name
                </th>
                <th scope="col" class="px-6 py-3">
                    Gender
                </th>
                <th scope="col" class="px-6 py-3">
                    Maths
                </th>
                <th scope="col" class="px-6 py-3">
                    Physics
                </th>
                <th scope="col" class="px-6 py-3">
                    English
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="student in studentList" class="bg-white border-b hover:bg-gray-50">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {{ student.name }}
                </th>
                <td class="px-6 py-4">
                    {{ student.gender }}
                </td>
                <td class="px-6 py-4">
                    {{ student.maths }}
                </td>
                <td class="px-6 py-4">
                    {{ student.physics }}
                </td>
                <td class="px-6 py-4">
                    {{ student.english }}
                </td>
            </tr>
        </tbody>
    </table>
</div>
</template>

<script setup lang="js">
const config = useRuntimeConfig()
const access_token = useCookie('access_token', {
	default: () => {},
	watch: true
})

let studentList = ref([{}])

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
                                url: config.public.EX_RESOURCE_1,
                                content_type: 'application/json',
							})
		},
		onResponseError({ request, response, options }) {
			console.log('error roiiii: ', response)
		},
		onResponse({ request, response, options }) {
			console.log('Resource response: ', response._data.data)
            studentList = response._data.Data.data.student_list
		},
	})
</script>