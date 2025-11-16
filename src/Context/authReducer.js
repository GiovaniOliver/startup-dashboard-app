const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START": {
      return {
        ...state,
        loading: true,
        error: null,
      };
    }
    case "LOGIN_SUCCESS": {
      return {
        user: action.payload.user,
        authType: action.payload.authType,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    }
    case "LOGIN_FAILURE": {
      return {
        user: null,
        authType: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    }
    case "LOGOUT": {
      return {
        user: null,
        authType: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    }
    case "CLEAR_ERROR": {
      return {
        ...state,
        error: null,
      };
    }
    default:
      return state;
  }
};

export default AuthReducer;
