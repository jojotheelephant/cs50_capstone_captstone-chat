import React, { useState } from "react";
import Room from "./Room";

function RoomList({ roomList, currentUser, activeRoom, roomListHandler, handleLogOut, addRoom, removeRoom }) {
    const [addChatRoomForm, setAddChatForm] = useState(false);
    const [newRoomName, setNewRoomName] = useState("");

    const toggleButton = (event) => {
        event.preventDefault();
        setAddChatForm(!addChatRoomForm);
    };

    const handleChange = (event) => {
        setNewRoomName(event.target.value);
    };

    const addRoomHandler = (event) => {
        event.preventDefault();
        setAddChatForm(!addChatRoomForm);
        addRoom(currentUser, newRoomName);
    };

    return (
        <div className="col-md-4 col-xl-3 chat">
            <div className="card mb-sm-3 mb-md-0 contacts_card">
                <div className="card-header">
                    <h2 className="contacts_header">Rooms</h2>
                </div>
                {roomList && <Room roomList={roomList} activeRoom={activeRoom} roomListHandler={roomListHandler} />}

                <div className="card-footer justify-self-end">
                    {addChatRoomForm && currentUser ? (
                        <div className="d-flex bd-highlight my-3">
                            <div className="user_info">
                                <form onSubmit={(event) => addRoomHandler(event)}>
                                    <div className="form-group mb-0">
                                        <input
                                            type="text"
                                            className="form-control mb-1 bg-transparent"
                                            placeholder="Room Name"
                                            onChange={handleChange}
                                        />
                                        <small className="form-text mb-2 input_small">
                                            <ul className="input_small">
                                                <li>Room name must be 3-18 characters</li>
                                                <li>If room name already exists, you will be added as participant</li>
                                            </ul>
                                        </small>

                                        <button
                                            type="button"
                                            className="btn btn-outline-light mx-2"
                                            onClick={toggleButton}
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                        <button type="submit" className="btn btn-outline-warning">
                                            <i className="fas fa-check"></i>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="d-flex .flex-row bd-highlight my-3">
                            <div className="user_info">
                                <button className="btn btn-outline-warning" onClick={toggleButton}>
                                    <i className="fa fa-plus"></i>
                                </button>
                                <button
                                    className="btn btn-outline-warning ml-2"
                                    disabled={activeRoom ? false : true}
                                    onClick={(event) => removeRoom(event, currentUser, activeRoom)}
                                >
                                    <i className="fa fa-minus"></i>
                                </button>
                            </div>
                            <div className="user_info align-self-end ml-auto">
                                <button className="btn btn-outline-warning" onClick={handleLogOut}>
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RoomList;
