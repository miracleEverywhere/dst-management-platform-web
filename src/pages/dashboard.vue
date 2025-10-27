<script setup>
import AnalyticsAward from '@/views/dashboard/AnalyticsAward.vue'
import AnalyticsBarCharts from '@/views/dashboard/AnalyticsBarCharts.vue'
import AnalyticsDepositWithdraw from '@/views/dashboard/AnalyticsDepositWithdraw.vue'
import AnalyticsSalesByCountries from '@/views/dashboard/AnalyticsSalesByCountries.vue'
import AnalyticsTotalEarning from '@/views/dashboard/AnalyticsTotalEarning.vue'
import AnalyticsTotalProfitLineCharts from '@/views/dashboard/AnalyticsTotalProfitLineCharts.vue'
import AnalyticsTransactions from '@/views/dashboard/AnalyticsTransactions.vue'
import AnalyticsUserTable from '@/views/dashboard/AnalyticsUserTable.vue'
import AnalyticsWeeklyOverview from '@/views/dashboard/AnalyticsWeeklyOverview.vue'
import CardStatisticsVertical from '@core/components/cards/CardStatisticsVertical.vue'

const totalProfit = {
  title: 'Total Profit',
  color: 'secondary',
  icon: 'ri-pie-chart-2-line',
  stats: '$25.6k',
  change: 42,
  subtitle: 'Weekly Project',
}

const newProject = {
  title: 'New Project',
  color: 'primary',
  icon: 'ri-file-word-2-line',
  stats: '862',
  change: -18,
  subtitle: 'Yearly Project',
}
</script>

<template>
  <v-row class="match-height">
    <v-col
      cols="12"
      md="4"
    >
      <analytics-award />
    </v-col>

    <v-col
      cols="12"
      md="8"
    >
      <analytics-transactions />
    </v-col>

    <v-col
      cols="12"
      md="4"
    >
      <analytics-weekly-overview />
    </v-col>

    <v-col
      cols="12"
      md="4"
    >
      <analytics-total-earning />
    </v-col>

    <v-col
      cols="12"
      md="4"
    >
      <v-row class="match-height">
        <v-col
          cols="12"
          sm="6"
        >
          <analytics-total-profit-line-charts />
        </v-col>

        <v-col
          cols="12"
          sm="6"
        >
          <card-statistics-vertical v-bind="totalProfit" />
        </v-col>

        <v-col
          cols="12"
          sm="6"
        >
          <card-statistics-vertical v-bind="newProject" />
        </v-col>

        <v-col
          cols="12"
          sm="6"
        >
          <analytics-bar-charts />
        </v-col>
      </v-row>
    </v-col>

    <v-col
      cols="12"
      md="4"
    >
      <analytics-sales-by-countries />
    </v-col>

    <v-col
      cols="12"
      md="8"
    >
      <analytics-deposit-withdraw />
    </v-col>

    <v-col cols="12">
      <analytics-user-table />
    </v-col>
  </v-row>
</template>
