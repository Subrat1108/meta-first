import Movements from './movements.js';
import blockchain from './Web3.js';
import abi from './abi/abi.json' assert { type: 'json' };

//Declare a new scene with three.js
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfd1e5);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//setting up light for the metaverse scene
const ambient_light = new THREE.AmbientLight(0xbda355);
const directional_light = new THREE.DirectionalLight(0xffffff, 1);
ambient_light.add(directional_light);
scene.add(ambient_light);

//setting up the space for the metaverse
const geometry_space = new THREE.BoxGeometry(100, 0.2, 50);
const material_space = new THREE.MeshPhongMaterial({ color: 0xffffff });
const space = new THREE.Mesh(geometry_space, material_space);
scene.add(space);

//Setting up 3D cube
const geometry_cube = new THREE.BoxGeometry();
const material_cube = new THREE.MeshPhongMaterial({ color: 0xffcc00 });
const cube = new THREE.Mesh(geometry_cube, material_cube);
cube.position.set(0, 2, 0);
scene.add(cube);

//Setting up cone
const geometry_cone = new THREE.ConeGeometry(2, 5, 5);
const material_cone = new THREE.MeshPhongMaterial({ color: 0xffcc00 });
const cone = new THREE.Mesh(geometry_cone, material_cone);
cone.position.set(0, 7, 0);
scene.add(cone);

//setting camera position
camera.position.set(10, 5, 40);

renderer.render(scene, camera);

const animate = () => {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  cone.rotation.y += 0.01;

  //upward movement
  if (Movements.isPressed(38)) {
    camera.position.x += 0.05;
    camera.position.y += 0.05;
  }

  //left movement
  if (Movements.isPressed(37)) {
    camera.position.x -= 0.05;
  }

  //Right movement
  if (Movements.isPressed(39)) {
    camera.position.x += 0.05;
  }

  //downward movement
  if (Movements.isPressed(40)) {
    camera.position.x -= 0.05;
    camera.position.y -= 0.05;
  }

  camera.lookAt(space.position);
  renderer.render(scene, camera);
};
animate();

const display_NFTs = function (color) {
  //Web3 connection to data generated in the blockchain to be represented on the metaverse
  blockchain.then(({ totalSupply, buildings }) => {
    //Each building paid for in the smart contract has a graphical representation in the metaverse
    buildings.forEach((building, index) => {
      if (index <= totalSupply) {
        //represention of nft tokens as boxes
        const nft_geometry = new THREE.BoxGeometry(
          building.w,
          building.h,
          building.d
        );
        const nft_material = new THREE.MeshPhongMaterial({
          color: color || 0xffcc00,
        });
        const nft = new THREE.Mesh(nft_geometry, nft_material);
        nft.position.set(building.x, building.y, building.z);
        scene.add(nft);
      }
    });
  });
};

display_NFTs();

const mint_button = document.getElementById('mint');
mint_button.addEventListener('click', function () {
  let nft_name = document.getElementById('name').value;
  let color = document.getElementById('color').value;
  let x = document.getElementById('x').value;
  let y = document.getElementById('y').value;
  let z = document.getElementById('z').value;

  //Check if metamask is not available
  if (typeof window.ethereum === 'undefined') {
    reject('Metamask is required!');
  }

  //Instantiate web3
  let web3 = new Web3(window.ethereum);
  let contract = new web3.eth.Contract(
    abi,
    '0xE3b07796A40cD418472d2071aB2f5816377C828A'
  );

  //Get my metamask address
  web3.eth.requestAccounts().then(accounts => {
    contract.methods
      .mint(nft_name, 2, 2, 2, x, y, z)
      .send({ from: accounts[0] })
      .then(data => {
        console.log('NFT Created Successfully', data);
        display_NFTs(color);
      });
  });
});
