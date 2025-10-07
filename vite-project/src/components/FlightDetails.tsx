import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import "./style.css";
import Logo from "../assets/Logo.svg";
import Estrela1 from "../assets/estrela1.svg";
import Estrela2 from "../assets/estrela2.svg";
import Trofeu from "../assets/trofeu.svg";

const API_BASE = "/api"; 

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
    xp?: number;
    missionBonus?: number;
  };
}

const FlightDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [flight, setFlight] = useState<Flight | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchFlightById(id);
    }
  }, [id]);

  const fetchFlightById = async (flightId: string) => {
    try {
      const response = await axios.get<Flight>(
        `${API_BASE}/flights/${flightId}`
      );
      setFlight(response.data);
    } catch (error) {
      console.error("Erro ao buscar voo:", error);
    }
  };

  if (!flight) {
    return <p>Carregando detalhes...</p>;
  }

  return (
    <div className="container">
      <div className="titulo mb-5">
        <h1>
          <img src={Logo} alt="Logo" />
        </h1>
        <p className="font-15 fw-light">
          Your virtual pilot career for Flight Simulator
        </p>
      </div>

      <h2
        className="font-24"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/flights")}
      >
        <i
          className="fa-solid fa-angle-left"
          style={{ marginRight: "1rem" }}
        ></i>
        Detalhes do Voo
      </h2>
      <table>
        <tbody>
          <tr>
            <td>
              <h6 className="mb-4 font-18">
                <img className="fa-trophy" src={Trofeu} alt="Trofeu" />
                Recompensas
              </h6>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <div className="d-flex" style={{ alignItems: "flex-start" }}>
                  <div className="ps mr-3">P$</div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <span className="fw-light font-14">Ganhos Totais</span>
                    <div
                      className="fw-bold font-28"
                      style={{
                        color:
                          (flight.flightData?.balance ?? 0) > 0
                            ? "#00FF88"
                            : "#FF0000",
                      }}
                    >
                      {"P$ " +
                        (flight.flightData?.balance ?? 0).toLocaleString(
                          "pt-BR",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </td>

            <td>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <div
                  className="d-flex mt-5"
                  style={{ alignItems: "flex-start" }}
                >
                  <div className="star mr-3">
                  <img src={Estrela1} alt="Estrela XP" />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <span className="fw-light font-12 xp">Xp conquistado</span>
                    <div className="fw-bold font-28">
                      {flight.flightData?.xp?.toLocaleString() ?? "0"}
                    </div>
                  </div>
                </div>
              </div>
            </td>

            <td>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <div
                  className="d-flex mt-5"
                  style={{ alignItems: "flex-start" }}
                >
                  <div className="star mr-3">
                  <img src={Estrela2} alt="Estrela Bônus" />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <span className="fw-light font-12 xp">Bônus de missão</span>
                    <div className="fw-bold font-28">
                      {flight.flightData?.missionBonus != null
                        ? (flight.flightData.missionBonus * 100).toFixed(0) +
                          "%"
                        : "0%"}
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </tr>

          <tr>
            <td>
              <div className="fw-semibold">{flight.aircraft?.name || "-"}</div>
              <div className="fw-light font-14">
                {flight.aircraft?.airline || "-"}
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
                  {flight.flightData?.route?.from || "-"}
                </span>
                <span className="font-14">
                  {flight.flightData?.route?.to || "-"}
                </span>
              </div>
            </td>

            <td>
              <div>
                <h6 className="fw-light font-12">Matrícula</h6>
              </div>
              <div className="fw-semibold">
                {flight.aircraft?.registration || "-"}
              </div>
            </td>

            <td>
              <div>
                <h6 className="fw-light font-12">Data</h6>
              </div>
              <div className="fw-semibold">
                {(flight.flightData?.date ?? "-").replace(/-/g, "/")}
              </div>
            </td>

          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FlightDetails;
