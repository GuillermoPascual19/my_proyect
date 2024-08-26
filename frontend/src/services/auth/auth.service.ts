import api from "..";

class AuthService {
  async login(userData: { username: string; password: string }) {
    const { username, password } = userData;
    // Validate data
    if (!username || !password) {
      throw new Error("All fields are required");
    }
    await api.post("/signin", { username, password }).then((response) => {
      console.log("RESPONSE:", response);
      return response;
    });
  }

  register(userData: {
    username: string;
    name: string;
    surname: string;
    email: string;
    password: string;
    role: string;
  }) {
    const { username, name, surname, email, password, role } = userData;
    // Validate data
    if (!username || !name || !surname || !email || !password || !role) {
      throw new Error("All fields are required");
    }
    return api.post("/register", {
      username,
      name,
      surname,
      email,
      password,
      role,
    });
  }

  forgotPassword(userData: {
    username: string;
    name: string;
    surname: string;
    email: string;
    password: string;
    role: string;
  }) {
    const { username, name, surname, email, password, role } = userData;
    // Validate data
    if (!email) {
      throw new Error("Email is required");
    }
    return api.post("/recover-password", {
      username,
      name,
      surname,
      email,
      password,
      role,
    });
  }
}

export default new AuthService();
