const Products = require("../model/products")

exports.getAllProducts = async (req, res, next) => {
    try {
        const products = await Products.find()
        res.status(200).render("Main", {
            pageTitle: "نوین شاپ || خانه",
            path: "/",
            layout: "./layouts/mainlayout.ejs",
            products
        })

    } catch (err) {
        console.log(err);
    }

}