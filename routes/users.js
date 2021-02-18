var express = require('express');
var router = express.Router();

/* CRUD users listing. */
module.exports = function (pool) {
  router.get('/', function (req, res, next) {
    pool.query('SELECT * FROM public.user', (err, data) => {
      if (err) throw err;
      res.json(data.rows);
    })
  });

  router.post('/', function (req, res, next) {
    pool.query('INSERT INTO public.user (nama, email, password, nohandphone) VALUES ($1, $2, $3, $4)', [req.body.nama, req.body.email, req.body.password, req.body.nohandphone], (err, data) => {
      if (err) throw err;
      res.json(data.json);
    })
  });

  router.put('/:iduser', function (req, res, next) {
pool.query()
  })





}

module.exports = router;
