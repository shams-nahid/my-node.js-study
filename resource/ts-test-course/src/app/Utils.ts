import { UrlWithParsedQuery, parse } from 'url';

export class Utils {
  public static toUpperCase(arg: string): string {
    return arg.toUpperCase();
  }

  public static parseUrl(url: string): UrlWithParsedQuery {
    if (!url) {
      throw new Error('Empty url!');
    }
    /* istanbul ignore next */
    return parse(url, true);
  }
}
