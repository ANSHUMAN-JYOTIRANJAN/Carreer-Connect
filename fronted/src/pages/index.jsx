import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";



const inter = Inter({ subsets: ["latin"] });
export default function Home() {
  const router = useRouter();
  return (
    <>
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          <div className={styles.mainContainer__left}>
            <p>Connect with Friends without Exaggeration</p>
            <p>A true Social media Platform, with stories no bulfs</p>
            <div
              onClick={() => {
                router.push("/login");
              }}
              className={styles.buttonJoin}
            >
              <p>Join now</p>
            </div>
          </div>
          <div className={styles.mainContainer__right}>
            <img src="/homepage.jpg" alt="homepage" width={500} height={500} />
          </div>
        </div>
      </div>
    </>
  );
}
