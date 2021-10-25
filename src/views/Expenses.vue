<template>
  <v-container
    id="expenses"
    fluid
    tag="section"
  >
    <v-data-table
      :headers="headers"
      :items="innerExpenses"
      :loading="!getPopulated || getStatus.loading"
      item-key="id"
      sort-by="id"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar
          flat
          color="white"
        >
          <v-toolbar-title>
            Затраты Heroin
          </v-toolbar-title>
        </v-toolbar>
      </template>
      <template v-slot:header>
        <thead>
          <tr>
            <th
              class="fixed"
              colspan="15"
            >
              HeroInMarketing {{ year }}
            </th>
          </tr>
        </thead>
      </template>
      <template
        #item.sum="{ item }"
      >
        {{ item.sum | toCurrency }}
      </template>
      <template
        #item.expenses="{ item, header }"
      >
        {{ getExpenses(header.month, item.type, item.cParty) | toCurrency }}
      </template>
      <template slot="body.append">
        <tr>
          <td class="font-weight-bold fixed">
            Итого:
          </td>
          <td
            class="fixed"
          />
          <td class="font-weight-bold fixed text-center">
            {{ getExpenses() | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getExpenses("01") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getExpenses("02") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getExpenses("03") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getExpenses("04") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getExpenses("05") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getExpenses("06") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getExpenses("07") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getExpenses("08") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getExpenses("09") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getExpenses("10") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getExpenses("11") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getExpenses("12") | toCurrency }}
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        year: '2021',
        headers: [
          { text: 'Тип услуги', value: 'type', align: 'center fixed', width: '110px', class: 'fixed', hide: false },
          { text: 'к/Агент', value: 'cParty', align: 'center fixed', width: '110px', class: 'fixed', hide: false },
          { text: 'Сумма за год', value: 'sum', align: 'center fixed', width: '110px', class: 'fixed', hide: false },
          { text: 'Январь', value: 'expenses', month: '01', hide: false },
          { text: 'Февраль', value: 'expenses', month: '02', hide: false },
          { text: 'Март', value: 'expenses', month: '03', hide: false },
          { text: 'Апрель', value: 'expenses', month: '04', hide: false },
          { text: 'Май', value: 'expenses', month: '05', hide: false },
          { text: 'Июнь', value: 'expenses', month: '06', hide: false },
          { text: 'Июль', value: 'expenses', month: '07', hide: false },
          { text: 'Август', value: 'expenses', month: '08', hide: false },
          { text: 'Сентябрь', value: 'expenses', month: '09', hide: false },
          { text: 'Октябрь', value: 'expenses', month: '10', hide: false },
          { text: 'Ноябрь', value: 'expenses', month: '11', hide: false },
          { text: 'Декабрь', value: 'expenses', month: '12', hide: false },
        ],
      }
    },
    computed: {
      getStatus () {
        return this.$store.getters.status
      },
      getPopulated () {
        return this.$store.getters.populated
      },
      getCParties () {
        return this.$store.getters.cParties
      },
      getThisYearExpenses () {
        return this.$store.getters.projectTransactionsByDirection('Heroin', 'expense').filter(expense => expense.date.split('-')[0] === this.year)
      },
      innerExpenses () {
        var list = []
        this.getThisYearExpenses.forEach(expense => {
          const index = list.findIndex(x => x.cParty === expense.cParty && x.type === expense.type)
          if (index === -1) list.push(expense)
          else list[index].sum += expense.sum
        })
        return list
      },
    },
    methods: {
      getExpenses (month, type, cParty) {
        let expenses = this.getThisYearExpenses
        if (month) expenses = expenses.filter(expense => expense.date.split('-')[1] === month)
        if (type && cParty) expenses = expenses.filter(expense => (expense.type === type && expense.cParty === cParty))
        return (expenses.length > 0) ? expenses.reduce((accumulator, current) => accumulator + current.sum, 0) : 0
      },
      sumValues (arr, key) {
        return arr.reduce((a, b) => a + (b[key] || 0), 0)
      },
    },
  }
</script>

<style>

table > tbody > tr > td.fixed:first-child,
table > thead > tr > th.fixed:first-child,
table > tbody > tr > td.fixed:nth-child(2),
table > thead > tr > th.fixed:nth-child(2),
table > tbody > tr > td.fixed:nth-child(3),
table > thead > tr > th.fixed:nth-child(3),
table > tbody > tr > td.fixed:nth-child(4),
table > thead > tr > th.fixed:nth-child(4),
table > tbody > tr > td.fixed:nth-child(5),
table > thead > tr > th.fixed:nth-child(5),
table > tbody > tr > td.fixed:nth-child(6),
table > thead > tr > th.fixed:nth-child(6),
table > tbody > tr > td.fixed:nth-child(7),
table > thead > tr > th.fixed:nth-child(7) {
  position: sticky !important;
  position: -webkit-sticky !important;
  left: 0;
  z-index: 4;
  background: white;
}
table > tbody > tr > td.fixed:nth-child(2),
table > thead > tr > th.fixed:nth-child(2) {
  left: 110px;
}
table > tbody > tr > td.fixed:nth-child(3),
table > thead > tr > th.fixed:nth-child(3) {
  left: 200px;
}
table > tbody > tr > td.fixed:nth-child(4),
table > thead > tr > th.fixed:nth-child(4) {
  left: 290px;
}
table > tbody > tr > td.fixed:nth-child(5),
table > thead > tr > th.fixed:nth-child(5) {
  left: 400px;
}
table > tbody > tr > td.fixed:nth-child(6),
table > thead > tr > th.fixed:nth-child(6) {
  left: 500px;
}
table > tbody > tr > td.fixed:nth-child(7),
table > thead > tr > th.fixed:nth-child(7) {
  left: 600px;
}

table > thead > tr > th.fixed:first-child,
table > thead > tr > th.fixed:nth-child(2),
table > thead > tr > th.fixed:nth-child(3),
table > thead > tr > th.fixed:nth-child(4),
table > thead > tr > th.fixed:nth-child(5),
table > thead > tr > th.fixed:nth-child(6),
table > thead > tr > th.fixed:nth-child(7) {
  z-index: 5;
}</style>
