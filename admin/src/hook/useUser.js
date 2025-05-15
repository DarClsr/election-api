import { computed, reactive, ref } from "vue";
import { getUsers } from "../api/user";

export const useUser = () => {

  const list = ref([]);

  const pagination = reactive({
    total: 0,
    current: 1,
    pageSize: 10,
    showTotal: true,
    showJumper: true,
  });

  const columns = ref([
    {
      title: "序号",
      dataIndex: "index",
      slotName: "index",
    },
    {
      title: "邮箱",
      dataIndex: "email",
    },
  ]);

  const getList = async () => {
    const data = await getUsers({
      page: pagination.current,
      limit: pagination.pageSize,
    });
    if (data.code === 0) {
      list.value = data.data.list;
      pagination.total = data.data.total;
    }
  };

  const indexNum = computed(() => {
    return (pagination.current - 1) * pagination.pageSize;
  });

  const changePage = (val) => {
    pagination.current = val;
    getList();
  };

  return {
    getList,
    pagination,
    list,
    columns,
    indexNum,
    changePage,
  };
};
