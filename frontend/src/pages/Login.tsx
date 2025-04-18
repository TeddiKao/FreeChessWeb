import AuthForm from "../globalComponents/AuthForm";

function Login() {
    return <AuthForm method="Login" url="/users_api/token/get/"/>;
}

export default Login;
