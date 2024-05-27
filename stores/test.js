export const useTestStore = defineStore("test", {
  state: () => ({
    MS_PROTOCOL: "http",
    MS_API: "localhost",
    MS_PORT: 1000,
  }),
  getters: {
    MS_URL: (state) => `${state.MS_PROTOCOL}://${MS_API}:${state.MS_PORT}`,
  },
  actions: {
    setProtocol(protocol) {
      this.MS_PROTOCOL = protocol;
    },
    setPort(port) {
      console.log("setPort", port);
      this.MS_PORT = port;
    },
    connect() {
      console.log("connect", this.MS_URL);
    },
  },
});
