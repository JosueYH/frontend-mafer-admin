export interface ApiResponse {
  msg: string;
  success: boolean;
}

export const addProduct = async (formData: FormData): Promise<ApiResponse> => {
  try {
    const response = await fetch(
      "https://bkmaferyogurt-production.up.railway.app/api/product/insert",
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();

    if (response.ok) {
      return { msg: result.msg, success: result.success };
    } else {
      throw new Error(result.msg || "Failed to insert product.");
    }
  } catch (error) {
    return { msg: (error as Error).message, success: false };
  }
};

import { Product } from "../types/Product";

const API_URL = "https://bkmaferyogurt-production.up.railway.app/api/product";

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(API_URL);
    const result = await response.json();
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.msg);
    }
  } catch (error) {
    throw new Error("No se pudo cargar los productos");
  }
};


//---------------------------------------------------------------- DELETE PRODUCT
export async function deleteProduct(
  productId: any
): Promise<{ msg: string; success: boolean }> {
  try {
    const url = `${API_URL}/Delete/${productId}`;
    const response = await fetch(url, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Error al eliminar el producto");
    }
    const responseData: { msg: string; success: boolean } =
      await response.json();
    return responseData;
  } catch (error) {
    throw new Error(`Error al eliminar el producto`);
  }
}


export const updateProduct = async (formData: FormData): Promise<{ msg: string; success: boolean }> => {
  try {
    const response = await fetch(`${API_URL}/Update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: formData,
    });
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.msg);
    }
        const responseData: { msg: string; success: boolean } =
      await response.json();
    return responseData;
  } catch (error) {
    throw new Error("No se pudo actualizar el producto");
  }
};

