import { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import "./login.scss";

const Login = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    loginWithNear,
    loginWithEmail,
    loading,
    error,
    clearError,
    nearInitialized
  } = useContext(AuthContext);

  const [loginMethod, setLoginMethod] = useState("near");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when switching login methods
  useEffect(() => {
    setFormError("");
    clearError();
  }, [loginMethod, clearError]);

  const handleNearLogin = async () => {
    if (!nearInitialized) {
      setFormError("NEAR wallet is still initializing. Please wait...");
      return;
    }
    await loginWithNear();
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setFormError("");

    // Basic validation
    if (!formData.email || !formData.password) {
      setFormError("Please fill in all fields");
      return;
    }

    if (!formData.email.includes("@")) {
      setFormError("Please enter a valid email address");
      return;
    }

    const result = await loginWithEmail(
      formData.email,
      formData.password,
      formData.rememberMe
    );

    if (!result.success) {
      setFormError(result.error || "Login failed");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className="login">
      <div className="loginContainer">
        <div className="loginLeft">
          <div className="brandSection">
            <div className="logo">
              <AccountBalanceWalletIcon className="logoIcon" />
              <h1>Startup Dashboard</h1>
            </div>
            <p className="tagline">
              Manage your startup with powerful analytics and insights
            </p>
            <div className="features">
              <div className="feature">
                <span className="checkmark">✓</span>
                <span>Real-time Analytics</span>
              </div>
              <div className="feature">
                <span className="checkmark">✓</span>
                <span>NEAR Protocol Integration</span>
              </div>
              <div className="feature">
                <span className="checkmark">✓</span>
                <span>Secure & Reliable</span>
              </div>
            </div>
          </div>
        </div>

        <div className="loginRight">
          <div className="loginBox">
            <h2>Welcome Back</h2>
            <p className="subtitle">Sign in to access your dashboard</p>

            {(error || formError) && (
              <div className="errorMessage">
                {error || formError}
              </div>
            )}

            <div className="loginMethodToggle">
              <button
                className={`toggleBtn ${loginMethod === "near" ? "active" : ""}`}
                onClick={() => setLoginMethod("near")}
              >
                <AccountBalanceWalletIcon className="icon" />
                NEAR Wallet
              </button>
              <button
                className={`toggleBtn ${loginMethod === "email" ? "active" : ""}`}
                onClick={() => setLoginMethod("email")}
              >
                <EmailIcon className="icon" />
                Email
              </button>
            </div>

            {loginMethod === "near" ? (
              <div className="nearLogin">
                <p className="methodDescription">
                  Connect with your NEAR wallet to access the dashboard securely
                  using blockchain technology.
                </p>
                <button
                  className="nearWalletBtn"
                  onClick={handleNearLogin}
                  disabled={loading || !nearInitialized}
                >
                  <AccountBalanceWalletIcon className="icon" />
                  {loading ? "Connecting..." : !nearInitialized ? "Initializing..." : "Connect NEAR Wallet"}
                </button>
                <div className="walletInfo">
                  <small>
                    Don't have a NEAR wallet?{" "}
                    <a
                      href="https://wallet.testnet.near.org"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Create one here
                    </a>
                  </small>
                </div>
              </div>
            ) : (
              <div className="emailLogin">
                <form onSubmit={handleEmailLogin}>
                  <div className="formGroup">
                    <label htmlFor="email">Email Address</label>
                    <div className="inputWrapper">
                      <EmailIcon className="inputIcon" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="formGroup">
                    <label htmlFor="password">Password</label>
                    <div className="inputWrapper">
                      <LockIcon className="inputIcon" />
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        className="togglePassword"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="formOptions">
                    <label className="checkboxLabel">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                        disabled={loading}
                      />
                      <span>Remember me</span>
                    </label>
                    <Link to="/forgot-password" className="forgotPassword">
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    className="loginBtn"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </button>
                </form>

                <div className="signupLink">
                  Don't have an account?{" "}
                  <Link to="/signup">Create one now</Link>
                </div>
              </div>
            )}

            <div className="divider">
              <span>or</span>
            </div>

            <div className="alternativeMethod">
              <small>
                {loginMethod === "near"
                  ? "Prefer traditional login? "
                  : "Want to use blockchain? "}
                <button
                  className="switchMethodBtn"
                  onClick={() =>
                    setLoginMethod(loginMethod === "near" ? "email" : "near")
                  }
                >
                  {loginMethod === "near"
                    ? "Use Email/Password"
                    : "Use NEAR Wallet"}
                </button>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;