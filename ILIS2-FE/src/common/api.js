// 接口地址
const api = {
    common:{
        // 获取页面权限
        getUserFunctionTreeJson: '/ilis2/functionController.do?getUserFunctionTreeJson',
        // 获取页面功能权限
        getUserFunctionByCode: '/ilis2/functionController.do?getUserFunctionByCode',
        // 获取选择人员
        getPersonsForChoose: "/ilis2/reportCreateController.do?getPersonsForChoose",
        // 上传文件
        upload: "/ilis2/uploadController.do?upload"
    },
    home:{
        test: "/ilis2/consignController.do?datagridNew"
        // test: "/ILIS2_0_war_exploded/consignController.do?datagridNew"
    },
    testItem: {
        // 综合项目列表
        list: "/ilis2/rest/synthesis/list",
        // 新增项目
        addProject: "/ilis2/projectController.do?doAdd",
        // 更新项目信息
        updateProject: "/ilis2/projectController.do?doUpdate",
        // 删除项目
        deleteProject: "/ilis2/projectController.do?doDel",
        // 获取导航树
        getTree: "/ilis2/rest/synthesis/nav/tree",
        // 其他成果列表
        achievementList: "/ilis2/rest/synthesis/achievement/list",
        // 新增/编辑其他成果
        achievement: "/ilis2/rest/synthesis/achievement",
        // 联系人列表
        contactList: "/ilis2/rest/synthesis/contact/list",
        // 新增/编辑/删除 联系人
        addContact: "/ilis2/rest/synthesis/contact",
        // 设置/获取相关人员
        setPerson: "/ilis2/rest/synthesis/person",
        // 登记进度列表
        progressList: "/ilis2/rest/synthesis/progress/tree",
        // 更新进度
        updateProgress: "/ilis2/rest/synthesis/progress",
        // 进度详情
        progressDetail: "/ilis2/rest/synthesis/progress",
        // 获取自定义字段
        getFields: "/ilis2/rest/synthesis/column",
        // 修改自定义字段
        column: "/ilis2/rest/synthesis/column",
        // 新增单位工程
        unit: "/ilis2/rest/synthesis/unit",
        // 新增/修改合同段
        contract: "/ilis2/rest/synthesis/contract",
        // 合同段/单位工程列表
        contractUnit: "/ilis2/rest/synthesis/contract/unit",
        // 合同段/单位工程设置人员
        setCUPerson: "/ilis2/rest/synthesis/contract/unit/person",
        // 获取待审核/已审核列表
        auditAchieve: "/ilis2/rest/synthesis/audit/achieve/list",
        // 审核其它成果
        audit: "/ilis2/rest/synthesis/audit",
        // 审核日志
        auditLog: "/ilis2/rest/synthesis/achieve/log",
        // 获取查询附录列表(搜文件名)
        appendixByFile: "/ilis2/rest/synthesis/attachment",
        // 获取查询附录列表(根据树筛选)
        appendixByField: "/ilis2/rest/synthesis/attachment"
    },
    standard:{
        tableUrl:'/ilis2/baseStandardManageController.do?datagrid',
        treeUrl:'/ilis2/baseStandardTypeController.do?datagrid',
        treeSave:'/ilis2/baseStandardTypeController.do?save',
        treeDel:'/ilis2/baseStandardTypeController.do?delete',
        standardType:'/ilis2/baseStandardManageController.do?changeStandardType',
        standardDel:'/ilis2/baseStandardManageController.do?delete',
        standardSave:'/ilis2/baseStandardManageController.do?save',
        standardGetById:'/ilis2/baseStandardManageController.do?getById',
    },
    laboratory:{
        tableUrl:'/ilis2/laboratoryController.do?datagridAll',
        saveUrl:'/ilis2/laboratoryController.do?save',
        delUrl:'/ilis2/laboratoryController.do?delete',
    },
    environment:{
        tableUrl:'/ilis2/labEnvironmentController.do?datagrid',
        editUrl:'/ilis2/labEnvironmentController.do?getById',
        saveUrl:'/ilis2/labEnvironmentController.do?save',
        delUrl:'/ilis2/labEnvironmentController.do?delete',
    },
    environmentStatistics:{
        tableUrl:'/ilis2/labEnvironmentController.do?datagrid',
        chartUrl:'/ilis2/labEnvironmentController.do?lineChart',
    },

};

module.exports = api;