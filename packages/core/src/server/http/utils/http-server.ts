/**
 * Http Server 관련 유틸리티
 * @exports {@link HttpServerUtils}
 * @packageDocumentation
 */
import { IncomingMessage, ServerResponse } from "http";
import { URL, URLSearchParams } from "url";
import { logger } from "#moong/core";

/**
 * HTTP Server 관련 유틸리티
 */
export class HttpServerUtils {
  /**
   * 텍스트 메시지 반환
   * @param _req
   * @param res
   * @param content
   */
  sendText(res: ServerResponse, content: string | string[]): void {
    this.setContentType(res, "text/plain; charset=utf-8");

    res.write(content);
    res.end();
  }

  /**
   * 404 응답
   * @param res ServerResponse
   * @param content response body text
   */
  sendNotExists(res: ServerResponse, content?: string): void {
    res.statusCode = 404;
    res.write(content || "not found...");
    res.end();
  }

  /**
   * status 응답
   * @param res ServerResponse
   * @param statusCode 상태 코드
   * @param message 메시지
   */
  sendStatus(res: ServerResponse, statusCode: number, message: string): void {
    res.statusCode = statusCode;
    res.statusMessage = message;
    res.end();
  }

  /**
   * JSON 문자열 응답
   * @param res ServerResponse
   * @param content 응답 text or object
   */
  sendJson(res: ServerResponse, content?: object | string): void {
    this.setContentType(res, "application/json; charset=utf-8");
    if (typeof content === "string" || !content) {
      res.write(content);
      res.end();
    } else {
      res.write(JSON.stringify(content));
      res.end();
    }
  }

  /**
   * HTML 응답
   * @param res ServerResponse
   * @param content 응답 text
   */
  sendHtml(res: ServerResponse, content: string | string[]): void {
    this.setContentType(res, "text/html; charset=utf-8");

    res.write(content);
    res.end();
  }

  /**
   * content type 설정
   * @param res response
   * @param contentType content type string
   */
  setContentType(res: ServerResponse, contentType: string) {
    res.setHeader("Content-Type", contentType);
  }

  /**
   * redirect url
   * @param res response 객체
   * @param url URL
   */
  redirect(res: ServerResponse, url: string) {
    res.writeHead(302, {
      Location: url,
    });
    res.end();
  }

  /**
   * 쿼리 스트링을 조회한다.
   * @param req request 객체
   */
  query(req: IncomingMessage): URLSearchParams {
    try {
      // @ts-ignore
      const url = new URL(req.originalUrl || req.url);
      return url.searchParams;
    } catch (e) {
      // @ts-ignore
      logger.warn(`request url is invalid : ${req.originalUrl || req.url}`);
      return new URLSearchParams();
    }
  }

  /**
   * body 조회
   * @param req  request 객체
   */
  body<T = any>(req: IncomingMessage): T {
    // @ts-ignore
    const { body } = req;

    if (!body) {
      return null;
    }

    if (typeof body === "string") {
      return JSON.parse(body) as T;
    } else {
      return body as T;
    }
  }
}

const instance = new HttpServerUtils();
export default instance;
