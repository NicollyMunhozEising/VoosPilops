import request from 'supertest';
import app from './server';

jest.mock('fs', () => ({
  readFileSync: jest.fn(() => JSON.stringify({
    flights: [
      { id: '1', flightData: { balance: 100 } },
      { id: '2', flightData: { balance: 200 } },
      { id: '3', flightData: { balance: null } }
    ]
  }))
}));

describe('API de Voos', () => {
  it('deve retornar uma lista paginada de voos', async () => {
    const res = await request(app).get('/flights?page=1&limit=2');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.total).toBe(3);
    expect(res.body.pages).toBe(2);
  });

  it('deve retornar um voo específico pelo ID', async () => {
    const res = await request(app).get('/flights/1');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('1');
  });

  it('deve retornar 404 se o voo não existir', async () => {
    const res = await request(app).get('/flights/999');
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Voo não encontrado');
  });

  it('deve calcular o totalBalance corretamente', async () => {
    const res = await request(app).get('/totalBalance');
    expect(res.status).toBe(200);
    expect(res.body.totalBalance).toBe(300);
  });
});
