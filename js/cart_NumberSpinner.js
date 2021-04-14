(function($) {
    $.fn.cart_htmlNumberSpinner = function () {

        /* creating the counter buttons */
        $(this).append("<div class='btn cart_decrementer'>-</div> <input class='number-input' type='number' readonly/> <div class='btn cart_incrementer'>+</div>");

        /* default value and variables and jquery elements*/
        var defaultValue = 0, inputValue;
        var numberInput$ = $(this).find('.number-input');
        var incrementerEl$ = $(this).find('.cart_incrementer');
        var decrementerEl$ = $(this).find('.cart_decrementer');

        /* hide the default number input spinner */
        $(this).append("<style>" +
            "input[type=number]::-webkit-inner-spin-button, \n" +
            "input[type=number]::-webkit-outer-spin-button { \n" +
            "    -webkit-appearance: none;\n" +
            "    -moz-appearance: none;\n" +
            "    appearance: none;\n" +
            "    margin: 0; \n" +
            "}</style>");

        /* styling the counter buttons */
        $(this).find('.btn').css({"display":"inline-block", "width":"18px", "height":"18px", "font-size":"18px", "text-align":"center", "vertical-align":"middle", "line-height":"1", "cursor":"pointer", "user-select":"none"});
        incrementerEl$.css({"vertical-align":"middle","background-color":"white", "color":"black", "border": "1px solid black"});
        decrementerEl$.css({"vertical-align":"middle","background-color":"white", "color":"black", "font-size":"18px", "border": "1px solid black"});



        /* props - dynamic attributes */
        var minAttributeValue = $(this).attr("min");
        var maxAttributeValue = $(this).attr("max");
        var stepAttributeValue = $(this).attr("step");
        var defaultAttributeValue=$(this).attr("default"), inputValue;

        if(minAttributeValue){
            numberInput$.attr("min",+minAttributeValue);
        }

        if(maxAttributeValue){
            numberInput$.attr("max", +maxAttributeValue);
        }

        if(stepAttributeValue){
            numberInput$.attr("step", +stepAttributeValue);
        }

        if(defaultAttributeValue){
            numberInput$.attr("default", +defaultAttributeValue);
        }

        /* set the default value into the input */
        inputValue = defaultAttributeValue<minAttributeValue ? minAttributeValue: defaultAttributeValue;
        numberInput$.val(inputValue);

        /* incrementer functionality */
        incrementerEl$.click(function () {

            var parentEl = $(this).parent();
            var array_cart=GetCookies("cart");
            var id=parentEl[0].id;
            inputValue = parentEl.find('.number-input').val();
            if(maxAttributeValue){
                if(maxAttributeValue==inputValue){
                  inputValue = parentEl.find('.number-input').val();
                  array_cart[id]={id:array_cart[id].id,qty:inputValue};
                  var str_cart = JSON.stringify(array_cart);
                  document.cookie = "cart="+str_cart;
                  return;
                }
            }
            if(stepAttributeValue){
                inputValue = parentEl.find('.number-input').val();
                parentEl.find('.number-input').val((+inputValue)+(+stepAttributeValue));
                inputValue = parentEl.find('.number-input').val();
                array_cart[id]={id:array_cart[id].id,qty:inputValue};
                var str_cart = JSON.stringify(array_cart);
                document.cookie = "cart="+str_cart;
                UpdateCart(id,inputValue,"add");
                return;
            }
              inputValue = parentEl.find('.number-input').val();
              parentEl.find('.number-input').val(++inputValue);
              inputValue = parentEl.find('.number-input').val();
              array_cart[id]={id:array_cart[id].id,qty:inputValue};
              var str_cart = JSON.stringify(array_cart);
              document.cookie = "cart="+str_cart;
              UpdateCart(id,inputValue,"add");
        });

        /* decrementer functionality */
            decrementerEl$.click(function () {
            var array_cart=GetCookies("cart");
            var parentEl = $(this).parent();
            var id=parentEl[0].id;
            inputValue = parentEl.find('.number-input').val();
            if(minAttributeValue){
                if(minAttributeValue==inputValue){
                  inputValue = parentEl.find('.number-input').val();
                  array_cart[id]={id:array_cart[id].id,qty:inputValue};
                  var str_cart = JSON.stringify(array_cart);
                  document.cookie = "cart="+str_cart;
                    return;
                }
            }
            if(stepAttributeValue){
                inputValue = parentEl.find('.number-input').val();
                parentEl.find('.number-input').val((+inputValue)-(+stepAttributeValue));
                inputValue = parentEl.find('.number-input').val();
                array_cart[id]={id:array_cart[id].id,qty:inputValue};
                var str_cart = JSON.stringify(array_cart);
                document.cookie = "cart="+str_cart;
                UpdateCart(id,inputValue,"minus");
                return;
            }
            inputValue = parentEl.find('.number-input').val();
            parentEl.find('.number-input').val(--inputValue);
            inputValue = parentEl.find('.number-input').val();
            array_cart[id]={id:array_cart[id].id,qty:inputValue};
            var str_cart = JSON.stringify(array_cart);
            document.cookie = "cart="+str_cart;
            UpdateCart(id,inputValue,"minus");
        })

        numberInput$.change(function () {
            if(!maxAttributeValue || !minAttributeValue) return;
            var currentValue = $(this).val();
            if((+currentValue)>(+maxAttributeValue)){
                $(this).val(maxAttributeValue)
                return;
            }
            if((+currentValue)<(+minAttributeValue)){
                $(this).val(minAttributeValue)
                return;
            }
        })

    };

    $.fn.getSpinnerValue = function () {
        return $(this).find('.number-input').val();
    }

}(jQuery));
