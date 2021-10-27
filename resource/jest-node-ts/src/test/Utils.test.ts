import { Utils } from '../app/Utils';

describe('Utils test suite', () => {
  test('first test', () => {
    const result = Utils.toUpperCase('abc');
    expect(result).toBe('ABC');
  });

  test('parse simple url', () => {
    const parsedUrl = Utils.parseUrl('http://localhost:8080/login');
    expect(parsedUrl.href).toBe('http://localhost:8080/login');
    expect(parsedUrl.port).toBe('8080');
    expect(parsedUrl.protocol).toBe('http:');
    expect(parsedUrl.query).toEqual({});
  });

  test('parse url with query', () => {
    const parsedUrl = Utils.parseUrl('http://localhost:8080/login?user=john');
    expect(parsedUrl.query).toEqual({
      user: 'john'
    });
  });

  describe('Should throw error', () => {
    test('throw error using arrow method for invalid url', () => {
      expect(() => {
        Utils.parseUrl('');
      }).toThrowError('Empty url!');
    });

    test('throw error using try catch for invalid url', () => {
      try {
        Utils.parseUrl('');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toHaveProperty('message', 'Empty url!');
      }
    });
  });
});
