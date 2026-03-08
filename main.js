let scene, camera, renderer;

let player = {
x:0,
z:5,
speed:0.15
};

let keys={};

let clues=[];
let nearClue=null;

function init(){

scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);



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



/* LIGHTING */

const light = new THREE.PointLight(0xffffff,1,30);
light.position.set(0,5,0);
scene.add(light);



/* TEXTURES */

const loader = new THREE.TextureLoader();

const floorTex = loader.load("floor.jpg");
floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
floorTex.repeat.set(10,10);

const wallTex = loader.load("wall.jpg");
wallTex.wrapS = wallTex.wrapT = THREE.RepeatWrapping;



/* FLOOR */

const floorGeo = new THREE.PlaneGeometry(40,40);
const floorMat = new THREE.MeshStandardMaterial({map:floorTex});

const floor = new THREE.Mesh(floorGeo,floorMat);

floor.rotation.x = -Math.PI/2;

scene.add(floor);



/* WALLS */

function wall(x,z,rot){

const geo = new THREE.BoxGeometry(40,5,1);
const mat = new THREE.MeshStandardMaterial({map:wallTex});

const w = new THREE.Mesh(geo,mat);

w.position.set(x,2.5,z);
w.rotation.y = rot;

scene.add(w);

}

wall(0,-20,0);
wall(0,20,0);
wall(-20,0,Math.PI/2);
wall(20,0,Math.PI/2);



/* CLUES */

createClue(3,3,"A bloody knife...");
createClue(-4,2,"A strange letter...");
createClue(0,-3,"Footprints...");



animate();

}



function createClue(x,z,text){

const geo = new THREE.BoxGeometry(0.6,0.6,0.6);

const mat = new THREE.MeshStandardMaterial({
color:0xff0000,
emissive:0x550000
});

const cube = new THREE.Mesh(geo,mat);

cube.position.set(x,0.3,z);

cube.userData.text = text;

scene.add(cube);

clues.push(cube);

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



checkClues();

}



function checkClues(){

nearClue = null;

clues.forEach(clue=>{

let dist = Math.sqrt(
(player.x - clue.position.x)**2 +
(player.z - clue.position.z)**2
);

if(dist < 2){

nearClue = clue;

}

});

}



window.addEventListener("keydown",e=>{

keys[e.key]=true;

if(e.key==="e" && nearClue){

showClue(nearClue.userData.text);

}

});



window.addEventListener("keyup",e=>{
keys[e.key]=false;
});



function showClue(text){

const box = document.getElementById("clueBox");

box.innerText = text;

box.style.display="block";

setTimeout(()=>{
box.style.display="none";
},3000);

}



document.getElementById("startBtn").onclick=()=>{

document.getElementById("menu").style.display="none";

init();

};