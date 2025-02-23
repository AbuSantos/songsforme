export const classifyMood = (features: any) => {
  const tempo = features["tempo"];
  const spectral_centroid = features["spectral_centroid"];

  if (tempo > 120 && spectral_centroid > 3000) {
    return "Energetic";
  } else if (tempo < 100 && spectral_centroid < 2000) {
    return "Calm";
  } else if (spectral_centroid > 4000) {
    return "Happy";
  } else return "Sad";
};
