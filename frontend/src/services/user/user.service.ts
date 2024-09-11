import api from "..";

class UserService {
  getStudents() {
    return api.post("/teachers");
  }
  getSubjectsByStudent(id: number) {
    // Validate data
    if (!id) {
      throw new Error("Id is required");
    }
    return api.post("/students", { id });
  }
  activateAccount(userData: { access_token: string }) {
    const { access_token } = userData;
    // Validate data
    if (!access_token) {
      throw new Error("Access_Token is required");
    }
    return api.post("/activate-account", { access_token });
  }
  recoverPassword(userData: { email: string }) {
    const { email } = userData;
    // Validate data
    if (!email) {
      throw new Error("Email is required");
    }
    return api.post("/recover-password", { email });
  }
  changePassword(userData: { access_token: string; password: string }) {
    const { access_token, password } = userData;
    // Validate data
    if (!password) {
      throw new Error("Password is required");
    } else if (!access_token) {
      throw new Error("Access_Token is required");
    }
    return api.post("/change-password", { access_token, password });
  }
  deleteUser(userData: { id: string }) {
    const { id } = userData;
    // Validate data
    if (!id) {
      throw new Error("Id is required");
    }
    return api.delete(`/users/${id}`);
  }
  changeCredentials(userData: {
    name: string;
    surname: string;
    email: string;
    role: number;
    id: number;
  }) {
    const { name, surname, email, role, id } = userData;
    // Validate data
    if (!surname) {
      throw new Error("Username is required");
    } else if (!email) {
      throw new Error("Email is required");
    } else if (!role) {
      throw new Error("Access_Token is required");
    } else if (!name) {
      throw new Error("Name is required");
    }
    return api.post("/change-credentials", { name, surname, email, role, id });
  }
  assignSubject(userData: { id: number; email: string; subject: string }) {
    const { id, email, subject } = userData;
    // Validate data
    if (!email) {
      throw new Error("Email is required. Insert a valid email");
    } else if (!subject) {
      throw new Error("Subject is required. Insert a valid subject");
    }
    console.log(userData);
    return api.post("/assign-subject", { id: id, email, subject });
  }
  unassignSubject(userData: { id: number; email: string; subject: string }) {
    const { id, email, subject } = userData;
    // Validate data
    if (!email) {
      throw new Error("Email is required. Insert a valid email");
    } else if (!subject) {
      throw new Error("Subject is required. Insert a valid subject");
    }
    console.log(userData);
    return api.post("/unassign-subject", { id: id, email, subject });
  }
  getAsigNumStud(userData: { id: number }) {
    const { id } = userData;
    // Validate data
    if (!id) {
      throw new Error("Id is required");
    }
    return api.post("/asig-num-stud", { id });
  }
  getNumStudentsPerSubject(id: number) {
    // Validate data
    if (!id) {
      throw new Error("Id is required");
    }
    return api.post("/num-stud-subject", { id });
  }
  // uploadImage(userData: { access_token: string; image: string }) {
  //   const { access_token, image } = userData;
  //   // Validate data
  //   if (!image) {
  //     throw new Error("Image is required");
  //   } else if (!access_token) {
  //     throw new Error("Access_Token is required");
  //   }
  //   return api.post("/upload-image", { access_token, image });
  // }
  uploadImage(userData: { access_token: string; file: File }) {
    const { access_token, file } = userData;
    console.log(userData);
    // Validate data
    if (!file) {
      throw new Error("File is required");
    } else if (!access_token) {
      throw new Error("Access_Token is required");
    }
    return api.post("/upload-image", userData);
  }
}
export default new UserService();
