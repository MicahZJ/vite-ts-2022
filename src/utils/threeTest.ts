import * as THREE from "three";

import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

export default class ThreeD {
  private cylinderRadius: any; // 圆柱体半径
  private cylinderOpacity: any; // 圆柱体透明度
  private cylinderMesh: any; // 圆柱网格
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
  constructor(
    cameraX: Number,
    cameraY: Number,
    cameraZ: Number,
    objSize: Number,
    modelSpeed: number
  ) {
    // this.path = path;
    // this.objName = objName;
    // this.mtlName = mtlName || null;
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
    this.camera.position.set(600, 300, 100);
    // 设置相机视角的角度
    this.camera.lookAt(0, 0, 0);

    // 3.创建组和模型
    this.group = new THREE.Group(); // 组-天目湖
    this.group2 = new THREE.Group(); // 组-天目湖-总光圈
    this.group3 = new THREE.Group(); // 组-天目湖-普通光圈
    this.group4 = new THREE.Group(); // 组-天目湖-光标

    // 创建cube简单模型
    this.loadGlb("tianmu_lake.glb", "0", true, 1); // 天目湖

    // 创建光圈-总的
    this.loadGlbCylinder("Cylinder2.glb", "0", true, 10, 0, 0, 0);
    // 创建光圈-白茶馆
    this.loadGlbCylinderNormal("Cylinder2.glb", "1", false, 10);
    // 创建光圈-水族馆
    this.loadGlbCylinderNormal("Cylinder2.glb", "2", false, 10);
    // 创建光圈-电动船
    this.loadGlbCylinderNormal("Cylinder2.glb", "3", false, 10);
    // 创建光圈-十四澜
    this.loadGlbCylinderNormal("Cylinder2.glb", "4", false, 10);
    // 创建光圈-全电厨房
    this.loadGlbCylinderNormal("Cylinder2.glb", "5", false, 10);
    // 标注点
    this.loadGlbPoint("biaozhi.glb", "0", true, 20);

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

    // 场景坐标辅助线（选择性功能）
    // const axesHelper = new THREE.AxesHelper(150);
    // this.scene.add(axesHelper);
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
  loadGlbCylinderNormal(
    obj: string,
    name: string,
    showFlag: any,
    scale: number
  ) {
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
            object.material.opacity = 0.4; //设置透明度
          }
        });

        this.group3.add(model);
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

        model.traverse((child: any) => {
          // 设置线框材质
          if (child.isMesh && child.userData.name !== "backGround") {
            //这个判断模型是楼房还是其他  加载不同的材质
            // 拿到模型线框的Geometry
            this.setCityLineMaterial(child, name, showFlag);
          }
          // 设置线框材质
        });

        // model.name = name;
        // model.visible = showFlag;
        // this.group.add(model);
      },
      undefined,
      function (e) {
        console.error(e);
      }
    );
  }

  // 线条化场景模型
  setCityLineMaterial(object: any, name: any, showFlag: any) {
    const edges = new THREE.EdgesGeometry(object.geometry, 1);
    //设置模型的材质
    const lineMaterial = new THREE.LineBasicMaterial({
      // 线的颜色
      color: "rgba(11, 113, 117, 1)",
      transparent: true,
      opacity: object.name === "floor001" ? 0.1 : 1,
    });
    //把数据组合起来
    const lineS = new THREE.LineSegments(edges, lineMaterial);
    //设置数据的位置
    lineS.position.set(
      object.position.x,
      object.position.y + 0,
      object.position.z
    );
    lineS.name = name;
    lineS.visible = showFlag;
    //添加到场景
    // this.scene.add(lineS);
    this.group.add(lineS);
    lineS.rotateY(Math.PI / 2 + 0.15);
  }

  // 加载cube模型
  loadCube() {
    const geometry = new THREE.BoxGeometry(50, 50, 50); // 结构大小x,y,z
    const material = new THREE.MeshLambertMaterial({
      color: 0x00ffff, // 颜色
      transparent: true, // 开启透明
      opacity: 0.5, // 透明度
    }); // 材质
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);

    // 设置模型坐标位置（x红，y绿，z蓝）
    cube.position.set(0, 0, 0);

    // 旋转45度
    cube.rotateY(Math.PI / 4);

    // 创建一个Group 对象
    this.group = new THREE.Group();
    // 把group对象添加到场景中
    this.scene.add(this.group);
    this.group.add(cube);
  }

  // 创建obj模型裸模
  loadObj() {
    // 创建一个Group 对象
    this.group = new THREE.Group();
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

  // 场景移除group
  remGroup() {
    // this.group.visible = false
    this.scene.remove(this.group);
    // this.scene.clear();
    // console.log('after', this.group)
  }

  // 隐藏组内模型
  /**
   *
   * @param cName 菜单id
   */
  hiddenModel(cName: string) {
    // console.log('test', cName, typeof cName)
    // this.group.children.map((item, index) => {
    //   item.visible = false;
    //   if (item.name === cName) {
    //     item.visible = true;
    //   }
    // })
    this.group2.children.map((item: any, index: number) => {
      item.visible = false;
      if (item.name === cName) {
        item.visible = true;
      }
    });
    switch (cName) {
      case "0":
        this.group3.position.set(0, 0, 0);
        this.group4.position.set(0, 0, 0);
        break;
      case "1":
        this.group3.position.set(-75, 0, 230);
        this.group4.position.set(-75, 0, 230);
        break;
      case "2":
        this.group3.position.set(-230, 0, -10);
        this.group4.position.set(-230, 0, -10);
        break;
      case "3":
        this.group3.position.set(-80, 0, 0);
        this.group4.position.set(-80, 0, 0);
        break;
      case "4":
        this.group3.position.set(-160, 0, 125);
        this.group4.position.set(-160, 0, 125);
        break;
      case "5":
        this.group3.position.set(-235, 0, -70);
        this.group4.position.set(-235, 0, -70);
        break;
    }

    this.group3.children.map((item: any, index: number) => {
      item.visible = false;
      if (item.name === cName) {
        item.visible = true;
      }
    });
  }

  // 终极奥义Threejs内存清除，清的渣都不剩
  deleteThree() {
    function disposeChild(mesh: any) {
      if (mesh instanceof THREE.Mesh) {
        if (mesh.geometry?.dispose) {
          mesh.geometry.dispose(); //删除几何体
        }
        if (mesh.material?.dispose) {
          mesh.material.dispose(); //删除材质
        }
        if (mesh.material?.texture?.dispose) {
          mesh.material.texture.dispose();
        }
      }
      if (mesh instanceof THREE.Group) {
        mesh.clear();
      }
      if (mesh instanceof THREE.Object3D) {
        mesh.clear();
      }
    }

    this.scene.traverse((item: any) => {
      disposeChild(item);
    });
    THREE.Cache.clear();
    this.scene.clear();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }

  // 创建obj材质模型
  loadObjAndMtl() {
    // 创建一个Group 对象
    this.group = new THREE.Group();
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    // ambientLight.position.set(400, 200, 300);
    this.scene.add(ambientLight);

    // 点光
    const pointLight = new THREE.PointLight(0xffffff, 1); //点光源
    pointLight.position.set(100, 150, 100);
    this.scene.add(pointLight);

    // 灯光辅助线
    // const sphereSize = 10;
    // const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
    // this.scene.add(pointLightHelper);

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

      // 扩散动画
      this.group3.scale.x = this.group3.scale.x + 0.1;
      this.group3.scale.y = this.group3.scale.y - 0.01;
      this.group3.scale.z = this.group3.scale.z + 0.1;

      // console.log('圆柱123', this.group3)
      if (this.group3.scale.x > 10) {
        this.group3.scale.x = 1;
        this.group3.scale.y = 1;
        this.group3.scale.z = 1;
      }

      // 上下移动
      const time = Date.now() * 0.005;
      this.group4.position.y = Math.cos(time) * 1.75 + 2.25;

      // 围绕空间Y轴旋转
      // this.group.rotateY(0.03);
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
    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
    this.mouse.x = (event.clientX / Number(this.screenWidth)) * 2 - 1;
    this.mouse.y = -(event.clientY / Number(this.screenHeight)) * 2 + 1;
    // console.log( '点了',  this.mouse);
    this.raycaster.setFromCamera(this.mouse, this.camera);
    // const ray = this.raycaster.ray
    // console.log( ray)

    // 获取raycaster直线和所有模型相交的数组集合
    // const intersects = this.raycaster.intersectObjects( this.group.children );
    // console.log('模型集合', intersects);

    //将所有的相交的模型的颜色设置为红色for ( var i = 0; i < intersects.length; i++ ) {

    // intersects[ i ].object.material.color.set( 0xff0000 );
  };
}
