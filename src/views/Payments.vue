<template>
  <v-container
    id="payments"
    fluid
    tag="section"
  >
    <v-data-table
      :headers="headers"
      :items="getTransactions"
      :loading="!getPopulated || getStatus.loading"
      item-key="idN"
      sort-by="idN"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar
          flat
          color="white"
        >
          <v-toolbar-title>
            Оплаты
          </v-toolbar-title>
          <v-spacer />
          <v-dialog
            v-model="dialog"
            :fullscreen="$vuetify.breakpoint.mobile"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="ma-2"
                v-bind="attrs"
                v-on="on"
              >
                Новая оплата
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span
                  v-if="editedIndex==-1"
                  class="text-h5"
                >Новая оплата</span>
                <span
                  v-else
                  class="text-h5"
                >Оплата {{ editedTransaction.idN }}
                </span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                  >
                    <v-row class="justify-center">
                      <v-col
                        cols="12"
                        sm="4"
                        md="2"
                        xl="1"
                      >
                        <v-menu
                          v-model="editedTransaction.menu"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="290px"
                        >
                          <template
                            v-slot:activator="{ on, attrs }"
                          >
                            <v-text-field
                              ref="date"
                              v-model="editedTransaction.date"
                              label="Дата"
                              prepend-icon="event"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                              :rules="[rules.required]"
                              required
                            />
                          </template>
                          <v-date-picker
                            v-model="editedTransaction.date"
                            no-title
                            scrollable
                            @input="editedTransaction.menu = false"
                          />
                        </v-menu>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="4"
                        md="2"
                        xl="1"
                      >
                        <v-select
                          ref="direction"
                          v-model="editedTransaction.direction"
                          v-bind:class="{ 'isClientClass' : isClientClass }"
                          :items="directions"
                          item-text="text"
                          item-value="value"
                          :rules="[rules.required]"
                          label="Направление"
                          required
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="4"
                        md="2"
                        xl="1"
                      >
                        <vuetify-money
                          v-model.number="editedTransaction.sum"
                          :rules="[rules.required]"
                          required
                          label="Сумма"
                          v-bind:valueWhenIsEmpty=0
                          v-bind:options="sumOptions"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="4"
                        md="2"
                        xl="1"
                      >
                        <v-combobox
                          ref="wallet"
                          v-model="editedTransaction.wallet"
                          :items="transactionWallets"
                          label="Кошелек"
                          :rules="[rules.required]"
                          required
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="4"
                        md="2"
                        xl="1"
                      >
                        <v-select
                          v-model="editedTransaction.slug"
                          :items="getAllProjects"
                          :rules="[rules.required]"
                          item-text="slug"
                          item-value="slug"
                          label="Проект"
                          required
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="4"
                        md="2"
                        xl="1"
                      >
                        <v-select
                          v-model="editedTransaction.type"
                          :items="getTransactionTypes"
                          item-text="name"
                          :rules="[rules.required]"
                          required
                          label="Тип услуги"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="4"
                        md="2"
                        xl="1"
                      >
                        <v-select
                          v-model="editedTransaction.option"
                          :items="getTransactionOptions(editedTransaction.type)"
                          :rules="[rules.required]"
                          required
                          label="Услуга"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="4"
                        md="2"
                        xl="1"
                      >
                        <v-combobox
                          v-model="editedTransaction.cParty"
                          :items="getCParties"
                          :rules="[rules.required]"
                          required
                          label="Контрагент"
                          @change="isClient"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="4"
                        md="2"
                        xl="1"
                      >
                        <v-combobox
                          v-model="editedTransaction.cPartyType"
                          :items="cPartyTypes"
                          label="Тип контрагента"
                          :rules="[rules.required]"
                          required
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="4"
                        md="2"
                        xl="1"
                      >
                        <v-combobox
                          v-model="editedTransaction.account"
                          :items="getUsers"
                          label="Аккаунт"
                          :rules="[rules.required]"
                          required
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="8"
                        md="4"
                      >
                        <v-textarea
                          v-model="editedTransaction.comment"
                          label="Комментарии"
                        />
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="blue darken-1"
                  text
                  @click="close()"
                >
                  Отменить
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="save()"
                >
                  Сохранить
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          class="mr-2"
          @click="editTransaction(item)"
        >
          edit
        </v-icon>
        <v-icon
          @click="deleteTransaction(item)"
        >
          delete
        </v-icon>
      </template>
      <template
        #item.sum="{ item }"
      >
        {{ item.sum | toCurrency }}
      </template>
      <template
        #item.direction="{ item }"
      >
        {{ (item.direction === 'expense') ? 'Расход' : (item.direction === 'receipt') ? 'Приход' : 'Перевод' }}
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
  import firebase from 'firebase'
  import VuetifyMoney from '../components/VuetifyMoney.vue'
  export default {
    components: {
      VuetifyMoney,
    },
    data () {
      return {
        dialog: false,
        datePicker: false,
        lastProject: null,
        isClientClass: false,
        valid: true,
        headers: [
          { text: 'ID', align: 'start', value: 'idN' },
          { text: 'Дата', value: 'date' },
          { text: 'Направление', value: 'direction' },
          { text: 'Сумма', value: 'sum' },
          { text: 'Кошелек', value: 'wallet' },
          { text: 'Бизнес', value: 'business' },
          { text: 'Проект', value: 'slug' },
          { text: 'Клиент', value: 'client' },
          { text: 'Тип услуги', value: 'type' },
          { text: 'Опция', value: 'option' },
          { text: 'К/агент', value: 'cParty' },
          { text: 'Тип к/агента', value: 'cPartyType' },
          { text: 'Комментарий', value: 'comment' },
          { text: 'Аккаунт', value: 'account' },
          { text: 'Действия', value: 'actions', sortable: false },
        ],
        rules: {
          required: value => !!value || 'Обязательно',
        },
        editedIndex: -1,
        directions: [
          { text: 'Расход', value: 'expense' },
          { text: 'Приход', value: 'receipt' },
          { text: 'Перевод', value: 'transfer' },
        ],
        transactionWallets: ['KING', 'РМС', 'ИП Балашов', 'Corp.card', 'Оля П.', 'ИП налоги', 'РМС налоги'],
        cPartyTypes: this.$store.state.cPartyTypes,
        initialised: false,
        editedTransaction: {
          id: null,
          idN: null,
          date: new Date().toISOString().substr(0, 10),
          direction: null,
          sum: null,
          wallet: null,
          slug: null,
          business: null,
          num: null,
          type: null,
          option: null,
          cParty: null,
          cPartyType: null,
          tax: 0,
          comment: '',
          menu: false,
          status: 'new',
        },
        defaultTransaction: {
          id: null,
          idN: null,
          date: new Date().toISOString().substr(0, 10),
          direction: null,
          sum: null,
          wallet: null,
          slug: null,
          business: null,
          num: null,
          type: null,
          option: null,
          cParty: null,
          cPartyType: null,
          tax: 0,
          comment: '',
          menu: false,
          status: 'new',
        },
        sumOptions: {
          locale: 'ru-RU',
          suffix: ' ₽',
          precision: 2,
        },
      }
    },
    computed: {
      getStatus () {
        return this.$store.getters.status
      },
      getAllProjects () {
        return this.$store.getters.projects
      },
      getTransactions () {
        return this.$store.getters.transactions
      },
      getTransactionTypes () {
        return this.$store.getters.transactionTypes(this.editedTransaction.slug)
      },
      getPopulated () {
        return this.$store.getters.populated
      },
      getBusinesses () {
        return this.$store.getters.businesses
      },
      getClients () {
        return this.$store.getters.clients
      },
      getCParties () {
        return this.$store.getters.cParties
      },
      getWallets () {
        return this.$store.getters.wallets
      },
      getUsers () {
        return this.$store.getters.users
      },
    },
    watch: {
      'editedTransaction.slug' (val) {
        if (val !== '') this.getBusiness(val)
      },
      'getPopulated' (val) {
        if (val && !this.initialised) this.initialize()
      },
    },
    mounted () {
      if (this.getPopulated && !this.initialised) this.initialize()
    },
    methods: {
      initialize () {
        this.lastProject = this.getAllProjects[0].slug
        this.editedTransaction.slug = this.lastProject
        this.editedTransaction.direction = this.directions[0].value
        this.editedTransaction.transactionType = this.getTransactionTypes[0].name
        this.editedTransaction.option = this.getTransactionTypes[0].options[0]
        this.editedTransaction.cPartyType = this.cPartyTypes[0]
        this.editedTransaction.wallet = this.transactionWallets[0]
        this.defaultTransaction.slug = this.lastProject
        this.defaultTransaction.direction = this.directions[0].value
        this.defaultTransaction.transactionType = this.getTransactionTypes[0].name
        this.defaultTransaction.option = this.getTransactionTypes[0].options[0]
        this.defaultTransaction.cPartyType = this.cPartyTypes[0]
        this.defaultTransaction.wallet = this.transactionWallets[0]
        this.initialised = true
      },
      getBusiness (slug) {
        return this.getAllProjects.find(project => project.slug === slug) ? this.getAllProjects.find(project => project.slug === slug).business : ''
      },
      getTransactionOptions (expenseType) {
        return this.$store.getters.transactionOptions(expenseType)
      },
      isClient (e) {
        const o = this.editedTransaction.direction
        this.editedTransaction.direction = (this.getClients.includes(e)) ? 'receipt' : 'expense'
        if (this.editedTransaction.direction !== o) {
          this.isClientClass = true
          setTimeout(() => {
            this.isClientClass = false
          }, 1000)
        }
      },
      editTransaction (transaction) {
        this.editedIndex = this.getTransactions.indexOf(transaction)
        this.editedTransaction = Object.assign({}, transaction)
        this.editedTransaction.status = (!this.editedTransaction.status) ? 'editing' : this.editedTransaction.status
        this.dialog = true
      },
      deleteTransaction (transaction) {
        this.$store.commit('SET_STATUS', ['removing transaction', true])
        if (confirm('Вы уверены, что хотите удалить эту оплату?')) {
          transaction.status = 'removing'
          const deleteTransactionFire = firebase.functions().httpsCallable('updateTransaction')
          deleteTransactionFire(transaction).then(function (resp) {
          })
            .catch(function (error) {
              const code = error.code
              const message = error.message
              alert(code + ' — ' + message)
              location.reload()
            })
        }
      },
      close () {
        this.dialog = false
        this.$refs.form.resetValidation()
        this.$nextTick(() => {
          this.editedTransaction = Object.assign({}, this.defaultTransaction)
          this.editedIndex = -1
        })
      },
      async save () {
        if (this.$refs.form.validate()) {
          const statusText = this.editedTransaction.status + ' transaction'
          this.$store.commit('SET_STATUS', [statusText, true])
          this.lastProject = this.editedTransaction.slug
          const updateTransactionFire = firebase.functions().httpsCallable('updateTransaction')
          updateTransactionFire(this.editedTransaction).then(function (resp) {
          })
            .catch(function (error) {
              const code = error.code
              const message = error.message
              alert(code + ' — ' + message)
              location.reload()
            })
          this.close()
        }
      },
    },
  }
</script>
<style>
  .theme--light.v-text-field.isClientClass > .v-input__control > .v-input__slot:before {
    transition: .5s ease;
    border-color: #ff5252;
    border-width: bold 0 0 0;;
  }
  input[type='number'] {
      -moz-appearance:textfield;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
      -webkit-appearance: none;
  }
</style>
