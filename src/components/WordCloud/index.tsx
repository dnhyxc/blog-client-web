import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import 'echarts-wordcloud';
// import { useHtmlWidth } from '@/hooks';
import { BIRD_BASE64 } from '@/constant';
import styles from './index.less';

interface IProps {
  data: { name: string; value: number }[];
  callback?: Function;
}

const WordCloud: React.FC<IProps> = ({ data, callback }) => {
  // const { htmlWidth } = useHtmlWidth();

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    const myChart = echarts.init(document.getElementById('main')!);

    const maskImage = new Image();

    // 下面一些翻译是借助翻译工具翻译的，可能不够准确，但我主要是自用够用就行。
    // 也可能是不是翻译，而是自我需要的备注，请注意这点，避免误解。
    const option = {
      series: [
        {
          // echarts 类型
          type: 'wordCloud',
          // 字体大小范围。默认最小12px，最大60px大小。
          sizeRange: [14, 50],
          // [0, 0] 词不旋转，步长为0。
          // 文字旋转范围和步进度。文本将在[0,0]范围内由rotationStep 0 随机旋转。
          rotationRange: [0, 0],
          // 词旋转步长
          rotationStep: 0,
          // 网格大小以像素为单位，用于标记画布的可用性，网格大小越大，词之间的间隙越大。
          gridSize: 5,
          // 把“云”的形状画出来。可以是任何表示为回调函数的极坐标方程，也可以是present的关键字。
          // 有圆形(默认)、心形(苹果或心形曲线，最著名的极坐标方程)、菱形(正方形的别名)、正三角形、
          // 三角形、(直三角形、五边形、星形的别名)。
          shape: 'pentagon',
          // 背景图，可自定义背景图，词云会按照背景图的范围分布。比如背景图是一个心形，
          // 那么词云足够多的时候就会形成一个心形。
          maskImage,
          // 设置为true，允许词超出画布范围。允许词大于画布的尺寸被绘制。
          drawOutOfBound: false,
          // 是否开启动画效果
          layoutAnimation: false,
          // 保持maskImage的纵横比或1:1的形状这个选项是支持的echarts-wordcloud@2.1.0
          keepAspect: true,
          // 全局设置词的样式
          textStyle: {
            // fontWeight: "bold",
            // 配色函数制定配色机制： Math.round() 和 Math.random() 随机给词配色
            color() {
              return `rgb(${[
                Math.round(Math.random() * 225),
                Math.round(Math.random() * 225),
                Math.round(Math.random() * 225),
              ].join(',')})`;
            },
          },
          emphasis: {
            // 每个数据项还支持 textStyle，给单个词自定义文本样式
            textStyle: {
              // 鼠标hover颜色
              color: '#FF863C',
              // color: "#1da57a",
              fontWeight: 'bold',
            },
          },
          left: 'center',
          top: 'center',
          right: null,
          bottom: null,
          // width: htmlWidth < 960 ? '1000%' : 'none',
          // height: htmlWidth < 960 ? '1000%' : 'none', // 当不设置高是，词超出图片范围会显示不完全
          // 数据是一个数组，每个数据项必须包含 name 和 value 属性。name是词，value是词的系数（频率）。
          data,
        },
      ],
    };

    maskImage.onload = () => {
      myChart.setOption(option);
      // 点击某个字
      myChart.on('click', (params: any) => {
        const { name } = params.data;
        callback && callback(name);
      });
    };

    // 放在 public 的img资源使用绝对路径引入有效，或先 import 引入图片资源，再赋值也有效。
    maskImage.src = BIRD_BASE64; // 小鸟
    // maskImage.src = CAT_BASE64; // 猫
    // maskImage.src = IMAGE_BASE64; // 花朵

    // circleImg：爱心背景，树形背景：treeImg，jin鱼背景：whaleImg
    // maskImage.src = whaleImg;

    // 注意，这种直接通过相对地址引入的方式，是无效的，maskImage.onload 会加载失败，
    // 不会进入onload的回调函数，因此在onload回调里面调用echarts初始化是无效的，因为根本不会进入到这里。
    // maskImage.src = './circle.png';

    let timer: any = null;
    // 设备视口大小改变时，重置 echarts
    window.onresize = () => {
      // 简单的防抖动处理
      clearTimeout(timer);
      timer = setTimeout(() => {
        myChart.resize();
      });
    };
  };

  return (
    <div className={styles.WordCloud} key={Math.random()}>
      <div id="main" style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default WordCloud;
