let scene,camera,renderer;
let player;
let clues=[];
let keys={};

function init(){

scene=new THREE.Scene();

camera=new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
1000
);

renderer=new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);



/* LIGHT */

const light=new THREE.PointLight(0xffffff,1);
light.position.set(5,10,5);
scene.add(light);



/* FLOOR */

const floorGeo=new THREE.PlaneGeometry(30,30);
const floorMat=new THREE.MeshStandardMaterial({color:0x444444});
const floor=new THREE.Mesh(floorGeo,floorMat);

floor.rotation.x=-Math.PI/2;
scene.add(floor);



/* WALLS */

function wall(x,z,rot){

const geo=new THREE.BoxGeometry(30,5,1);
const mat=new THREE.MeshStandardMaterial({color:0x999999});

const w=new THREE.Mesh(geo,mat);

w.position.set(x,2.5,z);
w.rotation.y=rot;

scene.add(w);

}

wall(0,-15,0);
wall(0,15,0);
wall(-15,0,Math.PI/2);
wall(15,0,Math.PI/2);



/* PLAYER */

player=new THREE.Object3D();
scene.add(player);

camera.position.set(0,1.7,0);
player.add(camera);



/* CLUES */

createClue(-5,0,"A bloody knife...");
createClue(5,5,"A strange note...");
createClue(0,-5,"Footprints on the floor...");



animate();
}



function createClue(x,z,text){

const geo=new THREE.BoxGeometry(1,1,1);
const mat=new THREE.MeshStandardMaterial({color:0xff0000});

const cube=new THREE.Mesh(geo,mat);

cube.position.set(x,0.5,z);
cube.userData.text=text;

scene.add(cube);

clues.push(cube);
}



function animate(){

requestAnimationFrame(animate);

movePlayer();

renderer.render(scene,camera);

}



function movePlayer(){

const speed=0.1;

if(keys["ArrowUp"]) player.position.z-=speed;
if(keys["ArrowDown"]) player.position.z+=speed;
if(keys["ArrowLeft"]) player.position.x-=speed;
if(keys["ArrowRight"]) player.position.x+=speed;

camera.lookAt(
player.position.x,
1.7,
player.position.z-5
);

checkClues();

}



function checkClues(){

clues.forEach(clue=>{

const dist=player.position.distanceTo(clue.position);

if(dist<2){

showClue(clue.userData.text);

}

});

}



function showClue(text){

const popup=document.getElementById("cluePopup");

popup.innerText=text;
popup.style.display="block";

setTimeout(()=>{
popup.style.display="none";
},2000);

}



window.addEventListener("keydown",e=>{

keys[e.key]=true;

});

window.addEventListener("keyup",e=>{

keys[e.key]=false;

});



document.getElementById("startBtn").onclick=()=>{

document.getElementById("menu").style.display="none";

init();

};