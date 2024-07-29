import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { FaCalendarAlt } from 'react-icons/fa'; // Importa el ícono que desees

import {
  fetchClientCountsByDate,
  fetchPaymentCounts,
  getClientDue,
} from "../services/Reports";

export function HomePage() {
  const [datosPayment, setDatosPayment] = useState<any>();
  const [clientDueData, setClientDueData] = useState<any[]>([]);
  const [clientCountsByMonth, setClientCountsByMonth] = useState<any[]>([]);

  //---------------------------------------------------------------- GET DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const paymentCountResponse = await fetchPaymentCounts();

        setDatosPayment(paymentCountResponse);
        const clientDueResponse = await getClientDue();

        if (clientDueResponse.success) {
          setClientDueData(clientDueResponse.data);
        }

        const clientCountsResponse = await fetchClientCountsByDate();
        if (clientCountsResponse) {
          setClientCountsByMonth(clientCountsResponse);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  //---------------------------------------------------------------- GRAFIC
  const dataMultiLinea = {
    series: [
      {
        name: "Clientes",
        data: clientCountsByMonth.map((item) => parseInt(item.count)),
      },
    ],
    options: {
      chart: {
        type: "line",
      },
      xaxis: {
        categories: clientCountsByMonth.map((item) => {
          const [year, month] = item.month.split("-");
          const date = new Date(parseInt(year), parseInt(month) - 1, 1);
          return date.toLocaleString("default", { month: "long" });
        }),
      },
      legend: {
        position: "top",
      },
    } as ApexOptions,
  };

  return (
    <div className="page-content">
      <div className="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <div>
          <h4 className="mb-3 mb-md-0">Reportes</h4>
        </div>
        <div className="d-flex align-items-center flex-wrap text-nowrap">
          <div
            className="input-group flatpickr wd-200 me-2 mb-2 mb-md-0"
            id="dashboardDate"
          >
            <span
              className="input-group-text input-group-addon bg-transparent border-danger"
              data-toggle
            >
              <FaCalendarAlt className="text-danger" />
            </span>
            <input
              type="text"
              className="form-control bg-transparent border-danger"
              placeholder="Fecha inicio"
              data-input
            />
          </div>
          <div
            className="input-group flatpickr wd-200 me-2 mb-2 mb-md-0"
            id="dashboardDate"
          >
            <span
              className="input-group-text input-group-addon bg-transparent border-danger"
              data-toggle
            >
              <FaCalendarAlt className="text-danger" />
            </span>
            <input
              type="text"
              className="form-control bg-transparent border-danger"
              placeholder="Fecha fin"
              data-input
            />
          </div>
          <button
            type="button"
            className="btn btn-primary btn-icon-text mb-2 mb-md-0"
          >
            <i className="btn-icon-prepend" data-feather="download-cloud" />
            Filtrar
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-xl-12 stretch-card">
          <div className="row flex-grow-1">
            <div className="col-md-4 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-baseline">
                    <h6 className="card-title mb-0">Productos vendidos</h6>
                  </div>
                  <div className="row">
                    <div className="col-6 col-md-12 col-xl-5">
                      <h3 className="mb-2">
                        {datosPayment ? datosPayment.clientCount : "0"}
                      </h3>
                      <div className="d-flex align-items-baseline">
                        <p className="text-success">
                          <span>Totales</span>
                          <i data-feather="arrow-up" className="icon-sm mb-1" />
                        </p>
                      </div>
                    </div>
                    <div className="col-6 col-md-12 col-xl-7">
                      <div id="customersChart" className="mt-md-3 mt-xl-0" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-baseline">
                    <h6 className="card-title mb-0">Cantidad de clientes</h6>
                  </div>
                  <div className="row">
                    <div className="col-6 col-md-12 col-xl-5">
                      <h3 className="mb-2">
                        {datosPayment ? datosPayment.clientCount : "0"}
                      </h3>
                      <div className="d-flex align-items-baseline">
                        <p className="text-success">
                          <span>Totales</span>
                          <i data-feather="arrow-up" className="icon-sm mb-1" />
                        </p>
                      </div>
                    </div>
                    <div className="col-6 col-md-12 col-xl-7">
                      <div id="customersChart" className="mt-md-3 mt-xl-0" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-baseline">
                    <h6 className="card-title mb-0">Cantidad de productos</h6>
                  </div>
                  <div className="row">
                    <div className="col-6 col-md-12 col-xl-5">
                      <h3 className="mb-2">
                        {datosPayment ? datosPayment.clientCount : "0"}
                      </h3>
                      <div className="d-flex align-items-baseline">
                        <p className="text-success">
                          <span>Totales</span>
                          <i data-feather="arrow-up" className="icon-sm mb-1" />
                        </p>
                      </div>
                    </div>
                    <div className="col-6 col-md-12 col-xl-7">
                      <div id="customersChart" className="mt-md-3 mt-xl-0" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-lg-12 d-flex">
          <div className="card radius-10 w-100">
            <div className="card-header">
              <div className="d-flex align-items-center">
                <div>
                  <h6 className="mb-0">Productos vendidos por mes</h6>
                </div>
              </div>
            </div>
            <div className="card-body">
              <Chart
                options={dataMultiLinea.options}
                series={dataMultiLinea.series}
                type="line"
                height={350}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
