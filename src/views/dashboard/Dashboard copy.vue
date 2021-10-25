<template>
  <v-container
    id="dashboard"
    fluid
    tag="section"
  >
    <v-row>
      <v-col>
        <v-card>
          <v-toolbar
            dark
            :color="((tabs === 0)? 'red' : (tabs === 1)? 'purple' : (tabs === 2)? 'blue' : 'green' ) + ' darken-3'"
            flat
          >
            <v-toolbar-title>Проекты</v-toolbar-title>
            <template v-slot:extension>
              <v-tabs
                v-model="tabs"
                centered
              >
                <v-tab
                  v-for="business in tabsArray"
                  :key="business"
                >
                  {{ business }}
                </v-tab>
              </v-tabs>
            </template>
          </v-toolbar>
          <v-tabs-items
            v-model="tabs"
          >
            <v-dialog
              v-model="dialog"
              fullscreen
              hide-overlay
              transition="dialog-bottom-transition"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  fab
                  absolute
                  top
                  right
                  v-bind="attrs"
                  v-on="on"
                  @click="editedProject.business = businesses[tabs-1]"
                >
                  <v-icon
                    large
                    color="white"
                  >
                    add
                  </v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-toolbar
                  color="primary"
                >
                  <v-btn
                    icon
                    dark
                    @click="close"
                  >
                    <v-icon
                      large
                    >
                      close
                    </v-icon>
                  </v-btn>
                  <v-toolbar-title
                    class="white--text"
                  >
                    <span
                      v-if="editedIndex==-1"
                      class="text-h5"
                    >
                      Новый проект
                    </span>
                    <span
                      v-else
                      class="text-h5"
                    >
                      {{ editedProject.name }}
                    </span>
                  </v-toolbar-title>
                  <v-spacer />
                  <v-toolbar-items>
                    <v-btn
                      :disabled="!valid"
                      dark
                      text
                      @click="save"
                    >
                      Сохранить
                    </v-btn>
                  </v-toolbar-items>
                </v-toolbar>
                <v-card-text>
                  <v-container
                    fluid
                  >
                    <v-form
                      ref="form"
                      v-model="valid"
                      lazy-validation
                    >
                      <v-row
                        class="justify-center"
                      >
                        <v-col
                          cols="12"
                          md="6"
                        >
                          <v-card>
                            <v-toolbar
                              dark
                              color="green darken-3"
                            >
                              <v-toolbar-title>Аккаунт</v-toolbar-title>
                            </v-toolbar>
                            <v-card-text>
                              <v-row>
                                <v-col
                                  cols="12"
                                  md="8"
                                >
                                  <v-select
                                    v-model="editedProject.business"
                                    :items="businesses"
                                    :rules="[rules.required]"
                                    label="Бизнес"
                                    required
                                  />
                                </v-col>
                                <v-col
                                  cols="12"
                                  md="4"
                                >
                                  <v-select
                                    v-model="editedProject.type"
                                    :items="projectTypes"
                                    label="Тип проекта"
                                  />
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col
                                  cols="12"
                                  md="8"
                                >
                                  <v-text-field
                                    v-model="editedProject.name"
                                    :rules="[rules.required]"
                                    label="Название"
                                    required
                                    @change="transliterate"
                                  />
                                </v-col>
                                <v-col
                                  cols="12"
                                  md="4"
                                >
                                  <v-text-field
                                    v-model="editedProject.slug"
                                    :disabled="(editedIndex > -1)"
                                    :rules="[rules.required, rules.slug]"
                                    label="Код проекта"
                                    required
                                  />
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col
                                  cols="12"
                                  md="8"
                                >
                                  <v-combobox
                                    v-model="editedProject.client"
                                    :items="getClients"
                                    :rules="[rules.required]"
                                    label="Клиент"
                                    required
                                    @change="isNew"
                                  />
                                </v-col>
                                <v-col
                                  cols="12"
                                  md="4"
                                >
                                  <v-switch
                                    v-model="editedProject.new"
                                    label="Новый клиент"
                                  />
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col
                                  cols="12"
                                  sm="6"
                                >
                                  <v-combobox
                                    v-model="editedProject.director"
                                    :items="users"
                                    label="Директор"
                                  />
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="6"
                                >
                                  <v-slider
                                    v-model.number="editedProject.directorsCut"
                                    hint="от 0 до 10%"
                                    max="10"
                                    min="0"
                                    :label="'Комиссия ' + editedProject.directorsCut + '%'"
                                  />
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col
                                  cols="12"
                                  sm="6"
                                >
                                  <v-combobox
                                    v-model="editedProject.account"
                                    :items="users"
                                    label="Аккаунт"
                                  />
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="6"
                                >
                                  <v-combobox
                                    v-model="editedProject.manager"
                                    :items="users"
                                    label="Менеджер"
                                  />
                                </v-col>
                              </v-row>
                            </v-card-text>
                          </v-card>
                        </v-col>
                        <v-col
                          cols="12"
                          md="6"
                          xl="4"
                        >
                          <v-card>
                            <v-toolbar
                              dark
                              color="green darken-3"
                            >
                              <v-toolbar-title>Сроки и стоимость</v-toolbar-title>
                            </v-toolbar>
                            <v-card-text>
                              <v-row>
                                <v-col
                                  cols="12"
                                  sm="6"
                                >
                                  <vuetify-money
                                    v-model.number="editedProject.sum"
                                    label="Сумма"
                                    :value-when-is-empty=0
                                    :options="sumOptions"
                                  />
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="6"
                                >
                                  <v-select
                                    v-model="editedProject.wallet"
                                    label="Кошелек"
                                    :items="getWallets"
                                    item-text="name"
                                    :rules="[rules.required]"
                                    required
                                    @change="updateWallet"
                                  />
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col
                                  cols="12"
                                  md="6"
                                >
                                  <v-menu
                                    ref="menu"
                                    v-model="datePicker"
                                    :return-value.sync="editedProject.dates"
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
                                        :value="dateRangeText"
                                        label="Продолжительность"
                                        prepend-icon="event"
                                        readonly
                                        :rules="[rules.required]"
                                        required
                                        v-bind="attrs"
                                        v-on="on"
                                      />
                                    </template>
                                    <v-date-picker
                                      v-model="editedProject.dates"
                                      range
                                      no-title
                                      scrollable
                                    >
                                      <v-spacer />
                                      <v-btn
                                        text
                                        color="primary"
                                        @click="datePicker = false"
                                      >
                                        Отмена
                                      </v-btn>
                                      <v-btn
                                        outlined
                                        color="primary"
                                        @click="$refs.menu.save(editedProject.dates)"
                                      >
                                        OK
                                      </v-btn>
                                    </v-date-picker>
                                  </v-menu>
                                </v-col>
                                <v-col
                                  cols="12"
                                  md="6"
                                >
                                  <p>Финансовый период</p>
                                  <span
                                    class="ma-2 mb-7"
                                    style="vertical-align: text-top"
                                    :class="{ 'text--disabled': editedProject.auto }"
                                  >
                                    Вручную
                                  </span>
                                  <v-switch
                                    v-model="editedProject.auto"
                                    class="ma-2 d-inline-block"
                                    label="Авто"
                                  />
                                </v-col>
                              </v-row>
                              <v-row
                                v-for="payment in editedProject.payments"
                                :key="payment.num"
                              >
                                <v-col
                                  cols="6"
                                >
                                  <v-menu
                                    v-model="payment.menu"
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
                                        v-model="payment.date"
                                        :label="payment.num + ' платеж'"
                                        prepend-icon="event"
                                        readonly
                                        v-bind="attrs"
                                        :rules="[rules.required]"
                                        required
                                        v-on="on"
                                      />
                                    </template>
                                    <v-date-picker
                                      v-model="payment.date"
                                      no-title
                                      scrollable
                                      @input="payment.menu = false; editedProject.auto = false"
                                    />
                                  </v-menu>
                                </v-col>
                                <v-col
                                  cols="6"
                                >
                                  <vuetify-money
                                    v-model.number="payment.sum"
                                    label="Сумма"
                                    :options="sumOptions"
                                    :value-when-is-empty=0
                                    :rules="[rules.required]"
                                    required
                                    @input="editedProject.auto = false"
                                  />
                                </v-col>
                                <v-btn
                                  color="red"
                                  dark
                                  absolute
                                  right
                                  small
                                  fab
                                >
                                  <v-icon
                                    @click="removePayment"
                                  >
                                    remove
                                  </v-icon>
                                </v-btn>
                              </v-row>
                              <v-btn
                                color="blue"
                                dark
                                absolute
                                bottom
                                right
                                fab
                              >
                                <v-icon
                                  large
                                  @click="addPayment"
                                >
                                  add
                                </v-icon>
                              </v-btn>
                            </v-card-text>
                          </v-card>
                        </v-col>
                        <v-col
                          v-if="editedProject.wallet && editedProject.sum"
                          cols="12"
                          xl="10"
                        >
                          <v-card>
                            <v-toolbar
                              dark
                              color="green darken-3"
                            >
                              <v-toolbar-title>Затраты</v-toolbar-title>
                            </v-toolbar>
                            <v-card-text>
                              <v-row
                                v-for="expense in activeExpenses(editedProject)"
                                :key="expense.num"
                                class="project-expense"
                              >
                                <v-col
                                  cols="12"
                                  sm="6"
                                  md="4"
                                  lg="2"
                                >
                                  <v-menu
                                    v-model="expense.menu"
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
                                        v-model="expense.date"
                                        :label="expense.num + ' оплата'"
                                        prepend-icon="event"
                                        readonly
                                        :rules="[rules.required]"
                                        required
                                        v-bind="attrs"
                                        v-on="on"
                                      />
                                    </template>
                                    <v-date-picker
                                      v-model="expense.date"
                                      no-title
                                      scrollable
                                      @input="expense.menu = false"
                                      @change="expense.status = (!expense.status) ? 'editing' : expense.status"
                                    />
                                  </v-menu>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="6"
                                  md="4"
                                  lg="2"
                                >
                                  <v-select
                                    v-model="expense.wallet"
                                    :items="getTransactionWallets"
                                    label="Кошелек оплаты"
                                    @change="expense.status = (!expense.status) ? 'editing' : expense.status"
                                  />
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="6"
                                  md="4"
                                  lg="2"
                                >
                                  <v-select
                                    v-model="expense.type"
                                    label="Тип платежа"
                                    :items="getExpenseTypes"
                                    item-text="name"
                                    @change="updateExpense(expense, true)"
                                  />
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="6"
                                  md="4"
                                  lg="2"
                                >
                                  <v-select
                                    v-model="expense.option"
                                    :items="getExpenseOptions(expense.type)"
                                    label="Тип услуги"
                                    @change="expense.status = (!expense.status) ? 'editing' : expense.status"
                                  />
                                </v-col>
                                <v-col>
                                  <v-combobox
                                    v-model="expense.cParty"
                                    label="К/агент"
                                    :items="getCParties"
                                    :rules="[rules.required]"
                                    required
                                    @change="expense.status = (!expense.status) ? 'editing' : expense.status"
                                  />
                                </v-col>
                                <v-col>
                                  <v-select
                                    v-model="expense.cPartyType"
                                    label="Тип к/агента"
                                    :items="cPartyTypes"
                                    @change="updateExpense(expense)"
                                  />
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="6"
                                  md="4"
                                  lg="2"
                                >
                                  <vuetify-money
                                    v-model.number="expense.sum"
                                    label="Сумма"
                                    :options="sumOptions"
                                    :value-when-is-empty=0
                                    :rules="[rules.required]"
                                    required
                                    @change="updateExpense(expense)"
                                  />
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="6"
                                  md="4"
                                  lg="2"
                                >
                                  <vuetify-money
                                    v-model="expense.tax"
                                    label="Налог"
                                    :readonly="true"
                                    :background-color="filled"
                                    :options="sumOptions"
                                  />
                                </v-col>
                                <v-btn
                                  color="red"
                                  dark
                                  absolute
                                  right
                                  small
                                  fab
                                >
                                  <v-icon
                                    @click="removeExpense(expense)"
                                  >
                                    remove
                                  </v-icon>
                                </v-btn>
                              </v-row>
                              <v-btn
                                color="blue"
                                dark
                                absolute
                                bottom
                                right
                                fab
                              >
                                <v-icon
                                  large
                                  @click="addExpense"
                                >
                                  add
                                </v-icon>
                              </v-btn>
                            </v-card-text>
                          </v-card>
                        </v-col>
                        <v-col
                          v-if="editedProject.wallet && editedProject.sum"
                          cols="12"
                          xl="8"
                        >
                          <v-card
                            class="mt-5"
                          >
                            <v-toolbar
                              dark
                              color="green darken-3"
                            >
                              <v-toolbar-title>{{ editedProject.name }}</v-toolbar-title>
                            </v-toolbar>
                            <v-card-text>
                              <v-row>
                                <v-col
                                  cols="6"
                                  md="3"
                                >
                                  Поступления:
                                </v-col>
                                <v-col
                                  cols="6"
                                  md="3"
                                >
                                  {{ editedProject.sum | toCurrency }}
                                </v-col>
                                <v-col
                                  cols="6"
                                  md="3"
                                >
                                  Из них налогов:
                                </v-col>
                                <v-col
                                  cols="6"
                                  md="3"
                                >
                                  {{ getWalletTax | toCurrency }}
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col
                                  cols="6"
                                  md="3"
                                >
                                  Прямые затраты:
                                </v-col>
                                <v-col
                                  cols="6"
                                  md="3"
                                >
                                  {{ getDirectCosts(editedProject) | toCurrency }}
                                </v-col>
                                <v-col
                                  cols="6"
                                  md="3"
                                >
                                  Из них налогов:
                                </v-col>
                                <v-col
                                  cols="6"
                                  md="3"
                                >
                                  {{ getDirectCostsTax(editedProject) | toCurrency }}
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col
                                  cols="6"
                                  md="3"
                                >
                                  Дельта:
                                </v-col>
                                <v-col
                                  cols="6"
                                  md="3"
                                >
                                  {{ getDelta(editedProject) | toCurrency }}
                                </v-col>
                                <v-col
                                  cols="6"
                                  md="3"
                                >
                                  Стоимость вывода:
                                </v-col>
                                <v-col
                                  cols="6"
                                  md="3"
                                >
                                  {{ getWithdrawal(editedProject) | toCurrency }}
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col
                                  cols="6"
                                  md="3"
                                >
                                  Премия директору:
                                </v-col>
                                <v-col
                                  cols="6"
                                  md="3"
                                >
                                  {{ getDelta(editedProject) * editedProject.directorsCut / 100 | toCurrency }}
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col
                                  cols="6"
                                  md="3"
                                >
                                  На операционные расходы:
                                </v-col>
                                <v-col
                                  cols="6"
                                  md="3"
                                >
                                  {{ getOperationalBudget(editedProject) | toCurrency }}
                                </v-col>
                                <v-col
                                  cols="6"
                                  md="3"
                                >
                                  Операционные расходы:
                                </v-col>
                                <v-col
                                  cols="6"
                                  md="3"
                                >
                                  {{ getOperationalCosts(editedProject) | toCurrency }}
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col
                                  cols="6"
                                  md="3"
                                >
                                  <b>Heroin:</b>
                                </v-col>
                                <v-col
                                  cols="6"
                                  md="3"
                                >
                                  {{ getHeroin(editedProject) | toCurrency }}
                                </v-col>
                                <v-col
                                  cols="6"
                                  md="3"
                                >
                                  <b>Рентабельность:</b>
                                </v-col>
                                <v-col
                                  cols="6"
                                  md="3"
                                >
                                  {{ Math.round((getHeroin(editedProject) / editedProject.sum * 100 + Number.EPSILON) * 100) / 100 }}%
                                </v-col>
                              </v-row>
                            </v-card-text>
                          </v-card>
                        </v-col>
                        <v-col
                          v-if="editedProject.wallet && editedProject.sum"
                          cols="12"
                          xl="8"
                        >
                          <v-card
                            class="mt-5"
                          >
                            <v-toolbar
                              dark
                              color="green darken-3"
                            >
                              <v-toolbar-title>Затраты Heroin</v-toolbar-title>
                            </v-toolbar>
                            <v-card-text>
                              <v-row>
                                <v-col
                                  cols="6"
                                  md="2"
                                >
                                  <v-spacer />
                                  <v-text-field
                                    v-model.number="editedProject.common"
                                    label="Общие"
                                    type="number"
                                    suffix="%"
                                    class="heroin-exp ml-auto"
                                  />
                                </v-col>
                                <v-col
                                  cols="6"
                                  md="2"
                                >
                                  <p
                                    class="mt-5"
                                  >
                                    {{ Math.round(((getOperationalBudget(editedProject) - getOperationalCosts(editedProject)) * editedProject.common / 100 + Number.EPSILON) * 100) / 100 | toCurrency }}
                                  </p>
                                </v-col>
                                <v-col
                                  cols="6"
                                  md="2"
                                >
                                  <v-text-field
                                    v-model.number="editedProject.reserve"
                                    label="Резерв"
                                    type="number"
                                    suffix="%"
                                    class="heroin-exp ml-auto"
                                  />
                                </v-col>
                                <v-col
                                  cols="6"
                                  md="2"
                                >
                                  <p
                                    class="mt-5"
                                  >
                                    {{ Math.round(((getOperationalBudget(editedProject) - getOperationalCosts(editedProject)) * editedProject.reserve / 100 + Number.EPSILON) * 100) / 100 | toCurrency }}
                                  </p>
                                </v-col>
                                <v-col
                                  cols="6"
                                  md="2"
                                >
                                  <v-text-field
                                    v-model.number="editedProject.profit"
                                    label="Прибыль"
                                    type="number"
                                    suffix="%"
                                    class="heroin-exp ml-auto"
                                  />
                                </v-col>
                                <v-col
                                  cols="6"
                                  md="2"
                                >
                                  <p
                                    class="mt-5"
                                  >
                                    {{ Math.round(((getOperationalBudget(editedProject) - getOperationalCosts(editedProject)) * editedProject.profit / 100 + Number.EPSILON) * 100) / 100 | toCurrency }}
                                  </p>
                                </v-col>
                              </v-row>
                            </v-card-text>
                          </v-card>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-dialog>
            <v-tab-item
              v-for="business in tabsArray"
              :key="business"
            >
              <v-card flat>
                <v-card-text>
                  <v-row>
                    <v-col>
                      <v-data-table
                        :headers="projectsHeaders"
                        :items="getProjects(business)"
                        :loading="!getPopulated || getStatus.loading"
                        item-key="slug"
                        sort-by="projectName"
                        class="elevation-1"
                      >
                        <template v-slot:top>
                          <v-toolbar
                            flat
                            color="white"
                          >
                            <v-toolbar-title>Проекты</v-toolbar-title>
                          </v-toolbar>
                        </template>
                        <template
                          #item.projectName="{ item }"
                        >
                          {{ item.name }} ({{ item.slug }})
                        </template>
                        <template
                          #item.sum="{ item }"
                        >
                          {{ item.sum | toCurrency }}
                        </template>
                        <template
                          #item.expensesSum="{ item }"
                        >
                          {{ item.sum - item.heroin | toCurrency }}
                        </template>
                        <template
                          #item.displayDirectorsCut="{ item }"
                        >
                          {{ getDirectorsCut(item) | toCurrency }} ({{ item.directorsCut }}%)
                        </template>
                        <template
                          v-slot:item.actions="{ item }"
                        >
                          <v-icon
                            class="mr-2"
                            @click="editProject(item)"
                          >
                            edit
                          </v-icon>
                          <v-icon
                            @click="deleteProject(item)"
                          >
                            delete
                          </v-icon>
                        </template>
                        <template slot="body.append">
                          <tr>
                            <td class="font-weight-bold">
                              Всего:
                            </td>
                            <td class="font-weight-bold">
                              {{ sumValues(getProjects(business), 'sum') | toCurrency }}
                            </td>
                            <td class="font-weight-bold">
                              {{ sumValues(getProjects(business), 'sum') - sumValues(getProjects(business), 'heroin') | toCurrency }}
                            </td>
                            <td class="font-weight-bold">
                              {{ sumValues(getProjects(business), 'heroin') | toCurrency }}
                            </td>
                            <td class="font-weight-bold">
                              {{ getBusinessWideDirectorsCut(getProjects(business)) | toCurrency }}
                            </td>
                            <td class="font-weight-bold" />
                          </tr>
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import firebase from 'firebase'
  import { mapState } from 'vuex'
  import VuetifyMoney from '../../components/VuetifyMoney.vue'
  export default {
    components: {
      VuetifyMoney,
    },
    data () {
      return {
        tabs: null,
        tabsArray: ['Все'],
        dialog: false,
        valid: true,
        projectsHeaders: [
          { text: 'Название (код)', align: 'start', value: 'projectName' },
          { text: 'Сумма по договору (₽)', value: 'sum' },
          { text: 'Расходы (₽)', value: 'expensesSum' },
          { text: 'Heroin (₽)', value: 'heroin' },
          { text: 'Учредитель (%)', value: 'displayDirectorsCut' },
          { text: 'Действия', value: 'actions', sortable: false },
        ],
        datePicker: false,
        widgets: false,
        projects: [],
        projectTypes: this.$store.state.projectTypes,
        cPartyTypes: this.$store.state.cPartyTypes,
        clients: this.$store.state.clients,
        filled: '#eee',
        editedIndex: -1,
        editedExpense: -1,
        editedProject: {
          business: null,
          type: null,
          name: null,
          slug: null,
          client: null,
          new: true,
          director: null,
          directorsCut: 4,
          account: null,
          manager: null,
          sum: null,
          wallet: null,
          dateOfCreation: new Date().toISOString().substr(0, 10),
          dates: [],
          length: 0,
          auto: true,
          payments: [],
          expenses: [],
          heroin: 0,
          common: 60,
          reserve: 20,
          profit: 20,
        },
        defaultProject: {
          business: null,
          type: null,
          name: null,
          slug: null,
          client: null,
          new: true,
          director: null,
          directorsCut: 4,
          account: null,
          manager: null,
          sum: null,
          wallet: null,
          dateOfCreation: new Date().toISOString().substr(0, 10),
          dates: [],
          length: 0,
          auto: true,
          payments: [],
          expenses: [],
          heroin: 0,
          common: 60,
          reserve: 20,
          profit: 20,
        },
        sumOptions: {
          locale: 'ru-RU',
          suffix: ' ₽',
          precision: 2,
          length: 15,
        },
        rules: {
          required: value => !!value || 'Обязательно.',
          min: value => value.length >= 6 || 'Не менее 6 символов',
          slug: value => this.editedIndex > -1 || !(this.getAllProjects.some(e => e.slug === value)) || 'Этот код уже используется в другом проекте',
        },
      }
    },
    computed: {
      ...mapState({
        businesses: 'businesses',
        users: 'users',
      }),
      getStatus () {
        return this.$store.getters.status
      },
      getPopulated () {
        return this.$store.getters.populated
      },
      getUser () {
        return this.$store.getters.user
      },
      getBusinesses () {
        return this.$store.getters.businesses
      },
      getAllProjects () {
        return this.$store.getters.projects
      },
      getUsers () {
        return this.$store.getters.users
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
      getTransactionWallets () {
        return this.$store.getters.transactionWallets
      },
      dateRangeText () {
        if (!this.editedProject.dates[1]) {
          return this.editedProject.dates[0]
        } else {
          const range = this.dateOrdering(this.editedProject.dates)
          return range[0].toLocaleDateString('ru-RU') + ' ~ ' + range[1].toLocaleDateString('ru-RU')
        }
      },
      getAllExpenses () {
        return this.$store.getters.transactionsByDirection('expense')
      },
      getExpenseTypes () {
        return this.$store.getters.transactionTypes('client')
      },
      getWalletTax () {
        const wallet = this.getWallets.find(obj => obj.name === this.editedProject.wallet)
        const sum = this.editedProject.sum
        const tax = (wallet) ? wallet.tax : 0
        return tax * sum
      },
    },
    watch: {
      'editedProject.dates' (val) {
        if (!val[1]) this.editedProject.length = 0
        else {
          const range = this.dateOrdering(val)
          this.editedProject.length = this.monthDiff(range[0], range[1])
          val = range
        }
        if (this.editedProject.auto) this.newPaymentDates()
      },
      'editedProject.sum' (val) {
        if (this.editedProject.auto) this.newPaymentDates()
      },
      'editedProject.auto' (val) {
        if (val) this.newPaymentDates()
      },
    },
    created () {
      this.editedProject.business = this.getBusinesses[0]
      this.editedProject.director = this.getUser.name
      this.defaultProject.business = this.getBusinesses[0]
      this.defaultProject.director = this.getUser.name
      this.tabsArray = this.tabsArray.concat(this.getBusinesses)
    },
    methods: {
      transliterate () {
        if (this.editedIndex === -1) {
          const a = { Ё: 'YO', Й: 'I', Ц: 'TS', У: 'U', К: 'K', Е: 'E', Н: 'N', Г: 'G', Ш: 'SH', Щ: 'SCH', З: 'Z', Х: 'H', Ъ: '', ё: 'yo', й: 'i', ц: 'ts', у: 'u', к: 'k', е: 'e', н: 'n', г: 'g', ш: 'sh', щ: 'sch', з: 'z', х: 'h', ъ: '', Ф: 'F', Ы: 'I', В: 'V', А: 'a', П: 'P', Р: 'R', О: 'O', Л: 'L', Д: 'D', Ж: 'ZH', Э: 'E', ф: 'f', ы: 'i', в: 'v', а: 'a', п: 'p', р: 'r', о: 'o', л: 'l', д: 'd', ж: 'zh', э: 'e', Я: 'Ya', Ч: 'CH', С: 'S', М: 'M', И: 'I', Т: 'T', Ь: '', Б: 'B', Ю: 'YU', я: 'ya', ч: 'ch', с: 's', м: 'm', и: 'i', т: 't', ь: '', б: 'b', ю: 'yu', ' ': '_' }
          this.$nextTick(() => {
            this.editedProject.slug = this.editedProject.name.split('').map(function (char) {
              return a[char] || char
            }).join('').substring(0, 7)
          })
        }
      },
      isNew (e) {
        this.editedProject.new = !this.clients.includes(e)
      },
      updateWallet () {
        this.activeExpenses(this.editedProject).filter(expense => expense.type === 'Прямые затраты').forEach(expense => {
          this.updateExpense(expense)
        })
      },
      monthDiff (d1, d2) {
        let months
        months = (d2.getFullYear() - d1.getFullYear()) * 12
        months -= d1.getMonth()
        months += d2.getMonth()
        return months <= 0 ? 0 : months
      },
      newPaymentDates () {
        if (this.editedProject.length === 0) {
          this.editedProject.payments = [{ num: '1', date: this.editedProject.dates[0], sum: this.editedProject.sum, menu: false }]
        } else {
          const range = this.dateOrdering(this.editedProject.dates)
          this.editedProject.payments = []
          for (let month = 1; month <= this.editedProject.length; month++) {
            this.editedProject.payments.push({ num: month, date: new Date(range[0].setMonth(range[0].getMonth() + 1)).toISOString().substr(0, 10), sum: this.editedProject.sum / this.editedProject.length, menu: false })
          }
        }
      },
      dateOrdering ([date1, date2]) {
        const start = new Date(Math.min.apply(null, [new Date(date1), new Date(date2)]))
        const end = new Date(Math.max.apply(null, [new Date(date1), new Date(date2)]))
        return [start, end]
      },
      addPayment () {
        this.editedProject.payments.push({ num: this.editedProject.payments.length + 1, date: null, sum: null, menu: false })
      },
      removePayment (payment) {
        const index = this.editedProject.payments.indexOf(payment)
        this.editedProject.payments.splice(index, 1)
        this.editedProject.auto = false
      },
      getProjectExpenses (project) {
        return this.$store.getters.projectTransactionsByDirection(project.slug, 'expense')
      },
      activeExpenses (project) {
        return project.expenses.filter(expense => expense.status !== 'removing')
      },
      getExpenseOptions (expenseType) {
        return this.$store.getters.transactionOptions(expenseType)
      },
      addExpense () {
        this.editedProject.expenses.push({
          id: null,
          idN: null,
          slug: this.editedProject.slug,
          num: this.editedProject.expenses.length + 1,
          date: new Date().toISOString().substr(0, 10),
          direction: 'expense',
          type: this.getExpenseTypes[0].name,
          wallet: this.getTransactionWallets[0],
          option: this.getExpenseTypes[0].options[0],
          cParty: null,
          cPartyType: this.cPartyTypes[0],
          tax: 0,
          sum: null,
          account: this.editedProject.account,
          menu: false,
          status: 'new',
        })
      },
      removeExpense (expense) {
        const toRemove = this.editedProject.expenses.indexOf(expense)
        this.editedProject.expenses[toRemove].status = 'removing'
      },
      updateExpense (expense, changeType) {
        this.editedExpense = this.editedProject.expenses.indexOf(expense)
        expense.status = (!expense.status) ? 'editing' : expense.status
        if (changeType) {
          expense.cPartyType = this.cPartyTypes[0]
          expense.option = this.getExpenseOptions(expense.type)[0]
        }
        if (expense.type === 'Прямые затраты') {
          const wallet = this.getWallets.find(obj => obj.name === this.editedProject.wallet)
          const sum = expense.sum
          const tax = (wallet && expense.cPartyType) ? wallet[expense.cPartyType] : 0
          const total = (sum) ? tax * sum : 0
          expense.tax = total
        } else {
          expense.tax = 0
          expense.cPartyType = ''
        }
      },
      getDirectCosts (project) {
        const costs = this.activeExpenses(project).filter(function (expense) {
          return expense.type === 'Прямые затраты'
        })
        return costs.reduce((accumulator, current) => accumulator + current.sum, 0) + this.getDirectCostsTax(project)
      },
      getDirectCostsTax (project) {
        const wallet = this.getWallets.find(obj => {
          return obj.name === project.wallet
        })
        const costs = this.activeExpenses(project).filter(function (expense) {
          return expense.type === 'Прямые затраты'
        })
        let sum = 0
        costs.forEach(expense => {
          sum += expense.sum * wallet[expense.cPartyType]
        })
        return sum
      },
      getDelta (project) {
        return project.sum - this.getWalletTax - this.getDirectCosts(project)
      },
      getWithdrawal (project) {
        const wallet = this.getWallets.find(obj => obj.name === project.wallet)
        return (wallet) ? this.getDelta(project) * wallet.withdrawal : 0
      },
      getOperationalBudget (project) {
        return this.getDelta(project) - this.getWithdrawal(project) - (this.getDelta(project) / 100 * project.directorsCut)
      },
      getOperationalCosts (project) {
        return this.activeExpenses(project).filter(function (expense) {
          return expense.type !== 'Прямые затраты'
        }).reduce((accumulator, current) => accumulator + current.sum, 0)
      },
      getHeroin (project) {
        const heroin = (this.getOperationalBudget(project)) ? Math.round((this.getOperationalBudget(project) - this.getOperationalCosts(project) + Number.EPSILON) * 100) / 100 : 0
        project.heroin = heroin
        return heroin
      },
      getDirectorsCut (project) {
        const wallet = this.getWallets.find(obj => obj.name === project.wallet)
        const costs = this.getAllExpenses.filter(expense => {
          return expense.slug === project.slug && expense.type === 'Прямые затраты'
        })
        let taxes = 0
        costs.forEach(expense => {
          taxes += expense.sum * wallet[expense.cPartyType]
        })
        return (project.sum - ((wallet) ? wallet.tax : 0) * project.sum - costs.reduce((accumulator, current) => accumulator + current.sum, 0) + taxes) * project.directorsCut / 100
      },
      getBusinessWideDirectorsCut (projects) {
        let sum = 0
        projects.forEach(project => {
          sum += this.getDirectorsCut(project)
        })
        return sum
      },
      sumValues (arr, key) {
        return arr.reduce((a, b) => a + (b[key] || 0), 0)
      },
      getProjects (business) {
        if (business === 'Все') {
          return this.getAllProjects
        } else {
          return this.getAllProjects.filter(function (project) {
            return project.business === business
          })
        }
      },
      editProject (project) {
        this.editedIndex = this.getAllProjects.indexOf(project)
        this.editedProject = Object.assign({}, project)
        this.editedProject.expenses = []
        this.editedProject.payments = []
        if (this.getProjectExpenses(project).length > 0) {
          this.getProjectExpenses(project).forEach((expense, i) => {
            this.editedProject.expenses.push(Object.assign({}, expense))
            this.editedProject.expenses[i].num = i + 1
          })
        }
        project.payments.forEach((payment, i) => {
          this.editedProject.payments.push(Object.assign({}, payment))
          this.editedProject.payments[i].num = i + 1
        })
        this.dialog = true
      },
      close () {
        this.$refs.form.resetValidation()
        this.valid = true
        this.dialog = false
        this.$nextTick(() => {
          this.editedProject = Object.assign({}, this.defaultProject)
          this.editedIndex = -1
        })
      },
      save () {
        if (this.$refs.form.validate()) {
          if (this.editedIndex > -1) {
            this.updateProject(this.editedProject)
          } else {
            this.createProject(this.editedProject)
          }
        }
      },
      async createProject (project) {
        this.$store.commit('SET_STATUS', ['new project', true])
        const createProjectFire = firebase.functions().httpsCallable('createProject')
        this.$store.commit('ADD_PROJECT', project)
        if (project.client && this.$store.state.clients.indexOf(project.client) === -1) this.$store.commit('ADD_CLIENT', project.client)
        if (project.director && this.$store.state.users.indexOf(project.director) === -1) this.$store.commit('ADD_USER', project.director)
        if (project.manager && this.$store.state.users.indexOf(project.manager) === -1) this.$store.commit('ADD_USER', project.manager)
        if (project.account && this.$store.state.users.indexOf(project.account) === -1) this.$store.commit('ADD_USER', project.account)
        createProjectFire(project).then(function (resp) {
          // Display success
        })
          .catch(function (error) {
            const code = error.code
            const message = error.message
            // Display error
            alert(code + ' — ' + message)
            location.reload()
          })
        this.close()
      },
      async updateProject (project) {
        this.$store.commit('SET_STATUS', ['editing project', true])
        const updateProjectFire = firebase.functions().httpsCallable('updateProject')
        this.$store.commit('UPDATE_PROJECT', project)
        if (project.client && this.$store.state.clients.indexOf(project.client) === -1) this.$store.commit('ADD_CLIENT', project.client)
        if (project.director && this.$store.state.users.indexOf(project.director) === -1) this.$store.commit('ADD_USER', project.director)
        if (project.manager && this.$store.state.users.indexOf(project.manager) === -1) this.$store.commit('ADD_USER', project.manager)
        if (project.account && this.$store.state.users.indexOf(project.account) === -1) this.$store.commit('ADD_USER', project.account)
        updateProjectFire(project).then(function (resp) {
        })
          .catch(function (error) {
            const code = error.code
            const message = error.message
            alert(code + ' — ' + message)
            location.reload()
          })
        this.close()
      },
      deleteProject (project) {
        if (confirm('Вы уверены, что хотите удалить этот проект?')) {
          const index = this.getAllProjects.indexOf(project)
          this.$store.commit('SET_STATUS', ['removing project', true])
          const deleteProjectFire = firebase.functions().httpsCallable('deleteProject')
          deleteProjectFire(project).then(function (resp) {
          })
            .catch(function (error) {
              const code = error.code
              const message = error.message
              alert(code + ' — ' + message)
              location.reload()
            })
          this.$store.commit('DELETE_PROJECT', index)
        }
      },
    },
  }
</script>

<style>
.v-picker.v-card {
  margin: 0;
  padding: 15px 0 0;
}
.heroin-exp {
  max-width: 100px;
}
.project-expense:not(:last-of-type) {
  border-bottom: 1px solid #333;
}
input[type='number'] {
    -moz-appearance:textfield;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
input[readonly]:not([aria-haspopup]) {
  cursor: not-allowed;
}
</style>
