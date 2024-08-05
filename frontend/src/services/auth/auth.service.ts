import api from "..";

class AuthService {
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
}

export default new AuthService();
