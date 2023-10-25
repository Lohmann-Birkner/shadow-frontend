import { NextPage } from "next";
import { useState } from "react";
import SigninForm from "@/components/forms/signin-form";
import RegisterForm from "@/components/forms/register-form";

const SignIn: NextPage = () => {

    const [isSignin, setIsSignin] = useState(true);


    return (
        <main className="flex flex-col h-screen pt-12 justify-center items-center">
            {isSignin ? (
                <SigninForm setIsSignin={setIsSignin} />
            ) : (
                <RegisterForm />
            )}
        </main>
    );
};

export default SignIn;
