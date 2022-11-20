import App from './App'
import * as Pinia from 'pinia';

import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
	app.use(Pinia.createPinia());
  return {
    app,
		Pinia
  }
}
