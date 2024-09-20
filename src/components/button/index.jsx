const Button = ({ children, isLoading, type }) => {
  return (
    <button disabled={isLoading} type={type} className="btn auth-btn">
      {isLoading ? "Loading..." : children}
    </button>
  );
};

export default Button;
