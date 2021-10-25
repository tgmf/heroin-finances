import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import '@/sass/overrides.sass'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.use(Vuetify)

const theme = {
  primary: '#4CAF50',
  secondary: '#9C27b0',
  accent: '#9C27b0',
  info: '#00CAE3',
}

export default new Vuetify({
  theme: {
    themes: {
      dark: theme,
      light: theme,
    },
  },
  icons: {
    iconfont: 'md',
  },
})
