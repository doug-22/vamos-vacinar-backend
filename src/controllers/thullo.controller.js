const { LocalStorage } = require('node-localstorage')
localStorage = new LocalStorage('./scratch');

module.exports = {
  async login(req, res) {
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log(req.body)
    localStorage.setItem('login', JSON.stringify(req.body))
    return res.status(200).json({
      error: false,
      message: "Login feito com sucesso!"
    })
  },

  async user(req, res) {
    await new Promise(resolve => setTimeout(resolve, 3000));
    const login = JSON.parse(localStorage.getItem('login'))
    return res.status(200).json(login)
  }
}