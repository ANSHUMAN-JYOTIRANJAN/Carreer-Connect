import UserLayout from "@/layout/UserLayout";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.css";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";
export default function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  const [userloginMethod, setUserloginMethod] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");

  const handleRegister = () => {
    if (!userName || !name || !email || !password) {
      alert("Please fill all fields");
      return;
    }
    console.log("User Registered");
    dispatch(registerUser({ username: userName, password, email, name }));
  };

  const handleLogin = () => {
    if (!email || !password) {
      alert("Please fill email and password");
      return;
    }
    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn, router]);

  useEffect(() => {
    if (authState.isSuccess && !authState.loggedIn && !userloginMethod) {
       setUserloginMethod(true);
    }
  }, [authState.isSuccess, authState.loggedIn, userloginMethod]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/dashboard");
    }
  });

  useEffect(() => {
    dispatch(emptyMessage());
  }, [userloginMethod]);

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          {/* LEFT SIDE */}
          <div className={styles.cardContainer__left}>
            <p className={styles.cardleft__heading}>
              {userloginMethod ? "Sign In" : "Sign Up"}
            </p>
            <p style={{ color: authState.isError ? "red" : "green" }}>
              {authState.message}
            </p>
            <div className={styles.inputContainer}>
              {!userloginMethod && (
                <div className={styles.inputRow}>
                  <input
                    onChange={(e) => setUserName(e.target.value)}
                    className={styles.inputfield}
                    type="text"
                    placeholder="Username"
                  />

                  <input
                    onChange={(e) => setName(e.target.value)}
                    className={styles.inputfield}
                    type="text"
                    placeholder="Name"
                  />
                </div>
              )}

              <input
                onChange={(e) => setEmail(e.target.value)}
                className={styles.inputfield}
                type="email"
                placeholder="Email"
              />

              <input
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputfield}
                type="password"
                placeholder="Password"
              />

              <button
                className={styles.button}
                onClick={() => {
                  if (userloginMethod) {
                    handleLogin();
                  } else {
                    handleRegister();
                  }
                }}
              >
                {userloginMethod ? "Login" : "Register"}
              </button>

              <p
                style={{ cursor: "pointer", marginTop: "10px" }}
                onClick={() => setUserloginMethod(!userloginMethod)}
              >
                {userloginMethod
                  ? "Don't have an account? Sign Up"
                  : "Already have an account? Sign In"}
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className={styles.cardContainer__right}>Welcome Back</div>
        </div>
      </div>
    </UserLayout>
  );
}
