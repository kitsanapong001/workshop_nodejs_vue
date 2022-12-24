const sql = require("../models/db");
const fs = require("fs");
const formidable = require("formidable");
const { v4: uuidv4 } = require("uuid");

exports.getAllProduct = (req, res) => {
    sql.query("SELECT * FROM products", (err, result) => {
        if (err) {
            console.log("error: ", err);
            return res.status(400).send({ status: "failed", message: "ระบบมีปัญหา" });
        }
        if (result.length) {
            var tempData = [];
            console.log("products: ", result);
            result.forEach((element, index) => {
                result[index].imageUrl = getImageUrl(req,element.product_image)
            });
            return res.status(200).send({ status: "ok", result});
        }
        return res.status(200).send({ status: "ok", message: "ไม่มีข้อมูล"});
    });
}
exports.getProductById = (req, res) => {
    const product_id = parseInt(req.query.product_id)
    sql.query(`SELECT * FROM products WHERE product_id = ${product_id}`, (err, result) => {
        if (err) {
            console.log("error: ", err);
            return res.status(400).send({ status: "failed", message: "ระบบมีปัญหา" });
        }
        if (result.length) {
            console.log("products: ", result[0]);
            result[0].imageUrl = getImageUrl(req,result[0].product_image)
            
            return res.status(200).send({ status: "ok", result});
        }
        return res.status(200).send({ status: "ok", message: "ไม่มีข้อมูล"});
    });
}
exports.createProduct = (req, res) => {
    var uuid = uuidv4().split("-").join("");
    const form = new formidable.IncomingForm();
    form.parse(req, async (error, fields, files) => {
        var fileName = uuid + checkTypeImage(files.product_image_file.mimetype);
        fs.readFile(files.product_image_file.filepath, function (err, data) {
            if (err) throw err;
            fs.writeFile('app/assets/images/'+fileName, data, function (err) {
                if (err) throw err;
            });
        });

        var dataProducts = {
            product_name : fields.product_name,
            product_quanlity : parseInt(fields.product_quanlity),
            product_detail : fields.product_detail,
            product_image : fileName,
        }
        sql.query("INSERT INTO products SET ?", dataProducts, (err, result) => {
            if (err) {
                console.log("error: ", err);
                return res.status(400).send({ status: "failed", message: "เพิ่มสินค้าไม่สำเร็จ" });
            }
                console.log("created products: ", { id: result.insertId,  dataProducts});
                return res.status(200).send({ status: "ok", message: "เพิ่มสินค้าสำเร็จ!" });
        });
    })
}
exports.editProduct = (req, res) => {
    var uuid = uuidv4().split("-").join("");
    var dataProducts = {};
    const form = new formidable.IncomingForm();
    form.parse(req, async (error, fields, files) => {
        let result_product = await getProductById(fields.product_id)
        if (files.product_image_file) {
            fs.unlinkSync("app/assets/images/"+result_product.product_image);
            var fileName = uuid + checkTypeImage(files.product_image_file.mimetype);
            fs.readFile(files.product_image_file.filepath, function (err, data) {
                if (err) throw err;
                fs.writeFile('app/assets/images/'+fileName, data, function (err) {
                    if (err) throw err;
                });
            });
            dataProducts = {
                product_id : parseInt(fields.product_id),
                product_name : fields.product_name,
                product_quanlity : parseInt(fields.product_quanlity),
                product_detail : fields.product_detail,
                product_image : fileName,
            };
        }else{
            dataProducts = {
                product_id : parseInt(fields.product_id),
                product_name : fields.product_name,
                product_quanlity : parseInt(fields.product_quanlity),
                product_detail : fields.product_detail,
                product_image : result_product.product_image,
            };
        }
        sql.query("UPDATE products SET product_name = ?, product_quanlity = ?, product_detail = ?, product_image = ? WHERE product_id = ?",
        [dataProducts.product_name,dataProducts.product_quanlity,dataProducts.product_detail,dataProducts.product_image,dataProducts.product_id],(err, result) => {
            if (err) {
                console.log("error: ", err);
                return res.status(400).send({ status: "failed", message: "แก้ไขข้อมูลสินค้าไม่สำเร็จ" });
            }
            if (result.affectedRows == 0) {
                console.log("Product not founded!");
                return res.status(200).send({ status: "failed", message: "ไม่มีรหัสสินค้านี้"});
            }
                console.log("Update products: ", { dataProducts});
                return res.status(200).send({ status: "ok", message: "แก้ไขข้อมูลสินค้าสำเร็จ" });
        });
    })
}
exports.deleteProduct = async (req, res) => {
    var product_id = req.body.product_id;
    let result_product = await getProductById(product_id);

    sql.query("DELETE FROM products WHERE product_id = ?", product_id, async (err, result) => {
        if (err) {
            console.log("error: ", err);
            return res.status(400).send({ status: "failed", message: "ลบข้อมูลสินค้าไม่สำเร็จ" });
        }
        if (result.affectedRows == 0) {
            console.log("Product not founded!");
            return res.status(200).send({ status: "failed", message: "ไม่มีสินค้านี้"});
        }
            
            fs.unlinkSync("app/assets/images/"+result_product.product_image);
            console.log("Deleted product with product_id: ", product_id);
            return res.status(200).send({ status: "ok", message: "ลบข้อมูลสินค้าสำเร็จ" });
      });
}



function checkTypeImage(val) {
    if (val == "image/png") {
      type_image = ".png";
    } else if (val == "image/jpeg") {
      type_image = ".jpeg";
    } else {
      type_image = ".jpg";
    }
    return type_image;
  };

 async function getProductById(product_id){
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM products WHERE product_id = ${product_id}`, (err, result) => {
            if (err) {
                console.log("error: ", err);
                reject()
            }
            if (result.length) {
                console.log("products: ", result[0]);
                resolve(result[0])
            }
                reject()
        });
    })
  }

  function getImageUrl(req,fileName){
    const hostname = req.headers.host;
    const protocal = req.protocol;
    let a = protocal + "://" + hostname + "/getImage/" + fileName;
    return a;
  }