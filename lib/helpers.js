const fsPromises = require("fs/promises");
const path = require("path");
const {productModel} = require("../models/product");
const ITEMS_PER_PAGE = 2;

function absolutePath(resource) {
    const splitResource = resource.split("/") || resource.split("/");
    splitResource.unshift(path.dirname(require.main.filename));
    return path.join.apply(null, splitResource);
}


async function deleteFile(filePath) {
    try {
        await fsPromises.unlink(filePath);
    } catch (e) {
        console.log("Delete Operation Failed");
        console.error(e);
        // throw new Error(e);
    }
}

async function pagination(req, res, next) {
    const filter = req.isAdminRoute ? {userId: req.user._id} : null;
    req.itemsPerPage = ITEMS_PER_PAGE;
    req.currentPage = Math.abs(Number(req.query.page)) || 1;
    const totalItems = await productModel.find(filter).countDocuments();
    if (totalItems === 0) {
        req.lastPage = 1;
    } else {
        req.lastPage = Math.ceil(totalItems / ITEMS_PER_PAGE);
    }
    if (req.currentPage > req.lastPage) {
        return res.redirect(`?page=${req.lastPage}`)
    }
    next();
}

module.exports = {absolutePath, deleteFile, pagination};
