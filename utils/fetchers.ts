import { $fetch, type FetchOptions } from "ofetch";

import type { Api } from "./types";

export const $apiRequest = async <T>(
  endpoint: string,
  options?: Omit<FetchOptions, "responseType"> & { responseType?: "json" },
): Promise<Api.Response.General<T>> => {
  const config = useRuntimeConfig();
  try {
    const response = await $fetch<Api.Response.General<T>>(
      `${config.public.apiUrl}${endpoint}`,
      {
        responseType: "json",
        credentials: "include",
        ...options,
      },
    );
    return response;
  } catch (error: any) {
    throw new Error(
      error?.data?.message ??
        "An unexpected error occurred during API request.",
    );
  }
};
