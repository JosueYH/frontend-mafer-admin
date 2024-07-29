const API_URL = "https://zonafitbackend-production.up.railway.app/api/";

//-------------------------------------------------------------------------------GET DATE HOME
export async function fetchPaymentCounts() {
  try {
    const response = await fetch(`${API_URL}payment/getCount`);

    if (!response.ok) {
      throw new Error("Error al obtener los totales");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error al obtener los totales:", error);
    throw new Error("Ocurrió un error al obtener los totales");
  }
}

//-------------------------------------------------------------------------------GET DATE HOME
export async function fetchClientCountsByDate() {
  const url = `${API_URL}client/countByDate`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch client counts by date");
    }
    const responseData = await response.json();
    if (responseData.success) {
      return responseData.data.map(
        (item: { month: string; count: string }) => ({
          month: item.month,
          count: parseInt(item.count),
        })
      );
    } else {
      throw new Error("Failed to fetch client counts by date");
    }
  } catch (error) {
    console.error("Error fetching client counts:", error);
    throw error;
  }
}

//-------------------------------------------------------------------------------GET CLIENT DUE
export async function getClientDue() {
  try {
    const response = await fetch(`${API_URL}client/getClientDue`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching client due:", error);
    throw error;
  }
}

////////////////////////////////////////////////////////////////////////////////// TABLES
export async function fetchIncomeMembershipByDateRange(
  startDate: any,
  endDate: any
) {
  const response = await fetch(
    "https://zonafitbackend-production.up.railway.app/api/payment/getIncomeMembershipByDateRange",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        StartDate: startDate,
        EndDate: endDate,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Error fetching membership data");
  }

  const data = await response.json();
  return data;
}

export async function fetchIncomeProductByDateRange(
  startDate: any,
  endDate: any
) {
  const response = await fetch(
    "https://zonafitbackend-production.up.railway.app/api/payment/getIncomeProductByDateRange",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        StartDate: startDate,
        EndDate: endDate,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Error fetching product data");
  }

  const data = await response.json();
  return data;
}

export async function fetchPaymentByDateRange(startDate: any, endDate: any) {
  const response = await fetch(
    "https://zonafitbackend-production.up.railway.app/api/payment/getPaymentByDateRange",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        StartDate: startDate,
        EndDate: endDate,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Error fetching payment data");
  }

  const data = await response.json();
  return data;
}

export async function fetchProductByDateRange(startDate: any, endDate: any) {
  const response = await fetch(
    "https://zonafitbackend-production.up.railway.app/api/payment/paymentProduct",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        StartDate: startDate,
        EndDate: endDate,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Error fetching product data");
  }

  const data = await response.json();
  return data;
}
