import plugin from '#moong/nuxt-vuetify/plugins/ustra-vuetify'

import 'vuetify/styles'

<% if (options.mdi.enabled) { %>
import '@mdi/font/css/materialdesignicons.min.css'
<% } %>

<% if (options.datepicker.enabled) { %>
import '@vuepic/vue-datepicker/dist/main.css'
<% } %>

export default plugin
