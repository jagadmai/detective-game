let scene,camera,renderer
let objects=[]
let keys={}
let evidence=[]

let yaw=0
let pitch=0

function startGame(){

document.getElementById("menu").style.display="none"

init()
animate()

document.body.requestPointerLock()

}

function init(){

scene=new THREE.Scene()

camera=new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
1000
)

camera.position.set(0,1.8,8)

renderer=new THREE.WebGLRenderer({antialias:true})
renderer.setSize(window.innerWidth,window.innerHeight)
document.body.appendChild(renderer.domElement)

const ambient=new THREE.AmbientLight(0xffffff,0.4)
scene.add(ambient)

const light=new THREE.PointLight(0xffffff,2)
light.position.set(0,5,5)
scene.add(light)

const floor=new THREE.Mesh(
new THREE.PlaneGeometry(50,50),
new THREE.MeshStandardMaterial({color:0x1a1a1a})
)

floor.rotation.x=-Math.PI/2
scene.add(floor)

createWall(0,-25,0)
createWall(0,25,0)
createWall(-25,0,Math.PI/2)
createWall(25,0,Math.PI/2)

createClue(0,1,"Suspicious Note")
createClue(-3,1,"Bloody Knife")
createClue(3,1,"Victim Phone")

document.addEventListener("keydown",e=>keys[e.key.toLowerCase()]=true)
document.addEventListener("keyup",e=>keys[e.key.toLowerCase()]=false)

document.addEventListener("mousemove",look)
document.addEventListener("click",interact)

}

function createWall(x,z,r){

let wall=new THREE.Mesh(
new THREE.BoxGeometry(50,8,1),
new THREE.MeshStandardMaterial({color:0x444444})
)

wall.position.set(x,4,z)
wall.rotation.y=r

scene.add(wall)

}

function createClue(x,z,name){

let obj=new THREE.Mesh(
new THREE.BoxGeometry(0.5,0.2,0.5),
new THREE.MeshStandardMaterial({color:0xffd966})
)

obj.position.set(x,0.5,z)

obj.userData.name=name

scene.add(obj)
objects.push(obj)

}

function look(e){

yaw-=e.movementX*0.002
pitch-=e.movementY*0.002

pitch=Math.max(-1.5,Math.min(1.5,pitch))

camera.rotation.order="YXZ"
camera.rotation.y=yaw
camera.rotation.x=pitch

}

function move(){

let speed=0.15

let forward=new THREE.Vector3()
camera.getWorldDirection(forward)

let right=new THREE.Vector3()
right.crossVectors(camera.up,forward)

if(keys["w"]) camera.position.add(forward.multiplyScalar(speed))
if(keys["s"]) camera.position.add(forward.multiplyScalar(-speed))
if(keys["a"]) camera.position.add(right.multiplyScalar(speed))
if(keys["d"]) camera.position.add(right.multiplyScalar(-speed))

}

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

function animate(){

requestAnimationFrame(animate)

move()

renderer.render(scene,camera)

}