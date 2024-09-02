import api from "..";

class UserService {
  getStudents() {
    return api.post("/students");
  }
  getSubjectsByStudent(userData: { id: string }) {
    const { id } = userData;
    // Validate data
    if (!id) {
      throw new Error("Id is required");
    }
    return api.post("/subjects");
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
  uploadImage(userData: { access_token: string; image: string }) {
    const { access_token, image } = userData;
    // Validate data
    if (!image) {
      throw new Error("Image is required");
    } else if (!access_token) {
      throw new Error("Access_Token is required");
    }
    return api.post("/upload-image", { access_token, image });
  }
  changeCredentials(userData: {
    name: string;
    surname: string;
    email: string;
    role: number;
  }) {
    const { name, surname, email, role } = userData;
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
    return api.post("/change-credentials", { name, surname, email, role });
  }
}

export default new UserService();
