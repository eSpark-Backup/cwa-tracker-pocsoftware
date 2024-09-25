const AuthBox = ({ title, children }) => {
  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-side">
          <img className="auth-logo" src="/logo.png" alt="logo" />
          <p className="auth-text">{title}</p>
        </div>
        <div className="auth-form">{children}</div>
      </div>
    </div>
  );
};

export default AuthBox;
