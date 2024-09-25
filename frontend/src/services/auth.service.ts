import api from ".";

class AuthService {
  login(userData: { email: string; password: string }) {
    const { email, password } = userData;
    // Validate data
    if (!email || !password) {
      throw new Error("All fields are required");
    }
    return api
      .post("/signin", { email, password })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Login failed");
        }
        return response.data; // Extracting the actual data
      })
      .catch((error) => {
        console.error("Login failed:", error);
        throw error;
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
  loginGoogle(userData: { idToken: string }) {
    const { idToken } = userData;
    // Validate data
    if (!idToken) {
      throw new Error("IdToken is required");
    }
    return api.post("/loginGoogle", { idToken }).then((response) => {
      console.log("authService.loginGoogle:", response);
      return response.data;
    });
  }

  logOut(userData: { access_token: string }) {
    const { access_token } = userData;
    // Validate data
    if (!access_token) {
      throw new Error("AuthService.Access_token is required");
    }
    console.log("AuthService.cerrarSesion hasta aquí esta bien");
    return api.post("/closeSession", { access_token });
  }
}

export default new AuthService();
