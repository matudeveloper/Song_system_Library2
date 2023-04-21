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


/**
 * @swagger
 * /sessions/sessions:
 *   delete:
 *     summary: Logout of the current session
 *     description: Deletes the session with the specified session ID, effectively logging the user out.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: The session was deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete(
  "/sessions",
  authorizeRequest,
  async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    try {

      await prisma.session.delete({
        where: { id: req.sessionId },
      });

      return res.status(204).send("Logged out");
    } catch (error) {
      return res.status(500).send(error);
    }
  }
);

router.post(
  "/sessions",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    
    if (!email) {
     return res.status(400).send({ error: "Email is required" });
    }
    if (!password) {
      return res.status(400).send({ error: "Password is required" });
    }
    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      const userPassword = existingUser?.password;
      if (!existingUser) {
        return res.status(400).send({ error: "Invalid email or password" });
      }

      const passwordMatches = await bcrypt.compare(
        password,
        userPassword ?? ""
      );



      if (!passwordMatches) {
        return res.status(400).send({ error: "Invalid email or password" });
      }

      await prisma.session.deleteMany({
        where: {
          userId: existingUser.id
        }
      });

      // Create new session for user
      const newSession = await prisma.session.create({
        data: {
          userId: existingUser.id
        },
      });
      const session = newSession.id

      return res.status(200).send(session);
    } catch (error) {
      return res.status(500).send(error);
    }
  }
);

export default router;
