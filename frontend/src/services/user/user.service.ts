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
}

export default new UserService();
