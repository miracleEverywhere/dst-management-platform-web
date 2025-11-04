<template>
  <div>
    <v-text-field v-model="modSearchForm.searchText"
                  :label="modSearchForm.searchType==='text'?'请输入要搜索的模组名称':'请输入要搜索的模组ID'"
                  clearable>
      <template #prepend>
        <v-select v-model="modSearchForm.searchType" :items="searchTypeMap">
        </v-select>
      </template>
      <template #append>
        <v-btn @click="handleModSearch" size="large">搜索</v-btn>
      </template>
    </v-text-field>
    <template v-if="modSearchLoading">
      <v-skeleton-loader type="table-row@20" class="my-8"></v-skeleton-loader>
    </template>
    <template v-else>
      <div class="item-container my-8">
        <template v-for="mod in modSearchData.rows">
          <mod-info :mod="mod"/>
        </template>
      </div>
      <div class="d-flex justify-end mt-4">
                <span class="align-content-center mr-2">
                  共 {{modSearchData.total}}
                </span>
        <v-pagination
            v-model="modSearchForm.page"
            variant="text"
            :length="Math.ceil(modSearchData.total/modSearchForm.pageSize)"
            :total-visible="7"
            @first="handleModSearch(false)"
            @last="handleModSearch(false)"
            @next="handleModSearch(false)"
            @prev="handleModSearch(false)"
            @update:modelValue="handleModSearch(false)"
        ></v-pagination>
      </div>
    </template>
  </div>
</template>

<script setup>
import ModInfo from "@/views/game/components/mod/modInfo.vue";
import externalApi from "@/api/external.js";
import {showSnackbar} from "@/utils/snackbar.js";


const searchTypeMap = ref([
  {title: '名称', value: 'text'},
  {title: 'ID', value: 'id'},
])

const modSearchLoading = ref(false)
const modSearchData = ref({
  total: 0,
  rows: [],
})
const modSearchFormRef = ref()
const modSearchForm = ref({
  page: 1,
  pageSize: 36,
  searchText: "",
  searchType: "text",
})

const handleModSearch = (resetPage = true) => {
  if (resetPage) {
    modSearchForm.value.page = 1;
  }
  modSearchLoading.value = true
  externalApi.mod.search.get(modSearchForm.value).then(response => {
    modSearchData.value.rows = response.data.rows
    modSearchData.value.total = response.data.total
    if (modSearchForm.value.searchType === "id") {
      showSnackbar('ID搜索不显示评分', 'info')
    }
  }).finally(() => {
    modSearchLoading.value = false
  })
}



onMounted(() => {
  handleModSearch()
});
</script>

<style scoped>
.item-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}
</style>