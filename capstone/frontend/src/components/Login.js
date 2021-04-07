import React, { useState } from "react";

function Login({ toggleLoginView, handleLogIn }) {
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const loginUsernameHandler = (event) => {
        setLoginUsername(event.target.value);
    };
    const loginPasswordHandler = (event) => {
        setLoginPassword(event.target.value);
    };

    const data = {
        username: loginUsername,
        password: loginPassword,
    };

    const loginHandler = (event) => {
        event.preventDefault();
        event.stopPropagation();
        handleLogIn(data);
    };

    return (
        <div className="card card_login mt-5 col-md-10">
            <div className="card-header">
                <h4 className="login-header">Login</h4>
            </div>
            <form onSubmit={(event) => loginHandler(event)}>
                <div className="card-body">
                    <div id="dynamic_container">
                        <div className="input-group">
                            <input
                                type="text"
                                name="username"
                                placeholder="User Name"
                                className="form-control bg-transparent"
                                value={loginUsername}
                                onChange={loginUsernameHandler}
                            />
                        </div>
                        <div className="input-group mt-3">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                className="form-control bg-transparent"
                                value={loginPassword}
                                onChange={loginPasswordHandler}
                            />
                        </div>
                    </div>
                </div>
                <div className="card-footer">
                    <button type="button" className="btn btn-outline-light" id="add_more" onClick={toggleLoginView}>
                        <p className="mb-0">Back</p>
                    </button>
                    <button type="submit" id="submitButton" className="btn btn-outline-warning ml-3 submit_btn">
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Login;
