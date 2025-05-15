<template>
  <div class="video-list px-5 w-full h-full overflow-hidden bg-white dark:bg-slate-800">
    <div class="top flex justify-end my-3">
      <a-button type="primary" @click="addElection">
        <template #icon>
          <icon-plus />
        </template>
        添加选举</a-button
      >
    </div>
    <a-table
      align="center"
      class="h-full"
      :pagination="pagination"
      @page-change="changePage"
      :columns="columns"
      :data="list"
    >
      <template #index="{ rowIndex }">
        <span>{{ indexNum + rowIndex + 1 }}</span>
      </template>
      <template #times="{ record }">
        <a-tag v-for="item in record.times" :key="itme" class="mx-2"> {{ item }} </a-tag>
      </template>
      <template #status="{ record }">
        <span class="text-xs mx-2">
          {{ record.isActive ? "关闭" : "开启" }}
        </span>
        <a-switch
        :checked-value="1"
        :unchecked-value="0"
         :modelValue="record.isActive" @change="changeStatus(record)" />
      </template>
      <template #actions="{ record }">
        <a-button type="text" @click="editElection(record)">编辑</a-button>
        <a-button type="text" @click="openElection(record)">去选举</a-button>
        <a-button type="text" status="danger" class="ml-2" @click="deleteElection(record)"
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
      <template #title> {{ isNew ? "新建" : "编辑" }}选举 </template>
      <div class="flex justify-center">
        <a-form :model="form" ref="modelForm">
          <a-form-item
            field="title"
            label="标题"
            :rules="[{ required: true, message: '标题不能为空' }]"
            validate-trigger="input"
            required
          >
            <a-input v-model="form.title" placeholder="输入名称" />
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

          <a-form-item
            field="times"
            label="候选人"
            :rules="[{ required: true, message: '候选人不能为空' }]"
            validate-trigger="input"
            required
          >
            <a-select placeholder="选择候选人" multiple v-model="form.candidates">
              <a-option
                v-for="option in options"
                :value="option.value"
                :key="option.value"
              >
                {{ option.label }}
              </a-option>
            </a-select>
          </a-form-item>

          <a-form-item
            field="times"
            label="时间"
            :rules="[{ required: true, message: '时间不能为空' }]"
            validate-trigger="input"
            required
          >
            <a-range-picker v-model="form.times" />
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
import { useElection } from "../../hook/useElection";
import { useCandidate } from "../../hook/useCandidate";
const {
  list,
  isNew,
  pagination,
  columns,
  addElection,
  isAdd,
  cancelAdd,
  form,
  saveElection,
  indexNum,
  editElection,
  deleteElection,
  getList,
  changePage,
  changeStatus,
} = useElection();

const modelForm = ref();
const handleBeforeOk = async (done) => {
  const errors = await modelForm.value.validate();
  if (!errors) {
    await saveElection();
    done();
    getList();
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

const { options, getOptions } = useCandidate();

const openElection=(record)=>{
    window.open(`http://127.0.0.1:8888/index.html?code=${record.short_link}`)
}

onMounted(() => {
  getList();
  getOptions();
  
});
</script>
