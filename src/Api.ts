import * as qs from 'qs';
import fetch from 'node-fetch';
import { EventEmitter } from 'tsee';

import { ApiError } from './Error';

import {
  ApiMethod,
  // ApiHeaders,
  IApiOptions,
  IApiEvents,
  IApiFetchResponse,
  IApiConfig,
  IApiClient,
  IApiRequest,
  IApiParameters
} from './types';

export const DefaultApiOptions: IApiOptions = {
  method: ApiMethod.GET,
  headers: {
    'Content-Type': 'application/json'
  }
};

export const DefaultApiConfig: IApiConfig = {
  base: '',
  defaultOptions: DefaultApiOptions
};

export class Api implements IApiClient {
  public config: IApiConfig = DefaultApiConfig;
  public events: EventEmitter;

  constructor(config?: IApiConfig) {
    this.init(config);
  }

  public init(config?: IApiConfig): void {
    this.events = new EventEmitter<IApiEvents>();

    if (config) {
      this.config = config;
    }
  }

  public async get<T>(request: IApiRequest): Promise<T> {
    return this.fetchJson<T>(Object.assign(request, { method: ApiMethod.GET }));
  }

  public async put<T>(request: IApiRequest): Promise<T> {
    return this.fetchJson<T>(Object.assign(request, { method: ApiMethod.PUT }));
  }

  public async patch<T>(request: IApiRequest): Promise<T> {
    return this.fetchJson<T>(Object.assign(request, { method: ApiMethod.PATCH }));
  }

  public async post<T>(request: IApiRequest): Promise<T> {
    return this.fetchJson<T>(Object.assign(request, { method: ApiMethod.POST }));
  }

  public async delete<T>(request: IApiRequest): Promise<T> {
    return this.fetchJson<T>(Object.assign(request, { method: ApiMethod.DELETE }));
  }

  public async fetch<T>(request: IApiRequest): Promise<IApiFetchResponse<T>> {
    return fetch(this.buildUrl(request.url), this.buildOptions(request.options));
  }

  public async fetchJson<T>(request: IApiRequest): Promise<T> {
    const resp = await this.fetch<T>(request);

    if (resp.status >= 400) {
      throw new ApiError(resp);
    }

    return resp.json();
  }

  public buildUrl(route: string, params?: IApiParameters): string {
    return this.config.base + route + (qs ? qs.stringify(params) : '');
  }

  public buildOptions(options?: IApiOptions): IApiOptions {
    return Object.assign({}, this.config.defaultOptions, options);
  }

  // handleMiddlewares (response) {
  //   return this.middlewares.reduce((promiseChain, currentTask) => {
  //     return promiseChain.then(currentTask)
  //   }, Promise.resolve(response))
  // }

  // handleEvents (response) {
  //   if (this.eventNames().includes(response.status.toString())) {
  //     this.emit(response.status.toString(), response)
  //   }

  //   if (/2\d\d/.test(response.status)) {
  //     if (this.eventNames().includes('success')) {
  //       this.emit('success', response)
  //     }
  //   } else {
  //     if (this.eventNames().includes('error')) {
  //       this.emit('error', response)
  //     }
  //   }

  //   return Promise.resolve(response)
  // }
}
