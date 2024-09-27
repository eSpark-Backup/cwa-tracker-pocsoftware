const AuthBox = ({ children }) => {
  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-side">
          <img className="auth-logo" src="/auth-image.png" alt="logo" />
        </div>
        <div className="auth-form">{children}</div>
      </div>
    </div>
  );
};

export default AuthBox;
