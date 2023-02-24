import * as Three from "three";

import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default class ThreeD {
  private scene: any; // 场景
  private camera: any; // 相机
  private renderer: any; // 渲染器
  private group: any; // 新的组对象，控制模型
  private controls: any; // 创建控件对象
  private path: any; // 路径
  private objName: any; // 模型
  private mtlName: any; // 材质
  private cameraX: Number; // 相机x
  private cameraY: Number; // 相机y
  private cameraZ: Number; // 相机z
  private objSize: Number; // 模型倍数
  private modelSpeed: Number; // 旋转速度
  constructor(
    path: any,
    objName: any,
    mtlName: any,
    cameraX: Number,
    cameraY: Number,
    cameraZ: Number,
    objSize: Number,
    modelSpeed: number
  ) {
    this.path = path;
    this.objName = objName;
    this.mtlName = mtlName || null;
    this.cameraX = cameraX;
    this.cameraY = cameraY;
    this.cameraZ = cameraZ;
    this.objSize = objSize;
    this.modelSpeed = modelSpeed;
  }

  // 初始化
  initThree(instance: HTMLElement | null) {
    // 场景宽高
    const width = instance && instance.clientWidth;
    const height = instance && instance.clientHeight;

    // 1. 创建场景对象Scene
    this.scene = new Three.Scene();

    // 2. 创建相机对象fov 代表视角\aspect 宽高比\near 最近看到\far 最远看到
    this.camera = new Three.PerspectiveCamera(50, 1, 0.1, 2000);
    // 设置相机位置(眼睛位置或者说相机篇拍照位置x,y,z)
    this.camera.position.set(this.cameraX, this.cameraY, this.cameraZ);

    // 3. 创建模型对象
    this.mtlName ? this.loadObjAndMtl() : this.loadObj();

    // 4. 创建渲染器对象
    this.renderer = new Three.WebGLRenderer();

    // 设置渲染器的大小
    this.renderer.setSize(Number(width), Number(height));
    this.renderer.setClearColor(0xeeeeee, 0);
    // 将渲染器添加到div中
    instance && instance.append(this.renderer.domElement);

    // 创建光源
    this.createPoint();

    // 动画旋转
    this.animate();
  }

  // 创建obj模型裸模
  loadObj() {
    // 创建一个Group 对象
    this.group = new Three.Group();
    // 把group对象添加到场景中
    this.scene.add(this.group);

    //创建shader材质
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();

    objLoader.load(`${this.path}${this.objName}`, (obj: any) => {
      obj.scale.set(this.objSize, this.objSize, this.objSize); //模型缩放
      // obj.position.set(0, 0, 0); // 设置坐标
      this.scene.add(obj);
      this.group.add(obj);
    });
  }

  // 创建obj材质模型
  loadObjAndMtl() {
    // 创建一个Group 对象
    this.group = new Three.Group();
    // 把group对象添加到场景中
    this.scene.add(this.group);

    //创建shader材质
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();

    mtlLoader.load(`${this.path}${this.mtlName}`, (mtl: any) => {
      // 加载贴图
      objLoader.setMaterials(mtl);

      objLoader.load(`${this.path}${this.objName}`, (obj: any) => {
        obj.scale.set(this.objSize, this.objSize, this.objSize); // 模型缩放
        // obj.position.set(0, 0, 0); // 设置坐标
        this.scene.add(obj);
        this.group.add(obj);
      });
    });
  }

  // 创建光源
  createPoint() {
    //环境光
    const ambientLight = new Three.AmbientLight(0xadadad, 6.4);
    ambientLight.position.set(400, 200, 300);
    this.scene.add(ambientLight);

    // 点光
    // const pointLight = new Three.PointLight(0xffffff, 0.8); //点光源
    // this.scene.add(pointLight);

    //平行光
    const directionalLight = new Three.DirectionalLight(0xffffff, 1);
    directionalLight.position.setScalar(100);
    directionalLight.position.set(0, 0, 0);
    this.scene.add(directionalLight);
  }

  // 动画效果
  animate() {
    this.createControls();
    const angle = 0;
    // 渲染
    const renderEvent = () => {
      //循环调用函数，请求再次执行渲染函数render，渲染下一帧
      requestAnimationFrame(renderEvent);
      // 将场景和摄像机传入到渲染器中
      this.renderer.render(this.scene, this.camera);
      // 围绕物体y轴自转
      this.group.rotation.y -= 0.0001;
      // 围绕空间Y轴旋转
      // this.group.rotateY -= 0.002;
      // 只有在动画循环中调用controls.update()时，才可以使用OrbitControls.autoRotate
      this.controls.update();
    };
    renderEvent();
  }
  // 创建控件对象
  createControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement); //创建控件对象
    this.controls.enableDamping = false;
    // 禁止缩放
    this.controls.enableZoom = true;
    // 允许旋转
    this.controls.autoRotate = true;
    // 禁止手动旋转
    this.controls.enableRotate = true;
    this.controls.autoRotateSpeed = this.modelSpeed;
    // 禁止右键拖拽
    this.controls.enablePan = false;
    //相机距离观察目标点极小距离——模型最大状态
    // controls.minDistance = 500;
    //相机距离观察目标点极大距离——模型最小状态
    // controls.maxDistance = 800;
  }
}
