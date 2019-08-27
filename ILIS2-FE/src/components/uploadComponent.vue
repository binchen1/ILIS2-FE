// weqweqw

<template>
  <div>
    <a-modal
      title="上传"
      v-model="visible"
      @ok="handleSubmit"
      :maskClosable="false"
      @cancel="handleCancel"
    >
      <div style="margin-bottom:5px;">最多上传{{ max||1 }}个文件</div>
      <a-upload
        :fileList="fileList"
        :remove="handleRemove"
        :beforeUpload="beforeUpload"
        :defaultFileList="fileList"
      >
        <a-button>
          <a-icon type="upload" /> 选择文件
        </a-button>
      </a-upload>
      <a-button
        type="primary"
        @click="handleUpload"
        :disabled="fileList.length === 0"
        :loading="uploading"
        style="margin-top: 16px"
      >
        {{uploading ? '上传中' : '开始上传' }}
      </a-button>
    </a-modal>
  </div>
</template>

<script>

  import { message } from "ant-design-vue";

  export default {
    data(){
      return {
        visible: false,
        uploadAPI: `${window.location.origin}/ilis2/uploadController.do?upload`,
        fileList: [],
        uploading: false,
        data: []
      }
    },
    props: ['max', 'uploadcall','fileLists'],
    watch:{
      fileLists:function(newValue){
        this.fileList = [...newValue];
      }
    },
    methods: {
      showModal(){
        this.visible = true;
      },
      handleSubmit(){
        this.visible = false;
        console.log('handleSubmit', this.data);
        this.uploadcall(this.data);
      },
      handleCancel(){
        this.data.length = 0;
        this.uploadcall(this.data);
      },
      handleRemove(file) {
        const index = this.fileList.indexOf(file);
        const newFileList = this.fileList.slice();
        newFileList.splice(index, 1);
        this.fileList = newFileList
      },
      beforeUpload(file) {
        console.log('beforeUpload', file);
        let num = this.max || 1;
        if(this.fileList.length >= num){
          this.fileList.shift();
        }
        this.fileList = [...this.fileList, file];
        return false;
      },
      handleUpload() {
        const { fileList } = this;
        const formData = new FormData();
        fileList.forEach((file) => {
          formData.append('file', file);
        });
        this.uploading = true;

        this.$ajax({
          url: this.$api.common.upload,
          method: 'post',
          data: formData
        }).then(res => {
          if(res && res.success){
            message.success("上传成功");
            this.data = res.obj;

          }else{
            message.success("上传失败");
          }
          this.uploading = false
        })
      }
    }
  }
</script>

<style lang="less" scoped>

</style>