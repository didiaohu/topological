//数据结构 邻接链表-顶点
function Vertex() {
    if (!(this instanceof Vertex))
        return new Vertex();
    this.color = this.WHITE; //初始为 白色
    this.pi = null; //初始为 无前驱
    this.d = this.INFINITY; //初始为 无穷大
    this.edges = null; //由顶点发出的所有边
    this.value = null; //节点的标识
    this.data = null; //节点的数据
    this.incoming = 0;
}
Vertex.prototype = {
    constructor: Vertex,
    WHITE: 'white', //白色
    GRAY: 'gray', //灰色
    BLACK: 'black', //黑色
    INFINITY: null, //d 为 null 时表示无穷大
}

//数据结构 邻接链表-边
function Edge() {
    if (!(this instanceof Edge))
        return new Edge();
    this.index = null; //边所依附的节点的位置
    this.sibling = null;
    this.w = null; //保存边的权值
}

//数据结构 图-G
function Graph() {
    if (!(this instanceof Graph))
        return new Graph();
    this.graph = [];
    this.dict = {}; //字典 用来映射标节点的识符和数组中的位置
}
Graph.prototype = {
    constructor: Graph,
    //这里加进来的已经具备了边的关系
    addNode: function(node) {
        this.graph.push(node);
    },
    getNode: function(index) {
        return this.graph[index];
    },
    //创建图的 节点
    initVertex: function(vertexs) {
        //创建节点并初始化节点属性 value
        for (let value of vertexs) {
            let vertex = Vertex();
            vertex.value = value.value;
            vertex.data = value.data;
            this.graph.push(vertex);
        }
        //初始化 字典
        for (let i in this.graph) {
            this.dict[this.graph[i].value] = i;
        }
    },
    //建立图中 边 的关系
    initEdge: function(edges) {
        for (let field in edges) {
            let index = this.dict[field]; //从字典表中找出节点在 graph 中的位置
            let vertex = this.graph[index]; //获取节点
            vertex.edges = createLink(0, edges[field].length, edges[field], this.dict, this.graph);
        }
    }
}

//创建链表，返回链表的第一个节点
function createLink(index, len, edges, dict, vertexs) {
    if (index >= len) return null;
    let edgeNode = Edge();
    edgeNode.index = dict[edges[index].id]; //边连接的节点 用在数组中的位置表示 参照字典
    vertexs[edgeNode.index].incoming = vertexs[edgeNode.index].incoming + 1; //设置节点的入度
    edgeNode.w = edges[index].w; //边的权值
    edgeNode.sibling = createLink(++index, len, edges, dict, vertexs); //通过递归实现 回溯
    return edgeNode;
}
// a内裤 b袜子 c手表 d裤子 e鞋 f腰带 g衬衣 h领带 i 夹克
// vertexs = [{value: 'a', data: '内裤'}, {value: 'b',   data: '袜子'}, 
// {value: 'c',data: '手表'}, {value: 'd',   data: '裤子'}, 
// {value: 'e',data: '鞋'}, {value: 'f',    data: '腰带'}, 
// {value: 'g',data: '衬衣'}, {value: 'h',   data: '领带'}, 
// {value: 'i',data: '夹克'}];

// var edges = {
//     a: [{id: 'd', w: 1 }, {id: 'e', w: 1 }],
//     b: [{id: 'e', w: 1}],
//     c: [],
//     d: [{id: 'e', w: 1 }, {id: 'f', w: 1 }],
//     e: [],
//     f: [{id: 'i', w: 1}],
//     g: [{id: 'f', w: 1 }, {id: 'h', w: 1 }],
//     h: [{id: 'i', w: 1}],
//     i: []
// }

export const DFS = function(g) {
    let t = 0;
    let l =[];
    for (let v of g.graph) {
        if (v.color == v.WHITE) DFSVisit(g, v);
    }
    function DFSVisit(g, v) {
        t = t + 1;
        v.d = t;
        v.color = v.GRAY;
        let sibling = v.edges;
        while (sibling != null) {
            let index = sibling.index;
            let n = g.getNode(index);
            if (n.color == n.WHITE) {
                n.pi = v;
                DFSVisit(g, n); //先纵向找
            }
            sibling = sibling.sibling; //利用递归的特性来回溯
        }
        v.color = v.BLACK;
        t = t + 1;
        v.f = t; //设置完成时间
        l.unshift(v); //拓扑排序的次序与顶点的完成时间恰好相反
    }
    return l;
}

var g = Graph();

export default g;