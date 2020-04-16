import { Api } from '../dist';

describe('Api', () => {
  it('exists', () => {
    expect(Api).toBeDefined();
  });

  it('can be created without config', () => {
    const api = new Api();

    expect(api).toBeDefined();
  });
});
