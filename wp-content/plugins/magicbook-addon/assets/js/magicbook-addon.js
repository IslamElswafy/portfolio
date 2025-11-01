jQuery(document).ready(function($) {

    /* Set the height of magicbook container */
    window.magicbook_container = function() {

        $('.magicbook-wrapper').each(function() {

            if (typeof($(this).attr('data-fullsize')) !== 'undefined' && $(this).attr('data-fullsize') === '1') {
                var outerHeight = $(this).closest('.bb-item').height();
                var innerHeight = $(this).children('.magicbook-inner-wrapper').height();
                var thisHeight = outerHeight;
                if (innerHeight > outerHeight) {
                    thisHeight = innerHeight;
                }

                $(this).addClass('fullsize');
                $(this).height(thisHeight);

                if ($(window).width() <= 768) {
                    $(this).height($(window).height());
                    $(this).closest('.bb-custom-side').height($(this).height());
                }
            } else {
                $(this).closest('.container').css('padding', '0');
            }
            if (typeof($(this).attr('data-bg-color')) !== 'undefined') {
                $(this).css({
                    backgroundColor: $(this).attr('data-bg-color')
                });
                $(this).closest('.container').css({
                    backgroundColor: $(this).attr('data-bg-color')
                });
            }
            if (typeof($(this).attr('data-bg-img')) !== 'undefined') {
                $(this).css({
                    backgroundImage: 'url(' + $(this).attr('data-bg-img') + ')'
                });
            }
            if (typeof($(this).attr('data-bg-size')) !== 'undefined') {
                $(this).css({
                    backgroundSize: $(this).attr('data-bg-size')
                });
            }
            if (typeof($(this).attr('data-text-color')) !== 'undefined') {
                $(this).css({
                    color: $(this).attr('data-text-color')
                });
                $(this).find('div,h1,h2,h3,h4,h5,h6,p,span,blockquote').css('color', $(this).attr('data-text-color'));
            }
        });
    };

    $(window).load(function() {
        magicbook_container();
        $('.bb-custom-side').each(function() {
            if ($(this).children('.content-wrapper').children('.container').has('.magicbook-wrapper').length > 0) {
                $(this).find('.page-head-cover').hide();
                $(this).find('.page-foot-cover').hide();
            }
        });
    });

});