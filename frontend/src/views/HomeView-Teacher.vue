<!-- src/components/Subjects.vue -->
<template>
  <div class="app">
    <div class="fondo">
      <h1 class="title">Teacher</h1>
      <table class="subjects-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre del Alumno</th>
            <th>Apellidos del Alumno</th>
            <th>Email del Alumno</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in students" :key="student.id">
            <td>{{ student.id }}</td>
            <td>{{ student.name }}</td>
            <td>{{ student.surname }}</td>
            <td>{{ student.email }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import userService from "../services/user/user.service";

export default {
  data: () => ({
    id: "",
    name: "",
    surname: "",
  }),
  setup() {
    const students = ref([]);

    const fetchAsignaturas = async () => {
      try {
        const response = await userService.getUsersByRole();
        students.value = response.data;
      } catch (error) {
        console.error("Error al obtener las asignaturas:", error);
      }
    };

    onMounted(() => {
      fetchAsignaturas();
    });

    return {
      students,
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
.title {
  text-align: center;
  font-family: "Helvetica", sans-serif;
  font-size: 60px;
  font-weight: 800;
  color: #45a049;
  margin-bottom: 20px;
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
