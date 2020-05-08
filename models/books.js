'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class Books extends Sequelize.Model {}
    Books.init({
        title:{
            type: Sequelize.STRING,
            allowNull: false,
            validate:{
                notNull: true,
                notNull:{
                    msg: "Title cannot be blank!"
                },
                notEmpty: true, 
                notEmpty: {
                    msg: "Title cannot be blank!"
                }
            }
        } ,
        author: {
            type: Sequelize.STRING,
            allowNull: false,
            validate:{
                notNull: true,
                notNull:{
                    msg: "Author cannot be blank!"
                },
                notNull: true,
                notEmpty: {
                    msg: "Author cannot be blank!"
                }
            }
        },
        genre: Sequelize.STRING,
        year: Sequelize.INTEGER

    }, { sequelize });

    return Books;
};