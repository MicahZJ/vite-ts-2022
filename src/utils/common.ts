import elementResizeDetectorMaker from "element-resize-detector";

/*
 * 监听div
 */
export function divListen(div: string, chart: any) {
  // let that = this
  return new Promise(() => {
    const erd = elementResizeDetectorMaker();
    const dom = <HTMLElement>document.getElementById(div);
    // erd.listenTo(
    //   dom,
    //   debounce(async () => {
    //     // that.$nextTick(function () {
    //     //使echarts尺寸重置
    //     console.log("3333");
    //     // await nextTick()
    //     chart && chart.resize();
    //     // })
    //   }, 100)
    // );
  });
}
