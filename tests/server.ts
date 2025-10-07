import express, { Router, Request, Response } from 'express';
import fs from 'fs';
import cors from 'cors';

const app = express();
const route = Router();

app.use(express.json());
app.use(cors());

const flight = JSON.parse(fs.readFileSync('flightHistory.json', 'utf8'));
const PORT = 3030;

interface Flight {
  id: string;
  flightData?: {
    balance?: number;
    [key: string]: any;
  };
  [key: string]: any;
}

route.get('/flights', (req: Request, res: Response) => {
  const flightsArray = flight.flights;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedFlights = flightsArray.slice(startIndex, endIndex);

  res.json({
    page,
    limit,
    total: flightsArray.length,
    pages: Math.ceil(flightsArray.length / limit),
    data: paginatedFlights
  });
});

route.get('/flights/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const key = flight.flights.find((f: Flight) => f.id === id);

  if (key) {
    res.json(key);
  } else {
    res.status(404).json({ message: 'Voo não encontrado' });
  }
});

route.get('/totalBalance', (req: Request, res: Response) => {
  const totalBalance = flight.flights.reduce((acc: number, f: Flight) => {
    const bal = typeof f.flightData?.balance === 'number' ? f.flightData.balance : 0;
    return acc + bal;
  }, 0);

  res.json({ totalBalance });
});

app.use(route);

if (require.main === module) {
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}

export default app;
