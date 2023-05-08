const config = require("../config/auth.config");
const sql = require("../models/db");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const moment = require('moment');
require('moment-timezone');
moment.locale('th');


exports.signup = async (req, res) => {
  const dataUsers = {
    user_username : req.body.user_username,
    user_password : bcrypt.hashSync(req.body.user_password, 8),
    user_email : req.body.user_email,
    user_firstname : req.body.user_firstname,
    user_lastname : req.body.user_lastname,
    role_id : 1
  }

  sql.query("INSERT INTO users SET ?", dataUsers, (err, result) => {
    if (err) {
        console.log("error: ", err);
        return res.status(400).send({ status: "failed", message: "ทำรายการไม่สำเร็จ!" });
    }
        console.log("signup users: ", { id: result.insertId,  dataUsers});
        return res.status(200).send({ status: "ok", message: "สมัครสมาชิกสำเร็จ!" });
  });
};

exports.signin = async (req, res) => {
  var user_username = req.body.user_username;
  var user_password = req.body.user_password;

  sql.query(`SELECT * FROM users a LEFT JOIN roles b ON a.role_id = b.role_id WHERE user_username = '${user_username}'`, (err, result) => {
    if (err) {
        console.log("error: ", err);
        return res.status(404).send({ message: "User not found." });
    }
    if (result.length) {
        var passwordIsValid = bcrypt.compareSync(
          user_password,
          result[0].user_password
        );

        if (!passwordIsValid) {
          return res.status(401).send({
            status: "failed",
            accessToken: null,
            message: "รหัสผ่านไม่ถูกต้อง",
          });
        }

        if (result[0].role_id == 99) {
          return res.status(401).send({
            status: "failed",
            accessToken: null,
            message: "ผู้ใช้งานนี้ถูกปิดการใช้งาน",
          });
        }


        var token = jwt.sign({ id: result[0].user_id }, config.secret, {
          expiresIn: "9h",
        });

        console.log("user - login : ",{
          id: result[0].user_id,
          username: result[0].user_username,
          email: result[0].user_email,
          firstname: result[0].user_firstname,
          lastname: result[0].user_lastname,
          roles: result[0].role_name,
          accessToken: token,
        });
        
        return res.status(200).send({
          id: result[0].user_id,
          username: result[0].user_username,
          email: result[0].user_email,
          firstname: result[0].user_firstname,
          lastname: result[0].user_lastname,
          roles: result[0].role_name,
          accessToken: token,
        });
    }
    return res.status(404).send({ status: "failed", message: "ไม่มีผู้ใช้งานนี้ในระบบ" });
  });
};

exports.refreshToken = (req, res) => {
  const token = req.body.user.accessToken;
  let user = req.body.user;
  if (!token) {
    res.status(403).send({ message: "No token provided!" });
  } else {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(200).send({ message: "Tokens expire!" });
      }
      var tokenNew = jwt.sign({ id: req.body.user.id }, config.secret, {
        expiresIn: "9h",
      });
      user.accessToken = tokenNew;
      res.status(200).send({
        status: "ok",
        message: "ok",
        user: user,
      });
    });
  }
};
