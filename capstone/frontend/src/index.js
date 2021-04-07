import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import RoomList from "./components/RoomList";
import Chat from "./components/Chat";
import WebSocketInstance from "./util/websocket";

const App = () => {
    const [loggedIn, setLoggedIn] = useState(localStorage.getItem("token") ? true : false);
    const [currentUser, setCurrentUser] = useState("");
    const [activeRoom, setActiveRoom] = useState("");
    const [roomList, setRoomList] = useState([]);

    useEffect(() => {
        // assign the parameter passed in to be what user enters as room name when front page is designed.
        if (activeRoom) {
            WebSocketInstance.connect(activeRoom);
        }
    }, [activeRoom]);

    useEffect(() => {
        console.log(
            "This project was created by Kenny Hsieh as part Harvard's CS50 Web Developer Course Capstone project. Project was completed on 3/31/21. "
        );
    }, []);

    // checks server to see if token in local storage is still valid.
    useEffect(async () => {
        if (loggedIn) {
            const requestOptions = {
                headers: {
                    Authorization: `JWT ${localStorage.getItem("token")}`,
                },
            };
            const response = await fetch("http://localhost:8000/chat/current_user/", requestOptions);
            const results = await response.json();
            if (results.detail === "Signature has expired.") {
                localStorage.removeItem("token");
                setLoggedIn(false);
                setCurrentUser("");
            }
            setCurrentUser(results.username);
        }
    }, [loggedIn]);

    // ===================RoomList==================================================
    // runs when page is loaded. Gets the lists of rooms that the user is current in
    useEffect(() => {
        if (currentUser) {
            getListOfRooms(currentUser);
        }
    }, [currentUser]);

    // sends request to server to grab list of rooms
    const getListOfRooms = async (currentUser) => {
        const requestOptions = {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            redirect: "follow",
        };
        const response = await fetch(`http://localhost:8000/chat/chatroomlist/${currentUser}/`, requestOptions);
        const results = await response.json();
        formatRoomName(results.listofrooms);
    };

    // adds user to room instance.
    const addRoom = async (currentUser, roomName) => {
        const lowerCaseRoomName = roomName.toLowerCase();
        const formattedRoomName = lowerCaseRoomName.replace(/\s/g, "");
        const token = localStorage.getItem("token");
        const requestOptions = {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `JWT ${token}`,
            },
            redirect: "follow",
        };
        await fetch(`http://localhost:8000/chat/createroom/${formattedRoomName}/`, requestOptions);
        getListOfRooms(currentUser);
    };

    // remove room instance from user's list
    const removeRoom = async (event, currentUser, roomName) => {
        event.preventDefault();
        const token = localStorage.getItem("token");
        const requestOptions = {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `JWT ${token}`,
            },
            redirect: "follow",
        };
        await fetch(`http://localhost:8000/chat/removeroom/${roomName}/`, requestOptions);
        setActiveRoom("");
        getListOfRooms(currentUser);
    };

    // formats the room names by adding another key=value pair with key 'newRoomName'
    const formatRoomName = (results) => {
        const formattedResults = results.map((room) => {
            const regex = /chat_/g;
            const newRoomName = room.room_name.replace(regex, "");
            return { ...room, newRoomName };
        });
        roomListSetState(formattedResults);
    };

    // save roomlist to state
    const roomListSetState = (roomlist) => {
        setRoomList(roomlist);
    };

    // ===================SelectRoom================================================
    // passed down as props >> RoomList.js >> Room.js
    const roomListHandler = (room_name) => {
        console.log(`Current Chat room selected: `, room_name);
        setActiveRoom(room_name);
    };

    // ==================== Add new Chat Room ======================================
    const addChatRoom = (roomName) => {
        console.log(hello);
    };

    // ==================== log in / log out =======================================
    const handleLogIn = async (data) => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };
        try {
            const response = await fetch("http://localhost:8000/token_auth/", requestOptions);
            const results = await response.json();
            console.log(`Log in successful`);
            if (results.token !== undefined) {
                localStorage.setItem("token", results.token);
                setLoggedIn(true);
                setCurrentUser(results.user.username);
            } else {
                console.error(`Token is ${results.token}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleRegister = async (data) => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };
        try {
            const response = await fetch("http://localhost:8000/chat/users/", requestOptions);
            const results = await response.json();
            console.log(`User registered`);
            if (results.token !== undefined) {
                localStorage.setItem("token", results.token);
                setLoggedIn(true);
                setCurrentUser(results.username);
            } else {
                console.error(`Token is ${results.token}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogOut = () => {
        console.log("User Logged out");
        localStorage.removeItem("token");
        setLoggedIn(false);
        setCurrentUser("");
        setActiveRoom("");
    };

    return (
        <div className="container-fluid h-100">
            <div className="row justify-content-center h-100">
                {/* only show roomlist when logged in */}
                {loggedIn && (
                    <RoomList
                        currentUser={currentUser}
                        roomList={roomList}
                        activeRoom={activeRoom}
                        roomListHandler={roomListHandler}
                        loggedIn={loggedIn}
                        handleLogOut={handleLogOut}
                        addRoom={addRoom}
                        removeRoom={removeRoom}
                    />
                )}
                <Chat
                    currentUser={currentUser}
                    activeRoom={activeRoom}
                    handleLogIn={handleLogIn}
                    handleRegister={handleRegister}
                />
            </div>
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById("app"));
