<template>
  <v-app>
    <dashboard-core-drawer v-if="$route.name !== 'Войти'" />
    <v-content>
      <router-view />
      <dashboard-core-footer />
    </v-content>
  </v-app>
</template>

<script>
  import { auth } from '@/plugins/firebase'
  export default {
    name: 'App',
    components: {
      DashboardCoreFooter: () => import('./views/dashboard/components/core/Footer'),
      DashboardCoreDrawer: () => import('./views/dashboard/components/core/Drawer'),
    },
    computed: {
      getWallets () {
        return this.$store.getters.wallets
      },
      getAllTransactions () {
        return this.$store.getters.transactions
      },
    },
    created () {
      this.initialize()
    },
    methods: {
      async initialize () {
        let user = null
        this.$store.commit('SET_STATUS', ['initialising', true])
        await auth.onAuthStateChanged(userAuth => {
          if (userAuth) {
            user = auth.currentUser
            user.getIdTokenResult()
              .then(tokenResult => {
                const claims = tokenResult.claims
                this.$store.commit('SET_USER', [claims, user.displayName])
              })
          }
        })
        if (user !== null) {
          await this.$store.dispatch('populate')
        } else {
          this.$store.commit('SET_STATUS', ['not authorised', false])
        }
      },
    },
  }
</script>

<style>
</style>
