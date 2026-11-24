// A local stand-in for a CDN, so the network tests run offline. It prints its port, then serves until killed.
// lib.js loads late.js after the page's load event; late.js answers 400 ms later, so a screenshot taken before the
// network goes idle misses what it draws.
import http from "node:http";

const files: Record<string, { type: string; body: string; delay: number }> = {
  "/lib.js": {
    type: "text/javascript",
    body: 'const base = document.currentScript.src;\naddEventListener("load", () => { const s = document.createElement("script"); s.src = new URL("late.js", base).href; document.head.append(s); });\n',
    delay: 0,
  },
  "/late.js": { type: "text/javascript", body: 'document.getElementById("cdn-out").textContent = "drawn by the CDN script";\n', delay: 400 },
  "/data.json": { type: "application/json", body: '{"n": 1}\n', delay: 0 },
};

const server = http.createServer((req, res) => {
  const f = files[req.url ?? ""];
  if (!f) {
    res.writeHead(404).end();
    return;
  }
  setTimeout(() => res.writeHead(200, { "content-type": f.type, "access-control-allow-origin": "*" }).end(f.body), f.delay);
});
server.listen(0, "127.0.0.1", () => {
  const addr = server.address();
  console.log(typeof addr === "object" && addr ? addr.port : 0);
});
