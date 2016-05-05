var App = function () {
    return {
        scrollTo: function (el, offeset) {
            pos = (el && el.size() > 0) ? el.offset().top : 0;
            jQuery('html,body').animate({
                scrollTop: pos + (offeset ? offeset : 0)
            }, 'slow');
        },
        // function to scroll to the top
        scrollTop: function () {
            App.scrollTo();
        }
    };
}();

