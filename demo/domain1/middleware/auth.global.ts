import { useAuthStore } from '~/store/auth';
import { jwtDecode } from "jwt-decode";

export default defineNuxtRouteMiddleware((to) => {
    const { authenticated, user_id } = storeToRefs(useAuthStore());
    const access_token = useCookie('access_token');
    const id_token = useCookie('id_token');

    if (access_token.value) {
        authenticated.value = true; // update the state to authenticated
    }
    if (id_token.value) {
        user_id.value = (<any> jwtDecode(id_token.value)).user.id
    }
    if (access_token.value && to?.name === 'login') {
        return navigateTo('/');
    }
    if (!access_token && to?.name === 'students') {
        abortNavigation();
        return navigateTo('/login');
      }
})