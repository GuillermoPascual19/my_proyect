<template>
  <div class="app">
    <div class="user-info">
      <span class="user-name">{{ userName }}</span>
      <v-avatar class="avatar" size="80" color="grey" @click="gotoProfile">
        <v-img :src="profilePictureUrl"></v-img>
      </v-avatar>
    </div>

    <!-- File Upload -->
    <!-- <vue-file-agent
        v-model="selectedFile"
        @select="onFileSelected"
        multiple
      ></vue-file-agent> -->
    <div class="botones">
      <router-link to="/settings" class="button">
        <v-btn
          class="ma-2"
          color="purple"
          icon="mdi-wrench"
          @click="changeCredentials"
        ></v-btn>
        <span class="text">Settings</span>
      </router-link>
      <router-link to="/login" class="button">
        <v-btn
          class="ma-2"
          color="purple"
          icon="mdi-exit-to-app"
          @click="cerrarSesion"
        ></v-btn>
        <span class="text">Close Session</span>
      </router-link>
    </div>

    <div class="fondo">
      <h1 class="title">Teacher</h1>
      <table class="subjects-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre del Alumno</th>
            <th>Apellidos del Alumno</th>
            <th>Email del Alumno</th>
            <th>Asignatura</th>
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
