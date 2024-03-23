let csrfToken;
let productId;

async function deleteProduct(delBtn) {
    const parent = delBtn.parentElement;
    const productCard = delBtn.closest("article");
    let response;
    csrfToken = parent.querySelector("input[name='_csrf']").value;
    productId = parent.querySelector("input[name='productId']").value;

    try {
        if (confirm("Are you sure you want to delete this product?")) {
            response = await (await fetch(`/admin/product/${productId}`, {
                method: "DELETE",
                headers: {
                    "csrf-token": csrfToken
                }
            })).text();
            console.log(response);
            if (response.error) {
                throw new Error(response.message);
            }
            productCard.remove();
        }
    } catch (e) {
        console.log(e);
    }
    // console.log(csrfToken, productId);
}