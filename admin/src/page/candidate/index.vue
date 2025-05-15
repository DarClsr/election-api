<template>
  <div class="video-list px-5 w-full h-full overflow-hidden bg-white dark:bg-slate-800">
    <div class="top flex justify-end my-3">
      <a-button type="primary" @click="addCandidate">
        <template #icon>
          <icon-plus />
        </template>
        添加候选人</a-button
      >
    </div>
    <a-table align="center" class="h-full"
     :pagination="pagination"
     @page-change="changePage"
     :columns="columns" :data="list">
      <template #index="{ rowIndex }">
        <span>{{ indexNum + rowIndex + 1 }}</span>
      </template>
      <template #actions="{ record }">
        <a-button type="text" @click="editCandidate(record)">编辑</a-button>
        <a-button type="text" status="danger" class="ml-2" @click="deleteCandidate(record)"
          >删除</a-button
        >
      </template>
    </a-table>

    <a-modal
      :top="100"
      :align-center="false"
      draggable
      v-model:visible="isAdd"
      @cancel="cancelAdd"
      @before-ok="handleBeforeOk"
      unmountOnClose
      :closable="false"
    >
      <template #title> {{ isNew ? "新建" : "编辑" }}候选人 </template>
      <div class="flex justify-center">
        <a-form :model="form" ref="modelForm">
          <a-form-item
            field="name"
            label="名称"
            :rules="[{ required: true, message: '名称不能为空' }]"
            validate-trigger="input"
            required
          >
            <a-input v-model="form.name" placeholder="输入名称" />
          </a-form-item>
          <a-form-item
            field="description"
            label="描述"
            :rules="[{ required: true, message: '描述不能为空' }]"
            validate-trigger="input"
            required
          >
            <a-textarea
              v-model="form.description"
              placeholder="输入描述"
              :max-length="{ length: 100, errorOnly: true }"
              allow-clear
              show-word-limit
            />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { IconPlus } from "@arco-design/web-vue/es/icon";
import { ref, onMounted } from "vue";
import { Message } from "@arco-design/web-vue";
import { useCandidate } from "../../hook/useCandidate";
const {
  list,
  isNew,
  pagination,
  columns,
  addCandidate,
  isAdd,
  cancelAdd,
  form,
  saveCandidate,
  indexNum,
  editCandidate,
  deleteCandidate,
  getList,
  changePage
} = useCandidate();

const modelForm = ref();
const handleBeforeOk = async (done) => {
  const errors = await modelForm.value.validate();
  if (!errors) {
    await saveCandidate();
    done();
    getList()
  } else {
    Message.error(getMessage(errors));
    done(false);
  }
};

const getMessage = (errors) => {
  let error_key = Object.keys(errors)[0];

  if (!error_key) {
    return "未知错误";
  }
  return errors[error_key].message;
};

onMounted(() => {
  getList();
});
</script>
