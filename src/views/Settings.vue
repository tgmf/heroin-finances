<template>
  <v-container fluid>
    <p class="text-h1">
      Настройки
    </p>
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-card>
          <v-data-table
            :headers="taxesHeaders"
            :items="getTaxes"
            :loading="!getPopulated || getStatus.loading"
            item-key="name"
            sort-by="name"
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar
                flat
                color="white"
              >
                <v-toolbar-title>Налоги</v-toolbar-title>
                <v-spacer />
                <v-dialog
                  v-model="dialog['tax']"
                  max-width="500px"
                >
                  <template v-slot:activator="{ on, taxAttrs }">
                    <v-btn
                      color="primary"
                      dark
                      class="ma-2"
                      v-bind="taxAttrs"
                      v-on="on"
                    >
                      Новый налог
                    </v-btn>
                  </template>
                  <v-card ref="taxForm">
                    <v-card-title>
                      <span
                        v-if="editedIndex==-1"
                        class="text-h5"
                      >Новый налог</span>
                      <span
                        v-else
                        class="text-h5"
                      >{{ editedTax.name }}
                      </span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row class="justify-center">
                          <v-col
                            cols="12"
                            md="6"
                          >
                            <v-text-field
                              ref="tax-name"
                              v-model="editedTax.name"
                              :disabled="(editedIndex >= 0)"
                              :rules="[rules.required]"
                              label="Название"
                              required
                            />
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="3"
                          >
                            <v-text-field
                              ref="tax-plain"
                              v-model.number="percentageTax"
                              :rules="[rules.positive]"
                              suffix="%"
                              label="Налог"
                              type="number"
                            />
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="3"
                          >
                            <v-text-field
                              ref="tax-withdrawal"
                              v-model.number="percentageWithdrawal"
                              :rules="[rules.positive]"
                              suffix="%"
                              label="За вывод"
                              type="number"
                            />
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="3"
                          >
                            <v-text-field
                              ref="tax-НДС"
                              v-model.number="percentageNds"
                              :rules="[rules.positive]"
                              suffix="%"
                              label="НДС"
                              type="number"
                            />
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="3"
                          >
                            <v-text-field
                              ref="tax-УСН"
                              v-model.number="percentageUsn"
                              :rules="[rules.positive]"
                              suffix="%"
                              label="УСН"
                              type="number"
                            />
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="3"
                          >
                            <v-text-field
                              ref="tax-ИП"
                              v-model.number="percentageIp"
                              :rules="[rules.positive]"
                              suffix="%"
                              label="ИП"
                              type="number"
                            />
                          </v-col> <v-col
                            cols="12"
                            sm="6"
                            md="3"
                          >
                            <v-text-field
                              ref="tax-KING"
                              v-model.number="percentageKing"
                              :rules="[rules.positive]"
                              suffix="%"
                              label="KING"
                              type="number"
                            />
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer />
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="close('tax')"
                      >
                        Отменить
                      </v-btn>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="save('tax')"
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
                @click="editItem('tax', item)"
              >
                edit
              </v-icon>
              <v-icon
                v-if="false"
                @click="deleteItem('tax', item)"
              >
                delete
              </v-icon>
            </template>
            <template
              #item.plain="{ item }"
            >
              {{ item.plain * 100 }}%
            </template>
            <template
              #item.withdrawal="{ item }"
            >
              {{ item.withdrawal * 100 }}%
            </template>
            <template
              #item.НДС="{ item }"
            >
              {{ item.НДС * 100 }}%
            </template>
            <template
              #item.УСН="{ item }"
            >
              {{ item.УСН * 100 }}%
            </template>
            <template
              #item.ИП="{ item }"
            >
              {{ item.ИП * 100 }}%
            </template>
            <template
              #item.KING="{ item }"
            >
              {{ item.KING * 100 }}%
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-card>
          <v-data-table
            :headers="walletsHeaders"
            :items="getWallets"
            :loading="!getPopulated || getStatus.loading"
            item-key="name"
            sort-by="name"
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar
                flat
                color="white"
              >
                <v-toolbar-title>Кошельки</v-toolbar-title>
                <v-spacer />
                <v-dialog
                  v-model="dialog['wallet']"
                  max-width="500px"
                >
                  <template v-slot:activator="{ on, walletAttrs }">
                    <v-btn
                      color="primary"
                      dark
                      class="ma-2"
                      v-bind="walletAttrs"
                      v-on="on"
                    >
                      Новый кошелек
                    </v-btn>
                  </template>
                  <v-card ref="walletForm">
                    <v-card-title>
                      <span
                        v-if="editedIndex==-1"
                        class="text-h5"
                      >Новый кошелек</span>
                      <span
                        v-else
                        class="text-h5"
                      >{{ editedWallet.name }}
                      </span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row class="justify-center">
                          <v-col
                            cols="12"
                            md="6"
                          >
                            <v-text-field
                              ref="wallet-name"
                              v-model="editedWallet.name"
                              :disabled="(editedIndex >= 0)"
                              :rules="[rules.required]"
                              label="Название"
                              required
                            />
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="3"
                          >
                            <v-select
                              ref="wallet-tax"
                              :items="getTaxes"
                              item-text="name"
                              v-model="editedWallet.tax"
                              :rules="[rules.required]"
                              label="Налог"
                              required
                            />
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer />
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="close('wallet')"
                      >
                        Отменить
                      </v-btn>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="save('wallet')"
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
                @click="editItem('wallet', item)"
              >
                edit
              </v-icon>
              <v-icon
                v-if="false"
                @click="deleteItem('wallet', item)"
              >
                delete
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-card
          class="mt-0"
        >
          <v-data-table
            :headers="usersHeaders"
            :items="users"
            :loading="!getPopulated || getStatus.loading"
            item-key="id"
            sort-by="email"
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar
                flat
                color="white"
              >
                <v-toolbar-title>
                  Пользователи
                </v-toolbar-title>
                <v-spacer />
                <v-dialog
                  v-model="dialog['user']"
                  max-width="500px"
                >
                  <template v-slot:activator="{ on, userAttrs }">
                    <v-btn
                      color="primary"
                      dark
                      class="ma-2"
                      v-bind="userAttrs"
                      v-on="on"
                    >
                      Новый пользователь
                    </v-btn>
                  </template>
                  <v-card ref="userForm">
                    <v-card-title>
                      <span
                        v-if="editedIndex==-1"
                        class="text-h5"
                      >Новый пользователь</span>
                      <span
                        v-else
                        class="text-h5"
                      >{{ editedUser.displayName }}
                      </span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row class="justify-center">
                          <v-col
                            cols="12"
                          >
                            <v-text-field
                              ref="user-displayName"
                              v-model="editedUser.displayName"
                              :rules="[rules.required]"
                              label="Имя"
                              :error-messages="err"
                              required
                            />
                          </v-col>
                          <v-col
                            cols="12"
                          >
                            <v-text-field
                              ref="user-email"
                              v-model="editedUser.email"
                              :rules="[rules.required, rules.email]"
                              label="Email"
                              :type="'email'"
                              required
                            />
                          </v-col>
                          <v-col
                            cols="12"
                          >
                            <v-text-field
                              ref="user-password"
                              v-model="editedUser.password"
                              :rules="[rules.required, rules.min]"
                              :append-icon="showPass ? 'visibility_off' : 'visibility'"
                              :type="showPass ? 'text' : 'password'"
                              required
                              label="Пароль"
                              class="input-group--focused"
                              @click:append="showPass = !showPass"
                            />
                          </v-col>
                          <v-col
                            cols="12"
                            class="justify-center d-flex align-center"
                          >
                            <span
                              class="ma-2 mb-7"
                              :class="{ 'text--disabled': editedUser.isAdmin }"
                            >
                              Менеджер
                            </span>
                            <v-switch
                              ref="user-isAdmin"
                              v-model="editedUser.isAdmin"
                              class="ma-2 d-inline-block"
                              label="Администратор"
                            />
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer />
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="close('user')"
                      >
                        Отменить
                      </v-btn>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="save('user')"
                      >
                        Сохранить
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:item.isAdmin="{ item }">
              <v-simple-checkbox
                v-model="item.isAdmin"
                disabled
              />
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon
                v-if="!item.isAdmin || item.email === user.email"
                class="mr-2"
                @click="editItem('user', item)"
              >
                edit
              </v-icon>
              <v-icon
                v-if="!item.isAdmin"
                @click="deleteItem('user', item)"
              >
                delete
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-card
          class="mt-0"
        >
          <v-data-table
            :headers="employeesHeaders"
            :items="getEmployees"
            :loading="!getPopulated || getStatus.loading"
            item-key="id"
            sort-by="name"
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar>
                <v-toolbar-title>
                  Сотрудники
                </v-toolbar-title>
                <v-spacer />
                <v-dialog
                  v-model="dialog['employee']"
                  max-width="500px"
                >
                  <template v-slot:activator="{ on, employeeAttrs }">
                    <v-btn
                      color="primary"
                      dark
                      class="ma-2"
                      v-bind="employeeAttrs"
                      v-on="on"
                    >
                      Новый сотрудник
                    </v-btn>
                  </template>
                  <v-card ref="employeeForm">
                    <v-card-title>
                      <span
                        v-if="editedIndex==-1"
                        class="text-h5"
                      >Новый сотрудник</span>
                      <span
                        v-else
                        class="text-h5"
                      >{{ editedEmployee.name }}
                      </span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row class="justify-center">
                          <v-col
                            cols="12"
                          >
                            <v-text-field
                              ref="employee-name"
                              v-model="editedEmployee.name"
                              :rules="[rules.required]"
                              label="Имя"
                              :error-messages="err"
                              required
                            />
                          </v-col>
                          <v-col
                            cols="12"
                          >
                            <v-text-field
                              ref="employee-email"
                              v-model="editedEmployee.email"
                              :rules="[rules.email]"
                              label="Email"
                              :type="'email'"
                            />
                          </v-col>
                          <v-col
                            cols="12"
                          >
                            <v-switch
                              ref="employee-isActive"
                              v-model="editedEmployee.isActive"
                              class="ma-2 d-inline-block"
                              label="Активен"
                            />
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer />
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="close('employee')"
                      >
                        Отменить
                      </v-btn>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="save('employee')"
                      >
                        Сохранить
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:item.isActive="{ item }">
              <v-simple-checkbox
                v-model="item.isActive"
                disabled
              />
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon
                class="mr-2"
                @click="editItem('employee', item)"
              >
                edit
              </v-icon>
              <v-icon
                @click="deleteItem('employee', item)"
              >
                delete
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  import firebase from 'firebase'
  // import { debounce } from 'debounce'

  export default {
    data () {
      return {
        dialog: {
          user: false,
          wallet: false,
          tax: false,
          employee: false,
        },
        state: 'Загрузка',
        editedIndex: -1,
        usersHeaders: [
          { text: 'Имя', align: 'start', value: 'displayName' },
          { text: 'Email', value: 'email' },
          { text: 'Администратор', value: 'isAdmin' },
          { text: 'Действия', value: 'actions', sortable: false },
        ],
        users: [],
        editedUser: {
          displayName: '',
          email: '',
          password: '',
          isAdmin: false,
        },
        defaultUser: {
          displayName: '',
          email: '',
          password: '',
          isAdmin: false,
        },
        taxesHeaders: [
          { text: 'Название', align: 'start', value: 'name' },
          { text: 'Налог', value: 'plain' },
          { text: 'Вывод', value: 'withdrawal' },
          { text: 'НДС', value: 'НДС' },
          { text: 'УСН', value: 'УСН' },
          { text: 'ИП', value: 'ИП' },
          { text: 'KING', value: 'KING' },
          { text: 'Действия', value: 'actions', sortable: false },
        ],
        editedTax: {
          name: '',
          plain: 0,
          НДС: 0,
          УСН: 0,
          ИП: 0,
          KING: 0,
          withdrawal: 0,
        },
        defaultTax: {
          name: '',
          plain: 0,
          НДС: 0,
          УСН: 0,
          ИП: 0,
          KING: 0,
          withdrawal: 0,
        },
        walletsHeaders: [
          { text: 'Название', align: 'start', value: 'name' },
          { text: 'Налог', value: 'tax' },
          { text: 'Действия', value: 'actions', sortable: false },
        ],
        editedWallet: {
          name: '',
          tax: null,
        },
        defaultWallet: {
          name: '',
          tax: null,
        },
        employeesHeaders: [
          { text: 'Имя', align: 'start', value: 'name' },
          { text: 'Email', value: 'email' },
          { text: 'Активен', value: 'isActive' },
          { text: 'Действия', value: 'actions', sortable: false },
        ],
        editedEmployee: {
          name: '',
          email: '',
          isActive: true,
        },
        defaultEmployee: {
          name: '',
          email: '',
          isActive: true,
        },
        user: this.$store.state.user,
        showPass: false,
        rules: {
          required: value => !!value || 'Обязательно.',
          positive: value => (value >= 0 && value <= 100) || 'Должно быть от 0 до 100',
          min: v => v.length >= 6 || 'Не менее 6 символов',
          email: v => !!(v || '').match(/@/) || 'Введите настоящий email адрес',
        },
        formHasErrors: false,
        err: '',
      }
    },
    computed: {
      getStatus () {
        return this.$store.getters.status
      },
      getTaxes () {
        return this.$store.getters.taxes
      },
      getWallets () {
        return this.$store.getters.wallets
      },
      getEmployees () {
        return this.$store.getters.employees
      },
      getPopulated () {
        return this.$store.getters.populated
      },
      percentageTax: {
        get: function () {
          return +(this.editedTax.plain * 100).toFixed(0)
        },
        set: function (newValue) {
          this.editedTax.plain = (newValue / 100).toFixed(2)
        },
      },
      percentageNds: {
        get: function () {
          return +(this.editedTax.НДС * 100).toFixed(0)
        },
        set: function (newValue) {
          this.editedTax.НДС = (newValue / 100).toFixed(2)
        },
      },
      percentageUsn: {
        get: function () {
          return +(this.editedTax.УСН * 100).toFixed(0)
        },
        set: function (newValue) {
          this.editedTax.УСН = (newValue / 100).toFixed(2)
        },
      },
      percentageIp: {
        get: function () {
          return +(this.editedTax.ИП * 100).toFixed(0)
        },
        set: function (newValue) {
          this.editedTax.ИП = (newValue / 100).toFixed(2)
        },
      },
      percentageKing: {
        get: function () {
          return +(this.editedTax.KING * 100).toFixed(0)
        },
        set: function (newValue) {
          this.editedTax.KING = (newValue / 100).toFixed(2)
        },
      },
      percentageWithdrawal: {
        get: function () {
          return +(this.editedTax.withdrawal * 100).toFixed(0)
        },
        set: function (newValue) {
          this.editedTax.withdrawal = (newValue / 100).toFixed(2)
        },
      },
    },
    watch: {
      'dialog.user' (val) {
        val || this.close('user')
      },
      'dialog.wallet' (val) {
        val || this.close('wallet')
      },
      'dialog.tax' (val) {
        val || this.close('tax')
      },
      'dialog.employee' (val) {
        val || this.close('employee')
      },
    },
    created () {
      this.initialize()
    },
    // firestore: {
    //   users: firebase.firestore().collection('users'),
    // },
    methods: {
      async initialize () {
        // whipe dirty arrays
        this.users = []
        // get user data from firestore
        await firebase.firestore().collection('users').onSnapshot((snapshot) => {
          snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
              var user = change.doc.data()
              user.id = change.doc.id
              this.users.push(user)
            }
            if (change.type === 'modified') {
              this.users.forEach((user, i) => {
                if (user.id === change.doc.id) {
                  Object.assign(this.users[i], change.doc.data())
                }
              })
            }
            if (change.type === 'removed') {
              this.users.forEach((user, i) => {
                if (user.id === change.doc.id) {
                  Object.assign(this.users[i], change.doc.data())
                }
              })
            }
          })
        })
      },
      editItem (type, item) {
        switch (type) {
          case 'user': {
            this.editedIndex = this.users.indexOf(item)
            this.editedUser = Object.assign({}, item)
            break
          }
          case 'tax': {
            this.editedIndex = this.getTaxes.indexOf(item)
            this.editedTax = Object.assign({}, item)
            break
          }
          case 'wallet': {
            this.editedIndex = this.getWallets.indexOf(item)
            this.editedWallet = Object.assign({}, item)
            break
          }
          case 'employee': {
            this.editedIndex = this.getEmployees.indexOf(item)
            this.editedEmployee = Object.assign({}, item)
            break
          }
          default: break
        }
        this.dialog[type] = true
      },
      deleteItem (type, item) {
        switch (type) {
          case 'user': {
            const index = this.users.indexOf(item)
            if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
              this.users.splice(index, 1)
              this.deleteUser(item)
            }
            break
          }
          case 'tax': {
            if (confirm('Вы уверены, что хотите удалить этот налог?')) {
              this.deleteTax(item)
            }
            break
          }
          case 'wallet': {
            if (confirm('Вы уверены, что хотите удалить этот кошелек?')) {
              this.deleteWallet(item)
            }
            break
          }
          case 'employee': {
            if (confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
              this.deleteEmployee(item)
            }
            break
          }
          default: break
        }
      },
      close (type) {
        this.dialog[type] = false
        this.$nextTick(() => {
          this.editedUser = Object.assign({}, this.defaultUser)
          this.editedTax = Object.assign({}, this.defaultTax)
          this.editedWallet = Object.assign({}, this.defaultWallet)
          this.editedEmployee = Object.assign({}, this.defaultEmployee)
          this.editedIndex = -1
          this.showPass = false
        })
      },
      save (type) {
        this.formHasErrors = false
        switch (type) {
          case 'user': {
            Object.keys(this.editedUser).forEach(f => {
              if (f !== 'isAdmin' && f !== 'id' && !this.editedUser[f]) {
                this.formHasErrors = true
                this.$refs[type + '-' + f].validate(true)
              }
            })
            if (!this.formHasErrors) {
              if (this.editedIndex > -1) {
                Object.assign(this.users[this.editedIndex], this.editedUser)
                this.updateUser(this.editedUser)
              } else {
                this.createUser(this.editedUser)
              }
              this.close(type)
            }
            break
          }
          case 'tax': {
            Object.keys(this.editedTax).forEach(f => {
              if (!this.editedTax[f] && this.editedTax[f] !== 0) {
                this.formHasErrors = true
                this.$refs[type + '-' + f].validate(true)
              }
            })
            if (!this.formHasErrors) {
              if (this.editedIndex > -1) {
                this.$store.commit('UPDATE_TAX', [this.editedTax, this.editedIndex])
              }
              this.updateTax(this.editedTax)
              this.close(type)
            }
            break
          }
          case 'wallet': {
            Object.keys(this.editedWallet).forEach(f => {
              if (!this.editedWallet[f] && this.editedWallet[f] !== 0) {
                this.formHasErrors = true
                this.$refs[type + '-' + f].validate(true)
              }
            })
            if (!this.formHasErrors) {
              if (this.editedIndex > -1) {
                this.$store.commit('UPDATE_WALLET', [this.editedWallet, this.editedIndex])
              }
              this.updateWallet(this.editedWallet)
              this.close(type)
            }
            break
          }
          case 'employee': {
            Object.keys(this.editedEmployee).forEach(f => {
              if (f !== 'isActive' && f !== 'email' && !this.editedEmployee[f] && this.editedEmployee[f] !== 0) {
                this.formHasErrors = true
                this.$refs[type + '-' + f].validate(true)
              }
            })
            if (!this.formHasErrors) {
              if (this.editedIndex > -1) {
                this.$store.commit('UPDATE_EMPLOYEE', [this.editedEmployee, this.editedIndex])
              }
              this.updateEmployee(this.editedEmployee)
              this.close(type)
            }
            break
          }
          default: break
        }
      },
      async createUser (user) {
        const createUserFire = firebase.functions().httpsCallable('createUser')
        // this.users.push(user)
        await createUserFire(user).then(function (resp) {
        })
          .catch(function (error) {
            alert.log(error)
            // Display error
          })
      },
      async updateUser (user) {
        const updateUserFire = firebase.functions().httpsCallable('updateUser')
        await updateUserFire(user).then(function (resp) {
        })
          .catch(function (error) {
            alert.log(error)
          })
      },
      async deleteUser (user) {
        const deleteUserFire = firebase.functions().httpsCallable('deleteUser')
        deleteUserFire(user).then(function (resp) {
        })
          .catch(function (error) {
            alert.error(error)
          })
      },
      async updateTax (tax) {
        try {
          await firebase.firestore().collection('taxes').doc(tax.name).set(tax)
        } catch (error) {
          this.err = JSON.stringify(error)
          this.state = 'Ошибка'
          alert(error)
          location.reload()
        }
        this.state = 'Ок'
      },
      async deleteTax (tax) {
        try {
          await firebase.firestore().collection('taxes').doc(tax.name).delete()
        } catch (error) {
          this.err = JSON.stringify(error)
          this.state = 'Ошибка'
          alert(error)
          location.reload()
        }
        this.state = 'Ок'
      },
      async updateWallet (wallet) {
        try {
          await firebase.firestore().collection('wallets').doc(wallet.name).set(wallet)
        } catch (error) {
          this.err = JSON.stringify(error)
          this.state = 'Ошибка'
          alert(error)
          location.reload()
        }
        this.state = 'Ок'
      },
      async deleteWallet (wallet) {
        try {
          await firebase.firestore().collection('wallets').doc(wallet.name).delete()
        } catch (error) {
          this.err = JSON.stringify(error)
          this.state = 'Ошибка'
          alert(error)
          location.reload()
        }
        this.state = 'Ок'
      },
      async updateEmployee (employee) {
        try {
          await firebase.firestore().collection('employees').doc(employee.name).set(employee)
        } catch (error) {
          this.err = JSON.stringify(error)
          this.state = 'Ошибка'
          alert(error)
          location.reload()
        }
        this.state = 'Ок'
      },
      async deleteEmployee (employee) {
        try {
          await firebase.firestore().collection('employees').doc(employee.name).delete()
        } catch (error) {
          this.err = JSON.stringify(error)
          this.state = 'Ошибка'
          alert(error)
          location.reload()
        }
        this.state = 'Ок'
      },
    },
  }
</script>
<style>
  table.v-table thead th {
    font-size: 1em !important;
  }
  .v-label {
    font-size: 16px!important;
  }
  input[type='number'] {
      -moz-appearance:textfield;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
      -webkit-appearance: none;
  }
</style>
