<template>
  <div class="app">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <h1 class="text-center">Error {{ status }}</h1>
          <h2 class="text-subcenter">Unexpected error!</h2>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data: () => ({
    status: 404,
  }),
  methods: {
    async fetchData() {
      try {
        const response = await fetch("https://api.example.com/data");
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
<style>
.text-center {
  text-align: center;
  color: #333;
  background-color: #cef3de;
  padding: 10px;
  border-radius: 5px;
  margin-top: 20px;
  font-size: 22px;
  font-style: italic;
  box-shadow: 0 4px 10px 4px rgba(0, 0, 0, 0.3);
}
.text-subcenter {
  text-align: center;
  margin-top: 20px;
  font-size: 22px;
  font-style: italic;
  box-shadow: 0 4px 10px 4px rgba(0, 0, 0, 0.3);
}
</style>
