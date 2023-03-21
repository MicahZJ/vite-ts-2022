import * as THREE from "three";

import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

import * as TWEEN from "@tweenjs/tween.js";

export default class ThreeD {
  private scene: any; // 场景
  private camera: any; // 相机
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
    // this.cameraPosition = [
    //   { radius: 5, phi: 0, theta: Math.PI / 4 },
    //   { radius: 10, phi: Math.PI / 4, theta: Math.PI / 2 },
    //   { radius: 5, phi: Math.PI / 2, theta: Math.PI },
    //   { radius: 10, phi: (3 * Math.PI) / 4, theta: (3 * Math.PI) / 2 },
    // ];
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
    this.camera.position.set(600, 300, 100);
    // 设置相机视角的角度
    this.camera.lookAt(new THREE.Vector3(0,0,5));

    // 3.创建组和模型
    this.group = new THREE.Group(); // 组-天目湖
    this.group2 = new THREE.Group(); // 组-天目湖-总光圈
    this.group3 = new THREE.Group(); // 组-天目湖-普通光圈
    this.group4 = new THREE.Group(); // 组-天目湖-光标

    // 创建cube简单模型
    this.loadGlb("plane.glb", "pm", true, 1); // 平面

    // 创建光圈-总的
    this.loadGlbCylinder("Cylinder2.glb", "cycle", true, 10, 0, 0, 0);

    // 标注点
    this.loadGlbPoint("biaozhi.glb", "dian", true, 20);

    // 把group对象添加到场景中
    this.scene.add(this.group);
    this.scene.add(this.group2);
    this.scene.add(this.group3);
    this.scene.add(this.group4);

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

    // 初始化相机位置
    this.setupCameraPosition();

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
      },
      undefined,
      function (e) {
        console.error(e);
      }
    );
  }

  /**
   *  创建glb模型-圆柱体-普通
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
      },
      undefined,
      function (e) {
        console.error(e);
      }
    );
  }

  /**
   * 创建glb模型-附带地图发光解析
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
        model.position.set(0, 0, 0); // 模型坐标偏移量xyz
        model.scale.set(scale, scale, scale);
        model.name = name;
        model.visible = showFlag;
        this.group.add(model);
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

  // 动画效果
  animate() {
    const clock = new THREE.Clock();

    // 渲染
    const renderEvent = () => {
      // const spt = clock.getDelta() * 1000; // 毫秒
      // console.log("一帧的时间:毫秒", spt);
      // console.log("帧率FPS", 1000 / spt);

      //循环调用函数，请求再次执行渲染函数render，渲染下一帧
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

      // 围绕空间Y轴旋转
      // this.group.rotateY(0.03);
      TWEEN.update();
    };
    renderEvent();
  }

  // 创建控件对象
  createControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement); //创建控件对象
    this.controls.enableDamping = false;
    // 禁止缩放
    this.controls.enableZoom = true;
    // 允许场景自动旋转
    // this.controls.autoRotate = true;
    // 禁止手动旋转
    this.controls.enableRotate = true;
    this.controls.autoRotateSpeed = this.modelSpeed;
    // 禁止右键拖拽
    this.controls.enablePan = false;
    // 控制相机观察视角
    this.controls.target.set(0, 100, 50);
    //相机距离观察目标点极小距离——模型最大状态
    // controls.minDistance = 500;
    //相机距离观察目标点极大距离——模型最小状态
    // controls.maxDistance = 800;
    // update函数会执行lookAt方法
    this.controls.update();
  }

  // 点击模型
  clickObj = (event: any) => {
    const myModel = this.scene.getObjectByName("pm");
    // myModel.rotation.x += 0.1;
    // myModel.rotation.y += 0.1;
    console.log("模型", myModel);
    this.animateCamera();
  };

  // 移动相机位置
  positionCamera() {
    // // 定义相机的初始位置和目标位置
    // const initialPosition = new THREE.Vector3(600, 300, 100);
    // const initialTarget = new THREE.Vector3(400, 300, 150);
    //
    // // 将相机和控制器的初始位置和目标位置设置为刚才定义的位置
    // this.camera.position.copy(initialPosition);
    // this.controls.target.copy(initialTarget);
    //
    // // 定义向前移动的距离
    // const distance = 0;
    //
    // // 计算新的相机位置和目标位置
    // const newPosition = new THREE.Vector3();
    // const newTarget = new THREE.Vector3();
    // newPosition
    //   .copy(this.camera.position)
    //   .add(this.controls.target)
    //   .normalize()
    //   .multiplyScalar(distance)
    //   .add(this.controls.target);
    // newTarget.copy(this.controls.target);
    //
    // // 将相机和控制器的位置和目标位置设置为新位置
    // this.camera.position.copy(newPosition);
    // this.controls.target.copy(newTarget);

    // 计算摄像头在路径上的位置
    const index = Math.floor(Date.now() * 0.001) % this.cameraPosition.length;
    const point = this.cameraPosition[index];
    const position = new THREE.Vector3();
    position.setFromSphericalCoords(point.radius, point.phi, point.theta);
    this.camera.position.copy(position);

    // 计算摄像头朝向
    const target = new THREE.Vector3(0, 0, 0);
    target.setFromSphericalCoords(point.radius, point.phi, point.theta);
    this.camera.lookAt(target);
  }

  setupCameraPosition() {
    this.cameraPosition = new THREE.Vector3(200, 100, 100);
    this.cameraTarget = new THREE.Vector3(0, 0, 0);
  }

  animateCamera() {
    console.log('test', this.camera)
    // const tween = new TWEEN.Tween(this.camera.position)
    //   .to(this.cameraPosition, 2000)
    //   .easing(TWEEN.Easing.Quadratic.InOut)
    //   .onUpdate(() => {
    //     this.camera.lookAt(this.cameraTarget);
    //   })
    //   .start();

    // 创建一个目标位置和视角
    const targetPosition = new THREE.Vector3(-500, 100, 0);
    const targetLookAt = new THREE.Vector3(0, 0, 0);

    // 创建一个 tween 动画实例，过渡相机位置和视角到目标位置和视角
    const cameraPositionTween = new TWEEN.Tween(this.camera.position)
      .to(targetPosition, 2000)
      .easing(TWEEN.Easing.Quadratic.InOut)
    const cameraLookAtTween = new TWEEN.Tween(this.camera.rotation)
      .to({z: 1.5, y: Math.PI/2}, 2000)
      .easing(TWEEN.Easing.Quadratic.InOut)

    // 设置 tween 动画链，同时执行位置和视角的 tween 动画
    const cameraTween = new TWEEN.Tween({})
      .chain(cameraPositionTween, cameraLookAtTween)
      .start();
  }
}
