export enum SocketEvents {
    JoinRoom = "JoinRoom",
    LeaveRoom = "LeaveRoom",
    LogMessage = "LogMessage",
}

export type EventType = {
    symbol: string;
    message?: string;
};
