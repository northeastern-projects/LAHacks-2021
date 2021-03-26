const N = 100;
const SCALE = 100;
const MAX_DISSIMILARITY = 3.3;
const ELEM = document.getElementById('3d-graph');
const SHOWALLNODES = true;
const SHOWALLLINKS = false;

var data, gData, graph;
//var interval;

document.getElementById('random').addEventListener('click', event => {
    //clearInterval(interval);
    generateRandom();
});

// graph using data from json file
const fileSelector = document.getElementById("file");
fileSelector.addEventListener('change', event => {
    const reader = new FileReader();
    reader.onload = generate;
    reader.readAsText(event.target.files[0]);
});

function generate(event) {
    data = JSON.parse(event.target.result).Articles;
    gData = {
        nodes: [...Array(data.length).keys()].map(i => ({ 
            id: i,
            name: data[i].title, 
            links: [], 
            x: data[i].position.x *= SCALE, 
            y: data[i].position.y *= SCALE, 
            z: data[i].position.z *= SCALE 
        })), 
        links: []
    };
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data.length; j++) {
            if (i != j && (data[i].dissimilarity[j]) <= MAX_DISSIMILARITY) {
                gData.links.push({source: i, target: j});
            }
            data[i].dissimilarity[j] *= SCALE;
        }
    }
    console.log(gData);
    process();
    render();
    
    //configure forces
    graph.d3Force('link').distance(link => data[link.source.id].dissimilarity[link.target.id]);
    graph.d3Force('x', d3.forceX(node=>data[node.id].position.x).strength(1));
    graph.d3Force('y', d3.forceY(node=>data[node.id].position.y).strength(1));
    graph.d3Force('z', d3.forceZ(node=>data[node.id].position.z).strength(1));
    graph.d3Force('center', null);
    //graph.d3Force('charge', null);
}

// Random test graph
function generateRandom() {
    gData = {
        nodes: [...Array(N).keys()].map(i => ({ id: i, links: [] })),
        links: [...Array(N).keys()]
            .filter(id => id)
            .map(id => ({
                source: id,
                target: Math.round(Math.random() * (id - 1))
            }))
    };
    process();
    render();
}

function process() {
    gData.links.forEach(link => {
        let a = gData.nodes[link.source];
        a.links.push(link);
    })
}

function render() {
    let hoverNode = null;

    const selectedNode = new Set();

    const showNode = new Set();
    if (SHOWALLNODES) {
        gData.nodes.forEach(node => showNode.add(node));
    }

    graph = ForceGraph3D({ controlType: "orbit" });

    graph(ELEM)
        .graphData(gData)
        .nodeLabel('name')
        .nodeRelSize(6)
        .nodeColor(node => selectedNode.has(node) || node === hoverNode ? 'rgba(245,220,200,1)' : 'rgba(0,255,255,0.5)')
        .nodeVisibility(node => showNode.has(node) ? true : false)
        .linkVisibility(link => showNode.has(link.source) && showNode.has(link.target) && (link.source === hoverNode || selectedNode.has(link.source)) ? true : SHOWALLLINKS)
        .linkOpacity(0.2)
        .linkCurvature(0)
        .linkDirectionalParticleWidth(2)
        .linkDirectionalParticles(link => link.source === hoverNode ? 4 : 0)
        .onNodeHover(node => {
            if (node && hoverNode === node) return;
        
            ELEM.style.cursor = node ? 'pointer' : null;
            hoverNode = node || null;
            update();
        })
        .onNodeRightClick(node => {
            
            const dist = 200;
            const factor = 1 + dist / Math.hypot(node.x, node.y, node.x);
            graph.cameraPosition({ x: node.x * factor, y: node.y * factor, z: node.z * factor }, node, 1000);
        })
        .onNodeClick(node => {if (!selectedNode.delete(node)) selectedNode.add(node)});

    /**
    let index = 0;
    interval = setInterval(() => {
        showNode.add(gData.nodes[index++]);
        update();
        if (index >= N) clearInterval(interval);
    }, 50);
     */
}

function update() {
    graph
        .nodeColor(graph.nodeColor())
        .linkDirectionalParticles(graph.linkDirectionalParticles())
        .nodeVisibility(graph.nodeVisibility())
        .linkVisibility(graph.linkVisibility())
}
