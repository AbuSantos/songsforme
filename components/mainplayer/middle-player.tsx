import { FaPlay, FaStepBackward, FaStepForward } from "react-icons/fa";

const MiddlePlayer = () => {
    return (
        <div className='flex justify-center items-center space-x-6 text-xl cursor-pointer '>
            <FaStepBackward />
            <FaPlay />
            <FaStepForward />
        </div>
    )
}

export default MiddlePlayer