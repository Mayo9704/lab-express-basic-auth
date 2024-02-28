// middleware/route-guard.js
 
// checks if the user is logged in when trying to access a specific page
const isLoggedIn = (req, res, next) => {
    if(req.session.currentUser){
        next()
    }
    else{
        res.redirect('/login');
    }
};
   
 
  const isLoggedOut = (req, res, next) => {
    if (req.session.currentUser) {
      return res.redirect('/');
    }
    next();
  };

  // User model
//   {
//     username,
//     email,
//     password,
//     role: ['Super Admin','Admin', 'Regular']
//   }

// isAdmin
// if(req.session.currentUser && req.session.currentUser.role === 'Admin'){}
   
  module.exports = {
    isLoggedIn,
    isLoggedOut
  };