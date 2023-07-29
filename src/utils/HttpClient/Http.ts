import axios from "axios";
import * as qs from "qs";

import { ignoredErrorCodes, overrideErrorCodes } from "@/utils/ErrorCodes";
import wrapClient from "./wrapClient";
import IAxiosInstance from "./IAxiosInstance";
import cacheAdapter from "./CacheAdapter";

const Http: IAxiosInstance = <any>axios.create({
  baseURL: "/api",
  timeout: 60000 * 10,
  withCredentials: true,
  adapter: cacheAdapter(),
  paramsSerializer: function (params) {
    return qs.stringify(params);
  },
});

wrapClient(Http);
Http.interceptors.response.use((response) => {
  const { data } = response;
  if (!data.success) {
    const { disableErrorMessage, formatErrorMessage } = response.config;
    if (!disableErrorMessage && !ignoredErrorCodes.includes(data.code)) {
      let msg = overrideErrorCodes.get(data.code) || data.message;
      if (formatErrorMessage) {
        msg = formatErrorMessage(msg);
      }
      console.error(msg);
    }
    return Promise.reject(data.code);
  }
  return data;
});

export default Http;
