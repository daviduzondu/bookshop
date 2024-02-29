const {Product} = require("../models/product");
const {v4: uuidv4} = require("uuid");
// Admin Controllers
const getAddProduct = (req, res, next) => {
    let path = "/admin/add-product"
    res.render('admin/edit-product', {
        docTitle: 'Add Product',
        path
    });
};

const getEditProduct = async (req, res, next) => {
    const editMode = req.query.edit;
    const prodId = req.params.productId;
    // const product = await Product.findByPk(prodId);
    const [product] = await req.user.getProducts({where: {id: prodId}});
    if (editMode !== "true") {
        return res.redirect("/");
    }

    if (!product) {
        return res.redirect('/');
    }
    let path = "/admin/edit-product"
    res.render('admin/edit-product', {
        docTitle: 'Edit Product',
        path,
        editing: editMode,
        product: product
    });
};

const postDeleteProduct = async (req, res, next) => {
    const {productId: id} = req.body;
    const match = await Product.findByPk(id);
    await match.destroy();
    res.redirect("/admin/products");
}

const postEditProduct = async (req, res, next) => {
    const {title, imageUrl, price, description, productId: id} = req.body;
    let updatedProduct = (await Product.findByPk(id))

    await updatedProduct.update({title, imageUrl, price, description, id});
    res.redirect("/admin/products");
}

const postAddProduct = async (req, res, next) => {
    const {title, imageUrl, price, description} = req.body;
    await req.user.createProduct({
        id: uuidv4(),
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description,
        userId: req.user.id
    })
    console.log(req.body);
    // const product = new Product(null, title, imageUrl, price, description);
    // product.save();
    res.redirect('/products');
};

const getAdminProducts = async (req, res, next) => {
    let  products= (await req.user.getProducts());
    let path = "/admin/products"
    res.render('admin/products', {path, docTitle: "Admin Products", prods: products.reverse()})
}


module.exports = {getAddProduct, postAddProduct, getEditProduct, getAdminProducts, postEditProduct, postDeleteProduct}