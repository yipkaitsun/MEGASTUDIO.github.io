var subtotal = 0;
function GetCookies(name) {
    var nameEQ = name + "=";
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) == ' ') cookie = cookie.substring(1, cookie.length);
        if (cookie.indexOf(nameEQ) == 0)
            return JSON.parse(cookie.substring(nameEQ.length, cookie.length));
    }
    return null;
}

function Goto(url) {
    window.location.href = url;
}

function DeleteCookies(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
}
function setCartNum() {
    var array_cart = GetCookies("cart");
    var indexflag = 0;
    try {
        $("#cartNumber").text(array_cart.length);
    }
    catch (err) {
        $("#cartNumber").text("0");
    }
}
function setCart() {
    var array_cart = GetCookies("cart");
    var indexflag = 0;
    array_cart.forEach((cart, index) => {
        new AsyncTask({ "path": "https://api.vexpo.ai/megastore/product/" + cart.id, }).post().then(function (response) {
            subtotal += response.content.product.price * cart.qty;
            $("#cd-cart-items").append("<li class='cart-li' data-id='" + index + "'><div class='cd-cart-img' style='background-image:url(" + response.content.product.thumbnail + ")'></div><div class='cd-cart-item'><div class='cd-cart-item-detail'><div class='cd-name'>" + response.content.product.name_zh + "</div><div class='cd-price'>$" + response.content.product.price * cart.qty + "</div></div><div class='cd-cart-item-spinner'><div id=" + index + " class='NumberSpinner' min='0' max='20'step='1' default='" + cart.qty + "'></div></div></div></li>").ready(() => {
                $("#" + index).cart_htmlNumberSpinner();
                indexflag++;
                if (array_cart.length == indexflag) {
                    $("#subtotal").text(subtotal);
                    $("#cd-cart-items > li")
                        .sort(function (a, b) { return $(a).data("id") - $(b).data("id"); })
                        .appendTo("#cd-cart-items");
                }
            })
        });
    });
}

function AddToCart() {
    var array_cart = GetCookies("cart");
    var id = GetId();
    var index = 0;
    var qty = $("#addQty > input").val();
    var openedCart = $('#cd-cart').attr('class') == "speed-in";
    if (!openedCart) {
        var lateral_cart = $('#cd-cart');
        var shadow_layer = $('#cd-shadow-layer');
        toggle_panel_visibility(lateral_cart, shadow_layer, $('body'));
    }

    if (array_cart !== null && array_cart.findIndex((element) => element.id == id) !== -1) {
        const isExist = array_cart.findIndex((element) => element.id == id);
        newQty = parseInt(array_cart[isExist].qty) + parseInt(qty)
        array_cart[isExist].qty = newQty;
        var str_cart = JSON.stringify(array_cart);
        document.cookie = "cart=" + str_cart;
        new AsyncTask({ "path": "https://api.vexpo.ai/megastore/product/" + id, }).post().then(function (response) {
            subtotal += response.content.product.price * qty;
            $("#subtotal").text(subtotal);
            $('#' + isExist).find('.number-input').val(newQty);
            $('[data-id="' + isExist + '"]>.cd-cart-item >.cd-cart-item-detail >.cd-price').text("$" + response.content.product.price * newQty);
        })

    }
    else {
        if (array_cart !== null) {
            index = array_cart.length;
            array_cart.push({ id: id, qty: qty });
        }
        else array_cart = [{ id: id, qty: qty }];
        $("#cartNumber").text(array_cart.length);
        var str_cart = JSON.stringify(array_cart);
        document.cookie = "cart=" + str_cart;
        new AsyncTask({ "path": "https://api.vexpo.ai/megastore/product/" + id, }).post().then(function (response) {
            $("<li class='cart-li' data-id='" + index + "'><div class='cd-cart-img' style='background-image:url(" + response.content.product.thumbnail + ")'></div><div class='cd-cart-item'><div class='cd-cart-item-detail'><div class='cd-name'>" + response.content.product.name_zh + "</div><div class='cd-price'>$" + response.content.product.price * qty + "</div></div><div class='cd-cart-item-spinner'><div id=" + index + " class='NumberSpinner' min='0' max='20'step='1' default='" + qty + "'></div></div></div></li>").hide().appendTo($('#cd-cart-items')).show('normal').ready($("#" + index).cart_htmlNumberSpinner());
            subtotal += response.content.product.price * qty;
            $("#subtotal").text(subtotal);
        })
    }
}

function UpdateCart(id, qty, operator) {
    var array_cart = GetCookies("cart");
    new AsyncTask({ "path": "https://api.vexpo.ai/megastore/product/" + array_cart[id].id, }).post().then(function (response) {
        if (operator == "add") {
            subtotal += response.content.product.price;
            $("#subtotal").text(subtotal);
        }
        else if (operator == "minus") {
            subtotal -= response.content.product.price;
            $("#subtotal").text(subtotal);
            if (qty <= 0) {
                array_cart.splice(id, 1);
                $("#cartNumber").text(array_cart.length);
                var str_cart = JSON.stringify(array_cart);
                document.cookie = "cart=" + str_cart;
                var removeEl = $('[data-id="' + id + '"]');
                removeEl.hide('normal', function () {
                    for (var i = parseInt(id); i < $('.cart-li').length; i++) {
                        $('#cd-cart-items li').eq(i + 1).attr({ 'data-id': i });
                        $("#" + (i + 1).toString()).attr({ 'id': i })
                    }
                    removeEl.remove();
                });
            }
        }
        $('[data-id="' + id + '"]>.cd-cart-item >.cd-cart-item-detail >.cd-price').text("$" + response.content.product.price * qty).animate({ 'opacity': 1 }, 400);
    });
}

function getCart(callback) {
    var array_cart = GetCookies("cart");
    var jsonarray_cart = [];
    var indexFlag = 0;
    array_cart.forEach((cart, index) => {
        if (cart.qty > 0) {
            new AsyncTask({ "path": "https://api.vexpo.ai/megastore/product/" + cart.id, }).post().then(function (response) {
                if (response.success == 1) {
                    jsonarray_cart.push(
                        {
                            id: response.content.product.id,
                            name: response.content.product.name,
                            thumbnail: response.content.product.thumbnail,
                            price: response.content.product.price,
                            quantity: parseInt(cart.qty),
                        });
                }
                indexFlag++;
                if (array_cart.length == indexFlag) {
                    callback(jsonarray_cart);
                }
            });
        }
    });
}
