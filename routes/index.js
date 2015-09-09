'use strict';

/*
 * GET 404 page
 */
exports._404 = function(req, res){
  res.render('404', { title: 'OOOOPS' });
};

/*
 * GET home page.
 */
exports.index = function(req, res) {
  res.render('index', { title: 'Index' });
};

/**
 * GET panic-button view
 */
exports.panicButton = function(req, res) {
  console.log('Aqui estamos');
  res.render('views/panic-button', { title: 'Panic Button' });
};

/**
 * GET product-detail view
 */
exports.productDetail = function(req, res) {
  console.log('Aqui estamos');
  res.render('views/product-detail', { title: 'Beer' });
};
