import { FbrInvoicePayload, FbrResponse } from "./fbrTypes";

const SANDBOX_BASE_URL = "https://gw.fbr.gov.pk/di_data/v1/di";
const PROD_BASE_URL = "https://gw.fbr.gov.pk/di_data/v1/di";

export class FbrApiClient {
  private token: string;
  private isSandbox: boolean;

  constructor(token: string, isSandbox: boolean = false) {
    this.token = token;
    this.isSandbox = isSandbox;
  }

  private getBaseUrl() {
    return this.isSandbox ? SANDBOX_BASE_URL : PROD_BASE_URL;
  }

  private getEndpoint(path: string) {
    // Sandbox endpoints have '_sb' suffix
    const suffix = this.isSandbox ? "_sb" : "";
    return `${this.getBaseUrl()}/${path}${suffix}`;
  }

  private async makeRequest(endpoint: string, payload: FbrInvoicePayload): Promise<FbrResponse> {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.token}`,
        },
        body: JSON.stringify(payload),
      });

      // FBR API sometimes returns 200 even for invalid payloads, with errors in the JSON body.
      // But we still catch actual 401/500 errors.
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("401 Unauthorized: Invalid or expired FBR Security Token.");
        }
        if (response.status === 500) {
          throw new Error("500 Internal Server Error: FBR PRAL server issue.");
        }
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data: FbrResponse = await response.json();
      return data;
    } catch (error: any) {
      console.error("FBR API Request Failed:", error);
      throw error;
    }
  }

  /**
   * Validate an invoice without saving it
   */
  public async validateInvoice(payload: FbrInvoicePayload): Promise<FbrResponse> {
    return this.makeRequest(this.getEndpoint("validateinvoicedata"), payload);
  }

  /**
   * Post an invoice to FBR permanently
   */
  public async postInvoice(payload: FbrInvoicePayload): Promise<FbrResponse> {
    return this.makeRequest(this.getEndpoint("postinvoicedata"), payload);
  }
}
