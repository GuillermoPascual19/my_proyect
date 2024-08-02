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

    console.log("HOLAculo");
    return api.post("/register", {
      username: username.trim(),
      name: name.trim(),
      surname: surname.trim(),
      email: email.trim(),
      password: password.trim(),
      role: role.trim(),
    });
  }
}

export default new AuthService();
