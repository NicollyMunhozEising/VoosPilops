import { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "fs";

const flight = JSON.parse(fs.readFileSync("flightHistory.json", "utf8"));

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    const totalBalance = flight.flights.reduce((acc: number, f: any) => {
      const bal = typeof f.flightData?.balance === "number" ? f.flightData.balance : 0;
      return acc + bal;
    }, 0);

    res.status(200).json({ totalBalance });
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
}
