import { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "fs";

const allowCors = (fn: Function) => (req: VercelRequest, res: VercelResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  return fn(req, res);
};

const flightData = JSON.parse(fs.readFileSync("flightHistory.json", "utf8"));

const handler = (req: VercelRequest, res: VercelResponse) => {
  if (req.method === "GET") {
    const { id } = req.query;
    const flight = flightData.flights.find((f: any) => f.id === id);
    if (!flight) return res.status(404).json({ message: "Voo não encontrado" });
    res.status(200).json(flight);
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
};

export default allowCors(handler);
