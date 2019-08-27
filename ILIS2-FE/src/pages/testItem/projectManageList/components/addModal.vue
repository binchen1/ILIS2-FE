<template>
<div>
    <a-modal
			:title="isAdd?'新增业务项目':'编辑业务项目'"
			:visible="visible"
			@ok="handleOk"
			:confirmLoading="confirmLoading"
			@cancel="handleCancel"
			class="projectManageList-addModal"
		>
			<div>
				<a-form
					:form="form"
				>
					<a-form-item
						label="工程项目"
						:label-col="{ span: 7 }"
						:wrapper-col="{ span: 17 }"
					>
						<a-input
							v-decorator="[
								'name',
								{ initialValue: data.name },
								{rules: [{ required: true, message: '工程项目为必填项！' }]},
							]"
							placeholder="请输入工程项目"
						/>
					</a-form-item>
					<a-form-item
						label="施工单位"
						:label-col="{ span: 7 }"
						:wrapper-col="{ span: 17 }"
					>
						<a-input
							v-decorator="[
								'constructionUnitName',
								{ initialValue: data.constructionUnitName }
							]"
							placeholder="请输入施工单位"
						/>
					</a-form-item>

					<a-form-item
						label="建设单位"
						:label-col="{ span: 7 }"
						:wrapper-col="{ span: 17 }"
					>
						<a-input
							v-decorator="[
								'buildUnitName',
								{ initialValue: data.buildUnitName }
							]"
							placeholder="请输入建设单位"
						/>
					</a-form-item>

					<a-form-item
						label="建设项目"
						:label-col="{ span: 7 }"
						:wrapper-col="{ span: 17 }"
					>
						<a-input
							v-decorator="[
								'buildProjectName',
								{ initialValue: data.buildProjectName }
							]"
							placeholder="请输入建设项目"
						/>
					</a-form-item>
					<a-form-item
						label="见证单位"
						:label-col="{ span: 7 }"
						:wrapper-col="{ span: 17 }"
					>
						<a-input
							v-decorator="[
								'witnessUnitName',
								{ initialValue: data.witnessUnitName }
							]"
							placeholder="请输入见证单位"
						/>
					</a-form-item>
					<a-form-item
						label="所在省份"
						:label-col="{ span: 7 }"
						:wrapper-col="{ span: 17 }"
					>
						<a-input
							v-decorator="[
								'province',
								{ initialValue: data.province }
							]"
							placeholder="请输入所在省份"
						/>
					</a-form-item>
					<a-form-item
						label="项目简介"
						:label-col="{ span: 7 }"
						:wrapper-col="{ span: 17 }"
					>
						<a-input
							v-decorator="[
								'description',
								{ initialValue: data.description }
							]"
							placeholder="请输入项目简介"
						/>
					</a-form-item>
					<a-form-item
						label="综合检测工程项目"
						:label-col="{ span: 7 }"
						:wrapper-col="{ span: 17 }"
					>
						<a-radio-group
							v-decorator="['isTestItem', {initialValue: data.isTestItem.toString()}]"
							style="width: 100%;"
						>
							<a-row>
								<a-col :span="4">
									<a-radio value="1">是</a-radio>
								</a-col>
								<a-col :span="4">
									<a-radio value="0">否</a-radio>
								</a-col>
							</a-row>
						</a-radio-group>
					</a-form-item>
				</a-form>
			</div>
    </a-modal>
</div>

</template>

<script>

import { message } from "ant-design-vue";
import { setTimeout } from 'timers';
import qs from "qs";

export default {
		data(){
				return {
					visible: false,
					confirmLoading: false,
					formLayout: 'horizontal',
					form: this.$form.createForm(this),
					data: {
						name: "",
						constructionUnitName: "",
						buildUnitName: "",
						buildProjectName: "",
						witnessUnitName: "",
						province: "",
						description: "",
						isTestItem: "1"
					}
				}
		},
		created(){
				console.log(this);
		}, 
		props:['isAdd', 'callback'],
		methods: {
				showModal(data) {
					this.visible = true;
					if(data){
						this.data = data;
					}else{
						this.data = {
							name: "",
							constructionUnitName: "",
							buildUnitName: "",
							buildProjectName: "",
							witnessUnitName: "",
							province: "",
							description: "",
							isTestItem: 1
						}
					}
				},
				handleOk(e) {
					this.form.validateFields((err, values) => {
							if (!err) {
								this.confirmLoading = true;

								let	url = this.$api.testItem.addProject,
										data = this.form.getFieldsValue();

								if(this.isAdd === false){
									url = this.$api.testItem.updateProject;
									data = {
										...data,
										id: this.data.id
									}
								}

								this.$ajax({
									method: "POST",
									url,
									data: qs.stringify(data),
									headers: {
											"X-Requested-With": "XMLHttpRequest"
									}
								}).then(res=>{
										if(res && res.success){
											message.success(res.msg);
											this.form.resetFields();
											this.visible = false;
											this.callback();
										}else{
											message.error(res.msg);
										}
										this.confirmLoading = false;
								})
							}
					});
				},
				handleCancel(e) {
					this.visible = false;
					this.form.resetFields();
				}
		}
}
</script>

<style>
    
</style>