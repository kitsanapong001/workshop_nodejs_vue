ติดตั้ง nodejs โดยโหลดที่หน้าเว็บไซด์

npm install express body-parser nodemon mysql2 cors bcryptjs formidable jsonwebtoken uuid
      
CREATE TABLE IF NOT EXISTS `users` (
  id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  email varchar(255) NOT NULL,
  firstname varchar(255),
	lastname varchar(255),
	phonenumber varchar(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `products` (
  product_id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  product_name varchar(255) NOT NULL,
  product_quanlity int(11),
	product_detail varchar(255),
	product_status int(11)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;