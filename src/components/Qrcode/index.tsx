import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import styles from './index.less';

interface IProps {}

const Qrcode: React.FC<IProps> = () => {
  const qrcodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    QRCode.toCanvas(
      window.location.href,
      {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 100,
        // color: {
        //   dark: '#010599FF',
        //   light: '#FFBF60FF',
        // },
      },
      (err, canvas) => {
        if (err) throw err;
        qrcodeRef.current?.appendChild(canvas);
      }
    );
  }, [qrcodeRef]);

  return (
    <div className={styles.Qrcode}>
      <div ref={qrcodeRef} />
      <div>微信扫码分享</div>
    </div>
  );
};

export default Qrcode;
