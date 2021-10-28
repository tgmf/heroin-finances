<template>
  <v-navigation-drawer
    id="navbarMain"
    app
    permanent
    expand-on-hover
  >
    <v-list
      nav
      dense
    >
      <v-list-item
        v-for="item in filteredArray"
        :key="item.title"
        link
        :to="item.to"
      >
        <v-list-item-icon>
          <v-icon v-text="item.icon" />
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <template
      #append
    >
      <div class="pa-2">
        <v-btn
          class="pl-1"
          block
          @click="signOut"
        >
          <v-icon>logout</v-icon>Выйти
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
  export default {
    data () {
      return {
        items: [
          { title: 'Проекты План', icon: 'dashboard', to: { name: 'Проекты План' }, manager: false },
          { title: 'Оплаты', icon: 'payments', to: { name: 'Оплаты' }, manager: true },
          { title: 'Поступления', icon: 'monetization_on', to: { name: 'Поступления' }, manager: false },
          { title: 'Затраты HeroIn', icon: 'shopping_cart', to: { name: 'Затраты HeroIn' }, manager: false },
          { title: 'Настройки', icon: 'settings', to: { name: 'Настройки' }, manager: false },
        ],
      }
    },
    computed: {
      filteredArray () {
        return this.items.filter(item => {
          if (item.manager === this.$store.state.user.manager || this.$store.state.user.admin) {
            return true
          } else {
            return false
          }
        })
      },
    },
    methods: {
      signOut () {
        this.$store
          .dispatch('signOut')
          .catch(err => {
            alert(err.message)
          })
          .then(data => {
            location.href = '/'
          })
      },
    },
  }
</script>

<style scoped></style>
