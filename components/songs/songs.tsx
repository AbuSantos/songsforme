import { currentTrackIdState, isPlayingState } from '@/atoms/song-atom'
// import { millisToMinsAndSecs } from '@/lib/time'
import { useRecoilValue, useRecoilState } from 'recoil'

export const Songs = () => {
    const [currentTrackId, setCurrentTrackId] = useRecoilState(
        currentTrackIdState,
    )
    return (
        <div>Songs</div>
    )
}
