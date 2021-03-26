const N = 100;
const elem = document.getElementById('3d-graph');
let data, graph;
let interval;

document.getElementById("generate").addEventListener('click', event => {
    clearInterval(interval);
    generateData();
    render();
});

function generateData() {
    // Random test graph
    data = {
        nodes: [...Array(N).keys()].map(i => ({ id: i })),
        links: [...Array(N).keys()]
            .filter(id => id)
            .map(id => ({
                source: id,
                target: Math.round(Math.random() * (id - 1))
            }))
    };
    data.links.forEach(link => {
        let a = data.nodes[link.source];
        let b = data.nodes[link.target];
        if (!a.links) a.links = [];
        if (!b.links) b.links = [];
        a.links.push(link);
        b.links.push(link);
    })
}

function render() {
    let hoverNode = null;
    const hoverLinks = new Set();

    const showNode = new Set();

    graph = ForceGraph3D({ controlType: "orbit" });

    graph(elem)
        .graphData(data)
        .nodeLabel('id')
        .nodeRelSize(6)
        .nodeColor(node => node === hoverNode ? 'rgba(245,220,200,1)' : 'rgba(0,255,255,0.5)')
        .nodeVisibility(node => showNode.has(node) ? true : false)
        .linkVisibility(link => (showNode.has(link.source) && showNode.has(link.target)) ? true : false)
        .linkCurvature(0)
        .linkDirectionalParticleWidth(2)
        .linkDirectionalParticles(link => hoverLinks.has(link) ? 4 : 0)
        .onNodeHover(node => {
            if (node && hoverNode === node) return;
            hoverLinks.clear()
            if (node) {
                node.links.forEach(link => hoverLinks.add(link));
            }
            elem.style.cursor = node ? 'pointer' : null;
            hoverNode = node || null;
            update();
        })
        .onNodeClick(node => {
            const dist = 120;
            const factor = 1 + dist / Math.hypot(node.x, node.y, node.x);
            graph.cameraPosition({ x: node.x * factor, y: node.y * factor, z: node.z * factor }, node, 1000);
        })
    
    let index = 0;
    interval = setInterval(() => {
        showNode.add(data.nodes[index++]);
        update();
        if (index >= N) clearInterval(interval);
    }, 50);
}

function update() {
    graph
        .nodeColor(graph.nodeColor())
        .linkDirectionalParticles(graph.linkDirectionalParticles())
        .nodeVisibility(graph.nodeVisibility())
        .linkVisibility(graph.linkVisibility());
}
