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
    const totalBalance = flightData.flights.reduce((acc: number, f: any) => {
      return acc + (f.flightData?.balance || 0);
    }, 0);

    res.status(200).json({ totalBalance });
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
};

export default allowCors(handler);
