import { createContext, useReducer, useEffect, useState } from "react";
import AuthReducer from "./authReducer";
import { initNear } from "../utils/nearConfig";

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  authType: localStorage.getItem("authType") || null,
  isAuthenticated: !!localStorage.getItem("user"),
  loading: false,
  error: null,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  const [wallet, setWallet] = useState(null);
  const [nearInitialized, setNearInitialized] = useState(false);

  // Initialize NEAR wallet connection
  useEffect(() => {
    const initialize = async () => {
      try {
        const { wallet: walletConnection } = await initNear();
        setWallet(walletConnection);
        setNearInitialized(true);

        // Check if user is already signed in with NEAR
        if (walletConnection.isSignedIn()) {
          const accountId = walletConnection.getAccountId();
          const user = {
            accountId,
            walletAddress: accountId,
            authType: "near",
          };

          // Update state if not already set
          if (!state.isAuthenticated || state.user?.accountId !== accountId) {
            dispatch({
              type: "LOGIN_SUCCESS",
              payload: { user, authType: "near" },
            });
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("authType", "near");
          }
        }
      } catch (error) {
        console.error("Failed to initialize NEAR:", error);
      }
    };

    initialize();
  }, []);

  // Persist auth state to localStorage
  useEffect(() => {
    if (state.user) {
      localStorage.setItem("user", JSON.stringify(state.user));
      localStorage.setItem("authType", state.authType);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("authType");
    }
  }, [state.user, state.authType]);

  // Login with NEAR wallet
  const loginWithNear = async () => {
    if (!wallet) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: "NEAR wallet not initialized",
      });
      return;
    }

    try {
      dispatch({ type: "LOGIN_START" });

      // Request sign in
      await wallet.requestSignIn({
        contractId: undefined,
        methodNames: [],
        successUrl: window.location.origin,
        failureUrl: window.location.origin,
      });
    } catch (error) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error.message || "Failed to connect to NEAR wallet",
      });
    }
  };

  // Login with email/password (traditional authentication)
  const loginWithEmail = async (email, password, rememberMe) => {
    try {
      dispatch({ type: "LOGIN_START" });

      // Simulate authentication - replace with your actual API call
      // For demo purposes, we'll accept any email/password
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const user = {
        email,
        name: email.split("@")[0],
        authType: "email",
        avatar: `https://ui-avatars.com/api/?name=${email.split("@")[0]}&background=random`,
      };

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user, authType: "email" },
      });

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }

      return { success: true };
    } catch (error) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error.message || "Login failed",
      });
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    if (state.authType === "near" && wallet) {
      wallet.signOut();
    }

    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("user");
    localStorage.removeItem("authType");
    localStorage.removeItem("rememberMe");
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        authType: state.authType,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        error: state.error,
        wallet,
        nearInitialized,
        loginWithNear,
        loginWithEmail,
        logout,
        clearError,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
