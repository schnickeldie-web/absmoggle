import { createServer } from "node:http";
import { Server } from "socket.io";
import { DEFAULT_MATCH_SECONDS, MAX_BOTS } from "../../src/lib/constants";

type QueuePlayer = {
  socketId: string;
  username: string;
  joinedAt: number;
};

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  }
});

const queue: QueuePlayer[] = [];
let activeBots = 0;

function findOpponent(socketId: string) {
  return queue.find((player) => player.socketId !== socketId);
}

io.on("connection", (socket) => {
  socket.on("queue:join", ({ username }: { username: string }) => {
    const player = { socketId: socket.id, username, joinedAt: Date.now() };
    const opponent = findOpponent(socket.id);

    if (opponent) {
      const matchId = `match_${Date.now()}`;
      io.to(socket.id).emit("match:found", { matchId, opponent: opponent.username });
      io.to(opponent.socketId).emit("match:found", { matchId, opponent: username });
      io.to([socket.id, opponent.socketId]).emit("match:start", {
        matchId,
        duration: DEFAULT_MATCH_SECONDS
      });
      queue.splice(queue.indexOf(opponent), 1);
      return;
    }

    queue.push(player);
    socket.emit("queue:joined");

    setTimeout(() => {
      const queuedPlayer = queue.find((item) => item.socketId === socket.id);
      if (!queuedPlayer || activeBots >= MAX_BOTS) return;
      activeBots += 1;
      const matchId = `bot_match_${Date.now()}`;
      socket.emit("match:found", { matchId, opponent: "[BOT] Calibrator" });
      socket.emit("match:start", { matchId, duration: DEFAULT_MATCH_SECONDS });
      queue.splice(queue.indexOf(queuedPlayer), 1);
    }, 5000);
  });

  socket.on("scan:update", (payload) => socket.to(payload.matchId).emit("score:update", payload));
  socket.on("queue:leave", () => {
    const index = queue.findIndex((player) => player.socketId === socket.id);
    if (index >= 0) queue.splice(index, 1);
  });
  socket.on("disconnect", () => {
    const index = queue.findIndex((player) => player.socketId === socket.id);
    if (index >= 0) queue.splice(index, 1);
  });
});

const port = Number(process.env.SOCKET_PORT ?? 3001);
httpServer.listen(port, () => {
  console.info(`ABSMOGGLE socket server listening on ${port}`);
});
