'use strict';

/*
 * GET backoffice index
 */
exports.index = function(req, res){
    res.render('views/backoffice/index', { title: 'Backoffice Index' });
};

/*
 * GET edit-beer
 */
exports.editBeer = function(req, res){
  if(req.method === "GET") {
    res.render('views/backoffice/edit-beer', { title: 'Edit your beer, dude' });
  } else {
    console.log(req.body);
  }
};
