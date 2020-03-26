// Check users session status
export default function checkLogin() {
  let access_token = sessionStorage.getItem("access_token");
  console.log("Access Token - " + access_token);

  if (access_token) {
    return {
      status: true,
      access_token: access_token,
      userDetails: {
        email: sessionStorage.getItem("email"),
        user_id: sessionStorage.getItem("user_id"),
        name: sessionStorage.getItem("name"),
        department: sessionStorage.getItem("department")
      }
    };
  } else {
    return {
      status: false,
      access_token: null
    };
  }
}
