import SocketIoClient from "socket.io-client";
import { createContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import {v4 as UUIDv4} from "uuid";
import Peer from "peerjs";
import { peerReducer } from "../Reducers/peerReducer";
import { addPeerAction } from "../Actions/peerAction";

const Backend_Server = "http://localhost:5000";

export const SocketContext = createContext<any | null>(null);

const socket = SocketIoClient(Backend_Server);

interface Props{
    children: React.ReactNode
}

export const SocketProvider: React.FC<Props> = ({children}) => {
    
    const navigate = useNavigate();
    const [user, setUser] = useState<Peer>(); //new peer user
    const [stream, setStream] = useState<MediaStream>();

    const [peers, dispatch] = useReducer(peerReducer, {})

    const fetchUserFeed = async() => {
        const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true})
        setStream(stream);
    }

    useEffect(() => {

        const userId = UUIDv4();
        // const newPeer = new Peer(userId, { // use this localhost when you install peer js server in your local
        //     host: "localhost",
        //     port: 9000,
        //     path: "/myapp"
        // });
        const newPeer = new Peer(userId);

        setUser(newPeer);
        fetchUserFeed();

        const enterRoom = ({roomId} : {roomId: string}) => {
            navigate(`/${roomId}`);
        }
        socket.on("room-created", enterRoom);

    
    },[]);

    useEffect(() => {
        if(!user || !stream) return;

        socket.on("user-joined", ({peerId}) => {
            const call = user.call(peerId, stream)
            console.log("Calling the new peer", peerId)
            call.on("stream", () => {
                dispatch(addPeerAction(peerId, stream))
            })
        })
        user.on("call", (call) => {
            console.log("receiving a call");
            call.answer(stream);
            call.on("stream", () => {
                dispatch(addPeerAction(call.peer, stream))
            })
        })

        socket.emit("ready");
    },[user,stream])
    
    return (
        <SocketContext.Provider value={{socket, user, stream, peers}}>{children}</SocketContext.Provider>
    )
}