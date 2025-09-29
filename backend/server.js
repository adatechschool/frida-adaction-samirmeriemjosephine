import http from "node:http"
const server = http.createServer((req, res) => {
res.end("Hello, Node.js !");
});
server.listen(3000, () => {
console.log("Serveur lancé sur http://localhost:3000");
});
