import AuthForm from "../globalComponents/AuthForm.js";

function Signup() {
    return <AuthForm method="Signup" url="/users_api/create-user/"/>;
}

export default Signup;
