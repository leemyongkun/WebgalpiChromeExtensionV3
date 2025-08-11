// Enhanced Vuetify-like CSS framework plugin
const vuetifyStub = {
  install(app) {
    // Global components registration stub
    app.config.globalProperties.$vuetify = {
      theme: {
        current: {
          dark: true
        }
      }
    };
  }
};

export default vuetifyStub;
