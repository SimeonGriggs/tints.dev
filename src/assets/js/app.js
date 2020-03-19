import Vue from 'vue';
import App from '../vue/App.vue';

new Vue({ render: createElement => createElement(App) }).$mount('#app');
