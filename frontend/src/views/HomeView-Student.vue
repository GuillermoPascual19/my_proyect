<!-- src/components/Subjects.vue -->
<template>
  <div class="fondo">
    <h1>Asignaturas</h1>
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
.fondo {
  margin: 3rem auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 20%;
  min-width: 800px;
  min-height: 500px;
  max-width: 100%;
  background: rgba(19, 35, 47, 0.9);
  border-radius: 5px;
  padding: 40px;
  box-shadow: 0 4px 10px 4px rgba(0, 0, 0, 0.3);
}
body {
  background-color: #f0f0f0;
  color: #333;
  font-family: Arial, sans-serif;
}

h1 {
  color: #555;
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
}

.input-subject {
  padding: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn-add {
  padding: 5px 10px;
  margin-left: 10px;
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
