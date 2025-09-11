import { Counter, Trend } from "k6/metrics";
import { check, sleep } from "k6";

import ws from "k6/ws";

const messagesSent = new Counter("messages_sent");
const messagesReceived = new Counter("messages_received");
const responseTime = new Trend("response_time_ms");

const CONFIG = {
  host: "https://communication-land.gentleflower-99ef02e0.eastus.azurecontainerapps.io",
  path: "/socket.io",
  API_BASE: "https://land.greycollar.ai/api",
  TEST: "true",
};

export const options = {
  vus: 5,
  duration: "2m",
  thresholds: {
    response_time_ms: ["p(95)<3000"],
  },
};

export default function () {
  const wsHost = CONFIG.host.replace("https://", "wss://");
  const url = `${wsHost}${CONFIG.path}/?EIO=4&transport=websocket`;

  const token = `test-token-${__VU}`;
  const colleagueId = `colleague-${__VU}`;

  const res = ws.connect(url, {}, function (socket) {
    let connected = false;
    let messageCount = 0;
    let pendingCallbacks = {};

    socket.on("open", () => {
      console.log(`User ${__VU}: Connected`);

      const auth = {
        token: token,
        colleagueId: colleagueId,
      };
      socket.send(`40${JSON.stringify(auth)}`);
    });

    socket.on("message", (data) => {
      if (data === "40") {
        console.log(`User ${__VU}: Authenticated`);
        connected = true;

        sendBatteryQuestion();
      }

      if (data.startsWith("43")) {
        messagesReceived.add(1);

        try {
          const jsonStr = data.substring(2);
          const response = JSON.parse(jsonStr);

          if (Array.isArray(response)) {
            const callbackId = response[response.length - 1];

            if (pendingCallbacks[callbackId]) {
              const timeTaken = Date.now() - pendingCallbacks[callbackId];
              responseTime.add(timeTaken);

              console.log(`User ${__VU}: Got response in ${timeTaken}ms`);
              delete pendingCallbacks[callbackId];
            }
          }
        } catch (e) {
          console.error(`User ${__VU}: Parse error:`, e.message);
        }
      }

      if (data.includes("ai_message")) {
        console.log(`User ${__VU}: Received AI message`);
      }

      if (data === "2") {
        socket.send("3");
      }
    });

    socket.on("error", (e) => {
      console.error(`User ${__VU}: Error:`, e);
    });

    function sendBatteryQuestion() {
      if (!connected) return;

      messageCount++;
      const callbackId = `${__VU}_${Date.now()}_${messageCount}`;

      const message = [
        "customer_message",
        { role: "USER", content: "What is the battery barcode number" },
        callbackId,
      ];

      pendingCallbacks[callbackId] = Date.now();

      socket.send(`42${JSON.stringify(message)}`);
      messagesSent.add(1);

      console.log(`User ${__VU}: Sent message #${messageCount}`);

      setTimeout(() => {
        if (connected) {
          sendBatteryQuestion();
        }
      }, 5000);
    }

    socket.setTimeout(() => {
      console.log(`User ${__VU}: Closing connection`);
      socket.close();
    }, 120000);
  });

  check(res, {
    "connected successfully": (r) => r && r.status === 101,
  });
}

export function loadTest() {
  const stages = [
    { duration: "30s", target: 10 },
    { duration: "2m", target: 10 },
    { duration: "30s", target: 0 },
  ];

  options.stages = stages;
  delete options.vus;
  delete options.duration;
}
