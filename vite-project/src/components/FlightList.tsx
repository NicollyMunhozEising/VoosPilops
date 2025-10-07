import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";
import { useNavigate } from "react-router-dom";

interface Flight {
  id: string;
  aircraft?: {
    name?: string;
    registration?: string;
    airline?: string;
  };
  flightData?: {
    balance?: number;
    date?: string;
    route?: { from?: string; to?: string };
  };
}

const FlightList: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  console.log("Total balance:", totalBalance);
  const navigate = useNavigate();

  const [page] = useState<number>(1); // página fixa
  const limit = 5;

  useEffect(() => {
    fetchFlights(page);
    fetchTotalBalance();
  }, [page]);

  const fetchFlights = async (pageNum: number) => {
    try {
      const resp = await axios.get(
        `http://localhost:3030/flights?page=${pageNum}&limit=${limit}`
      );
      setFlights(resp.data.data);
    } catch (err) {
      console.error("Erro ao buscar voos:", err);
      setFlights([]);
    }
  };

  const fetchTotalBalance = async () => {
    try {
      const resp = await axios.get("http://localhost:3030/totalBalance");
      setTotalBalance(resp.data.totalBalance);
    } catch (err) {
      console.error("Erro ao buscar saldo acumulado:", err);
      setTotalBalance(0);
    }
  };

  return (
    <div className="container">
      <div className="titulo mb-5">
        <h1>
          <img src=".\src\assets\Logo.svg" alt="" />
        </h1>
        <p className="font-15 fw-light">
          Your virtual pilot career for Flight Simulator
        </p>
      </div>

      <h3 className="fw-bold font-24">Histórico de Voos</h3>
      <p className="mb-3 font-18 fw-light">
        Visualize seu histórico completo de voos realizados
      </p>

      <table>
        <tbody>
          {flights.map((f) => (
            <tr key={f.id} onClick={() => navigate(`/flights/${f.id}`)} style={{ cursor: "pointer" }}>

              <td>
                <div className="fw-semibold">{f.aircraft?.name || "-"}</div>
                <div className="fw-light font-14">
                  {f.aircraft?.airline || "-"}
                </div>
              </td>

              <td>
                <div>
                  <h6 className="fw-light font-12">Trajeto</h6>
                </div>

                <div className="timeline">
                  <div className="circle"></div>
                  <div className="line"></div>
                  <div className="circle"></div>
                </div>

                <div className="d-flex justify-content-between">
                  <span className="font-14">
                    {f.flightData?.route?.from || "-"}
                  </span>
                  <span className="font-14">
                    {f.flightData?.route?.to || "-"}
                  </span>
                </div>
              </td>

              <td>
                <div>
                  <h6 className="fw-light font-12">Matrícula</h6>
                </div>
                <div className="fw-semibold">
                  {f.aircraft?.registration || "-"}
                </div>
              </td>

              <td>
                <div>
                  <h6 className="fw-light font-12">Data</h6>
                </div>
                <div className="fw-semibold">
                  {(f.flightData?.date ?? "-").replace(/-/g, "/")}
                </div>
              </td>

              <td>
                <div>
                  <h6 className="fw-light font-12">Saldo</h6>
                </div>
                <div
                  className="fw-semibold"
                  style={{
                    color:
                      (f.flightData?.balance ?? 0) > 0 ? "#00FF88" : "#FF0000",
                  }}
                >
                  {"P$ " +
                    (f.flightData?.balance ?? 0).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FlightList;

