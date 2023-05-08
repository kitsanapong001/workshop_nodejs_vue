const sql = require("../models/db");

checkDuplicateEmail = (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;

    let conditionUsername = '';
    let conditionEmail = '';

    conditionUsername = `SELECT * FROM users WHERE user_username = '${username}'`;
    conditionEmail = `SELECT * FROM users WHERE user_email= '${email}'`;
    
    sql.query(conditionUsername, (err, resultUser) => {
        if (err) {
            console.log("error: ", err);
            return res.status(400).send({ status: "failed", message: "error!" });
        }
        if (resultUser.length) {
            console.log("User duplicate User!: ", resultUser[0]);
            return res.status(400).send({ status: "failed", message: "มีผู้ใช้งานนี้ในระบบแล้ว"});
        }
        sql.query(conditionEmail, (err, resulEmail) => {
            if (err) {
                console.log("error: ", err);
                return res.status(400).send({ status: "failed", message: "error!" });
            }
            if (resulEmail.length) {
                console.log("User duplicate Email!: ", resulEmail[0]);
                return res.status(400).send({ status: "failed", message: "มีอีเมลนี้ในระบบแล้ว"});
            }
            next();
        });
    });
};


const verifyUser = {
  checkDuplicateEmail,
};
module.exports = verifyUser;
