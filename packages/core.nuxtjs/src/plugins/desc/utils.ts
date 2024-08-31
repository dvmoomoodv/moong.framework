/**
 * $ustra utils 정의
 * @packageDocumentation
 */
import { NuxtApp } from "#app";
import {
  core,
  hooks,
  objects,
  path,
  script,
  system,
  web,
  functions,
  masking,
  date,
  encoding,
  formatting,
  model,
  validation,
  string,
  file,
  random,
} from "#moong/core/utils";
import {
  browser,
  dom,
  message,
  mobile,
  event,
} from "#moong/core/utils/browser";

import { Crypto } from "./utils/crypto";
import nuxt from "../../utils/nuxt";
import component from "../../utils/component";
import router from "../../utils/router";
import { KeepAlive } from "../../utils/keep-alive";
// import { PdfCreator, PdfUtilsOptions } from '#moong/core/utils/browser/pdf'

export class UstraUtils {
  /**
   * core utility
   */
  public core = core;

  /**
   * hook utility
   */
  public hooks = hooks;

  /**
   * object utility
   */
  public objects = objects;

  /**
   * path utility
   */
  public path = path;

  /**
   * script utility
   */
  public script = script;

  /**
   * system utility
   */
  public system = system;

  /**
   * system utility
   */
  public web = web;

  /**
   * function utility
   */
  public functions = functions;

  /**
   * 암호화 모듈
   */
  public crypto: Crypto = null;

  /**
   * masking 모듈
   */
  public masking = masking;

  /**
   * date utility
   */
  public date = date;

  /**
   * encoding utility
   */
  public encoding = encoding;

  /**
   * random utility
   */
  public random = random;

  /**
   * nuxt utility
   */
  public nuxt = nuxt;

  /**
   * component utility
   */
  public component = component;

  /**
   * router utility
   */
  public router = router;

  /**
   * formatting
   */
  public formatting = formatting;

  /**
   * 문자열 관련
   */
  public string = string;

  /**
   * validation
   */
  public validation = validation;

  /**
   * model
   */
  public model = model;

  /**
   * keep alive 관련 컴포넌트
   */
  public keepAlive: KeepAlive;

  /**
   * file 유틸리티
   * @browser
   */
  public file = file;

  /**
   * browser 유틸리티
   * @browser
   */
  public browser: typeof browser;

  /**
   * dom 유틸리티
   * @browser
   */
  public dom: typeof dom;

  /**
   * message 유틸리티
   * @browser
   */
  public message: typeof message;

  /**
   * mobile 유틸리티
   * @browser
   */
  public mobile: typeof mobile;

  /**
   * 이벤트 관련 유틸리티
   * @browser
   */
  public event: typeof event;

  /**
   * PDF 유틸리티
   * FIXME: 추후 재 바인딩할 것
   */
  // pdf = {
  //   /**
  //    * PDF 생성
  //    * @param options 생성 옵션
  //    */
  //   createPdf(options?: PdfUtilsOptions) {
  //     return PdfCreator.createPdf(options)
  //   },
  // }

  constructor(private app: NuxtApp) {
    this.crypto = new Crypto(app);

    if (process.client) {
      this.browser = browser;
      this.dom = dom;
      this.message = message;
      this.mobile = mobile;
      this.event = event;
      this.keepAlive = new KeepAlive(app.$ustra);
    }
  }
}
