import * as z from "zod";

export const MusicSchema = z.object({
  artiste_name: z.string().min(4, {
    message: "Name is Required!",
  }),
  song_title: z.string().min(1, {
    message: "Title is Required!",
  }),
  image: z.string().min(1, {
    message: "Title is Required!",
  }),
  song_url: z.string().min(1, {
    message: "url is Required!",
  }),
  song_duration: z.number().min(1, {
    message: "duration is Required!",
  }),
});
