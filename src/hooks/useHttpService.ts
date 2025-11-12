import HttpRequestInstance from "../services/fetch";

export enum METHODS {
  get = "get",
  post = "post",
}

export const useHttpService = () => {
  return async (
    url: string,
    method: METHODS = METHODS.get,
    body?: Record<string, any>,
    options?: Record<string, any>
  ) => {
    try {
      const res: Response =
        method === METHODS.get
          ? await HttpRequestInstance[method](url, options)
          : await HttpRequestInstance[method](url, (body = {}), options);

      return res.json();
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
};
