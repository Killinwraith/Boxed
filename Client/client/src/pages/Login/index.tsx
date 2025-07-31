import Layout from "./Layout";
import UserCard from "./UserCard";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const index = () => {
  const { loginAction } = useParams();

  return (
    <>
      <Layout>
        {loginAction === "signIn" ? (
          <UserCard title="This is Sign In" description="SignIn" />
        ) : loginAction === "signUp" ? (
          <UserCard title="This is Sign Up" description="SignUp" />
        ) : (
          <UserCard title="This is Sign In" description="SignIn" />
        )}
      </Layout>
    </>
  );
};

export default index;
