import axios from "axios";
import qs from "qs";
import AxiosDebug from "axios-debug-log";

// eslint-disable-next-line no-unused-vars
let TARGET = {
  URL: "",
  TYPE: "local"
};

/*class RemoteAPIError extends Error {
  constructor(...args) {
    super(...args);
    Object.setPrototypeOf(this, RemoteAPIError.prototype);
  }
}*/

AxiosDebug({
  request(debug, config) {
    debug(
      `Request(${config.method.toUpperCase()}) ${config.baseURL}${config.url}${
        config.params
          ? "?" + qs.stringify(config.params, { arrayFormat: "repeat" })
          : ""
      }`
    );
    if (config.data) {
      debug(` - Payload\n${JSON.stringify(config.data, null, 2)}`);
    }
  },
  response(debug, response) {
    debug(
      `Response(${response.status}) ${response.config.url}${
        response.config.params
          ? "?" +
            qs.stringify(response.config.params, { arrayFormat: "repeat" })
          : ""
      }`
    );
    // debug(` - Headers\n${JSON.stringify(response.config.headers, null, 2)}`);
    debug(` - Result\n${JSON.stringify(response.data, null, 2)}`);
  },
  error(debug, error) {
    debug(
      `Error(${error.response.status})\n${JSON.stringify(
        error.response.data,
        null,
        2
      )}`
    );
  }
});

export const connection = axios.create();
connection.defaults.baseURL = "http://localhost:8080";

/*
fetch("/config/config.json")
  .then(result => result.json())
  .then(res => {
    TARGET.URL = res.URL;
    TARGET.TYPE = res.TYPE;
    connection.defaults.baseURL = TARGET.URL;
  })
  .then(() => {});
*/

// connection.defaults.timeout = 60000;
//connection.defaults.withCredentials = true;
connection.defaults.responseType = "json";
connection.defaults.paramsSerializer = params => {
  return qs.stringify(params || {}, { arrayFormat: "repeat", allowDots: true });
};

connection.interceptors.request.use(
  config => {
    // config.headers.common["X-CA-TOKEN"] = localStorage.getItem("token");
    config.headers.common["Content-Type"] = "application/json";
    config.headers.post["Content-Type"] = "application/json"; //multipart/form-data
    config.headers.put["Content-Type"] = "application/json";
    config.headers.patch["Content-Type"] = "application/json";

    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

connection.interceptors.response.use(
  response => {
    return response.data;
  },
  err => {
    const data = err.response.data || {};
    const status = err.response.status;

    switch (status) {
      case 401:
        // return 하지 않고 exception은 pass down 한다
        if (data.code === "10008") {
          modal.alert(data.message, "error");
          location.href = "/signin";
        }
        break;
      case 403:
        // return 하지 않고 exception은 pass down 한다
        if (data.code === "10006") {
          //권한없음.
          modal.alert(data.message, "error");
        }
        break;
      default:
        break;
    }
    // new RemoteAPIError();
    // return Promise.reject(data);
    /*const error = new RemoteAPIError();
        error.message = `[${status}] ${data.data || data.message}`;
        error.data = data;
        error.status = status;*/
    return Promise.reject(data);
  }
);
