import { defineNuxtComponent } from "#app";
import {
  h,
  ref,
  onMounted,
  onUpdated,
  PropType,
  getCurrentInstance,
  watch,
  useUstra,
} from "#moong/nuxt";
import markdown from "#moong/core/utils/misc/markdown";

export default defineNuxtComponent({
  name: "UMarkdownViewer",
  emits: {
    contentUpdated(payload: HTMLElement) {
      return true;
    },
  },
  props: {
    /**
     * 마크다운 컨텐츠 내용
     */
    content: { type: String },

    /**
     * 마크다운 컨텐츠를 로드할 URL
     */
    contentUrl: { type: String, default: null },

    /**
     * HTML
     */
    html: { type: Boolean, default: false },

    /**
     * 마크다운 컨텐츠 전처리기
     */
    adjustMarkdownContentBefore: {
      type: Function as PropType<(markdownContent: string) => string>,
      default: null,
    },

    /**
     * 마크다운 컨텐츠 후처리기
     */
    adjustMarkdownContentAfter: {
      type: Function as PropType<(markdownContent: string) => string>,
      default: null,
    },
  },
  setup(props, { slots, emit }) {
    const contentEl = ref<HTMLTextAreaElement>(null);

    //#region on udpate process
    const root = ref<HTMLElement>(null);
    onUpdated(() => {
      let markdownContent = null;
      let isHtml = false;

      if (!props.content) {
        if (
          contentEl.value?.firstChild &&
          contentEl.value.firstChild.nodeName === "PRE"
        ) {
          // @ts-ignore
          markdownContent = (contentEl.value.firstChild as Element).textContent;
          isHtml = true;
        } else {
          markdownContent = contentEl.value.value;
        }
      } else {
        markdownContent = props.content;
      }

      renderMarkdownContent(markdownContent, isHtml);
    });

    const renderMarkdownContent = (
      markdownContent: string,
      isHtml: boolean
    ) => {
      if (!isHtml && props.adjustMarkdownContentBefore) {
        markdownContent = props.adjustMarkdownContentBefore(markdownContent);
      }

      if (!isHtml) {
        markdownContent = markdown
          .getGlobalMarkdownRenderer()
          .render(markdownContent);
      }

      if (props.adjustMarkdownContentAfter) {
        markdownContent = props.adjustMarkdownContentAfter(markdownContent);
      }

      root.value.innerHTML = markdownContent;
      afterContentUpdated();
    };

    onMounted(() => {
      getCurrentInstance().proxy.$forceUpdate();
    });

    const afterContentUpdated = () => {
      root.value.querySelectorAll("a").forEach((el) => {
        if (el.href && el.href.includes("!")) {
          const hrefs = el.href.split("!");
          el.href = hrefs[0];
          el.target = hrefs[1];
        }
      });

      // @ts-ignore
      emit("contentUpdated", root.value);
    };
    //#endregion

    //#region on content url process
    watch(
      () => props.contentUrl,
      async (v) => {
        if (v) {
          const $ustra = useUstra();
          const content = (await $ustra.api.call<string>(v)).data;

          if (content) {
            renderMarkdownContent(content, content.trim().startsWith("<"));
          }
        }
      },
      {
        immediate: true,
      }
    );
    //#endregion

    //#region redering functions
    const generateChildComponent = () => {
      const components = [
        h("div", { ref: root }, []),
        // content
        h(
          "textarea",
          { ref: contentEl, style: { display: "none" } },
          slots?.default ? [slots.default()] : []
        ),
      ];
      return components;
    };

    return () => h("div", { class: "markdown-body" }, generateChildComponent());
    //#endregion
  },
});
