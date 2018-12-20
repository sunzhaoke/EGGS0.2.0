export default {
    async actionA ( {commit }) {
        commit('gotData', await getData())
      }, 
}