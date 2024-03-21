const fsPromises = require("fs/promises");
const path = require("path");

function absolutePath(resource) {
    const splitResource = resource.split("/") || resource.split("/");
    splitResource.unshift(path.dirname(require.main.filename));
    return path.join.apply(null, splitResource);
}


async function deleteFile(filePath) {
    try {
        await fsPromises.unlink(filePath);
    } catch (e){
        console.log("Delete Operation Failed");
        console.error(e);
        // throw new Error(e);
    }
}

module.exports = {absolutePath, deleteFile};
