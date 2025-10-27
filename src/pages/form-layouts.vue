<script setup>
import DemoFormLayoutHorizontalForm from '@/views/pages/form-layouts/DemoFormLayoutHorizontalForm.vue'
import DemoFormLayoutHorizontalFormWithIcons from '@/views/pages/form-layouts/DemoFormLayoutHorizontalFormWithIcons.vue'
import DemoFormLayoutMultipleColumn from '@/views/pages/form-layouts/DemoFormLayoutMultipleColumn.vue'
import DemoFormLayoutVerticalForm from '@/views/pages/form-layouts/DemoFormLayoutVerticalForm.vue'
import DemoFormLayoutVerticalFormWithIcons from '@/views/pages/form-layouts/DemoFormLayoutVerticalFormWithIcons.vue'
</script>

<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <!-- 👉 Horizontal Form -->
        <v-card title="Horizontal Form">
          <v-card-text>
            <demo-form-layout-horizontal-form />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <!-- 👉 Horizontal Form with Icons -->
        <v-card title="Horizontal Form with Icons">
          <v-card-text>
            <demo-form-layout-horizontal-form-with-icons />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <!-- 👉 Vertical Form -->
        <v-card title="Vertical Form">
          <v-card-text>
            <demo-form-layout-vertical-form />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <!-- 👉 Vertical Form with Icons -->
        <v-card title="Vertical Form with Icons">
          <v-card-text>
            <demo-form-layout-vertical-form-with-icons />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <!-- 👉 Multiple Column -->
        <v-card title="Multiple Column">
          <v-card-text>
            <demo-form-layout-multiple-column />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
