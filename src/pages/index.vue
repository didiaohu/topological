<template>
	<div>
		<textarea v-model="vertexs"></textarea>
		<div>--------------------</div>
		<textarea v-model="edges"></textarea>
		<div>
			<button @click="submit">生成</button>
		</div>
		<div>顺序如下：</div>
		<div>{{order}}</div>
	</div>
</template>
<script>
	import graph,{DFS} from './topological.js';
	export default{
		data(){
			return{
				vertexs:'',
				edges:'',
				order: ''
			}
		},
		mounted(){
			
		},
		methods:{
			submit(){
				let vertexs = eval("("+this.vertexs+")");
				let edges = eval("("+this.edges+")");
				graph.initVertex(vertexs);
				graph.initEdge(edges);
				let l = DFS(graph);
				for(let i = l.length-1; i >= 0; i--){
					this.order += l[i].data + ',';
				}
			}
		}
	}
</script>