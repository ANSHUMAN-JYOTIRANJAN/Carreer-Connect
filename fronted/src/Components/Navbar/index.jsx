import React from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

export default function NavBarComponent() {

  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <div className={styles.container}>
      
      {/* LEFT SIDE - LOGO */}
      <div
        className={styles.logo}
        onClick={() => router.push("/dashboard")}
      >
        LinkedIn
      </div>

      {/* CENTER - NAV ITEMS */}
      {/* <div className={styles.navItems}>
        <div
          className={styles.navItem}
          onClick={() => router.push("/dashboard")}
        >
          Home
        </div>

        <div
          className={styles.navItem}
          onClick={() => router.push("/network")}
        >
          My Network
        </div>

        <div
          className={styles.navItem}
          onClick={() => router.push("/post")}
        >
          Post
        </div>

        <div
          className={styles.navItem}
          onClick={() => router.push("/profile")}
        >
          Profile
        </div>
      </div> */}

      {/* RIGHT SIDE */}
      <div className={styles.rightSection}>
        <div
          className={styles.logout}
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/login");
            dispatch(reset());
          }} 
        >
          Logout
        </div>
      </div>

    </div>
  );
}