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
          :modelValue="record.isActive"
          @change="changeStatus(record)"
        />
      </template>
      <template #actions="{ record }">
        <a-button type="text" @click="editElection(record)">编辑</a-button>
        <a-button type="text" @click="openElection(record)">去选举</a-button>
        <a-button type="text" @click="getProgress(record)">进度</a-button>
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

    <a-modal
      :top="100"
      :align-center="false"
      draggable
      v-model:visible="showResults"
      @cancel="closeReuslt"
      unmountOnClose
      :closable="false"
    >
      <template #title> 选举进度 </template>

      <!-- 投票列表 -->
      <div class="space-y-4" v-if="results.total > 0">
        <!-- 每个候选人 -->

        <div v-for="item in results.list" :key="item._id">
          <div class="flex justify-between text-sm font-medium text-gray-700 mb-1">
            <span>{{ item.name }}</span>
            <span>{{ item.votes }} 票 {{ item.percentage }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div
              class="bg-green-500 h-3 rounded-full"
              :style="{
                width: item.percentage + '%',
              }"
            ></div>
          </div>
        </div>
      </div>

      <a-result status="404" subtitle="进度为0" v-else>
      </a-result>

      <!-- 总票数 -->
      <div class="mt-6 text-sm text-gray-600 text-right">
        总票数：<span class="font-semibold">{{ results.total }}</span>
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
import { getConfig } from '@/config';

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
  getProgress,
  results,
  showResults,
  closeReuslt,
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

const openElection = (record) => {
  const port = import.meta.env.MODE === 'development' ? '8889' : '8888';
  window.open(`http://127.0.0.1:${port}/index.html?code=${record.short_link}`);
};

onMounted(() => {
  getList();
  getOptions();
});
</script>
