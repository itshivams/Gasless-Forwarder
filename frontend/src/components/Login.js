import styles from "../styles/Login.module.css";

export default function Login() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.loginBox}>
          <h2>Login</h2>
          <form action="#">
            <div className={styles.inputBox}>
              <input type="email" required />
              <label>Email</label>
            </div>
            <div className={styles.inputBox}>
              <input type="password" required />
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
