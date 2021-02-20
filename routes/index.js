const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRound = 10

// middleware login 
const isloggedIn = function (req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/signin');
  }
}

module.exports = function (pool) {
  // page Home
  router.get('/', isloggedIn, function (req, res, next) {
    const KategoriFiltered = req.query.kategori;
    const provinsiFiltered = req.query.provinsi;
    const kotaFiltered = req.query.kota;
    const hargaFiltered = req.query.harga;

    let filter = [];
    let field = [];

    if (KategoriFiltered) {
      filter.push(KategoriFiltered);
      filter.push('kategori');
    }

    if (provinsiFiltered) {
      filter.push(provinsiFiltered);
      filter.push('provinsi');
    }

    if (kotaFiltered) {
      filter.push(kotaFiltered);
      filter.push('kota');
    }

    if (hargaFiltered) {
      filter.push(hargaFiltered);
      filter.push('harga');
    }

    // console.log(req.query.kategori)
    // console.log(field)

    let sql = `SELECT count (*) FROM public.iklan`;

    if (filter.length > 0) {
      sql += `WHERE`;
      for (let i = 0; i < field.length; i++) {
        switch (field[i]) {
          case 'kategori':
            sql += `${field[i]}`;
            break;
          case 'provinsi':
            sql += `${field[i]}`;
            break;
          case 'kota':
            sql += `${field[i]}`;
            break;
          case 'harga':
            sql += `${field[i]}`;
            break;
        }
      }
    }
  })
}
