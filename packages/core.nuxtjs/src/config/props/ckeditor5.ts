export interface Ckeditor5Options extends Record<string, any> {
  /**
   * 활성화 여부
   * @default false
   */
  enabled?: boolean;

  /**
   * 에디터 설정
   */
  editor?: Record<
    string,
    {
      /**
       * 빌드 파일 경로
       * @default ['@moong/nuxt-ckeditor5/src/builtin/classic-basic3/ckeditor.js']
       */
      buildPath: string;

      /**
       * map 파일 경로
       * @default ['@moong/nuxt-ckeditor5/src/builtin/classic-basic3/ckeditor.js.map']
       */
      mapPath?: string;

      /**
       * 언어 파일 경로
       * @default []
       */
      languagePath?: string;

      /**
       * 언어 명
       * @default 'ko'
       */
      language?: string;
    }
  >;
}
