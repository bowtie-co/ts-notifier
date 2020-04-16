import { Response, RequestInit } from 'node-fetch';
import { EventEmitter, DefaultEventMap } from 'tsee';
import { IStringifyOptions, IParseOptions } from 'qs';

export enum ApiMethod {
  GET = 'GET',
  PUT = 'PUT',
  PATCH = 'PATCH',
  POST = 'POST',
  DELETE = 'DELETE'
}

export interface IApiErrorResponse {
  message?: string;
}

export interface IApiError {
  message: string;
  response: IApiFetchResponse<IApiPayload>;
}

export interface IApiHeaders {
  [header: string]: string;
}

export interface IApiParameters {
  [key: string]: string | number | object;
}

export interface IApiPayload {
  [key: string]: string | number | object;
}

export interface IApiOptions extends RequestInit {
  method?: ApiMethod;
  headers?: IApiHeaders;
}

export interface IApiRequest extends IApiOptions {
  url: string;
  params?: IApiParameters;
  options?: IApiOptions;
}

export interface IApiFetchResponse<T = IApiPayload> extends Response {
  json<P = T>(): Promise<P>;
}

export interface IApiEvents extends DefaultEventMap {
  ok: (resp: IApiFetchResponse<IApiPayload>) => void;
  bad: (resp: IApiFetchResponse<IApiPayload>) => void;
  fail: (resp: IApiFetchResponse<IApiPayload>) => void;
  unauthorized: (resp: IApiFetchResponse<IApiPayload>) => void;
}

export interface IQSConfig {
  parse?: IParseOptions;
  stringify?: IStringifyOptions;
}

export interface IApiConfig {
  qs?: IQSConfig;
  base?: string;
  stage?: string;
  prefix?: string;
  version?: string;
  verbose?: boolean;
  secureOnly?: boolean;
  authorization?: string;
  defaultOptions?: IApiOptions;
}

export interface IApiClient {
  config: IApiConfig;
  events: EventEmitter<IApiEvents>;

  init(cfg?: IApiConfig): void;
  buildUrl(route: string, params?: IApiParameters): string;
  buildOptions(options?: IApiOptions): IApiOptions;

  fetch<T>(request: IApiRequest): Promise<IApiFetchResponse<T>>;

  get<T>(request: IApiRequest): Promise<IApiFetchResponse<T>>;
  put<T>(request: IApiRequest): Promise<IApiFetchResponse<T>>;
  patch<T>(request: IApiRequest): Promise<IApiFetchResponse<T>>;
  post<T>(request: IApiRequest): Promise<IApiFetchResponse<T>>;
  delete<T>(request: IApiRequest): Promise<IApiFetchResponse<T>>;
}
