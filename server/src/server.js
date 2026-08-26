import { createApp } from "./app.js";
import { env } from "./config/env.js";

const app = createApp();

if (process.env.NODE_ENV !== "production") {
  app.listen(env.PORT, () => {
    console.log(`API listening on http://localhost:${env.PORT}`);
  });
}

export default app;
