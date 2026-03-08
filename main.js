let scene, camera, renderer;

let player = { x:0, z:5, speed:0.2 };
let keys = {};

function init(){

scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

camera = new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
1000
);

camera.position.set(0,1.7,5);

renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth,window.innerHeight);

document.body.appendChild(renderer.domElement);


/* LIGHT */

const light = new THREE.PointLight(0xffffff,1.2,40);
light.position.set(0,5,0);
scene.add(light);

const ambient = new THREE.AmbientLight(0x404040);
scene.add(ambient);


/* TEXTURES */

const loader = new THREE.TextureLoader();

const floorTexture = loader.load("floor.jpg");
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(10,10);

const wallTexture = loader.load("wall.jpg");
wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set(6,2);

const ceilingTexture = loader.load("ceiling.jpg");
ceilingTexture.wrapS = ceilingTexture.wrapT = THREE.RepeatWrapping;
ceilingTexture.repeat.set(10,10);


/* FLOOR */

const floorGeo = new THREE.PlaneGeometry(40,40);
const floorMat = new THREE.MeshStandardMaterial({map:floorTexture});

const floor = new THREE.Mesh(floorGeo,floorMat);
floor.rotation.x = -Math.PI/2;

scene.add(floor);


/* CEILING */

const ceilingGeo = new THREE.PlaneGeometry(40,40);
const ceilingMat = new THREE.MeshStandardMaterial({map:ceilingTexture});

const ceiling = new THREE.Mesh(ceilingGeo,ceilingMat);
ceiling.rotation.x = Math.PI/2;
ceiling.position.y = 5;

scene.add(ceiling);


/* WALL FUNCTION */

function createWall(x,z,rotation){

const geo = new THREE.BoxGeometry(40,5,1);
const mat = new THREE.MeshStandardMaterial({map:wallTexture});

const wall = new THREE.Mesh(geo,mat);

wall.position.set(x,2.5,z);
wall.rotation.y = rotation;

scene.add(wall);

}


/* HOUSE WALLS */

createWall(0,-20,0);
createWall(0,20,0);
createWall(-20,0,Math.PI/2);
createWall(20,0,Math.PI/2);


/* GAME LOOP */

animate();

}

function animate(){

requestAnimationFrame(animate);

movePlayer();

renderer.render(scene,camera);

}

function movePlayer(){

if(keys["ArrowUp"]) player.z -= player.speed;
if(keys["ArrowDown"]) player.z += player.speed;

if(keys["ArrowLeft"]) player.x -= player.speed;
if(keys["ArrowRight"]) player.x += player.speed;

camera.position.x = player.x;
camera.position.z = player.z;

}


/* KEY CONTROLS */

window.addEventListener("keydown",e=>{
keys[e.key] = true;
});

window.addEventListener("keyup",e=>{
keys[e.key] = false;
});


document.getElementById("startBtn").onclick = ()=>{

document.getElementById("menu").style.display="none";

init();

};