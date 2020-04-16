import { IApiError, IApiFetchResponse, IApiPayload } from './types';

export class ApiError extends Error implements IApiError {
  public response: IApiFetchResponse<IApiPayload>;

  constructor(resp: IApiFetchResponse<IApiPayload>) {
    super(`[${resp.status}] ${resp.statusText}`);
    this.response = resp;
  }
}
