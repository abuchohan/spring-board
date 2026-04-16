import { CookieOptions, type Request, type Response } from "express";
import prisma from "../prisma/client.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendWelcomeEmail, sendPasswordResetEmail } from "../services/email.js";

const SALT_ROUNDS = 10;

const cookie_settings: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
};

export async function register(req: Request, res: Response) {
  try {
    const { password } = req.body;
    const email =
      typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : req.body.email;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and Password are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res
        .status(409)
        .json({ error: "This Email is already being used" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: { email: email, password: hashedPassword },
      select: { id: true, email: true },
    });

    sendWelcomeEmail(user.email).catch(() => {});

    return res.status(201).json({ user });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { password } = req.body;
    const email =
      typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : req.body.email;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days

    const existingSession = await prisma.session.findFirst({
      where: {
        userId: user.id,
        expiresAt: { gt: new Date() },
      },
    });

    const { password: userPassword, createdAt, ...SafeUser } = user;

    // if there is no existing session make one
    if (!existingSession) {
      const session = await prisma.session.create({
        data: {
          userId: user.id,
          expiresAt: expiresAt,
        },
      });

      res.cookie("session_id", session.id, {
        expires: expiresAt,
        ...cookie_settings,
      });

      return res.status(200).json({
        message: "You have been logged in",
        user: SafeUser,
      });
    }

    res.cookie("session_id", existingSession.id, {
      expires: existingSession.expiresAt,
      ...cookie_settings,
    });

    return res.status(200).json({
      message: "You already have a session",
      user: SafeUser,
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function logout(req: Request, res: Response) {
  try {
    const { session } = req;

    await prisma.session.delete({
      where: { id: session!.id },
    });

    res.clearCookie("session_id", {
      ...cookie_settings,
    });

    res.status(200).json({ message: "you have been logged out" });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error " + err });
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const email =
      typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : req.body.email;

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const user = await prisma.user.findUnique({ where: { email: email } });

    if (!user) {
      return res.status(401).json({ error: "Invalid Email" });
    }

    const existingResetToken = await prisma.passwordReset.findFirst({
      where: {
        userId: user.id,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (existingResetToken) {
      const response: { message: string; token?: string } = {
        message: "you currently have a reset token",
      };
      if (process.env.NODE_ENV !== "production") {
        response.token = existingResetToken.token;
      }
      return res.status(409).json(response);
    }

    const token = crypto.randomBytes(32).toString("hex");

    await prisma.passwordReset.create({
      data: {
        expiresAt: expiresAt,
        token: token,
        userId: user.id,
        used: false,
      },
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await sendPasswordResetEmail(user.email, resetLink);

    return res.status(200).json({
      message: "We have emailed you a password reset link",
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error", err });
  }
}

export async function validateResetToken(req: Request, res: Response) {
  try {
    const { resetToken } = req.params;

    if (!resetToken) {
      return res.status(400).json({ message: "Please provide a reset token" });
    }

    const passwordReset = await prisma.passwordReset.findUnique({
      where: {
        token: resetToken,
        used: false,
      },
    });

    if (!passwordReset) {
      return res.status(400).json({ message: "Invalid Reset Token" });
    }

    if (passwordReset.expiresAt < new Date()) {
      return res.status(400).json({ message: "Your Token has expired" });
    }

    return res.status(200).json({ message: "Token is valid" });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function resetPasswordToken(req: Request, res: Response) {
  try {
    const { resetToken } = req.params;
    const { password } = req.body;

    if (!resetToken) {
      return res.status(400).json({ message: "Please provide a reset token" });
    }

    if (!password) {
      return res.status(400).json({ message: "You must provide a password" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const passwordReset = await prisma.passwordReset.findUnique({
      where: {
        token: resetToken,
        used: false,
      },
    });

    // check the reset token hasnt expired and is a vlaid token

    if (!passwordReset) {
      return res.status(400).json({ message: "Invalid Reset Token" });
    }

    if (passwordReset?.expiresAt < new Date()) {
      return res.status(400).json({ message: "Your Token has expired" });
    }

    // invalidate session when the password reset has been sucessful -> if there is one

    // delete all user sessions. if we found the passwordReset field
    await prisma.session.deleteMany({
      where: {
        userId: passwordReset?.userId,
      },
    });

    const newHashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    await prisma.user.update({
      where: {
        id: passwordReset?.userId,
      },
      data: {
        password: newHashedPassword,
      },
    });

    // set token to used and invalidate it -> make sure this token is only valid for 15 mins

    await prisma.passwordReset.update({
      where: { id: passwordReset.id },
      data: {
        used: true,
      },
    });

    return res.status(200).json({
      message: "Your password has been reset",
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function me(req: Request, res: Response) {
  try {
    const { user, session } = req;

    if (!user || !session) {
      return res.status(401).json({
        message: "Authentication required or Session expired.",
      });
    }

    // when this route is called refresh session for another 3 days
    const newExpiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    await prisma.session.update({
      where: {
        id: session!.id,
      },
      data: {
        expiresAt: newExpiresAt,
      },
      select: {
        expiresAt: true,
      },
    });

    res.status(200).json({
      user: user,
      message: "Your session token has been refreshed",
      session: {
        oldSession: session!.expiresAt,
        newSession: newExpiresAt,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "There has been an internal error" });
  }
}
