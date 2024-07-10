import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode'



export const useAuthStore = defineStore('auth', {
    state: () => {
      return {
        authenticated: false,
        user_id: 'name',
        name: null
      }
    },
    actions: {
      authenticateUser(access_token, refresh_token, id_token) {
          const stored_access_token = useCookie('access_token');
          const stored_refresh_token = useCookie('refresh_token');
          const stored_id_token = useCookie('id_token')
          stored_access_token.value = access_token;
          stored_refresh_token.value = refresh_token
          stored_id_token.value = id_token
          this.authenticated = true; // set authenticated  state value to true
        },
      async refreshToken(token_endpoint, scope, client_id, client_secret) {
        const access_token = useCookie('access_token');
        const refresh_token = useCookie('refresh_token');
        const id_token = useCookie('id_token');

        if (!refresh_token.value) {
          return null
        } 

        const {data, error} = await useFetch(token_endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${client_secret}`
          },
          body: new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: client_id,
            scope: scope,
            user_id: jwtDecode(id_token.value?id_token.value:'').user.id,
            refresh_token: refresh_token.value
          })
        })

        if (data.value) {
          access_token.value = data.value.data.access_token
          refresh_token.value = data.value.data.refresh_token
          id_token.value = data.value.data.openid.id_token
          this.authenticated = true
          
          return access_token.value
        } else {
          console.log('refresh_token false', error.value)
          this.authenticated = false
          access_token.value = null
          refresh_token.value = null
          id_token.value = null
          
          return null
        }
      },
      async logUserOut(logout_endpoint, client_id) {
        const access_token = useCookie('access_token');
        const refresh_token = useCookie('refresh_token');
        const id_token = useCookie('id_token');

        this.authenticated = false; // set authenticated  state value to false
        access_token.value = null;
        refresh_token.value = null;
        id_token.value = null;
      },
    },
  });