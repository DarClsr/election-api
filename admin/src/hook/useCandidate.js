import { computed, reactive, ref } from "vue";
import {
  createCandidate,
  getCandidateOptions,
  getCandidates,
  removeCandidate,
  updateCandidate,
} from "../api/candidate";
import { Message, Modal } from "@arco-design/web-vue";

export const useCandidate = () => {
  const isAdd = ref(false);

  const list = ref([]);

  const form = ref({
    name: "",
    description: "",
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
      title: "名称",
      dataIndex: "name",
    },
    {
      title: "描述",
      dataIndex: "description",
    },
    {
      title: "操作",
      dataIndex: "actions",
      slotName: "actions",
      fixed: "right",
      width: 200,
    },
  ]);

  const isNew = computed(() => {
    return form.value._id ? false : true;
  });
  const getList = async () => {
    const data = await getCandidates({
      page: pagination.current,
      limit: pagination.pageSize,
    });
    if (data.code === 0) {
      list.value = data.data.list;
      pagination.total = data.data.total;
    }
  };

  const addCandidate = () => {
    isAdd.value = true;
  };

  const saveCandidate = async () => {
    let data;
    if (isNew.value) {
      data = await createCandidate({
        ...form.value,
      });
    } else {
      data = await updateCandidate(form.value._id, form.value);
    }

    if (data.code === 0) {
      Message.success(isNew.value ? "新增成功" : "修改成功");
    }
  };

  const cancelAdd = () => {
    form.value = {
      name: "",
    };
    isAdd.value = false;
  };

  const indexNum = computed(() => {
    return (pagination.current - 1) * pagination.pageSize;
  });

  const changePage = (val) => {
    pagination.current = val;
    getList();
  };

  const editCandidate = (row) => {
    isAdd.value = true;
    form.value = row;
  };

  const deleteCandidate = async (row) => {
     await Modal.warning({
      title: "是否执行此项操作",
      content: "删除数据后不可恢复",
      onOk: async () => {
        await removeCandidate(row._id);
        getList();
        Message.success("删除成功");
      },
    });
  };

  const options=ref([])

  const getOptions=async ()=>{
    const {data}=await getCandidateOptions();
    options.value=data
  }

  return {
    getList,
    pagination,
    list,
    isNew,
    isAdd,
    columns,
    addCandidate,
    form,
    saveCandidate,
    cancelAdd,
    indexNum,
    changePage,
    deleteCandidate,
    editCandidate,
    getOptions,
    options
  };
};
