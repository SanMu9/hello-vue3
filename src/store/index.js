import { createStore } from 'vuex'
import getters from './getters'

// https://webpack.js.org/guides/dependency-management/#requirecontext
// webpack自动化导入模块
const modulesFiles = require.context('./modules', false, /\.js$/)

const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})
console.log(modules)

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  getters,
  modules
})
