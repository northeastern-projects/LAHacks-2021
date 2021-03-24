const N = 200;
const elem = document.getElementById('3d-graph');
let data, graph;

document.getElementById("generate").addEventListener('click', event => {
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

    graph = ForceGraph3D({ controlType: "orbit" });

    graph(elem)
        .graphData(data)
        .nodeLabel('id')
        .nodeRelSize(6)
        .nodeColor(node => node === hoverNode ? 'rgba(245,220,200,1)' : 'rgba(0,255,255,0.5)')
        .linkCurvature(0)
        .linkDirectionalParticles(2)
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
}

function update() {
    graph
        .nodeColor(graph.nodeColor())
        .linkDirectionalParticles(graph.linkDirectionalParticles());
}
