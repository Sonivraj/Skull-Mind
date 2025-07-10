(function ($) {
  "use strict"; // Using strict mode

  var $body = $("body"),
    $wrapper = $("#wrapper"),
    $inner = $("#inner"),
    controller = new ScrollMagic.Controller(),
    $masonry = $body.find(".masonry-grid"),
    $section = $("section");

  $(".nav-links a, .hero a, a.grid-item, .prev-next-container a").addClass(
    "transition-link"
  );

  $(".animsition").animsition({
    inClass: "fade-in transition-in",
    outClass: "fade-out transition-out",
    inDuration: 600,
    outDuration: 600,
    linkElement: ".transition-link",
    // e.g. linkElement: 'a:not([target="_blank"]):not([href^="#"])'
    loading: false,
    loadingParentElement: "body", //animsition wrapper element
    loadingClass: "animsition-loading",
    loadingInner: "", // e.g '<img src="loading.svg" />'
    timeout: false,
    timeoutCountdown: 5000,
    onLoadEvent: true,
    browser: ["animation-duration", "-webkit-animation-duration"],
    // "browser" option allows you to disable the "animsition" in case the css property in the array is not supported by your browser.
    // The default setting is to disable the "animsition" in a browser that does not support "animation-duration".
    overlay: false,
    overlayClass: "animsition-overlay-slide",
    overlayParentElement: "body",
    transition: function (url) {
      window.location.href = url;
    },
  });

  // Disable right click on images (copyright protection)
  $("img").on("contextmenu", function (e) {
    e.preventDefault();
  });

  /*
      Responsive navigation
  */
  var $navLinks = $("ul.nav-links > li:not(.brand)");
  var $body = $("body");

  function toggleDropdown($clickedItem) {
    const $dropdown = $clickedItem.find(".dropdown");

    if (!$dropdown.hasClass("dropdown-open") && !$dropdown.is(":animated")) {
      $(".dropdown.dropdown-open").removeClass("dropdown-open").slideUp(200);
      $dropdown.addClass("dropdown-open").slideDown(200);
    }
  }

  function responsiveMenu() {
    const isMobile = $(window).width() < 951;

    if (isMobile) {
      if ($body.hasClass("menu-open")) {
        TweenLite.to($navLinks, 0.5, {
          opacity: 1,
          pointerEvents: "auto",
          display: "block",
          ease: Power3.easeInOut,
        });
      } else {
        TweenLite.to($navLinks, 0.5, {
          opacity: 0,
          pointerEvents: "none",
          display: "none",
          ease: Power3.easeInOut,
        });
        $(".dropdown.dropdown-open").removeClass("dropdown-open").slideUp(200);
      }
    } else {
      TweenLite.to($navLinks, 0, {
        opacity: 1,
        pointerEvents: "auto",
        display: "block",
        ease: Power3.easeInOut,
      });
      $(".dropdown.dropdown-open").removeClass("dropdown-open").slideUp(0);
    }
  }

  function ensureNavVisibleOnScroll() {
    const isMobile = $(window).width() < 951;
    if (!isMobile) {
      $navLinks.css({
        display: "block",
        opacity: 1,
        pointerEvents: "auto",
      });
    }
  }

  let lastScrollTop = 0;
  let headerVisible = true;

  function handleScrollDirectionNavVisibility() {
    const isMobile = $(window).width() < 951;
    if (isMobile) return;

    const currentScrollTop = $(window).scrollTop();
    const scrollingDown = currentScrollTop > lastScrollTop;

    if (scrollingDown) {
      $("header#main-header").stop().fadeOut(200);
    } else {
      $("header#main-header").stop().fadeIn(200);
    }

    lastScrollTop = currentScrollTop;
  }

  $(window).on("scroll", handleScrollDirectionNavVisibility);

  $body.on("click", ".has-dropdown", function (e) {
    const isMobile = $(window).width() < 951;
    if (isMobile && $body.hasClass("menu-open")) {
      toggleDropdown($(this));
      // e.preventDefault();
      e.stopPropagation();
    }
  });

  $body.on("click", ".responsive-nav", function (e) {
    e.preventDefault();
    e.stopPropagation();
    $body.toggleClass("menu-open");
    responsiveMenu();
  });

  $(window).on("scroll", function () {
    handleScrollDirectionNavVisibility();
    ensureNavVisibleOnScroll();
  });

  $(window).on("resize", responsiveMenu);

  responsiveMenu();

  responsiveMenu();
  /*
      Custom modules
  */

  // Anchor links
  $body.on("click", "a.anchor", function (e) {
    var id = $(this).attr("href");
    var link = this;
    TweenLite.to(window, 1.5, {
      scrollTo: id,
      ease: Power3.easeInOut,
      onComplete: function () {
        window.location.hash = link.hash;
      },
    });
    e.preventDefault();
  });

  /*
      Portfolio functions
  */

  // Filters
  $body.on("click", ".filter", function (e) {
    e.preventDefault();
    e.stopPropagation();

    var $this = $(this),
      selected = $this.attr("data-filter"),
      $filterContainer = $(this).closest(".filters");

    $filterContainer.find(".filter.active").removeClass("active");
    $this.addClass("active");

    $masonry.find(".grid-item:not(." + selected + ")").css({
      "-webkit-transition": "all .35s",
      transition: "all .35s",
      "-webkit-transform": "scale(0)",
      transform: "scale(0)",
      "-webkit-opacity": "0",
      opacity: "0",
    });
    setTimeout(function () {
      $masonry.find(".grid-item:not(." + selected + ")").hide(0);
      $masonry
        .find("." + selected)
        .show(0)
        .css({
          "-webkit-transform": "scale(1)",
          "-webkit-opacity": "1",
          transform: "scale(1)",
          opacity: "1",
        });
      $masonry.packery("layout");
    }, 250);
  });

  init();
  autoSizeTextarea();
  initAccordion();

  function init() {
    parallaxHero();
    scrollAnimations();

    $masonry.packery({
      percentPosition: true,
      columnWidth: ".grid-item",
      isInitLayout: false,
    });

    $masonry.packery("layout");

    // Preloader
    var $loader = $("#loader"),
      preloader = imagesLoaded($inner, { background: ".bg" }),
      total = 0,
      loaded = 0,
      totalImg = $(".bg").length + $("img").length;

    preloader
      .on("always", function () {
        total = preloader.images.length;
        $loader.find(".total").text(total);
      })
      .on("progress", function () {
        loaded++;
        if (loaded < 2) $loader.find(".description").text("image loaded");
        else $loader.find(".description").text("images loaded");
        $loader.find(".loaded").text(loaded);
        setTimeout(function () {
          $loader.find(".number").text(Math.round((loaded / totalImg) * 100));
          $loader
            .find(".loadbar .inner")
            .css({ width: (loaded / totalImg) * 100 + "%" });
        }, 100 * loaded);
        $masonry.packery("layout");
      })
      .on("done", function () {
        setTimeout(function () {
          $loader.find(".number").text("100");
          $loader.find(".loadbar .inner").css({ width: "100%" });
          $body.addClass("loaded init-load");
          $loader.find("section").delay(500).fadeOut(500);
          $loader.delay(1000).fadeOut(1000);
          TweenLite.to($inner, 1, {
            autoAlpha: 1,
            y: 0,
            delay: 1,
            ease: Power3.easeOut,
          });
          TweenLite.to(window, 0.5, {
            scrollTo: "#wrapper",
            ease: Power3.easeInOut,
          });
          if ($(window).width() > 951) {
            TweenMax.staggerFrom(
              $("#main-header .col-1"),
              1,
              { autoAlpha: 0, y: -80, delay: 0.7, ease: Power3.easeInOut },
              0.2
            );
          }
          animateText(0.7);
        }, 100 * loaded);
      })
      .on("fail", function () {
        $loader.find(".number").text("100");
        $loader.find(".loadbar .inner").css({ width: "100%" });
        $loader.find(".indicator").css("opacity", 1);
        $body.addClass("loaded init-load");
        $loader.delay(300).fadeOut(1000);
        TweenLite.to($inner, 4, {
          autoAlpha: 1,
          y: 0,
          delay: 2,
          ease: Power3.easeOut,
        });
      });

    makeLineGrid();
  }

  function initAccordion() {
    // Accordion
    var $accordion = $wrapper.find(".accordion");

    if ($accordion.length) {
      $(".accordion li.active .body")
        .show(0)
        .parent()
        .siblings()
        .find(".body")
        .hide(0);

      $(".accordion li").on("click", function (e) {
        var $li = $(this);
        if ($li.hasClass("active"))
          $li.removeClass("active").find(".body").slideUp().parent();
        else
          $li
            .addClass("active")
            .find(".body")
            .slideDown()
            .parent()
            .siblings()
            .removeClass("active")
            .find(".body")
            .slideUp();
        e.preventDefault();
      });
    }
  }

  function parallaxHero() {
    // Hero
    var parallaxHero = new ScrollMagic.Scene({
      triggerElement: ".hero",
      offset: $(window).height() / 2,
      duration: $(".hero").height(),
    })
      .setTween(".hero", { opacity: 0, y: 80 })
      .addTo(controller);
  }

  function scrollAnimations() {
    // Custom elements
    $wrapper.find(".list-block *, .content-block *").each(function () {
      // build a tween
      var tween = TweenLite.from($(this), 1, {
        autoAlpha: 0,
        y: "+=30",
        ease: Power3.easeInOut,
      });

      // build a scene
      var scene = new ScrollMagic.Scene({
        triggerElement: this,
        offset: -$(window).height() / 2,
      })
        .setTween(tween) // trigger a TweenLite.to tween
        .addTo(controller);
    });
  }

  function makeLineGrid() {
    var $lineCount = new Array(8),
      $gridLine = $('<div class="col-1"></div>'),
      $gridContainer = $('<div class="line-container"></div>'),
      $grid = $('<div class="container"></div>');

    $.each($lineCount, function (i) {
      $grid.append($gridLine.clone());
    });

    $gridContainer.append($grid);
    $wrapper.append($gridContainer);
    $(".line-container").remove();
  }

  function autoSizeTextarea() {
    $(document)
      .find("textarea")
      .each(function () {
        this.setAttribute(
          "style",
          "height:" + (this.scrollHeight - 26) + "px;overflow-y:hidden;"
        );
      })
      .on("input", function () {
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px";
      });
  }

  function animateText($delay) {
    if ($(".animatedText").length) {
      var mySplitText = new SplitText(".animatedText"),
        splitTextTimeline = new TimelineLite();
      mySplitText.split({ type: "words, chars" });
      splitTextTimeline.staggerFrom(
        mySplitText.chars,
        1,
        { delay: $delay, autoAlpha: 0, y: -100, ease: Power3.easeInOut },
        0.05
      );
    }
  }

  var $allVideos = $(
      "iframe[src^='//player.vimeo.com'], iframe[src^='//www.youtube.com']"
    ),
    $fluidEl = $("body");

  // Figure out and save aspect ratio for each video
  $allVideos.each(function () {
    $(this)
      .data("aspectRatio", this.height / this.width)

      // and remove the hard coded width/height
      .removeAttr("height")
      .removeAttr("width");
  });

  // When the window is resized
  $(window)
    .resize(function () {
      var newWidth = $fluidEl.width();

      // Resize all videos according to their own aspect ratio
      $allVideos.each(function () {
        var $el = $(this);
        $el.width(newWidth).height(newWidth * $el.data("aspectRatio"));
      });

      responsiveMenu();

      if ($(window).width() > 949) {
        var parallaxHeader = new ScrollMagic.Scene({
          triggerElement: $("#main-header"),
          offset: 0,
          duration: 200,
          triggerHook: "onLeave",
        })
          .setTween("#main-header", 0.5, {
            opacity: 0,
            y: 10,
            ease: Linear.ease,
          })
          .addTo(controller);
      }

      // Kick off one resize to fix all videos on page load
    })
    .resize();
})(jQuery);
