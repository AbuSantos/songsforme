export const calculateReward = async (
  listeningDuration: number,
  rewardRatio: number
) => {
  const ownerListeningTime = Math.floor(listeningDuration * rewardRatio);
  const listenerListeningTime = listeningDuration - ownerListeningTime;
  return { ownerListeningTime, listenerListeningTime };
};
