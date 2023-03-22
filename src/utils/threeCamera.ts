import * as THREE from "three";

import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { Water } from 'three/examples/jsm/objects/Water.js';

import * as TWEEN from "@tweenjs/tween.js";

export default class ThreeD {
  private scene: any; // 场景
  private camera: any; // 相机
  private water: any; // 水面
  private renderer: any; // 渲染器
  private group: any; // 新的组对象，控制模型
  private group2: any; // 圆柱体模组
  private group3: any; // 圆柱体模组-普通点
  private group4: any; // 点位模型
  private controls: any; // 创建控件对象
  private path: any; // 路径
  private objName: any; // 模型
  private mtlName: any; // 材质
  private cameraX: Number; // 相机x
  private cameraY: Number; // 相机y
  private cameraZ: Number; // 相机z
  private objSize: Number; // 模型倍数
  private modelSpeed: Number; // 旋转速度
  private screenWidth: Number; // 旋转速度
  private screenHeight: Number; // 旋转速度
  private raycaster: any; // 光线投射用于进行鼠标拾取
  private mouse: any; // 二维向量是一对有顺序的数字（标记为x和y）
  private cameraPosition: any; // 测试相机位置
  private cameraTarget: any; // 测试相机视角
  private beIntersectObjects: Array<any> = []; // 存放需要射线检测的物体数组
  constructor(
    cameraX: Number,
    cameraY: Number,
    cameraZ: Number,
    objSize: Number,
    modelSpeed: number
  ) {
    this.cameraX = cameraX;
    this.cameraY = cameraY;
    this.cameraZ = cameraZ;
    this.objSize = objSize;
    this.modelSpeed = modelSpeed;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.screenWidth = 0;
    this.screenHeight = 0;
  }

  /**
   * 初始化
   * @param instance 容器dom
   */
  initThree(instance: HTMLElement | null) {
    // 场景宽高
    const width: any = instance && instance.clientWidth;
    const height: any = instance && instance.clientHeight;
    this.screenWidth = width;
    this.screenHeight = height;

    // 1. 创建场景对象Scene
    this.scene = new THREE.Scene();
    // 创建场景背景贴图
    const textureCube = new THREE.CubeTextureLoader().load([
      "model/1.jpg",
      "model/2.jpg",
      "model/3.jpg",
      "model/4.jpg",
      "model/5.jpg",
      "model/6.jpg",
    ]);
    // 作为背景贴图
    this.scene.background = textureCube;

    // 2. 创建相机对象fov 代表视角\aspect 宽高比\near 最近看到\far 最远看到
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 200000);
    // 设置相机位置(眼睛位置或者说相机篇拍照位置x,y,z)
    this.camera.position.set(400, 300, 0);
    // 设置相机视角的角度,现在这个设置是无效的，是由于引用了OrbitControls控件，相机的lookAt 被OrbitControls控件更改
    // this.camera.lookAt(new THREE.Vector3(0,0,5));

    // 3.创建组和模型
    this.group = new THREE.Group(); // 组-天目湖
    this.group2 = new THREE.Group(); // 组-天目湖-总光圈
    this.group3 = new THREE.Group(); // 组-天目湖-普通光圈
    this.group4 = new THREE.Group(); // 组-天目湖-光标

    // 创建cube简单模型
    this.loadGlb("plane.glb", "pingmian", true, 1); // 平面

    // 创建光圈-总的
    this.loadGlbCylinder("Cylinder2.glb", "cyclebig", true, 10, 0, 0, 0);

    // 标注点
    this.loadGlbPoint("biaozhi.glb", "dianwei", true, 50);

    // 把group对象添加到场景中
    this.scene.add(this.group);
    this.scene.add(this.group2);
    this.scene.add(this.group3);
    this.scene.add(this.group4);

    this.createWater()

    // 4. 创建光源
    this.createPoint();

    // 5. 创建渲染器对象
    this.renderer = new THREE.WebGLRenderer();
    // 设置渲染器的大小
    this.renderer.setSize(Number(width), Number(height));
    // 增加背景颜色
    this.renderer.setClearColor(0xeeeeee, 0);
    // 将渲染器添加到div中
    instance && instance.append(this.renderer.domElement);

    // 6. 创建控制器
    this.createControls();

    // 7. 动画旋转
    this.animate();

    // 场景坐标辅助线（选择性功能）
    const axesHelper = new THREE.AxesHelper(150);
    this.scene.add(axesHelper);
  }
  // 创建glb模型-圆柱体
  /**
   *
   * @param obj 文件名字
   * @param name 模型名字
   * @param showFlag 是否展示
   * @param scale 放大倍数
   * @param x
   * @param y
   * @param z
   */
  loadGlbCylinder(
    obj: string,
    name: string,
    showFlag: any,
    scale: number,
    x: number,
    y: number,
    z: number
  ) {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("three/js/libs/draco/gltf/");
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.load(
      `model/${obj}`,
      (gltf) => {
        const model = gltf.scene;
        model.position.set(x, y, z); // 模型坐标偏移量xyz
        model.scale.set(scale, scale, scale);
        model.name = name;
        model.visible = showFlag;
        model.traverse((object: any) => {
          if (object.isMesh) {
            // 开启透明度
            object.material.transparent = true; //开启透明
            object.material.opacity = 0.3; //设置透明度
          }
        });
        this.group2.add(model);
        this.beIntersectObjects.push(model);
      },
      undefined,
      function (e) {
        console.error(e);
      }
    );
  }

  /**
   *  创建glb模型-光标
   * @param obj 文件名字
   * @param name 模型名字
   * @param showFlag 是否展示
   * @param scale 放大倍数
   * @param x
   * @param y
   * @param z
   */
  loadGlbPoint(obj: string, name: string, showFlag: any, scale: number) {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("three/js/libs/draco/gltf/");
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.load(
      `model/${obj}`,
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 0, 0); // 模型坐标偏移量xyz
        model.scale.set(scale, scale, scale);
        model.name = name;
        model.visible = showFlag;
        model.traverse((object: any) => {
          if (object.isMesh) {
            // 开启透明度
            object.material.transparent = true; //开启透明
            object.material.opacity = 1; //设置透明度
          }
        });
        this.group4.add(model);
        this.beIntersectObjects.push(model);
      },
      undefined,
      function (e) {
        console.error(e);
      }
    );
  }

  /**
   * 创建glb模型-地面
   * @param obj 文件名字
   * @param name 模型名字
   * @param showFlag 是否展示
   * @param scale 放大倍数
   */
  loadGlb(obj: string, name: string, showFlag: any, scale: number) {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("three/js/libs/draco/gltf/");
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.load(
      `model/${obj}`,
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 10, 0); // 模型坐标偏移量xyz
        model.scale.set(scale, scale, scale);
        model.name = name;
        model.visible = showFlag;
        model.traverse((object: any) => {
          if (object.isMesh) {
            // 开启透明度
            object.material.transparent = true; //开启透明
            object.material.opacity = .6; //设置透明度
          }
        });
        this.group.add(model);
        this.beIntersectObjects.push(model);
      },
      undefined,
      function (e) {
        console.error(e);
      }
    );
  }

  // 创建光源
  createPoint() {
    //环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    // ambientLight.position.set(400, 200, 300);
    this.scene.add(ambientLight);

    // 点光
    const pointLight = new THREE.PointLight(0xffffff, 1); //点光源
    pointLight.position.set(100, 150, 100);
    this.scene.add(pointLight);

    // 灯光辅助线
    const sphereSize = 10;
    const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
    this.scene.add(pointLightHelper);

    //平行光
    // const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    // directionalLight.position.setScalar(100);
    // directionalLight.position.set(0, 0, 0);
    // this.scene.add(directionalLight);
  }

  // 创建水面
  createWater() {
    // Water
    const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );

    this.water = new Water(
      waterGeometry,
      {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load( 'model/waternormals.jpg', function ( texture ) {

          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

        } ),
        sunDirection: new THREE.Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        fog: this.scene.fog !== undefined
      }
    );

    this.water.rotation.x = - Math.PI / 2;

    this.scene.add( this.water );
  }

  // 动画效果
  animate() {
    const clock = new THREE.Clock();
    // 渲染
    const renderEvent = () => {

      //循环调用函，请求再次执行渲染函数render，渲染下一帧
      requestAnimationFrame(renderEvent);
      // 将场景和摄像机传入到渲染器中
      this.renderer.render(this.scene, this.camera);
      // 围绕物体y轴自转
      // this.group.rotation.y -= 0.002;

      // 圆柱体扩散动画
      this.group2.scale.x = this.group2.scale.x + 0.5;
      this.group2.scale.y = this.group2.scale.y - 0.01;
      this.group2.scale.z = this.group2.scale.z + 0.5;

      if (this.group2.scale.x > 50) {
        this.group2.scale.x = 1;
        this.group2.scale.y = 1;
        this.group2.scale.z = 1;
      }

      // 上下移动
      const time = Date.now() * 0.005;
      this.group4.position.y = Math.cos(time) * 1.75 + 2.25;

      // angle += 0.005
      // // 重新设置相机位置，相机在XY平面绕着坐标原点旋转运动
      // this.camera.position.x= 200*Math.sin(angle)
      // this.camera.position.z= 200*Math.cos(angle)
      // 固定相机视角，旋转的时候也不变
      this.camera.lookAt(new THREE.Vector3(0,0,5));

      // 围绕空间Y轴旋转
      // this.group.rotateY(0.01);
      TWEEN.update();

      // 水面特效
      this.water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
    };
    renderEvent();
  }

  // 创建控件对象
  createControls() {
    //创建控件对象
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = false;
    // 禁止缩放
    this.controls.enableZoom = true;
    // 允许场景自动旋转
    this.controls.autoRotate = false;
    // 禁止手动旋转
    this.controls.enableRotate = true;
    this.controls.autoRotateSpeed = this.modelSpeed;
    // 禁止右键拖拽
    this.controls.enablePan = false;
    // 控制相机观察视角
    this.controls.target.set(0, 0, 5);
    //相机距离观察目标点极小距离——模型最大状态
    // controls.minDistance = 500;
    //相机距离观察目标点极大距离——模型最小状态
    // controls.maxDistance = 800;
    // update函数会执行lookAt方法
    this.controls.update();
  }

  // 点击模型
  clickObj = (event: any) => {

    //将鼠标点击位置的屏幕坐标转换成threejs中的标准坐标
    this.mouse.x = (event.clientX/Number(this.screenWidth))*2-1
    this.mouse.y = -((event.clientY/Number(this.screenHeight))*2-1)

    // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
    this.raycaster.setFromCamera( this.mouse, this.camera );

    // 获取raycaster直线和所有模型相交的数组集合
    const intersects = this.raycaster.intersectObjects(this.beIntersectObjects, true);
    console.log('数组集合', intersects);

    if (intersects.length > 0) { //碰到东西，文档说距离排序，因此最近的为第一个。
      const object = intersects[0].object
      console.log('当前点击对象', object)
      object.material.color.set( 0xff0000 );
      // 如果是指定模型，进行视角选择操作
      if (object.name == 'Cone001') this.animateCamera();
    }

    //将所有的相交的模型的颜色设置为红色
    // for ( let i = 0; i < intersects.length; i++ ) {
    //   intersects[i].object.material.color.set( 0xff0000 );
    // }
  };

  animateCamera() {
    // 创建一个目标位置和视角
    const targetPosition = new THREE.Vector3(100, 150, 100);
    const targetLookAt = new THREE.Vector3(0, 0, 0);

    // 创建一个 tween 动画实例，过渡相机位置和视角到目标位置和视角
    const cameraPositionTween = new TWEEN.Tween(this.camera.position)
      .to(targetPosition, 2000)
      .easing(TWEEN.Easing.Quadratic.InOut)

    // 设置 tween 动画链，同时执行位置和视角的 tween 动画
    const cameraTween = new TWEEN.Tween({})
      .chain(cameraPositionTween)
      .start();
  }
}
