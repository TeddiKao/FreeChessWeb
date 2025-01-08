import AuthForm from "../globalComponents/AuthForm.jsx";

function Signup() {
    return <AuthForm method="Signup" url="/users_api/create-user/"/>;
}

export default Signup;
