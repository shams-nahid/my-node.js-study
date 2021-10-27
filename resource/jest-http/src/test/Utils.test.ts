import { IncomingMessage } from 'http';
import { Utils } from '../app/Utils/Utils';

describe('Utils test suite', () => {
  test('getRequestPath valid request', () => {
    const request = {
      url: 'http://localhost:8080/login'
    } as IncomingMessage;

    const resultPath = Utils.getRequestBasePath(request);
    expect(resultPath).toBe('login');
  });
  test('getRequestPath with no path', () => {
    const request = {
      url: 'http://localhost:8080'
    } as IncomingMessage;

    const resultPath = Utils.getRequestBasePath(request);
    expect(resultPath).toBeFalsy();
  });

  test('getRequestPath with no url', () => {
    const request = {
      url: ''
    } as IncomingMessage;

    const resultPath = Utils.getRequestBasePath(request);
    expect(resultPath).toBeFalsy();
  });
});
