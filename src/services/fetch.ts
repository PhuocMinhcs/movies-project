const API_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZWYyMmRlNjQ1N2E2MDY4MmY5ZmZlNWU0YjY5M2I3YiIsIm5iZiI6MTc2Mjc2MzQ3Ny41NTYsInN1YiI6IjY5MTFhMmQ1NDlhMmQ1Y2JjOGNlOGUzNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qLgqdChP0d-eHnewsOfe3_gMKexHZL161rBzRZNv_mc";
export class HttpRequest {
  private static requestInstance: typeof fetch;
  private static internalOptions: Record<string, any>;

  constructor() {
    HttpRequest.requestInstance = window.fetch.bind(window);
    HttpRequest.internalOptions = {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    };
  }

  async get(url: string, options: Record<string, any> = {}) {
    return HttpRequest.requestInstance(url, {
      ...HttpRequest.internalOptions,
      method: "GET",
      ...options,
    });
  }

  post(
    url: string,
    body: Record<string, any>,
    options: Record<string, any> = {}
  ) {
    return HttpRequest.requestInstance(url, {
      ...HttpRequest.internalOptions,
      method: "POST",
      body: JSON.stringify(body),
      ...options,
    });
  }

  static setOption(key: string, value: string) {
    HttpRequest.internalOptions = {
      ...HttpRequest.internalOptions,
      [key]: value,
    };
  }
}

const HttpRequestInstance = new HttpRequest();
export default HttpRequestInstance;
