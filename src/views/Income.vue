<template>
  <v-container
    id="income"
    fluid
    tag="section"
  >
    <v-data-table
      :headers="computedHeaders"
      :items="getThisYearProjects"
      :loading="!getPopulated || getStatus.loading"
      item-key="slug"
      sort-by="dateOfCreation"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar
          flat
          color="white"
        >
          <v-toolbar-title>
            Поступления
          </v-toolbar-title>
        </v-toolbar>
      </template>
      <template
        #item.sum="{ item }"
      >
        {{ item.sum | toCurrency }}
      </template>
      <template
        #item.payment="{ item, header }"
      >
        {{ getPaymentsSum(item, header.type, year, header.month) | toCurrency }}
      </template>
      <template
        #item.profitability="{ item, header }"
      >
        {{ getPaymentsSum(item, 'made', year, header.month) - getExpenses(item.slug, header.month) | toCurrency }}
      </template>
      <template v-slot:header>
        <thead>
          <tr>
            <th
              class="fixed"
              colspan="7"
            >
              HeroInMarketing {{ year }}
            </th>
            <th
              v-if="!headers[7].hide || !headers[30].hide"
              colspan="3"
            >
              Январь
            </th>
            <th
              v-if="!headers[9].hide || !headers[30].hide"
              colspan="3"
            >
              Февраль
            </th>
            <th
              v-if="!headers[11].hide || !headers[30].hide"
              colspan="3"
            >
              Март
            </th>
            <th
              v-if="!headers[13].hide || !headers[30].hide"
              colspan="3"
            >
              Апрель
            </th>
            <th
              v-if="!headers[15].hide || !headers[30].hide"
              colspan="3"
            >
              Май
            </th>
            <th
              v-if="!headers[17].hide || !headers[30].hide"
              colspan="3"
            >
              Июнь
            </th>
            <th
              v-if="!headers[19].hide || !headers[30].hide"
              colspan="3"
            >
              Июль
            </th>
            <th
              v-if="!headers[21].hide || !headers[30].hide"
              colspan="3"
            >
              Август
            </th>
            <th
              v-if="!headers[23].hide || !headers[30].hide"
              colspan="3"
            >
              Сентябрь
            </th>
            <th
              v-if="!headers[25].hide || !headers[30].hide"
              colspan="3"
            >
              Октябрь
            </th>
            <th
              v-if="!headers[27].hide || !headers[30].hide"
              colspan="3"
            >
              Ноябрь
            </th>
            <th
              v-if="!headers[29].hide || !headers[30].hide"
              colspan="3"
            >
              Декабрь
            </th>
          </tr>
        </thead>
      </template>
      <template slot="body.append">
        <tr>
          <td class="font-weight-bold fixed">
            Итого:
          </td>
          <td
            class="fixed"
          />
          <td
            class="fixed"
          />
          <td class="font-weight-bold fixed text-center">
            {{ sumValues(getThisYearProjects, "sum") | toCurrency }}
          </td>
          <td class="font-weight-bold fixed text-center">
            {{ getAllProjectsPaymentsSum("planned", year) | toCurrency }}
          </td>
          <td class="font-weight-bold fixed text-center">
            {{ getAllProjectsPaymentsSum("made", year) | toCurrency }}
          </td>
          <td class="font-weight-bold fixed" />
          <td class="font-weight-bold">
            {{ getAllProjectsPaymentsSum("planned", year, "01") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getAllProjectsPaymentsSum("made", year, "01") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getAllProjectsMonthRent("01") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getAllProjectsPaymentsSum("planned", year, "02") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getAllProjectsPaymentsSum("made", year, "02") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getAllProjectsMonthRent("02") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getAllProjectsPaymentsSum("planned", year, "03") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getAllProjectsPaymentsSum("made", year, "03") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getAllProjectsMonthRent("03") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getAllProjectsPaymentsSum("planned", year, "04") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getAllProjectsPaymentsSum("made", year, "04") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getAllProjectsMonthRent("04") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getAllProjectsPaymentsSum("planned", year, "05") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getAllProjectsPaymentsSum("made", year, "05") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getAllProjectsMonthRent("05") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getAllProjectsPaymentsSum("planned", year, "06") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getAllProjectsPaymentsSum("made", year, "06") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getAllProjectsMonthRent("06") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getAllProjectsPaymentsSum("planned", year, "07") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getAllProjectsPaymentsSum("made", year, "07") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getAllProjectsMonthRent("07") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getAllProjectsPaymentsSum("planned", year, "08") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getAllProjectsPaymentsSum("made", year, "08") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getAllProjectsMonthRent("08") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getAllProjectsPaymentsSum("planned", year, "09") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getAllProjectsPaymentsSum("made", year, "09") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getAllProjectsMonthRent("09") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getAllProjectsPaymentsSum("planned", year, "10") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getAllProjectsPaymentsSum("made", year, "10") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getAllProjectsMonthRent("10") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getAllProjectsPaymentsSum("planned", year, "11") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getAllProjectsPaymentsSum("made", year, "11") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getAllProjectsMonthRent("11") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getAllProjectsPaymentsSum("planned", year, "12") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getAllProjectsPaymentsSum("made", year, "12") | toCurrency }}
          </td>
          <td class="font-weight-bold">
            {{ getAllProjectsMonthRent("12") | toCurrency }}
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
          { text: 'Клиент', value: 'client', align: 'center fixed', width: '110px', class: 'fixed', hide: false },
          { text: 'Тип проекта', value: 'type', align: 'center fixed', width: '90px', class: 'fixed', hide: false },
          { text: 'Проект', value: 'slug', align: 'center fixed', width: '90px', class: 'fixed', hide: false },
          { text: 'Сумма по договору (руб.)', value: 'sum', align: 'center fixed', width: '110px', class: 'fixed', hide: false },
          { text: 'План Оплата', value: 'payment', type: 'planned', month: '', align: 'center fixed', width: '100px', class: 'fixed', hide: false },
          { text: 'Факт Оплата', value: 'payment', type: 'made', month: '', align: 'center fixed', width: '100px', class: 'fixed made', hide: false },
          { text: 'Налог', value: 'tax', align: 'center fixed', width: '100px', class: 'fixed', hide: false },
          { text: 'План оплата', value: 'payment', type: 'planned', month: '01', hide: false },
          { text: 'Факт оплата', value: 'payment', type: 'made', month: '01', hide: false },
          { text: 'Рентабельность', value: 'profitability', month: '01', hide: false },
          { text: 'План оплата', value: 'payment', type: 'planned', month: '02', hide: false },
          { text: 'Факт оплата', value: 'payment', type: 'made', month: '02', hide: false },
          { text: 'Рентабельность', value: 'profitability', month: '02', hide: false },
          { text: 'План оплата', value: 'payment', type: 'planned', month: '03', hide: false },
          { text: 'Факт оплата', value: 'payment', type: 'made', month: '03', hide: false },
          { text: 'Рентабельность', value: 'profitability', month: '03', hide: false },
          { text: 'План оплата', value: 'payment', type: 'planned', month: '04', hide: false },
          { text: 'Факт оплата', value: 'payment', type: 'made', month: '04', hide: false },
          { text: 'Рентабельность', value: 'profitability', month: '04', hide: false },
          { text: 'План оплата', value: 'payment', type: 'planned', month: '05', hide: false },
          { text: 'Факт оплата', value: 'payment', type: 'made', month: '05', hide: false },
          { text: 'Рентабельность', value: 'profitability', month: '05', hide: false },
          { text: 'План оплата', value: 'payment', type: 'planned', month: '06', hide: false },
          { text: 'Факт оплата', value: 'payment', type: 'made', month: '06', hide: false },
          { text: 'Рентабельность', value: 'profitability', month: '06', hide: false },
          { text: 'План оплата', value: 'payment', type: 'planned', month: '07', hide: false },
          { text: 'Факт оплата', value: 'payment', type: 'made', month: '07', hide: false },
          { text: 'Рентабельность', value: 'profitability', month: '07', hide: false },
          { text: 'План оплата', value: 'payment', type: 'planned', month: '08', hide: false },
          { text: 'Факт оплата', value: 'payment', type: 'made', month: '08', hide: false },
          { text: 'Рентабельность', value: 'profitability', month: '08', hide: false },
          { text: 'План оплата', value: 'payment', type: 'planned', month: '09', hide: false },
          { text: 'Факт оплата', value: 'payment', type: 'made', month: '09', hide: false },
          { text: 'Рентабельность', value: 'profitability', month: '09', hide: false },
          { text: 'План оплата', value: 'payment', type: 'planned', month: '10', hide: false },
          { text: 'Факт оплата', value: 'payment', type: 'made', month: '10', hide: false },
          { text: 'Рентабельность', value: 'profitability', month: '10', hide: false },
          { text: 'План оплата', value: 'payment', type: 'planned', month: '11', hide: false },
          { text: 'Факт оплата', value: 'payment', type: 'made', month: '11', hide: false },
          { text: 'Рентабельность', value: 'profitability', month: '11', hide: false },
          { text: 'План оплата', value: 'payment', type: 'planned', month: '12', hide: false },
          { text: 'Факт оплата', value: 'payment', type: 'made', month: '12', hide: false },
          { text: 'Рентабельность', value: 'profitability', month: '12', hide: false },
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
      getThisYearProjects () {
        return this.$store.getters.projects.filter(project => (project.dates[0].split('-')[0] === this.year || (project.dates[0].split('-')[0] <= this.year && project.dates[1].split('-')[0] >= this.year)))
      },
      getAllPayments () {
        return this.$store.getters.transactionsByDirection('receipt')
      },
      computedHeaders () {
        return (this.getPopulated) ? this.headers.filter(h => !h.hide) : []
      },
    },
    methods: {
      getExpenses (slug, month) {
        const monthExpenses = this.$store.getters.projectTransactionsByDirection(slug, 'expense').filter(expense => (expense.date.split('-')[1] === month && expense.date.split('-')[0] === this.year))
        return (monthExpenses.length > 0) ? monthExpenses.reduce((accumulator, current) => accumulator + current.sum, 0) : 0
      },
      getPaymentsSum (project, type, year, month) {
        let payments = project.payments
        switch (type) {
          case 'planned':
            if (year) {
              payments = payments.filter(payment => payment.date.split('-')[0] === year)
            }
            if (month) {
              payments = payments.filter(payment => payment.date.split('-')[1] === month)
            } return (payments.length > 0) ? payments.reduce((accumulator, current) => accumulator + current.sum, 0) : 0
          case 'made':
            if (year) {
              payments = this.getAllPayments.filter(payment => payment.slug === project.slug && payment.date.split('-')[0] === year)
            }
            if (month) {
              payments = this.getAllPayments.filter(payment => payment.slug === project.slug && payment.date.split('-')[1] === month)
            }
            return (payments.length > 0) ? payments.reduce((accumulator, current) => accumulator + (current.sum || 0), 0) : 0
          default:

            break
        }
      },
      getAllProjectsPaymentsSum (type, year, month) {
        let sum = 0
        this.getThisYearProjects.forEach(project => {
          sum += this.getPaymentsSum(project, type, year, month)
        })
        return sum
      },
      getAllProjectsMonthRent (month) {
        let sum = this.getAllProjectsPaymentsSum('made', this.year, month)
        this.getThisYearProjects.forEach(project => {
          sum -= this.getExpenses(project.slug, month)
        })
        return sum
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
