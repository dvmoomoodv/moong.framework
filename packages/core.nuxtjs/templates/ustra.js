import plugin from '#moong/nuxt/plugins/ustra'

<%if (options.nuxt.markdown.enabled) { %>
import '#moong/nuxt/assets/styles/markdown.scss'
import 'highlight.js/styles/<%=options.nuxt.markdown.theme%>.css'
<% }%>


// default font
import '#moong/nuxt/assets/styles/fonts.scss'

// tippy.js
import 'tippy.js/dist/tippy.css'

export default plugin
