import { getJson } from "./api-client.server";

export async function fetchSectors(): Promise<Array<{ sector: string }>> {
  return await getJson<Array<{ sector: string }>>("/api/v1/analysis/sector");
}

export async function fetchServices(): Promise<Array<{ service: string }>> {
  return await getJson<Array<{ service: string }>>("/api/v1/analysis/service");
}

export async function fetchRegions(): Promise<Array<{ region: string }>> {
  return await getJson<Array<{ region: string }>>("/api/v1/analysis/region");
}