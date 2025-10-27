<script setup>
import DemoSimpleTableBasics from '@/views/pages/tables/DemoSimpleTableBasics.vue'
import DemoSimpleTableDensity from '@/views/pages/tables/DemoSimpleTableDensity.vue'
import DemoSimpleTableFixedHeader from '@/views/pages/tables/DemoSimpleTableFixedHeader.vue'
import DemoSimpleTableHeight from '@/views/pages/tables/DemoSimpleTableHeight.vue'
import DemoSimpleTableTheme from '@/views/pages/tables/DemoSimpleTableTheme.vue'
</script>

<template>
  <v-row>
    <v-col cols="12">
      <v-card title="Basic">
        <demo-simple-table-basics />
      </v-card>
    </v-col>

    <v-col cols="12">
      <v-card title="Theme">
        <v-card-text>
          use <code>theme</code> prop to switch table to the dark theme.
        </v-card-text>
        <demo-simple-table-theme />
      </v-card>
    </v-col>

    <v-col cols="12">
      <v-card title="Density">
        <v-card-text>
          You can show a dense version of the table by using the <code>density</code> prop.
        </v-card-text>
        <demo-simple-table-density />
      </v-card>
    </v-col>

    <v-col cols="12">
      <v-card title="Height">
        <v-card-text>
          You can set the height of the table by using the <code>height</code> prop.
        </v-card-text>
        <demo-simple-table-height />
      </v-card>
    </v-col>

    <v-col cols="12">
      <v-card title="Fixed Header">
        <v-card-text>
          You can fix the header of table by using the <code>fixed-header</code> prop.
        </v-card-text>
        <demo-simple-table-fixed-header />
      </v-card>
    </v-col>
  </v-row>
</template>
