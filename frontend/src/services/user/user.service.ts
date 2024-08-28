import api from "..";

class UserService {
  getUsersByRole() {
    return api.get("/roles");
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
}

export default new UserService();
