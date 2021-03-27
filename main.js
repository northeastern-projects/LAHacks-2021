const SCALE = 150;
const MAX_DISSIMILARITY = 3.3;
const ELEM = document.getElementById('3d-graph');
const SHOWALLNODES = true;
const SHOWALLLINKS = false;

var data, gData, graph, linkForce;

// graph using data from json file
const fileSelector = document.getElementById("file");
fileSelector.addEventListener('change', event => {
    const reader = new FileReader();
    reader.onload = generate;
    reader.readAsText(event.target.files[0]);
});

function generate(event) {
    gData = JSON.parse(event.target.result);
    
    //data = JSON.parse(event.target.result).Articles;
    /* gData = {
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
    gData.links = gData.nodes.flatMap(node => node.links) */
    gData.nodes.forEach(node => {
        node.neighbors = new Set();
        node.links = node.dissimilarity.reduce((links, d, t) => {
            if (d > 0.0 && d <= MAX_DISSIMILARITY) {
                let link = {
                    source: node.id,
                    target: gData.nodes[t].id,
                    dissimilarity: d
                }
                links.push(link);
                node.neighbors.add(link.target);
            }
            return links;
        }, []);
        gData.links.push(...node.links);
    });

    console.log({gData});

    render();
}

function render() {
    graph = ForceGraph3D({ controlType: "orbit" });
    
    const showNodes = new Set();
    if (SHOWALLNODES) {
        gData.nodes.forEach(node => showNodes.add(node));
    }

    let hoverNode = null;
    const selectedNodes = new Set();

    //configure forces
    linkForce = graph.d3Force('link').distance(link => link.dissimilarity*SCALE);
    graph.d3Force('x', d3.forceX(node=>node.px*SCALE).strength(1));
    graph.d3Force('y', d3.forceY(node=>node.py*SCALE).strength(1));
    graph.d3Force('z', d3.forceZ(node=>node.pz*SCALE).strength(1));
    graph.d3Force('center', null);
    graph.d3Force('charge', null);

    graph(ELEM)
        .graphData(gData)
        .nodeLabel('title')
        .linkLabel('dissimilarity')
        .nodeRelSize(6)
        .nodeColor(node => selectedNodes.has(node) || node === hoverNode ? 'rgba(245,220,200,1)' : 'rgba(0,255,255,0.5)')
        .nodeVisibility(node => showNodes.has(node) ? true : false)
        .linkVisibility(link => 
            showNodes.has(link.source) && showNodes.has(link.target) &&
            link.dissimilarity <= MAX_DISSIMILARITY && 
            (link.source === hoverNode || selectedNodes.has(link.source)) ? true : SHOWALLLINKS)
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
            urls = node.fulltextUrls;
            window.open(urls[urls.length-1], '_blank');
        })
        .onNodeClick(node => {
            if (!selectedNodes.delete(node)) {
                selectedNodes.add(node);
    
                const dist = SCALE;
                const factor = 1 + dist / Math.hypot(node.x, node.y, node.x);
                graph.cameraPosition({ x: node.x * factor, y: node.y * factor, z: node.z * factor }, node, 0);
            }
            update();
        });

        setTimeout(() => graph.zoomToFit(800), 200);
}

function update() {
    graph
        .nodeColor(graph.nodeColor())
        .linkDirectionalParticles(graph.linkDirectionalParticles())
        .nodeVisibility(graph.nodeVisibility())
        .linkVisibility(graph.linkVisibility())
}

