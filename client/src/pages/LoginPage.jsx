import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";
import styles from "./Auth.module.css";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login(data);
      toast.success("Welcome back!", { icon: "✦" });
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please try again.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign In"
      subtitle="Welcome back. Enter your credentials to continue."
    >
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
        {/* Email */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Email Address</label>
          <div className={`${styles.inputWrapper} ${errors.email ? styles.inputError : ""}`}>
            <span className={styles.inputIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </span>
            <input
              type="email"
              placeholder="you@example.com"
              className={styles.input}
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email address" },
              })}
            />
          </div>
          {errors.email && <span className={styles.errorMsg}>{errors.email.message}</span>}
        </div>

        {/* Password */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Password</label>
          <div className={`${styles.inputWrapper} ${errors.password ? styles.inputError : ""}`}>
            <span className={styles.inputIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={styles.input}
              {...register("password", { required: "Password is required" })}
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => setShowPassword((p) => !p)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
          {errors.password && <span className={styles.errorMsg}>{errors.password.message}</span>}
        </div>

        {/* Extras row */}
        <div className={styles.extrasRow}>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" className={styles.checkbox} />
            <span className={styles.checkmark} />
            <span>Remember me</span>
          </label>
          <button type="button" className={styles.forgotBtn}>Forgot password?</button>
        </div>

        {/* Submit */}
        <button type="submit" className={styles.submitBtn} disabled={isLoading}>
          {isLoading ? (
            <span className={styles.btnLoader} />
          ) : (
            <>
              <span>LOGIN</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </>
          )}
        </button>

        {/* Switch to register */}
        <p className={styles.switchText}>
          Don't have an account?{" "}
          <Link to="/register" className={styles.switchLink}>Create one</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
