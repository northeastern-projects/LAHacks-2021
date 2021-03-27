const N = 100;
const SCALE = 100;
const MAX_DISSIMILARITY = 3;
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
        nodes: data.map((a, i) => ({
            id: i,
            name: a.title, 
            x: a.position.x *= SCALE, 
            y: a.position.y *= SCALE, 
            z: a.position.z *= SCALE,
            links: a.dissimilarity.map((d, t) => ({
                source: i,
                target: t,
                dissimilarity: d
            }))
            .filter(l => l.dissimilarity > 0.0 && l.dissimilarity <= MAX_DISSIMILARITY)
        })),
    };
    gData.links = gData.nodes.flatMap(node => node.links)
    
    console.log({gData});
    //process();
    render();
    
    //configure forces
    graph.d3Force('link').distance(link => SCALE*link.dissimilarity);
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

    const selectedNodes = new Set();

    const showNodes = new Set();
    if (SHOWALLNODES) {
        gData.nodes.forEach(node => showNodes.add(node));
    }

    graph = ForceGraph3D({ controlType: "orbit" });

    graph(ELEM)
        .graphData(gData)
        .nodeLabel('name')
        .nodeRelSize(6)
        .nodeColor(node => selectedNodes.has(node) || node === hoverNode ? 'rgba(245,220,200,1)' : 'rgba(0,255,255,0.5)')
        .nodeVisibility(node => showNodes.has(node) ? true : false)
        .linkVisibility(link => showNodes.has(link.source) && showNodes.has(link.target) && (link.source === hoverNode || selectedNodes.has(link.source)) ? true : SHOWALLLINKS)
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
        .onNodeClick(node => {if (!selectedNodes.delete(node)) selectedNodes.add(node)});

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
