function ensureLoggedIn(req,res,next){
    if (!req.session.user){
        return res.redirect('login.html');
    }
    next();
}

function ensureRole(role){
    return function(req,res,next){
        if(!req.session.user || req.session.user.role !== role){
            return res.status(403).send('Forbidden');
        }
        next();
    };
}
module.exports = {ensureLoggedIn,}