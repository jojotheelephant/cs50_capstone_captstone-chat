import React from "react";

function Messages({ messages, currentUser, formatIcon }) {
    // format the timestamp
    const timeFormat = (timestamp) => {
        let formattedTime = "";
        const diff = Math.round((new Date().getTime() - new Date(timestamp).getTime()) / 60000);
        if (diff < 1) {
            // less than one minute ago
            formattedTime = "just now...";
        } else if (diff < 60 && diff >= 1) {
            // less than sixty minutes ago
            diff === 1 ? (formattedTime = `${diff} minute ago`) : (formattedTime = `${diff} minutes ago`);
        } else if (diff < 24 * 60 && diff >= 60) {
            // less than 24 hours ago
            Math.round(diff / 60) === 1
                ? (formattedTime = `${Math.round(diff / 60)} hour ago`)
                : (formattedTime = `${Math.round(diff / 60)} hours ago`);
        } else if (diff < 31 * 24 * 60 && diff >= 24 * 60) {
            // less than 7 days ago
            Math.round(diff / (60 * 24)) === 1
                ? (formattedTime = `${Math.round(diff / (60 * 24))} day ago`)
                : (formattedTime = `${Math.round(diff / (60 * 24))} days ago`);
        } else {
            formattedTime = `${new Date(timestamp)}`;
        }
        return formattedTime;
    };

    return (
        <div>
            {messages.map((message) =>
                message.author !== currentUser ? (
                    <div key={message.id} className="d-flex justify-content-start mb-4">
                        <div className="img_cont_msg">
                            <h2 className="rounded-circle user_img_msg">{formatIcon(message.author)}</h2>
                        </div>
                        <div className="msg_cotainer">
                            <p className="mb-0">{message.content}</p>
                            <span className="msg_time pl-2">
                                {`${message.author} - ${timeFormat(message.timestamp)}`}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div key={message.id} className="d-flex justify-content-end mb-4">
                        <div className="msg_cotainer_send">
                            <p className="mb-0">{message.content}</p>
                            <span className="msg_time_send">{timeFormat(message.timestamp)}</span>
                        </div>
                        <div className="img_cont_msg">
                            <h2 className="rounded-circle user_img_msg user_icon">{formatIcon(message.author)}</h2>
                        </div>
                    </div>
                )
            )}
        </div>
    );
}

export default Messages;
