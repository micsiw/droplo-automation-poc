import { APIRequestContext } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const redcartApiKey = process.env.REDCART_REQUEST_KEY as string;

type Redcart = {
  sendRequest: (
    module: string,
    method: string,
    params?: Array<Record<string, any>>
  ) => Promise<any>;
};

export const redcartApi = (context: APIRequestContext): Redcart => {
  const client: Redcart = {
    sendRequest: async (
      module: string,
      method: string,
      params: Array<Record<string, any>> = []
    ): Promise<any> => {
      const jsonRequestBody = {
        key: redcartApiKey,
        viewType: "json",
        module: module,
        method: method,
        parameters: params,
      };

      const formParams: Record<string, string> = {
        json: JSON.stringify(jsonRequestBody),
      };

      const response = await context.post(
        "https://api2.redcart.pl?input=json",
        {
          form: formParams,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return response.json();
    },
  };

  return client;
};
