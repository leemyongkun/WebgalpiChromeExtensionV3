<template>
  <div>
    {{ test }}
  </div>
</template>

<script>
//https://i.picsum.photos/id/20/400/400.jpg

export default {
  name: "App",
  components: {},
  data() {
    return {
      test: "TS"
    };
  },
  methods: {},
  mounted() {
    alert("!");
  }
};
</script>
