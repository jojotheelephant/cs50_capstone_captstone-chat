import React, { useState, useEffect } from "react";

function Register({ toggleRegisterView, handleRegister }) {
    const [registerUsername, setRegisterUsername] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState("");
    const [flag, setFlag] = useState("");

    const registerUsernameHandler = (event) => {
        setRegisterUsername(event.target.value);
    };
    const registerPasswordHandler = (event) => {
        setRegisterPassword(event.target.value);
    };
    const registerPasswordConfirmHandler = (event) => {
        setRegisterPasswordConfirm(event.target.value);
    };

    const data = {
        username: registerUsername,
        password: registerPassword,
    };

    const checkPasswordMatch = () => {
        console.log(registerPassword, registerPasswordConfirm);
        if (registerPassword === registerPasswordConfirm) {
            return true;
        } else {
            return false;
        }
    };

    const RegisterSubmitHandler = (event, data) => {
        event.preventDefault();
        const passwordMatch = checkPasswordMatch();
        if (passwordMatch) {
            handleRegister(data);
            setRegisterPassword("");
            setRegisterPasswordConfirm("");
            setFlag("");
        } else {
            console.error(`Password does not match`);
            setRegisterPassword("");
            setRegisterPasswordConfirm("");
            setFlag("*Passwords do not match.");
        }
    };

    useEffect(() => {
        document.getElementById("submitButton").addEventListener("keydown", function (event) {
            if (event.code === "Enter") {
                event.preventDefault();
                document.querySelector("form").submit();
            }
        });
    }, []);

    return (
        <div className="card card_login mt-5 col-md-10">
            <div className="card-header">
                <h4 className="login-header">Register</h4>
            </div>
            <form onSubmit={(event) => RegisterSubmitHandler(event, data)}>
                <div className="card-body">
                    <div id="dynamic_container">
                        <div className="input-group ">
                            <input
                                type="text"
                                name="username"
                                placeholder="User Name"
                                className="form-control bg-transparent"
                                value={registerUsername}
                                onChange={registerUsernameHandler}
                            />
                        </div>
                        <div className="input-group mt-3">
                            <input
                                type="password"
                                name="password"
                                placeholder="New Password"
                                className="form-control bg-transparent"
                                value={registerPassword}
                                onChange={registerPasswordHandler}
                            />
                        </div>
                        <div className="input-group mt-3">
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Re-enter Password"
                                className="form-control bg-transparent"
                                value={registerPasswordConfirm}
                                onChange={registerPasswordConfirmHandler}
                            />
                        </div>
                        {flag ? (
                            <p id="flag" className="mt-1">
                                {flag}
                            </p>
                        ) : (
                            <p></p>
                        )}
                    </div>
                </div>
                <div className="card-footer">
                    <button type="button" className="btn btn-outline-light" id="add_more" onClick={toggleRegisterView}>
                        <p className="mb-0">Back</p>
                    </button>
                    <button type="submit" id="submitButton" className="btn btn-outline-warning ml-3 submit_btn">
                        Register
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Register;
