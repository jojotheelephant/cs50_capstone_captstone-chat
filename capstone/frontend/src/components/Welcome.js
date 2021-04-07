import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";

function Welcome({ handleLogIn, handleRegister }) {
    // display states
    const [welcomeView, setWelcomeView] = useState(true);
    const [loginView, setLoginView] = useState(false);
    const [registerView, setRegisterView] = useState(false);

    // toggle views
    const toggleLoginView = (event) => {
        setRegisterView(false);
        setWelcomeView(!welcomeView);
        setLoginView(!loginView);
    };

    const toggleRegisterView = (event) => {
        setWelcomeView(!welcomeView);
        setLoginView(false);
        setRegisterView(!registerView);
    };

    return (
        <div className="card">
            <div className="card-header msg_head">
                <div className="d-flex bd-highlight"></div>
            </div>
            <div className="card-body msg_card_body">
                <div className="container h-100">
                    <div className="d-flex justify-content-center">
                        {welcomeView && (
                            <div className="card card_login mt-5 col-md-10">
                                <div className="card-header">
                                    <h4 className="login-header">Welcome</h4>
                                </div>
                                <div className="card-body login-header">
                                    <p> Welcome to my Harvard CS50 Capstone project. </p>
                                    <p>
                                        This project is a simple chatroom built using a React frontend, a Django backend
                                        and integrates upgrades web connection use of websocket for the chat feature.
                                    </p>
                                    <p>
                                        Start by registering an account. Once logged in, you can start a new chatroom or
                                        join an existing room by clicking the "plus" button on the bottom left corner.
                                    </p>
                                    <p>Send invites to your friends to join the chat. Enjoy!</p>
                                    <p>- Kenny H</p>
                                </div>
                                <div className="card-footer">
                                    <button className="btn btn-outline-warning mr-3" onClick={toggleLoginView}>
                                        <p className="mb-0">Login</p>
                                    </button>
                                    <button className="btn btn-outline-warning" onClick={toggleRegisterView}>
                                        <p className="mb-0">Register</p>
                                    </button>
                                </div>
                            </div>
                        )}
                        {loginView && <Login toggleLoginView={toggleLoginView} handleLogIn={handleLogIn} />}
                        {registerView && (
                            <Register toggleRegisterView={toggleRegisterView} handleRegister={handleRegister} />
                        )}
                    </div>
                </div>
            </div>
            <div className="card-footer"></div>
        </div>
    );
}

export default Welcome;
