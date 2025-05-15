<template>
  <div class="video-list px-5 w-full h-full overflow-hidden bg-white dark:bg-slate-800">
    <a-table align="center" class="h-full"
     :pagination="pagination"
     @page-change="changePage"
     :columns="columns" :data="list">
      <template #index="{ rowIndex }">
        <span>{{ indexNum + rowIndex + 1 }}</span>
      </template>
      <template #actions="{ record }">
        <a-button type="text" @click="editUser(record)">编辑</a-button>
        <a-button type="text" status="danger" class="ml-2" @click="deleteUser(record)"
          >删除</a-button
        >
      </template>
    </a-table>

  </div>
</template>

<script setup>
import { IconPlus } from "@arco-design/web-vue/es/icon";
import { ref, onMounted } from "vue";
import { Message } from "@arco-design/web-vue";
import { useUser } from "../../hook/useUser";
const {
  list,
  pagination,
  columns,
  indexNum,
  getList,
  changePage
} = useUser();

const modelForm = ref();
const handleBeforeOk = async (done) => {
  const errors = await modelForm.value.validate();
  if (!errors) {
    await saveUser();
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
