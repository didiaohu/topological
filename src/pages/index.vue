<template>
	<div class="home-page">
		<header class="header">
			<div>
				<img src="./logo.png" />
			</div>
			<span>聚财智能分配任务小系统</span>
		</header>
		<div class="content">
			<div class="content__addTask">
				<span class="content__title">任务</span>
				<el-tag
					:key="tag"
					v-for="tag in dynamicTags"
					closable
					:disable-transitions="false"
					@close="handleClose(tag)">
					{{tag}}
				</el-tag>
				<el-input
					class="input-new-tag"
					v-model="inputValue"
					ref="saveTagInput"
					size="small"
					@keyup.enter.native="handleInputConfirm"
					@blur="handleInputConfirm"
				>
				</el-input>
				<!-- <el-button v-else class="button-new-tag" size="small" @click="showInput" type="primary" plain>添加任务</el-button> -->
			</div>
			<div class="content__select">
				<div class="content__select-title">选填先行任务</div>
				<ul>
					<li v-for="(itemTag,index) in dynamicTags">
						<el-row type="flex" align="middle">
							<el-col :span="3">
								<div class="content__select-div">{{itemTag}}</div>
							</el-col>
							<el-col :span="21">
								<el-checkbox-group 
								v-model="checkedCities[index]"
								>
									<el-checkbox v-for="city in cities[index]" :label="city" :key="city">{{city}}</el-checkbox>
								</el-checkbox-group>
							</el-col>
						</el-row>
					</li>
				</ul>
			</div>
			<div class="content__submit">
				<div class="content__layout" v-if="">
					<el-button class="content__btn" type="primary" size="small" @click="createSort">结果</el-button>
				</div>
				<div class="content__results">
					<el-tag v-for="item in showSort">{{item.data}}</el-tag>
				</div>
			</div>
		</div>
		
	</div>
</template>
<style>
	.el-tag + .el-tag {
		margin-left: 10px;
	}
	.button-new-tag {
		margin-left: 10px;
		height: 32px;
		line-height: 30px;
		padding-top: 0;
		padding-bottom: 0;
	}
	.home-page .input-new-tag {
		width: 90px;
		margin-left: 10px;
		vertical-align: bottom;
	}
	.header{
		height: 60px;
		background: #FFFFFF;
		box-shadow: 0 2px 4px 0 rgba(227,227,227,0.50);
		padding: 0 calc(50% - 600px);
		display: flex;
		align-items: center;
	}
	.header img{
		width: 41px;
	}
	.header span{
		font-size: 16px;
		color: #008DF6;
		margin-left: 16px;
		font-weight: bold;
	}
	.content{
		padding: 0 calc(50% - 502px);
		padding-top: 80px;
	}
	.content__addTask{
		border-bottom: 1px solid #E9E9E9;
		padding-bottom: 20px;
		padding-left: 50px;
	}
	.content__title{
		font-size: 14px;
		color: #008DF6;
		font-weight: bold;
		margin-right: 23px;
	}
	.content__select{
		padding-top: 22px;
	}
	.content__select-title{
		font-size: 14px;
		color: #008DF6;
		font-weight: bold;
		padding-bottom: 10px;
	}
	.content__select-div{
		width: 90px;
		height: 34px;
		background: #E2F3FF;
		line-height: 34px;
		text-align: center;
		font-size: 14px;
		color: #008DF6; 
	}
	.content__submit{
		border: 1px solid #EBEBEB;
		margin-top: 37px;
		padding-bottom: 15px;
	}
	.content__submit .content__layout{
		padding-left: 10px;
		padding-top: 10px;
	}
	.content__submit .content__btn{
		margin: 0 auto;
	}
	.content__results{
		padding-left: 10px;
		padding-top: 10px;
	}
</style>
<script>
	import graph,{DFS} from './topological.js';
	export default{
		data(){
			return{
				dynamicTags: [],
				inputVisible: false,
				inputValue: '',
				checkedCities:[],
				cities:[],
				showSort: '',
				showResult: false
			}
		},
		mounted(){
			
		},
		methods:{
			handleClose(tag) {
				this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
				console.log(123,this.dynamicTags);
				this.fixData();
			},

			showInput() {
				this.inputVisible = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput.$refs.input.focus();
				});
			},

			handleInputConfirm() {
				let inputValue = this.inputValue;
				if (inputValue) {
					this.dynamicTags.push(inputValue);
					this.fixData();
				}
				this.inputVisible = false;
				this.inputValue = '';
			},

			fixData(){
				let k = 0;
				for(let i = 0; i < this.dynamicTags.length; i++){
					this.cities[i] = new Array();
					this.checkedCities[i] = new Array(); 
					for(let j = 0; j < this.dynamicTags.length; j++){
						if(i != j){
							this.cities[i][k] = this.dynamicTags[j];
							k++;
						}
					}
					k = 0;
				}
			},
			
			initVertexs(obj){
				for(let i = 0; i < this.dynamicTags.length; i++){
					let item = {};
					item.value = i;
					item.data = this.dynamicTags[i];
					obj.vertexs[i] = item;
				}
			},

			initEdges(obj){

				for(let i = 0; i < this.dynamicTags.length; i++){

					let item = [];
					for(let j = 0; j < this.checkedCities[i].length; j++){
						let oo = {};
						for(let k = 0; k < obj.vertexs.length; k++){
							if(obj.vertexs[k].data == this.checkedCities[i][j]){
								oo.id = k;
							}
						}
						item.push(oo);
					}
					obj.edges[i] = item;
				}

			},

			// 重组数据
			getRecombine(){
				let obj = {
					vertexs:[],
					edges:{}
				};
				this.initVertexs(obj);
				this.initEdges(obj);
				return obj;
			},

			createSort(){
				let obj = this.getRecombine();
				console.log(graph);
				graph.initVertex(obj.vertexs);
				graph.initEdge(obj.edges);
				this.showSort = DFS(graph);
				this.showSort.reverse();
			}
		}
	}
</script>

