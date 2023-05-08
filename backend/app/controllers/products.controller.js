const sql = require("../models/db");

exports.getAllProduct = (req, res) => {
    sql.query("SELECT * FROM products", (err, result) => {
        if (err) {
            console.log("error: ", err);
            return res.status(400).send({ status: "failed", message: "ระบบมีปัญหา" });
        }
        if (result.length) {
            console.log("products: ", result);
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
            return res.status(200).send({ status: "ok", result});
        }
        return res.status(400).send({ status: "ok", message: "ไม่มีข้อมูล"});
    });
}
exports.createProduct = (req, res) => {
    let product = req.body.data;
        var dataProducts = {
            product_name : product.product_name,
            product_quanlity : parseInt(product.product_quanlity),
            product_detail : product.product_detail,
            product_status : parseInt(product.product_status),
        }
        sql.query("INSERT INTO products SET ?", dataProducts, (err, result) => {
            if (err) {
                console.log("error: ", err);
                return res.status(400).send({ status: "failed", message: "เพิ่มสินค้าไม่สำเร็จ" });
            }
                console.log("created products: ", { id: result.insertId,  dataProducts});
                return res.status(200).send({ status: "ok", message: "เพิ่มสินค้าสำเร็จ!" });
        });
}
exports.editProduct = async (req, res) => {
    let product = req.body.data;
    var dataProducts = {
        product_id : parseInt(product.product_id),
        product_name : product.product_name,
        product_quanlity : parseInt(product.product_quanlity),
        product_detail : product.product_detail,
        product_status : parseInt(product.product_status),
    };
    sql.query("UPDATE products SET product_name = ?, product_quanlity = ?, product_detail = ?, product_status = ? WHERE product_id = ?",
    [dataProducts.product_name,dataProducts.product_quanlity,dataProducts.product_detail,dataProducts.product_status,dataProducts.product_id],(err, result) => {
        if (err) {
            console.log("error: ", err);
            return res.status(400).send({ status: "failed", message: "แก้ไขข้อมูลสินค้าไม่สำเร็จ" });
        }
        if (result.affectedRows == 0) {
            console.log("Product not founded!");
            return res.status(400).send({ status: "failed", message: "ไม่มีรหัสสินค้านี้"});
        }
            console.log("Update products: ", { dataProducts});
            return res.status(200).send({ status: "ok", message: "แก้ไขข้อมูลสินค้าสำเร็จ" });
    });
}
exports.deleteProduct = async (req, res) => {
    let product_id = parseInt(req.body.product_id);

    sql.query("DELETE FROM products WHERE product_id = ?", product_id, async (err, result) => {
        if (err) {
            console.log("error: ", err);
            return res.status(400).send({ status: "failed", message: "ลบข้อมูลสินค้าไม่สำเร็จ" });
        }
        if (result.affectedRows == 0) {
            console.log("Product not founded!");
            return res.status(400).send({ status: "failed", message: "ไม่มีสินค้านี้"});
        }
        console.log("Deleted product with product_id: ", product_id);
        return res.status(200).send({ status: "ok", message: "ลบข้อมูลสินค้าสำเร็จ" });
      });
}

