import { useState } from "react";
import { useRouter } from "next/router"; // for redirection
import styles from "../styles/Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push("/main");
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.loginBox}>
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputBox}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label>Email</label>
            </div>
            <div className={styles.inputBox}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label>Password</label>
            </div>
            <div className={styles.forgotPass}>
              <a href="#">Forgot your password?</a>
            </div>
            <button type="submit" className={styles.btn}>
              Login
            </button>
            <div className={styles.signupLink}>
              <p>
                Have no account yet? <a href="#">Signup</a>
              </p>
            </div>
          </form>
        </div>

        {[...Array(50)].map((_, index) => (
          <span key={index} style={{ "--i": index }}></span>
        ))}
      </div>
    </div>
  );
}
