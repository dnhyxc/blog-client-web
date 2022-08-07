export type Result<T> =
  | {
      success: true;
      code: string;
      data: T;
      response: any; // 原始数据
      message: string;
    }
  | {
      success: false;
      err: Error;
      message: string;
      code?: number | string;
      data?: any;
    };

export function normalizeResult<T = any>(res: {
  err: Error | null;
  data: any;
  code?: string;
}): Result<T> {
  if (!res) {
    return {
      success: false,
      data: null,
      message: '',
      err: new Error(''),
      code: '',
    };
  }

  if (res.err) {
    return {
      success: false,
      err: res.err,
      message: res.err.message,
      code: res.code,
    };
  }
  // 第一层 data 是服务端返回的原始 response
  let { data } = res;

  if (!data) {
    return {
      success: false,
      err: new Error(''),
      message: '未知错误',
      code: '',
    };
  }

  /**
   * data 是数组的情况
   * （还没有发现什么接口什么情况下服务端会直接返回数组，虽然双春说有）
   */
  if (Array.isArray(data)) {
    return {
      success: true,
      data: data as any,
      response: res.data,
      code: res.data.code,
      message: res.data.message,
    };
  }

  /**
   * 返回错误
   */
  if (data.success !== true) {
    return {
      success: false,
      err: new Error(data.message),
      message: data.message,
      data,
      code: data.code,
    };
  }

  // 第二层 data 为 response 的 data 属性
  ({ data } = data);

  // 如果 data 下面有且只有一层 data，则进入下一层
  while (
    data &&
    Object.prototype.hasOwnProperty.call(data, 'data') &&
    Object.keys(data).length === 1
  ) {
    ({ data } = data);
  }

  return {
    success: true,
    data,
    response: res.data,
    code: res.data.code,
    message: res.data.message,
  };
}
