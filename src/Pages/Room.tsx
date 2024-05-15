import { useParams } from "react-router-dom";
import { SocketContext } from "../Context/SocketContext";
import { useEffect,useContext } from "react";
import UserFeedPlayer from "../Components/UserFeedPlayer";

const Room: React.FC = () => {
    const {id} = useParams();
    const {socket, user, stream, peers} = useContext(SocketContext);
    
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
            your own feed
            <UserFeedPlayer stream={stream} />
            <div>
                <br />
                others feed
                {Object.keys(peers).map((peerId) => (
                    <>
                        <UserFeedPlayer key={peerId} stream={peers[peerId].stream} />
                    </>
                ))}
            </div>
        </div>
    )
}
export default Room;