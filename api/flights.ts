import { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "fs";

const flight = JSON.parse(fs.readFileSync("flightHistory.json", "utf8"));

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    const { id, page, limit } = req.query;

    // /api/flights/:id
    if (id) {
      const key = flight.flights.find((f: any) => f.id === id);
      if (key) return res.status(200).json(key);
      return res.status(404).json({ message: "Voo não encontrado" });
    }

    // /api/flights?page=X&limit=Y
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;
    const paginatedFlights = flight.flights.slice(startIndex, endIndex);

    // totalBalance
    const totalBalance = flight.flights.reduce((acc: number, f: any) => {
      const bal = typeof f.flightData?.balance === "number" ? f.flightData.balance : 0;
      return acc + bal;
    }, 0);

    return res.status(200).json({
      page: pageNum,
      limit: limitNum,
      total: flight.flights.length,
      pages: Math.ceil(flight.flights.length / limitNum),
      data: paginatedFlights,
      totalBalance
    });
  }

  res.status(405).json({ message: "Método não permitido" });
}
