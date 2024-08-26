<template>
  <div class="app">
    <div class="fondo">
      <h1 class="title">Student</h1>
      <h3 class="subtitle">Asignaturas</h3>
      <table class="subjects-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre de la Asignatura</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="subject in subjects" :key="subject.id">
            <td>{{ subject.id }}</td>
            <td>{{ subject.name }}</td>
          </tr>
        </tbody>
      </table>
      <div class="form-container">
        <input
          v-model="newSubject"
          placeholder="Nueva Asignatura"
          class="input-subject"
        />
        <button @click="addSubject" class="btn-add">Añadir Asignatura</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const subjects = ref([
      { id: 1, name: "Matemáticas" },
      { id: 2, name: "Ciencias" },
      { id: 3, name: "Historia" },
    ]);

    const newSubject = ref("");

    const addSubject = () => {
      if (newSubject.value.trim() !== "") {
        subjects.value.push({
          id: subjects.value.length + 1,
          name: newSubject.value.trim(),
        });
        newSubject.value = "";
      }
    };

    return {
      subjects,
      newSubject,
      addSubject,
    };
  },
};
</script>
<style scoped>
.app {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 90vh; /* Full viewport height */
  background-color: #f8f9fa;
  margin: 0;
}

.fondo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; /* Center content horizontally */
  width: 800px;
  background: rgba(19, 35, 47, 0.9);
  border-radius: 5px;
  padding: 30px;
  box-shadow: 0 4px 10px 4px rgba(0, 0, 0, 0.3);
}

.title {
  text-align: center;
  font-family: "Helvetica", sans-serif;
  font-size: 60px;
  font-weight: 800;
  color: #45a049;
  margin-bottom: 20px;
}

.subjects-table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.subjects-table th,
.subjects-table td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ccc;
}

.subjects-table th {
  background-color: #e0e0e0;
}

.subjects-table tbody tr:nth-child(odd) {
  background-color: #f9f9f9;
}

.subjects-table tbody tr:nth-child(even) {
  background-color: #f0f0f0;
}

.form-container {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  width: 100%; /* Ensure the form takes the full width of the container */
}

.input-subject {
  flex: 1;
  padding: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
}

.btn-add {
  padding: 5px 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-add:hover {
  background-color: #45a049;
}
</style>
