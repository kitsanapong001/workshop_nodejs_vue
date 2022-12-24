# required frontend vuejs
- vscode
- nodejs
- npm install -g @vue/cli
- npm install bootstrap@4.3.1 bootstrap-vue axios vue-sweetalert2 bootstrap-icons


- create vue
- add extension tool for vscode
- introduction vuejs
- {{}} == interpolation
- event click 
- v-model
- vuerouter navigation bar
- style componence
- method
- data & variable
- array object
- global style local style
- computed vs method
- binding
- v-model & input form
- call sub componence & prop data to componece
- v-if & v-for
- vuex state management


# required backend nodejs
npm install express body-parser nodemon mysql2 cors jsonwebtoken bcryptjs moment moment-timezone uuid
#sql
CREATE TABLE IF NOT EXISTS `users` (
  user_id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  user_username varchar(255) NOT NULL,
  user_password varchar(255) NOT NULL,
  user_firstname varchar(255) NOT NULL,
  user_lastname varchar(255) NOT NULL,
  user_email varchar(255) NOT NULL,
  role_id int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `roles` (
  role_id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  role_name varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `products` (
  product_id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  product_name varchar(255) NOT NULL,
  product_quanlity int(11),
	product_detail varchar(255),
	product_image varchar(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;