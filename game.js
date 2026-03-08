let scene,camera,renderer
let objects=[]
let keys={}
let evidence=[]

let yaw=0
let pitch=0

const PLAYER_HEIGHT = 1.8

function startGame(){

document.getElementById("menu").style.display="none"

init()
animate()

document.body.requestPointerLock()

}

function init(){

scene=new THREE.Scene()

/* SKY COLOR (background) */

scene.background = new THREE.Color(0xaec6cf)

camera=new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
1000
)

camera.position.set(0,PLAYER_HEIGHT,8)

renderer=new THREE.WebGLRenderer({antialias:true})
renderer.setSize(window.innerWidth,window.innerHeight)
document.body.appendChild(renderer.domElement)

/* LIGHTING */

const ambient=new THREE.AmbientLight(0xffffff,0.6)
scene.add(ambient)

const light=new THREE.PointLight(0xffffff,1.5)
light.position.set(0,6,0)
scene.add(light)

/* FLOOR (WOOD STYLE) */

const floor=new THREE.Mesh(
new THREE.PlaneGeometry(80,80),
new THREE.MeshStandardMaterial({color:0x8b5a2b})
)

floor.rotation.x=-Math.PI/2
scene.add(floor)

/* ROOMS */

createRoom(0,0)
createRoom(12,0)
createRoom(-12,0)

/* TABLES */

createTable(0,0)
createTable(12,0)
createTable(-12,0)

/* CLUES */

createClue(0,0,"Victim Note")
createClue(12,0,"Bloody Knife")
createClue(-12,0,"Broken Phone")
createClue(-12,2,"Mysterious Key")

/* INPUT */

document.addEventListener("keydown",e=>keys[e.key.toLowerCase()]=true)
document.addEventListener("keyup",e=>keys[e.key.toLowerCase()]=false)

document.addEventListener("mousemove",look)
document.addEventListener("click",interact)

}

/* ROOM CREATOR */

function createRoom(x,z){

let wallMat=new THREE.MeshStandardMaterial({color:0xf5f5f5})

let walls=[

[0,-6,0],
[0,6,0],
[-6,0,Math.PI/2],
[6,0,Math.PI/2]

]

walls.forEach(w=>{

let wall=new THREE.Mesh(
new THREE.BoxGeometry(12,6,0.5),
wallMat
)

wall.position.set(x+w[0],3,z+w[1])
wall.rotation.y=w[2]

scene.add(wall)

})

}

/* TABLE */

function createTable(x,z){

let table=new THREE.Mesh(
new THREE.BoxGeometry(2,1,2),
new THREE.MeshStandardMaterial({color:0x6b4a2f})
)

table.position.set(x,0.5,z)

scene.add(table)

}

/* CLUE */

function createClue(x,z,name){

let obj=new THREE.Mesh(
new THREE.BoxGeometry(0.4,0.2,0.4),
new THREE.MeshStandardMaterial({color:0xffd966})
)

obj.position.set(x,1.2,z)

obj.userData.name=name

scene.add(obj)
objects.push(obj)

}

/* MOUSE LOOK */

function look(e){

yaw-=e.movementX*0.002
pitch-=e.movementY*0.002

pitch=Math.max(-1.5,Math.min(1.5,pitch))

camera.rotation.order="YXZ"
camera.rotation.y=yaw
camera.rotation.x=pitch

}

/* MOVEMENT */

function move(){

let speed=0.15

let forward=new THREE.Vector3()
camera.getWorldDirection(forward)

let right=new THREE.Vector3()
right.crossVectors(camera.up,forward)

if(keys["w"]) camera.position.add(forward.clone().multiplyScalar(speed))
if(keys["s"]) camera.position.add(forward.clone().multiplyScalar(-speed))
if(keys["a"]) camera.position.add(right.clone().multiplyScalar(speed))
if(keys["d"]) camera.position.add(right.clone().multiplyScalar(-speed))

/* LOCK PLAYER TO FLOOR */

camera.position.y = PLAYER_HEIGHT

}

/* CLUE INTERACTION */

function interact(){

let ray=new THREE.Raycaster()

ray.setFromCamera(new THREE.Vector2(0,0),camera)

let hit=ray.intersectObjects(objects)

if(hit.length>0){

let clue=hit[0].object.userData.name

if(!evidence.includes(clue)){

evidence.push(clue)

let li=document.createElement("li")
li.textContent=clue

document.getElementById("evidenceList").appendChild(li)

}

}

}

/* GAME LOOP */

function animate(){

requestAnimationFrame(animate)

move()

renderer.render(scene,camera)

}