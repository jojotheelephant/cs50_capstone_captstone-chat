// this is a websocket service class that handles the websocket connection.
// Adapted from the work of JustDjango.

class WebSocketService {
    static instance = null;
    // add callbacks when we initiate the class
    // get message and new messages command
    callbacks = {};

    static getInstance() {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    constructor() {
        this.socketRef = null;
    }

    // called when opening chat page.
    connect(chatroom) {
        const chatroom1 = chatroom;
        const path = `ws://127.0.0.1:8000/ws/chat/${chatroom}/`;
        this.socketRef = new WebSocket(path);

        this.socketRef.onopen = () => {
            console.log("WebSocket open");
        };
        this.socketRef.onmessage = (event) => {
            this.socketNewMessage(event.data);
        };
        this.socketRef.onerror = (event) => {
            console.error(event.message);
        };
        this.socketRef.onclose = () => {
            console.log("WebSocket closed let's reopen");
            this.connect(chatroom1);
        };
    }

    disconnect() {
        this.socketRef.close();
    }

    // when receiving message data from server socket
    socketNewMessage(data) {
        const parsedData = JSON.parse(data);
        console.log(`Message(s) received from Server`);
        const command = parsedData.command;
        if (Object.keys(this.callbacks).length === 0) {
            return;
        }
        if (command === "messages") {
            this.callbacks[command](parsedData.messages);
        }
        if (command === "new_message") {
            this.callbacks[command](parsedData.message);
        }
    }

    fetchMessages(username, chatId) {
        this.sendMessage({
            command: "fetch_messages",
            username: username,
            chatId: chatId,
        });
    }

    newChatMessage(message) {
        this.sendMessage({
            command: "new_message",
            from: message.from,
            message: message.content,
            chatId: message.chatId,
        });
    }

    addCallbacks(messagesCallback, newMessageCallback) {
        this.callbacks["messages"] = messagesCallback;
        this.callbacks["new_message"] = newMessageCallback;
    }

    sendMessage(data) {
        const jsonData = JSON.stringify({ ...data });
        try {
            this.socketRef.send(JSON.stringify({ ...data }));
        } catch (err) {
            console.error(err.message);
        }
    }

    state() {
        return this.socketRef.readyState;
    }
}

const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;
