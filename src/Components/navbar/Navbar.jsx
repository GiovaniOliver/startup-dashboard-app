import "./navbar.scss";
import { useContext, memo, useState } from "react";
import { useNavigate } from "react-router-dom";

import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { DarkModeContext } from "../../Context/darkModeContext";
import { AuthContext } from "../../Context/AuthContext";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

const Navbar = memo(() => {
  const { dispatch } = useContext(DarkModeContext);
  const { user, authType, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getUserDisplayName = () => {
    if (authType === "near") {
      return user?.accountId || user?.walletAddress || "NEAR User";
    }
    return user?.name || user?.email || "User";
  };

  const getUserAvatar = () => {
    if (authType === "near") {
      // Generate avatar based on wallet address
      const address = user?.accountId || user?.walletAddress || "user";
      return `https://ui-avatars.com/api/?name=${address}&background=667eea&color=fff`;
    }
    return user?.avatar || `https://ui-avatars.com/api/?name=${getUserDisplayName()}&background=random`;
  };

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="search">
          <input type="text" placeholder="Search..." />
          <SearchOutlinedIcon />
        </div>
        <div className="items">
          <div className="item">
            <LanguageOutlinedIcon className="icon" />
            English
          </div>
          <div className="item">
            <DarkModeOutlinedIcon
              className="icon"
              onClick={() => dispatch({ type: "TOGGLE" })}
            />
          </div>
          <div className="item">
            <FullscreenExitOutlinedIcon className="icon" />
          </div>
          <div className="item">
            <NotificationsNoneOutlinedIcon className="icon" />
            <div className="counter">4</div>
          </div>
          <div className="item">
            <ChatBubbleOutlineOutlinedIcon className="icon" />
            <div className="counter">2</div>
          </div>
          <div className="item">
            <ListOutlinedIcon className="icon" />
          </div>

          {/* User Profile Section */}
          <div className="item userProfile">
            {authType === "near" && (
              <div className="walletBadge" title="Connected with NEAR Wallet">
                <AccountBalanceWalletIcon className="walletIcon" />
              </div>
            )}
            <div className="userInfo">
              <span className="userName">{getUserDisplayName()}</span>
              <span className="userType">{authType === "near" ? "NEAR Wallet" : "Email"}</span>
            </div>
            <div
              className="avatarWrapper"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <img
                src={getUserAvatar()}
                alt={getUserDisplayName()}
                className="avatar"
              />
              {showUserMenu && (
                <div className="userMenu">
                  <div className="menuHeader">
                    <img src={getUserAvatar()} alt={getUserDisplayName()} />
                    <div className="menuUserInfo">
                      <strong>{getUserDisplayName()}</strong>
                      <small>{authType === "near" ? "NEAR Wallet" : user?.email}</small>
                    </div>
                  </div>
                  <div className="menuDivider"></div>
                  <button className="menuItem" onClick={() => {
                    setShowUserMenu(false);
                    // Navigate to profile page when implemented
                  }}>
                    <ListOutlinedIcon className="menuIcon" />
                    Profile Settings
                  </button>
                  <button className="menuItem logout" onClick={handleLogout}>
                    <LogoutOutlinedIcon className="menuIcon" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showUserMenu && (
        <div
          className="menuOverlay"
          onClick={() => setShowUserMenu(false)}
        ></div>
      )}
    </div>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;