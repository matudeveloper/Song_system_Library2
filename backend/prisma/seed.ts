import { PrismaClient } from "@prisma/client";
const moment = require("moment");

const releaseDate = moment("04/04/2023", "MM/DD/YYYY").toDate();

const prisma = new PrismaClient();
async function main() {
  const Song1 = await prisma.song.create({
    data: {
      name: "Own it",
      author: "Drake",
      album: "Nothing was the same",
      release: releaseDate,
      imageUrl:
        "https://t2.genius.com/unsafe/378x378/https%3A%2F%2Fimages.genius.com%2F6d70f1e6d38e9af4ddb7b3582a40dab8.1000x1000x1.jpg",
      songTextTitle: "About Drake From Time with jhene aiko",
      songTextDesc:
        "The song features vocals from Jhene Aiko, production from 40, and piano harmonies from Chilly Gonzales. One of the album’s many standouts, and seems to be Drizzy’s personal favorite.",
    },
  });
  const Song2 = await prisma.song.create({
    data: {
      name: "From Time",
      author: "Drake",
      album: "Nothing was the same",
      release: releaseDate,
      imageUrl:
        "https://t2.genius.com/unsafe/378x378/https%3A%2F%2Fimages.genius.com%2F6d70f1e6d38e9af4ddb7b3582a40dab8.1000x1000x1.jpg",
      songTextTitle: "About Drake own it lyrics",
      songTextDesc:
        "Track #5 from Nothing Was the Same serves as a follow-up to “Wu-Tang Forever,” while flipping the meaning of “It’s Yours” to Drake letting an undisclosed girl that his heart/feelings belong to her. The uncredited background vocals are provided by PARTYNEXTDOOR.",
    },
  });
  console.log({ Song1, Song2 });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
