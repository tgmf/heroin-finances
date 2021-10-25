<template>
  <v-container>
    <v-row>
      <v-col
        sm="12"
        md="6"
        offset-md="3"
      >
        <v-card
          elevation="4"
          light
          tag="section"
        >
          <v-card-title>
            <v-row
              align="center"
              justify="space-between"
            >
              <h3 class="text-h5">
                {{ platformName }}
              </h3>
            </v-row>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-form>
              <v-text-field
                id="fire-email"
                v-model="account.email"
                outline
                label="E-mail"
                type="email"
              />
              <v-text-field
                id="fire-pass"
                v-model="account.password"
                outline
                hide-details
                label="Password"
                type="password"
              />
              <v-alert
                v-if="isError"
                type="error"
              >
                {{ errMsg }}
              </v-alert>
            </v-form>
          </v-card-text>
          <v-divider />
          <v-card-actions :class="{ 'pa-3': $vuetify.breakpoint.smAndUp }">
            <v-btn
              color="info"
              text
            >
              Забыли пароль?
            </v-btn>
            <v-spacer />
            <v-btn
              color="info"
              :large="$vuetify.breakpoint.smAndUp"
              @click="signIn"
            >
              Войти
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { setTimeout } from 'timers'
  export default {
    data: () => ({
      platformName: 'Hero[In]Finances',
      account: {
        email: null,
        password: null,
      },
      isError: false,
      errMsg: '',
    }),
    methods: {
      signIn () {
        this.$store
          .dispatch('signIn', this.account)
          .catch((error) => {
            this.isError = true
            this.errMsg = error.code
            setTimeout(() => {
              this.isError = false
            }, 5000)
          })
          .then(() => {
            this.$router.push('/projects')
          })
      },
    },
  }
</script>

<style scoped>
</style>
