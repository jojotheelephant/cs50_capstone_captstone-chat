import React from "react";

function Room({ roomList, activeRoom, roomListHandler }) {
    return (
        <div className="card-body contacts_body">
            <ul className="contacts">
                {roomList.map((list) => (
                    <li
                        key={list.id}
                        className={list.room_name == activeRoom ? "active" : ""}
                        id="room_name"
                        data-room_name={list.room_name}
                        onClick={() => roomListHandler(list.room_name)}
                    >
                        <div className="d-flex bd-highlight">
                            <div className="user_info">
                                <span className="room_name">{list.newRoomName}</span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Room;
