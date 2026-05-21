import type { Server as HttpServer } from "http";

import { Server as SocketIOServer } from "socket.io";

import { SESSION_COOKIE_NAME } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/session";
import type { MessageDto, SessionUser } from "@/types";

declare global {
  var __berbergo_io__: SocketIOServer | undefined;
  var __berbergo_online_users__: Map<string, number> | undefined;
}

function parseCookie(cookieHeader: string | undefined, key: string) {
  if (!cookieHeader) {
    return null;
  }

  const cookie = cookieHeader
    .split(";")
    .map((segment) => segment.trim())
    .find((segment) => segment.startsWith(`${key}=`));

  return cookie ? decodeURIComponent(cookie.slice(key.length + 1)) : null;
}

function getOnlineUsersMap() {
  if (!globalThis.__berbergo_online_users__) {
    globalThis.__berbergo_online_users__ = new Map<string, number>();
  }

  return globalThis.__berbergo_online_users__;
}

async function canAccessConversation(conversationId: string, user: SessionUser) {
  const conversation = await prisma.conversation.findFirst({
    where:
      user.role === "CUSTOMER"
        ? {
            id: conversationId,
            customerId: user.id,
          }
        : user.role === "SHOP_OWNER"
          ? {
              id: conversationId,
              shop: {
                ownerId: user.id,
              },
            }
          : {
              id: conversationId,
              adminId: user.id,
            },
    select: {
      id: true,
      customerId: true,
      adminId: true,
      shop: {
        select: {
          ownerId: true,
        },
      },
    },
  });

  return conversation;
}

async function emitPresence(conversationId: string) {
  const io = globalThis.__berbergo_io__;

  if (!io) {
    return;
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: {
      customerId: true,
      adminId: true,
      shop: {
        select: {
          ownerId: true,
        },
      },
    },
  });

  if (!conversation) {
    return;
  }

  const onlineUsers = getOnlineUsersMap();

  io.to(`conversation:${conversationId}`).emit("presence:update", {
    conversationId,
    onlineUserIds: [
      conversation.customerId,
      conversation.adminId,
      conversation.shop?.ownerId ?? null,
    ].filter((value): value is string => typeof value === "string" && onlineUsers.has(value)),
  });
}

export function getIO() {
  return globalThis.__berbergo_io__;
}

export function initializeSocketServer(httpServer: HttpServer) {
  if (globalThis.__berbergo_io__) {
    return globalThis.__berbergo_io__;
  }

  const io = new SocketIOServer(httpServer, {
    path: "/socket.io",
    cors: {
      origin: true,
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    const token = parseCookie(socket.handshake.headers.cookie, SESSION_COOKIE_NAME);

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    const session = await verifySessionToken(token);

    if (!session) {
      return next(new Error("Unauthorized"));
    }

    socket.data.user = session;
    return next();
  });

  io.on("connection", (socket) => {
    const session = socket.data.user as SessionUser;
    const onlineUsers = getOnlineUsersMap();
    onlineUsers.set(session.id, (onlineUsers.get(session.id) ?? 0) + 1);

    socket.on("conversation:join", async (conversationId: string) => {
      const conversation = await canAccessConversation(conversationId, session);

      if (!conversation) {
        return;
      }

      socket.join(`conversation:${conversationId}`);
      await emitPresence(conversationId);
    });

    socket.on("conversation:leave", async (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
      await emitPresence(conversationId);
    });

    socket.on("typing:start", async (conversationId: string) => {
      const conversation = await canAccessConversation(conversationId, session);

      if (!conversation) {
        return;
      }

      socket.to(`conversation:${conversationId}`).emit("typing:update", {
        conversationId,
        userId: session.id,
        userName: session.name,
        isTyping: true,
      });
    });

    socket.on("typing:stop", async (conversationId: string) => {
      const conversation = await canAccessConversation(conversationId, session);

      if (!conversation) {
        return;
      }

      socket.to(`conversation:${conversationId}`).emit("typing:update", {
        conversationId,
        userId: session.id,
        userName: session.name,
        isTyping: false,
      });
    });

    socket.on("disconnect", async () => {
      const currentCount = onlineUsers.get(session.id) ?? 0;

      if (currentCount <= 1) {
        onlineUsers.delete(session.id);
      } else {
        onlineUsers.set(session.id, currentCount - 1);
      }
    });
  });

  globalThis.__berbergo_io__ = io;
  return io;
}

export async function emitConversationMessage(conversationId: string, message: MessageDto) {
  const io = getIO();

  if (!io) {
    return;
  }

  io.to(`conversation:${conversationId}`).emit("message:new", {
    conversationId,
    message,
  });

  await emitPresence(conversationId);
}
