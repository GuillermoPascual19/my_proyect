import api from ".";

class UserService {
  getStudents() {
    return api.get("/teachers");
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
  changeCredentials(userData: {
    name: string;
    surname: string;
    email: string;
    role: number;
    id: number;
    access_token: string;
  }) {
    const { name, surname, email, role, id, access_token } = userData;
    // Validate data
    if (!surname) {
      throw new Error("Username is required");
    } else if (!email) {
      throw new Error("Email is required");
    } else if (!role) {
      throw new Error("Access_Token is required");
    } else if (!name) {
      throw new Error("Name is required");
    } else if (!access_token) {
      throw new Error("Access_Token is required");
    }
    return api.post(
      "/changeCredentials",
      { name, surname, email, role, id },
      { headers: { Authorization: `Bearer ${access_token}` } }
    );
  }
  assignSubject(userData: {
    access_token: string;
    email: string;
    subject: string;
  }) {
    const { access_token, email, subject } = userData;
    // Validate data
    if (!email) {
      throw new Error("Email is required. Insert a valid email");
    } else if (!subject) {
      throw new Error("Subject is required. Insert a valid subject");
    }
    console.log(userData);
    return api.post("/assign-subject", { access_token, email, subject });
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
  getUsers() {
    return api.get("/users");
  }
  changeRole(userData: { email: string; role: number }) {
    const { email, role } = userData;
    // Validate data
    if (!email) {
      throw new Error("Email is required");
    } else if (!role) {
      throw new Error("Role is required");
    }
    return api.post("/change-role", { email, role });
  }
  deleteUser(userData: { email: string }) {
    const { email } = userData;
    // Validate data
    if (!email) {
      throw new Error("Email is required");
    }
    return api.post("/delete-user", { email });
  }
  uploadImage(userData: unknown) {
    console.log(userData);

    return api.post("/upload-image", userData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}
export default new UserService();
