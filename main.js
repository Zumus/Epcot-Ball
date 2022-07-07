let container;
let camera;
let controls;
let renderer;
let scene;
let mesh;
let material;

function init(){
  
  var camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(-1,-3,-5);
  camera.lookAt(0.6, 0, 0);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('0xa0a0a0');
  scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

 //Light
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.9);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);


  var dl = new THREE.DirectionalLight(0xffffff, 1.0);
  dl.castShadow = true;
  dl.position.set(-3, 10, -10);
  dl.shadow.camera.top = 2;
  dl.shadow.camera.bottom = -2;
  dl.shadow.camera.left = -2;
  dl.shadow.camera.right = 2;
  dl.shadow.camera.near = 0.1;
  dl.shadow.camera.far = 40;
  scene.add(dl);

 


//Creating sphere mesh 
  
  //Create new buffer geometry
  THREE.BufferGeometry.prototype.triangulate = triangulate;
  let geometry = new THREE.IcosahedronGeometry(2, 5).triangulate();
  function triangulate(){
    let geometry = this;
    let pos = geometry.attributes.position;
    
    let numFaces = pos.count / 3;
    
    let pts = [];
    let triangle = new THREE.Triangle();
    let v1 = new THREE.Vector3()
    let v2 = new THREE.Vector3();
    let v3 = new THREE.Vector3();
    for(let i = 0; i < numFaces; i++){
      v1.fromBufferAttribute(pos, i * 3 + 0);
      v2.fromBufferAttribute(pos, i * 3 + 1);
      v3.fromBufferAttribute(pos, i * 3 + 2);
      triangle.set(v1, v2, v3);
      let o = new THREE.Vector3();
      triangle.getMidpoint(o);
      
      // make it tetrahedron-like
      let length = v1.distanceTo(v2);
      let height = Math.sqrt(3) / 10 * length;
      let d = o.clone().setLength(height); 
      o.add(d);
      
      pts.push(
        o.clone(), v1.clone(), v2.clone(),
        o.clone(), v2.clone(), v3.clone(),
        o.clone(), v3.clone(), v1.clone()
      );
    }
    
    let g = new THREE.BufferGeometry().setFromPoints(pts);
    g.computeVertexNormals()
    return g;
  }
  var material = new THREE.MeshLambertMaterial({
    color: 0x0f52BA,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1
  });
  var mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = false;
  scene.add(mesh);

//Adding edges
  var geo = new THREE.EdgesGeometry(mesh.geometry);
  var mat = new THREE.LineBasicMaterial( { color: 0xfffffff });
  var wireframe = new THREE.LineSegments(geo, mat);
  mesh.add(wireframe);

  const planeGeometry = new THREE.PlaneGeometry(100, 100);
  const planeMaterial = new THREE.MeshPhongMaterial({color:0x999999, depthWrite: false});
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;
  scene.add(plane);

  var renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled= true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  var animate = function() {
    requestAnimationFrame(animate);

    mesh.rotation.y += 0.005;

    renderer.render(scene, camera);
  };


  animate();
}

init();
