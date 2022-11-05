import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';

// 打印
/**
 * 导出页面为PDF格式，1pt === 4/3px，1px === 0.75pt
 * @param { String } title 文件名
 * @param { Number } type 0：生成PDF、1：生成base64
 * @param { Boolean } longitudinalShow true：横向打印，false：纵向打印
 * @returns { Promise }
 */
export const onPrintElement = ({
  element,
  title = '文章内容',
  type,
  longitudinalShow,
}: {
  element: HTMLDivElement | null;
  title?: string;
  type?: string;
  longitudinalShow?: boolean;
}) => {
  return new Promise((resolve) => {
    if (!element) return;
    html2canvas(element, {
      allowTaint: true, // 是否允许不同源的图片污染画布
      useCORS: true, // 是否尝试使用 CORS 从服务器加载图片
      scale: 1, // 用于渲染的比例，默认为浏览器设备像素比率
    }).then((canvas) => {
      // a4纸 pt尺寸
      const a4Size = {
        w: 595.28,
        h: 841.89,
      };
      // 算的是 px单位需要转 pt，a4纸与当前canvas的间距，用于居中
      const l =
        (((longitudinalShow ? a4Size.h : a4Size.w) * 1.33 - canvas.width) / 2) * 0.75;

      const pageData = canvas.toDataURL('image/jpeg', 1.0);

      const PDF = new JsPDF({
        unit: 'pt',
        format: 'a4',
      });
      // 表高度，pt单位比较
      let sheetHeight = canvas.height * 0.75;
      let t = 0;
      // 是否需要转换宽高(a4纸打印做转向了，但是分页处理没有转向)
      const isRotate = longitudinalShow ? a4Size.w : a4Size.h;
      // 当表小于a4的高时，无需分页
      if (isRotate > sheetHeight) {
        /*
          addImage(img, JPEG, left, top, width, height) pt单位
            1. 宽高传0，默认为原始图片的px单位
            2. 如果传入图片原始宽高会识别为pt，打印出来后会进行1.333倍的放大
            3. 打个比方a4纸的宽pt单位为595.28，px单位为793.71，一个图片宽高为180px
               如果使用默认为0的，打印出来还是为180px，如果手动设置180，打印出来就会转换为240px
               意思就是如果图片原始为px单位，设置的pt单位打印就不需要传，如果图片原始为pt单位，设置的pt单位打印就需要传
        */
        PDF.addImage(pageData, 'JPEG', l, 24, 0, 0);
      } else {
        while (sheetHeight > 0) {
          PDF.addImage(pageData, 'JPEG', l, t, 0, 0);
          sheetHeight -= isRotate;
          t -= isRotate;
          // 避免添加空白页
          if (sheetHeight > 0) {
            PDF.addPage();
          }
        }
      }
      if (!type) {
        PDF.save(`${title}.pdf`);
      } else {
        const basePDf = PDF.output('datauristring');
        resolve(basePDf);
      }
    });
  });
};

// 下载指定的元素
export const onDowmloadElement = (element: HTMLDivElement | null) => {
  if (element) {
    html2canvas(element, {
      allowTaint: true,
      useCORS: true, // 是否尝试使用 CORS 从服务器加载图片
    }).then((canvas) => {
      const obj = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = obj;
      link.setAttribute('download', '文章内容.png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
};
