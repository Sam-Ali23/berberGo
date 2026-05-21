import type { NextApiRequest, NextApiResponse } from "next";
import type { Server as HttpServer } from "http";

import { initializeSocketServer } from "@/lib/socket-server";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(_: NextApiRequest, response: NextApiResponse) {
  const socket = response.socket as typeof response.socket & { server?: HttpServer };

  if (!socket?.server) {
    response.status(500).json({ success: false, message: "Socket server unavailable." });
    return;
  }

  initializeSocketServer(socket.server);
  response.status(200).json({ success: true });
}
