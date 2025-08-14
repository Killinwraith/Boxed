// src/pages/Login.tsx
import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>;

  if (isAuthenticated) {
    return <div>You are already logged in!</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6">
      <h1 className="text-3xl font-bold">Welcome</h1>
      <p className="text-center text-gray-600">
        Sign in or sign up to access your dashboard. You can use Email/Password
        or login with Google, GitHub, or Apple.
      </p>

      <div className="flex flex-col gap-4">
        <button
          onClick={() =>
            loginWithRedirect({
              authorizationParams: {
                screen_hint: "login",
              },
            })
          }
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Log In / Sign Up
        </button>

        {/* Optional: Separate social provider buttons */}
        {/* 
        <button
          onClick={() => loginWithRedirect({ connection: "google-oauth2" })}
          className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700"
        >
          Continue with Google
        </button>
        <button
          onClick={() => loginWithRedirect({ connection: "github" })}
          className="bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-900"
        >
          Continue with GitHub
        </button>
        */}
      </div>
    </div>
  );
};

export default Login;
