const home = (req, res) => {
    return res.render(`./../views/index.ejs`);
  };
  
  
  
  module.exports = {
    getHome: home
  };