import { useContext } from "react";
import { SocketContext } from "../Context/SocketContext";

const CreateRoom: React.FC = () => {
    const {socket} = useContext(SocketContext);
    const roomId = 69;
    const initRoom = () => {
        socket.emit("create-room", {roomId});
    }
    return(
        <button className="btn btn-secondary" onClick={initRoom}>
            Start a new meet
        </button>
    )
}
export default CreateRoom;