import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
import { auth } from '@/plugins/firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    status: { name: 'fresh', loading: true },
    populated: false,
    drawer: null,
    user: null,
    taxes: [],
    wallets: [],
    projects: [],
    transactions: [],
    users: [],
    employees: [],
    clients: [],
    cParties: [],
    businesses: ['Heroin', 'Livestream', 'Zamper'],
    transactionTypes: [
      { name: 'Прямые затраты', domain: 'client', options: ['Digital-реклама', 'Web-разработка', 'PR-размещения', 'Сервисы', 'Social размещения'] },
      { name: 'Cубподряд', domain: 'client', options: ['Дизайн', 'Digital', 'Копирайт', 'SMM', 'PR', 'Event', 'Web', 'Call-center', 'Video', 'Social размещения'] },
      { name: 'Общие', domain: 'client', options: ['Sales bonus', 'Процент кредита'] },
      { name: 'Налоги', domain: 'company', options: ['НДС', 'Прибыль', 'Зарплата', 'Страховые взносы', 'Иные налоги'] },
      { name: 'Зарплата', domain: 'company', options: ['ЗП', 'ЗП Бонус'] },
      { name: 'BDM', domain: 'company', options: ['Представительские', 'Промо', 'Реклама'] },
      { name: 'Сервисы', domain: 'company', options: ['Monday', 'HH', 'Zadarma', 'Finolog', 'Unisender', 'Xocтинг', 'Энвато элементс', 'Grintern', 'Mockap', 'Чердак', 'Google'] },
      { name: 'Аренда', domain: 'company', options: ['Аренда офис', 'Уборка офиса', 'Товары для офиса'] },
      { name: 'Общие', domain: 'company', options: ['Канц. товары', 'Интернет', 'Еда', 'Курьер', 'Корпоративные'] },
      { name: 'King', domain: 'company', options: ['Снятие'] },
    ],
    cPartyTypes: ['НДС', 'УСН', 'ИП', 'KING'],
    projectTypes: ['Web', 'Дизайн', 'Digital', 'PR', 'Social', 'Event', 'SMM', 'Support 360'],
    transactionWallets: ['King', 'РМС', 'ИП Балашов', 'Corp.card', 'Оля П.', 'ИП налоги', 'РМС налоги'],
  },
  getters: {
    status: (state) => {
      return state.status
    },
    populated: (state) => {
      return state.populated
    },
    businesses: (state) => {
      return state.businesses
    },
    projects: (state) => {
      return state.projects
    },
    user: (state) => {
      return state.user
    },
    users: (state) => {
      return state.users
    },
    employees: (state) => {
      return state.employees
    },
    clients: (state) => {
      return state.clients
    },
    taxes: (state) => {
      return state.taxes
    },
    wallets: (state) => {
      return state.wallets
    },
    cParties: (state) => {
      return state.cParties
    },
    transactionWallets: (state) => {
      return state.transactionWallets
    },
    projectTransactionsByDirection: (state) => (slug, direction) => {
      return state.transactions.filter(obj => {
        return obj.slug === slug && obj.direction === direction
      })
    },
    transactionsByDirection: (state) => (direction) => {
      return state.transactions.filter(obj => {
        return obj.direction === direction
      })
    },
    transactions: (state) => {
      return state.transactions
    },
    transactionTypes: (state) => (slug) => {
      return (slug === 'Heroin') ? state.transactionTypes.filter(type => type.domain === 'company') : state.transactionTypes.filter(type => type.domain === 'client')
    },
    transactionOptions: (state) => (typeName) => {
      return (typeName) ? state.transactionTypes.find(type => type.name === typeName).options : state.transactionTypes[0].options
    },
  },
  mutations: {
    SET_STATUS: (state, [name, loading]) => {
      state.status = { name: name, loading: loading }
      if (name === 'transactions synchronized') state.populated = true
    },
    SET_DRAWER: (state, payload) => {
      state.drawer = payload
    },
    SET_USER: (state, [account, name]) => {
      state.user = account
      if (state.user !== '') state.user.name = name
    },
    ADD_TAX: (state, tax) => {
      state.taxes.push(tax)
    },
    UPDATE_TAX: (state, [tax, index]) => {
      Object.assign(state.taxes[index], tax)
    },
    DELETE_TAX: (state, name) => {
      state.taxes = state.taxes.filter(tax => tax.name !== name)
    },
    ADD_WALLET: (state, wallet) => {
      state.wallets.push(wallet)
    },
    UPDATE_WALLET: (state, [wallet, index]) => {
      Object.assign(state.wallets[index], wallet)
    },
    DELETE_WALLET: (state, name) => {
      state.wallets = state.wallets.filter(wallet => wallet.name !== name)
    },
    ADD_PROJECT: (state, project) => {
      state.projects.push(project)
      if (project.expenses.length === 0) {
        state.status.loading = false
        state.status.name = 'projects synchronized'
      }
    },
    DELETE_PROJECT: (state, index) => {
      let haveExpenses = false
      state.transactions.forEach((transaction, i) => {
        if (transaction.slug === state.projects[index].slug) {
          haveExpenses = true
          state.transactions.splice(i, 1)
        }
      })
      state.projects.splice(index, 1)
      if (!haveExpenses) {
        state.status.loading = false
        state.status.name = 'projects synchronized'
      }
    },
    UPDATE_PROJECT: (state, project) => {
      Object.assign(state.projects.find(obj => obj.slug === project.slug), project)
      if (!project.expenses.find(expense => expense.status)) {
        state.status.loading = false
        state.status.name = 'projects synchronized'
      }
    },
    UPDATE_PROJECTS_SUMS: (state, [heroin, index]) => {
      state.projects[index].heroin = heroin
    },
    ADD_CLIENT: (state, client) => {
      state.clients.push(client)
    },
    ADD_USER: (state, user) => {
      state.users.push(user)
    },
    ADD_EMPLOYEE: (state, employee) => {
      state.employees.push(employee)
    },
    UPDATE_EMPLOYEE: (state, [employee, index]) => {
      Object.assign(state.employees[index], employee)
    },
    DELETE_EMPLOYEE: (state, name) => {
      state.employees = state.employees.filter(employee => employee.name !== name)
    },
    ADD_CPARTY: (state, cParty) => {
      state.cParties.push(cParty)
    },
    ADD_TRANSACTION: (state, transaction) => {
      state.transactions.push(transaction)
    },
    UPDATE_TRANSACTION: (state, transaction) => {
      Object.assign(state.transactions.find(obj => {
        return obj.id === transaction.id
      }), transaction)
    },
    DELETE_TRANSACTION: (state, id) => {
      const index = state.transactions.indexOf(state.transactions.find(obj => {
        return obj.id === id
      }))
      if (index > -1) state.transactions.splice(index, 1)
    },
  },
  actions: {
    async signIn ({ commit, dispatch }, account) {
      commit('SET_STATUS', ['signing in', true])
      // Login the user
      await auth.signInWithEmailAndPassword(account.email, account.password)
      const user = auth.currentUser
      await user.getIdTokenResult().then((idTokenResult) => {
        const claims = idTokenResult.claims
        commit('SET_USER', [claims, user.displayName])
        commit('SET_STATUS', ['authorised', true])
      })
        .catch((error) => {
          alert(error)
        })
      await dispatch('populate')
    },

    async populate ({ commit, dispatch, state }) {
      firebase
        .firestore()
        .collection('taxes')
        .onSnapshot((snapshot) => {
          commit('SET_STATUS', ['synchronizing taxes', true])
          snapshot.docChanges().forEach(change => {
            var tax = change.doc.data()
            if (change.type === 'added') {
              commit('ADD_TAX', tax)
            }
            if (change.type === 'modified') {
              state.taxes.some((tax, i) => {
                if (tax.name === change.doc.data().name) {
                  commit('UPDATE_TAX', [change.doc.data(), i])
                }
                return tax.name === change.doc.data().name
              })
            }
            if (change.type === 'removed') {
              commit('DELETE_TAX', state.taxes.indexOf(change.doc.data()))
            }
          })
          commit('SET_STATUS', ['taxes synchronized', false])
        })
      firebase
        .firestore()
        .collection('wallets')
        .onSnapshot((snapshot) => {
          commit('SET_STATUS', ['synchronizing wallets', true])
          snapshot.docChanges().forEach(change => {
            var wallet = change.doc.data()
            if (change.type === 'added') {
              commit('ADD_WALLET', wallet)
            }
            if (change.type === 'modified') {
              state.wallets.some((wallet, i) => {
                if (wallet.name === change.doc.data().name) {
                  commit('UPDATE_WALLET', [change.doc.data(), i])
                }
                return wallet.name === change.doc.data().name
              })
            }
            if (change.type === 'removed') {
              commit('DELETE_WALLET', change.doc.data().name)
            }
          })
          commit('SET_STATUS', ['wallets synchronized', false])
        })
        firebase
        .firestore()
        .collection('employees')
        .onSnapshot((snapshot) => {
          commit('SET_STATUS', ['synchronizing employees', true])
          snapshot.docChanges().forEach(change => {
            var employee = change.doc.data()
            if (change.type === 'added') {
              commit('ADD_EMPLOYEE', employee)
            }
            if (change.type === 'modified') {
              state.employees.some((employee, i) => {
                if (employee.name === change.doc.data().employee) {
                  commit('UPDATE_EMPLOYEE', [change.doc.data(), i])
                }
                return employee.name === change.doc.data().employee
              })
            }
            if (change.type === 'removed') {
              commit('DELETE_EMPLOYEE', state.employees.indexOf(change.doc.data()))
            }
          })
          commit('SET_STATUS', ['employees synchronized', false])
        })
      await firebase
        .firestore()
        .collection('projects')
        .get()
        .then(snap => {
          commit('SET_STATUS', ['synchronizing projects', true])
          var clients = []
          var users = []
          snap.forEach(doc => {
            const project = doc.data()
            commit('ADD_PROJECT', project)
            if (project.client && clients.indexOf(project.client) === -1) {
              clients.push(project.client)
              commit('ADD_CLIENT', project.client)
            }
            if (project.director && users.indexOf(project.director) === -1) {
              users.push(project.director)
              commit('ADD_USER', project.director)
            }
            if (project.manager && users.indexOf(project.manager) === -1) {
              users.push(project.manager)
              commit('ADD_USER', project.manager)
            }
            if (project.account && users.indexOf(project.account) === -1) {
              users.push(project.account)
              commit('ADD_USER', project.account)
            }
          })
          commit('SET_STATUS', ['projects synchronised', false])
        })
      firebase.firestore().collection('transactions').onSnapshot((snapshot) => {
        commit('SET_STATUS', ['synchronizing transactions', true])
        var cParties = []
        var projects = []
        snapshot.docChanges().forEach(change => {
          var transaction = change.doc.data()
          if (change.type === 'added' && change.doc.id !== 'index') {
            transaction.id = change.doc.id
            transaction.status = false
            commit('ADD_TRANSACTION', transaction)
            if (transaction.slug && projects.indexOf(transaction.slug) === -1) projects.push(transaction.slug)
            if (transaction.cParty && cParties.indexOf(transaction.cParty) === -1) {
              cParties.push(transaction.cParty)
              commit('ADD_CPARTY', transaction.cParty)
            }
          }
          if (change.type === 'modified' && change.doc.id !== 'index') {
            transaction.status = false
            commit('UPDATE_TRANSACTION', transaction)
            if (transaction.slug && projects.indexOf(transaction.slug) === -1) projects.push(transaction.slug)
            if (transaction.cParty && cParties.indexOf(transaction.cParty) === -1) {
              cParties.push(transaction.cParty)
              commit('ADD_CPARTY', transaction.cParty)
            }
          }
          if (change.type === 'removed') {
            commit('DELETE_TRANSACTION', change.doc.id)
            if (transaction.slug && projects.indexOf(transaction.slug) === -1) projects.push(transaction.slug)
          }
        })
        dispatch('updateProjectsSums', projects)
        commit('SET_STATUS', ['transactions synchronized', false])
      })
    },

    async signOut ({ commit }) {
      auth.signOut()
      commit('SET_USER', ['', ''])
    },

    // Updates only accounts for expenses and projects 'sum' property. Recieps are purely decorative,
    updateProjectsSums ({ commit, state }, projects) {
      projects.forEach(slug => {
        const project = state.projects.find(obj => obj.slug === slug)
        const index = state.projects.indexOf(project)
        if (index > -1) {
          const transactions = state.transactions.filter(obj => obj.slug === slug && obj.direction === 'expense')
          if (transactions.length > 0) {
            const tax = state.taxes.find(obj => obj.name === project.tax)
            const plain = (tax) ? tax.plain : 0
            const directExpenses = transactions.filter(expense => expense.type === 'Прямые затраты')
            let directCosts = 0
            if (directExpenses.length > 0) {
              let directCostsTaxes = 0
              directExpenses.forEach(expense => {
                directCostsTaxes += expense.sum * tax[expense.cPartyType]
              })
              directCosts = directExpenses.reduce((accumulator, current) => accumulator + current.sum, 0) + directCostsTaxes
            }
            const delta = project.sum - plain * project.sum - directCosts
            const withdrawal = (tax) ? delta * tax.withdrawal : 0
            const operationalCosts = transactions.filter(expense => expense.type !== 'Прямые затраты').reduce((accumulator, current) => accumulator + current.sum, 0)
            const operationalBudget = delta - withdrawal - (delta / 100 * project.directorsCut)
            const heroin = (operationalCosts) ? Math.round((operationalBudget - operationalCosts + Number.EPSILON) * 100) / 100 : Math.round((operationalBudget + Number.EPSILON) * 100) / 100
            commit('UPDATE_PROJECTS_SUMS', [heroin, index])
          }
        }
      })
    },
  },
})
