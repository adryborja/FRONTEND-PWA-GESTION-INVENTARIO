import { LoginForm } from "../Autenticacion/LoginForm";

export const Login: React.FC = () => {
  return (
    <div className="p-d-flex p-jc-center p-ai-center" style={{ height: "100vh", backgroundColor: "#1E1E2F" }}>
      <LoginForm />
    </div>
  );
};

export default Login;

