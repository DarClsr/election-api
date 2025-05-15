import { ref, reactive, computed } from "vue";
import {
  getElections,
  createElection,
  updateElection,
  removeElection,
  setElectionStatus,
} from "../api/election";
import { Message, Modal } from "@arco-design/web-vue";

export const useElection = () => {
  const isAdd = ref(false);

  const list = ref([]);

  const form = ref({
    title: "",
    description: "",
    times: [],
    candidates: [],
  });

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
      title: "标题",
      dataIndex: "title",
    },
    {
      title: "描述",
      dataIndex: "description",
    },
    {
      title: "时间",
      dataIndex: "times",
      slotName: "times",
      align: "center",
    },
    {
      title: "候选人数量",
      dataIndex: "candidate_count",
      slotName: "candidate_count",
      align: "center",
    },
    {
      title: "状态",
      dataIndex: "status",
      slotName: "status",
      align: "center",
    },
    {
      title: "操作",
      align: "center",
      dataIndex: "actions",
      slotName: "actions",
      fixed: "right",
      width: 250,
    },
  ]);

  const isNew = computed(() => {
    return form.value._id ? false : true;
  });

  const getList = async () => {
    const data = await getElections({
      page: pagination.current,
      limit: pagination.pageSize,
    });
    if (data.code === 0) {
      list.value = data.data.list;
      pagination.total = data.data.total;
    }
  };

  const addElection = () => {
    isAdd.value = true;
  };

  const saveElection = async () => {
    let data;
    if (isNew.value) {
      data = await createElection({ ...form.value });
    } else {
      data = await updateElection(form.value._id, form.value);
    }

    if (data.code === 0) {
      Message.success(isNew.value ? "新增成功" : "修改成功");
      isAdd.value = false;
      getList();
    }
  };

  const cancelAdd = () => {
    form.value = {
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      candidates: [],
      user: "",
    };
    isAdd.value = false;
  };

  const indexNum = computed(() => {
    return (pagination.current - 1) * pagination.pageSize;
  });

  const changeStatus = async (record) => {
    const active = record.isActive == 1 ? 0 : 1;
    await setElectionStatus(record._id, active);
    record.isActive = active;
  };

  const changePage = (val) => {
    pagination.current = val;
    getList();
  };

  const editElection = (row) => {
    isAdd.value = true;
    form.value = { ...row };
  };

  const deleteElection = async (row) => {
    await Modal.warning({
      title: "是否执行此项操作",
      content: "删除数据后不可恢复",
      onOk: async () => {
        await removeElection(row._id);
        getList();
        Message.success("删除成功");
      },
    });
  };

  return {
    getList,
    pagination,
    list,
    isNew,
    isAdd,
    columns,
    addElection,
    form,
    saveElection,
    cancelAdd,
    indexNum,
    changePage,
    deleteElection,
    editElection,
    changeStatus,
  };
};
