import { ProductDto } from "../../../shared/types/dtos.ts";
import { GetProductsPayload } from "../../../shared/types/requests.ts";
import { SDK } from "../../sdk.ts";

const controller = "public/products";

export async function getProduct(this: SDK, id: string): Promise<ProductDto> {
  const response = await this.get(`${controller}/${id}`, {});

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Get product failed: ${err}`);
  }

  const result = (await response.json()) as ProductDto;
  return result;
}

export async function getProducts(
  this: SDK,
  payload: GetProductsPayload
): Promise<ProductDto[]> {
  const params: Record<string, any> = {
    page: payload.page,
    size: payload.size,
  };

  if (payload.storeId) {
    params.storeId = payload.storeId;
  }
  if (payload.minPrice !== undefined) {
    params.minPrice = payload.minPrice;
  }
  if (payload.maxPrice !== undefined) {
    params.maxPrice = payload.maxPrice;
  }
  if (payload.keywords && payload.keywords.length > 0) {
    params.keywords = payload.keywords;
  }
  if (payload.categories && payload.categories.length > 0) {
    params.categories = payload.categories;
  }
  if (payload.sortBy) {
    params.sortBy = payload.sortBy;
  }

  const response = await this.get(controller, params);

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Get products failed: ${err}`);
  }

  const result = (await response.json()) as ProductDto[];
  return result;
}
