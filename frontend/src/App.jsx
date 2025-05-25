import React from "react";
import { useAuth } from "react-oidc-context";
import { WebStorageStateStore } from "oidc-client-ts";
import TaskManager from "./components/TaskManager";
import {jwtDecode} from "jwt-decode";
import './App.css';


function App() {
  const auth = useAuth({
    userStore: new WebStorageStateStore({ store: window.localStorage }),
  });

  const signOutRedirect = () => {
    const clientId = "65rlfov95907n18k29kd87aps2";
    const logoutUri = "http://localhost:3000/";
    const cognitoDomain = "https://us-east-1aaknbv8oc.auth.us-east-1.amazoncognito.com";

    // Clear local/session storage ONLY on sign out
    localStorage.clear();
    sessionStorage.clear();

    // Redirect to Cognito logout
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) return <div>Loading...</div>;
  if (auth.error) return <div>Error: {auth.error.message}</div>;

  if (!auth.isAuthenticated) {
    return (
      <div className="auth-buttons">
        <h2>Welcome to Task Manager</h2>
        <button onClick={() => auth.signinRedirect()}>Sign In</button>
      </div>
    );
  }

  const decodedToken = jwtDecode(auth.user.id_token);
  const uuid = decodedToken.sub;

  return (
    <div>
      <header className="app-header">
        <h2>Hello, {auth.user?.profile.email}</h2>
        <button onClick={signOutRedirect}>Sign Out</button>
      </header>
      <TaskManager token={auth.user.access_token} uuid={uuid} />
    </div>
  );
}

export default App;
