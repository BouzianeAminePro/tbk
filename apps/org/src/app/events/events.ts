export enum SocketEvents {
    JoinRoom = "JoinRoom",
    LeaveRoom = "LeaveRoom",
    LogMessage = "LogMessage",
}

export enum ServerEvents {
    LogMessage = "LogMessage",
}

export type EventType = {
    symbol: string;
    message?: string;
};
