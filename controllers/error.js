const get404 = (req, res, next) => {
    res.render('404', {docTitle: "404 | Something went wrong.", path:"404"})
}

module.exports={get404};