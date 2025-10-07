import { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "fs";

const flight = JSON.parse(fs.readFileSync("flightHistory.json", "utf8"));

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    const { id } = req.query;
    const key = flight.flights.find((f: any) => f.id === id);
    if (key) return res.status(200).json(key);
    return res.status(404).json({ message: "Voo não encontrado" });
  }
  res.status(405).json({ message: "Método não permitido" });
}
