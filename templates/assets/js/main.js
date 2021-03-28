const SCALE = 100;
const MAX_DISSIMILARITY = 3.3;
const ELEM = document.getElementById('3d-graph');
const SHOWALLNODES = true;
const SHOWALLLINKS = false;

var data, gData, graph, linkForce;

function generate(event) {
    gData = JSON.parse(document.getElementById("requested_data").value);
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
                node.neighbors.add(gData.nodes[t]);
            }
            return links;
        }, []);
        node.val = node.neighbors.size;
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
    const hoverNodes = new Set();

    let selectedNode = null;
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
        .backgroundColor('#000000')
        .nodeOpacity(0.9)
        .nodeColor(node => 
            selectedNodes.has(node) || hoverNodes.has(node) ? 
            node === hoverNode || node === selectedNode ? 
            'gold' : 'lightyellow' : 'royalblue')
        .nodeVisibility(node => showNodes.has(node) ? true : false)
        .linkVisibility(link => 
            showNodes.has(link.source) && showNodes.has(link.target) &&
            (link.source === hoverNode || link.source === selectedNode) ? true : SHOWALLLINKS)
        .linkOpacity(0.2)
        .linkColor((link=>'yellow'))
        .linkCurvature(0)
        .linkDirectionalParticleWidth(1)
        .linkDirectionalParticles(link => link.source === hoverNode ? 8 : 0)
        .onNodeHover(node => {
            if ((!node && !hoverNodes.size) || (node && hoverNode === node)) return;
            hoverNodes.clear();
            if (node) {
                hoverNodes.add(node);
                node.neighbors.forEach(nb => hoverNodes.add(nb));
            }
            ELEM.style.cursor = node ? 'pointer' : null;
            hoverNode = node || null;
            console.log({hoverNodes});
            update();
        })
        .onNodeClick(node => {
            selectedNodes.clear();
            selectedNode = node;
            hoverNodes.forEach(node=>selectedNodes.add(node));
            const dist = 800;
            const factor = 1 + (dist / Math.hypot(node.x, node.y, node.x));
            graph.cameraPosition({ x: node.x * factor, y: node.y * factor, z: node.z * factor }, node, 1000); 
            update();
            writetohtml(node);
        })
        .onBackgroundClick(() => {
            selectedNodes.clear();
            selectedNode = null;
            update();
        });
    
        setTimeout(() => graph.zoomToFit(800), 200);
}

function update() {
    graph
        .nodeColor(graph.nodeColor())
        .linkColor(graph.linkColor())
        .nodeVisibility(graph.nodeVisibility())
        .linkVisibility(graph.linkVisibility())
        .linkDirectionalParticles(graph.linkDirectionalParticles());
}

// title, authors, description, urls
function writetohtml(node) {
    document.getElementById("title").innerHTML = node.title;
    document.getElementById("authors").innerHTML = node.authors.join(', ');
    document.getElementById("description").innerHTML = node.description;
    node.fulltextUrls.forEach(url => {
        var a = document.createElement('a');
        a.setAttribute('href',url);
        a.innerHTML = url;

        var br = document.createElement('br');

        document.getElementById('urls').appendChild(a);
        document.getElementById('urls').appendChild(br);
    })
}

generate()