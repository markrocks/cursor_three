let scene, camera, renderer, geometry, material, points;
let a, b, c, x, y, z;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    // Initialize Hopalong attractor parameters
    a = Math.random() * 10 - 5;
    b = Math.random() * 10 - 5;
    c = Math.random() * 10 - 5;
    x = y = z = 0;

    // Create geometry for points
    geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(300000); // 100000 points * 3 values per point
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Create material for points
    material = new THREE.PointsMaterial({
        color: 0xff9933,
        size: 0.01,
        blending: THREE.AdditiveBlending,
        transparent: true,
        sizeAttenuation: true
    });

    // Create points object and add to scene
    points = new THREE.Points(geometry, material);
    scene.add(points);
    
    camera.position.z = 5;
}

function hopalong(x, y, a, b, c) {
    let nx = y - Math.sign(x) * Math.sqrt(Math.abs(b * x - c));
    let ny = a - x;
    return [nx, ny];
}

function animate() {
    requestAnimationFrame(animate);
    
    const positions = points.geometry.attributes.position.array;

    for (let i = 0; i < positions.length; i += 3) {
        [x, y] = hopalong(x, y, a, b, c);
        positions[i] = x * 0.05;
        positions[i + 1] = y * 0.05;
        positions[i + 2] = (Math.sin(x * 0.1) + Math.cos(y * 0.1)) * 0.1;
    }

    points.geometry.attributes.position.needsUpdate = true;

    // Slowly rotate the entire scene
    scene.rotation.y += 0.001;
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Add these lines at the end of the file
window.addEventListener('resize', onWindowResize, false);
init();
animate();