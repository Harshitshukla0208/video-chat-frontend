import { useParams } from "react-router-dom";
import { SocketContext } from "../Context/SocketContext";
import { useEffect,useContext } from "react";

const Room: React.FC = () => {
    const {id} = useParams();
    const {socket, user} = useContext(SocketContext);
    
    const fetchParticipantsList = ({ roomId, participants }: { roomId: string, participants: string[] }) => {
        console.log("fetched room participants");
        console.log(roomId, participants);
    }
    
    useEffect(() => {
        if(user) {socket.emit("joined-room", {roomId: id, peerId: user._id})}
        socket.on("get-users", fetchParticipantsList)
    }, [id,user,socket])

    return(
        <div>
            room: {id}
        </div>
    )
}
export default Room;