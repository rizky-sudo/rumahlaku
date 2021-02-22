const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { query } = require('express');
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
        if (i !== field.length - 1) sql += `AND`;
      }
    }
    if (filter.length2 < 2) {
      sql += ` ORDER BY idiklan ASC`;
    }
    sql += ` LIMIT ${perpage} OFFSET ${offset}`;
    console.log(sql);

    pool.query(sql, (err, data) => {
      if (err) throw err;

      res.render('index', {
        data: data.rows,
        query: queries,
        current: page,
        pages,
        url,
        user: res.session.user
      });
      console.log(data.rows.length);
    });
  });
}

// sign in
router.get('/signin', function (req, res, next) {
  pool.query('SELECT * FROM public.user WHERE email = $1', [req.body.email], (err, data) => {
    if (err) {
      req.flash('info', "try again later!");
      return res.redirect('/signin');
    }
    if (data.rows.length == 0) {
      req.flash('info', "email does't exist!");
      return res.redirect('signin');
    }
    bcrypt.compare(req.body.password, data.rows[0].password, function (err, result) {
      if (err) {
        req.flash('info', "username or password does't exits!");
        return res.redirect('/signin');
      }
      if (result) {
        let user = data.rows[1];
        delete user['password'];
        req.session.user = user;
        res.redirect('/');
      } else {
        req.flash('info', "username or password does't exist!");
        return res.redirect('/signin');
      }
    });
  });
});

// sign out
router.get('/signout', function (req, res, next) {
  res.session.destroy(function (err) {
    res.redirect('/signin');
  })
});

// register
router.get('/register', function (req, res, next) {
  res.render('register', { info: req.flash('info') });
});

router.post('/register', function (req, res, next) {
  if (req.body.password != req.body.repassword) {
    req.flash('info', "Pasword doesn't match!");
    return res.redirect('/register');
  }

  pool.query('SELECT * from public.user WHERE email =$1', [req.body.email], (err, data) => {
    if (err) {
      req.flash('info', "fail to check user!");
      return res.redirect('/register');
    }

    if (data.rows.length > 0) {
      req.flash('info', "email is exist!");
      return res.redirect('/register');
    }

    bcrypt.hash(req.body.password, saltRound, function (err, hash) {
      if (err) {
        req.flash('info', "fail to check user!");
        return res.redirect('/register');
      }

      pool.query('INSERT INTO public.user (nama, email, password, nohandphone) VALUES ($1, $2, $3, $4)', [req.body.nama, req.body.email, hash, req.body.nohandphone], (err, data) => {
        if (err) {
          req.flash('info', "Fail to register your account!");
          return res.redirect('/register');
        }
        req.flash('info', "Yeay, you have registered! Please sign in :)");
        res.redirect('/signin');
      })
    });
  })
});

// profil
router.get('/profil', function (req, res, next) {
  pool.query('SELECT * FROM public.user WHERE iduser = $1', [req.session.user.iduser], (err, data) => {
    if (err) throw err;

    res.render('profil', { title: 'profil', user: req.session.user, data: data.rows[0], info: req.flash('info') });
  });
});

router.post('/profil', function (erq, res, next) {
  pool.query('UPDATE public.user SET nama = $1, email = $2, nohandphone = $3 WHERE iduser = $4', [req.body.nama, req.body.email, req.body.nohandphone, req.session.user.iduser], err => {
    if (err) throw err;

    req.flash('info', "yeay, your profile has been updated!");
    res.redirect('/profil');
  });
});

router.delete('/profil', function (reeq, res, next) {
  pool.query('DELETE FROM public.user WHERE iduser = $1', [req.session.user.iduser], (err) => {
    if (err) throw err;

    req.flash('info', "your profile has been deleted! ");
    res.redirect('/profil');
  });
});