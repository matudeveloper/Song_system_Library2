import express, { NextFunction, Request, Response } from "express";
import { handleErrors } from "./handleErrors";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const verifier = require("@gradeup/email-verify");

const prisma = new PrismaClient();
const router = express.Router();

interface AuthorizedRequest extends Request {
    sessionId?: string;
    userId?: number;
}

const authorizeRequest = async (
  req: AuthorizedRequest,
  res: Response,
  next: NextFunction
) => {
  const bearerHeader = req.headers.authorization;
  if (!bearerHeader || !bearerHeader.startsWith("Bearer ")) {
    res.status(400).send({ error: "Invalid authorization header" });
    return;
  }
  const bearerToken = bearerHeader.split(" ")[1];
  req.sessionId = bearerToken;

  const session = await prisma.session.findUnique({
    where: { id: req.sessionId },
  });
  
  if (!session) {
    return res.status(401).send({ error: "Session not found" });
  }

  
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  if (!user) {
    return res.status(404).send({ error: "User not found" });
  }
  
  // Add session and user details to the request object
  req.sessionId = session.id;
  req.userId = user.id;

  next();
};

router.get(
  "/getAllSongs", 
  async (req: Request, res: Response, next: NextFunction) => {
    const songs = await prisma.song.findMany({});

    return res.status(200).send(songs);
  }
);

router.post(
  "/createSong", authorizeRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      name,
      author,
      album,
      release,
      imageUrl,
      songTextTitle,
      songTextDesc,
    } = req.body;

    if (!name || !author || !album || !release || !imageUrl) {
      return res.status(400).send("Dont leave empty fields");
    }

    try {
      const song = await prisma.song.create({
        data: {
          name,
          author,
          album,
          release: new Date(release),
          imageUrl,
          songTextTitle,
          songTextDesc,
        },
      });

      return res.status(200).send(song);
    } catch (error) {
      console.error(error);
      return res.status(500).send(error);
    }
  }
);

router.delete(
  "/deleteSong/:id", authorizeRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    await prisma.song.delete({
      where: { id: id },
    });

    return res.status(200).send("Deleted");
  }
);

router.get(
  "/getSong/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const song = await prisma.song.findUnique({
      where: { id: id },
    });

    return res.status(200).send(song);
  }
);

export default router;
