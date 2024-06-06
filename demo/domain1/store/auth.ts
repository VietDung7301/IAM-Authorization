import { defineStore } from 'pinia';



export const useAuthStore = defineStore('auth', {
    state: () => {
      return {
        authenticated: false,
        user_id: 'name',
        name: null
      }
    },
    actions: {
      authenticateUser(access_token: string, refresh_token: string, id_token: string) {
          const stored_access_token = useCookie('access_token');
          const stored_refresh_token = useCookie('refresh_token');
          const stored_id_token = useCookie('id_token')
          stored_access_token.value = access_token;
          stored_refresh_token.value = refresh_token
          stored_id_token.value = id_token
          this.authenticated = true; // set authenticated  state value to true
        },
      async logUserOut(logout_endpoint: string, client_id: string) {
        const access_token = useCookie('access_token');
        const refresh_token = useCookie('refresh_token');
        const id_token = useCookie('id_token');

        const { data, pending }: any = await useFetch(logout_endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${access_token.value}`
          },
          body: new URLSearchParams ({
            user_id: this.user_id,
            client_id: client_id
          })
        })
        if (data.value) {
          this.authenticated = false; // set authenticated  state value to false
          access_token.value = null;
          refresh_token.value = null;
          id_token.value = null;
        }
      },
    },
  });