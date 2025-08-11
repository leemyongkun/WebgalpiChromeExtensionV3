<template>
  <div class="app">
    <div :style="style">
      <div
        class="card mx-auto"
        style="max-width: 344px; border: 1px solid #ccc;"
      >
        <div class="list-item three-line">
          <div class="list-item-content">
            <div class="list-item-title headline mb-1">
              {{ LANG.DESCRIPTION_MESSAGE("D0079") }}
            </div>
            <div class="list-item-subtitle pb-4 pt-2">
              {{ LANG.DESCRIPTION_MESSAGE("D0080") }}
            </div>
            <div class="list-item-subtitle" style="color: #e35a69">
              {{ LANG.DESCRIPTION_MESSAGE("D0081") }}
            </div>
          </div>
        </div>

        <div class="card-actions">
          <button class="btn primary" style="width: 100%" @click="goDashboard">
            {{ LANG.BUTTON_MESSAGE("B0022") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Common from "../common/common";
import LANG from "../common/language";

export default {
  components: {},
  data: () => ({
    style: "max-height: 390px; height: 42x; width: 350px;",
    LANG: LANG
  }),
  created() {},
  methods: {
    goDashboard() {
      Common.goDashboard();
    }
  },
  mounted() {
    document.body.classList.add("theme-dark");
  }
};
</script>
<style>
.app {
  height: 100vh;
}

.card {
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
}

.list-item {
  padding: 16px;
}

.list-item-content {
  display: flex;
  flex-direction: column;
}

.list-item-title {
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 8px;
}

.list-item-subtitle {
  color: #666;
  font-size: 0.875rem;
}

.card-actions {
  padding: 16px;
  display: flex;
  justify-content: flex-end;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  text-transform: uppercase;
}

.btn.primary {
  background-color: #1976d2;
  color: white;
}

.btn:hover {
  opacity: 0.8;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.mb-1 {
  margin-bottom: 8px;
}

.pb-4 {
  padding-bottom: 16px;
}

.pt-2 {
  padding-top: 8px;
}

.headline {
  font-size: 1.25rem;
  font-weight: 500;
}

/* Dark theme styles */
body.theme-dark .card {
  background: #2d2d2d;
  color: white;
}

body.theme-dark .list-item-subtitle {
  color: #ccc;
}
</style>
