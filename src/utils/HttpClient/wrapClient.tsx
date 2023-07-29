/**
 * 不需要全局的错误提示消息时，请求需传入disableErrorMessage: true
 * 需要根据不同错误码做不同处理时，自行进行try catch
 * example:
 *  try {
 *    await Http.post('/api/test/url', data, { disableErrorMessage: true })
 *  } catch(e) {
 *    // custom error handle
 * }
 */

let errorMessageVisible = false;
let messageVisible = false;
let networkErrorVisible = false;
let conflictModalVisible = false;

export default (instance: {
  interceptors: {
    request: {
      use: (
        arg0: { (config: any): any; (config: any): any; (config: any): any },
        arg1: {
          (error: any): Promise<never>;
          (error: any): Promise<never>;
          (error: any): Promise<never>;
        }
      ) => void;
    };
    response: {
      use: (arg0: (response: any) => any, arg1: (error: any) => any) => void;
    };
  };
}) => {
  instance.interceptors.request.use(
    (config) => {
      if (navigator.onLine) {
        return config;
      } else {
        console.error("您没有联网，请检查网络连接");
        return Promise.reject("no network");
      }
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.request.use(
    (config) => {
      if (config.method && config.method.toLowerCase() === "get") {
        config.params = config.params || {};
        config.params["__timestamp__"] = Date.now();
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.request.use(
    (config) => {
      config.headers["x-csrf-token"] = "";
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.message === "Network Error" && !networkErrorVisible) {
        networkErrorVisible = true;
        console.error("网络异常").promise.finally(() => {
          networkErrorVisible = false;
        });
      }

      const { response } = error;
      if (response) {
        const { formatErrorMessage, disableErrorMessage } = response.config;

        switch (response.status) {
          case 502: {
            if (!errorMessageVisible) {
              errorMessageVisible = true;
              console
                .error("服务异常，请联系系统管理员。", 5)
                .promise.finally(() => {
                  errorMessageVisible = false;
                });
            }
            break;
          }

          default:
            if (
              !disableErrorMessage &&
              response &&
              response.data &&
              response.data.message
            ) {
              let msg = response.data.message;
              if (formatErrorMessage) {
                msg = formatErrorMessage(msg);
              }
              console.error(msg);
            }
            break;
        }
      }

      return Promise.reject(error);
    }
  );
};
