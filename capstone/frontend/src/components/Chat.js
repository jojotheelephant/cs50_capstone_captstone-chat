import React, { useEffect, useState } from "react";
import Messages from "./Messages";
import Welcome from "./Welcome";
import WebSocketInstance from "../util/websocket";

function Chat({ currentUser, activeRoom, handleLogIn, handleRegister }) {
    const [messages, setMessages] = useState([]);
    const [connected, setConnected] = useState(false);
    // this is the message user wants to send in the input field
    const [newMessage, setNewMessage] = useState("");
    const [receivedMessage, setReceivedMessage] = useState();

    // ============= Websocket =====================================================
    useEffect(() => {
        if (!activeRoom) {
            setMessages([]);
        }
        setConnected(false);
        waitForSocketConnection(() => {
            WebSocketInstance.addCallbacks(reverseMessages, addMessageToState);
            WebSocketInstance.fetchMessages(currentUser, activeRoom);
        });
    }, [activeRoom]);

    const waitForSocketConnection = (callback) => {
        const component = this;
        if (activeRoom) {
            setTimeout(() => {
                if (WebSocketInstance.state() === 1) {
                    console.log("connection is secure");
                    setConnected(true);
                    callback();
                    return;
                } else {
                    console.log("waiting for connection...");
                    component.waitForSocketConnection(callback);
                }
            }, 300);
        }
    };

    const reverseMessages = (set_messages) => {
        setMessages(set_messages.reverse());
    };

    // The solution to pass data to state via callback is to create a new state called 'receivedMessage'.
    const addMessageToState = (add_message) => {
        setReceivedMessage(add_message);
    };

    // Updates the 'messages' state when 'receivedMessage' state updates
    useEffect(() => {
        if (receivedMessage) {
            const tempMessages = messages;
            const newTempMessage = [...tempMessages, receivedMessage];
            setMessages(newTempMessage);
        }
    }, [receivedMessage]);

    // ========================= Auto Scroll =======================================
    // scroll to last message when message state changes
    useEffect(() => {
        if (messages.length > 0) {
            scrollToLastMessage();
        }
    }, [messages]);

    // method to scroll to last message
    const scrollToLastMessage = () => {
        document.getElementById("lastMessage").scrollIntoView({ behavior: "smooth" });
    };

    // =================== format chat header ======================================
    const formatRoomName = (room) => {
        const regex = /chat_/g;
        const newRoomName = room.replace(regex, "");
        return newRoomName;
    };

    // ==================== NewMessage send to websocket ===========================
    const newMessageHandler = (event) => {
        setNewMessage(event.target.value);
    };

    const sendMessage = (event) => {
        event.preventDefault();
        const newMessageToSend = {
            from: currentUser,
            content: newMessage,
            chatId: activeRoom,
        };
        WebSocketInstance.newChatMessage(newMessageToSend);
        setNewMessage("");
    };

    const formatIcon = (letter) => {
        const firstLetter = letter.charAt(0).toUpperCase();
        return firstLetter;
    };

    return (
        <div className="col-md-8 col-xl-6 chat">
            {currentUser ? (
                <div className="card">
                    <div className="card-header msg_head">
                        <div className="d-flex bd-highlight">
                            <div className="img_cont">
                                <h1 className="rounded-circle user_img user_icon">{formatIcon(currentUser)}</h1>
                                <span className={connected ? "online_icon" : "online_icon offline"}></span>
                            </div>
                            <div className="user_info">
                                <span className="room_name">{formatRoomName(activeRoom)}</span>
                                {activeRoom ? (
                                    <p>{connected ? `Connected as ${currentUser}` : "Connecting... "}</p>
                                ) : (
                                    <p></p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="card-body msg_card_body">
                        {/* chat here */}
                        {messages && <Messages messages={messages} currentUser={currentUser} formatIcon={formatIcon} />}
                        {/* page will scroll to the div below upon message state change */}
                        <div style={{ float: "left", clear: "both" }} id="lastMessage" />
                    </div>
                    <div className="card-footer">
                        <form className="input-group" onSubmit={sendMessage}>
                            <input
                                className="form-control type_msg"
                                placeholder={activeRoom ? "Type your message..." : ""}
                                onChange={newMessageHandler}
                                value={newMessage}
                                disabled={activeRoom ? false : true}
                            ></input>
                            <div className="input-group-append">
                                <button
                                    type="submit"
                                    className="input-group-text send_btn"
                                    disabled={activeRoom ? false : true}
                                >
                                    <i className="fas fa-location-arrow"></i>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <Welcome handleLogIn={handleLogIn} handleRegister={handleRegister} />
            )}
        </div>
    );
}

export default Chat;
