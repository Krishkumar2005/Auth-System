import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";
import styles from "./Auth.module.css";

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await registerUser(data);
      toast.success("Account created! Welcome aboard.", { icon: "✦" });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate max date (must be at least 13 years old)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 13);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join us today. Fill in your details to get started."
      isRegister
    >
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
        {/* Name */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Full Name</label>
          <div className={`${styles.inputWrapper} ${errors.name ? styles.inputError : ""}`}>
            <span className={styles.inputIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </span>
            <input
              type="text"
              placeholder="John Doe"
              className={styles.input}
              {...register("name", {
                required: "Name is required",
                minLength: { value: 2, message: "Name must be at least 2 characters" },
              })}
            />
          </div>
          {errors.name && <span className={styles.errorMsg}>{errors.name.message}</span>}
        </div>

        {/* Date of Birth */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Date of Birth</label>
          <div className={`${styles.inputWrapper} ${errors.dateOfBirth ? styles.inputError : ""}`}>
            <span className={styles.inputIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </span>
            <input
              type="date"
              max={maxDateStr}
              className={`${styles.input} ${styles.dateInput}`}
              {...register("dateOfBirth", {
                required: "Date of birth is required",
              })}
            />
          </div>
          {errors.dateOfBirth && <span className={styles.errorMsg}>{errors.dateOfBirth.message}</span>}
        </div>

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
              placeholder="Min 6 characters"
              className={styles.input}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => setShowPassword((p) => !p)}
              aria-label="Toggle password"
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

        {/* Submit */}
        <button type="submit" className={styles.submitBtn} disabled={isLoading}>
          {isLoading ? (
            <span className={styles.btnLoader} />
          ) : (
            <>
              <span>CREATE ACCOUNT</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </>
          )}
        </button>

        {/* Switch to login */}
        <p className={styles.switchText}>
          Already have an account?{" "}
          <Link to="/login" className={styles.switchLink}>Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
