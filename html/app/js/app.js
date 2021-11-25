(function ($) {
	$(document).ready(function () {
		/* Cleanup main menu */
		$(".submenu:empty").parent().remove();

		$(".owl-carousel").owlCarousel({
			items: 1,
		});

		$(".has-mega-menu > a").on("click", function (e) {
			e.preventDefault();
			var $this = $(this);
			var isOpen = $this.parent(".active");

			hideOpenMenus(e);

			if (isOpen.length == 0) {
				$this.parent().addClass("active");
				$("header .main-menu").addClass("mega-menu-open open");
				$("header .mega-menu").addClass("open");
			}
		});

		$(".has-submenu > a").on("click", function (e) {
			e.preventDefault();
			var $this = $(this);
			var isOpen = $this.parent().find(".submenu-wrapper.open");

			hideOpenMenus(e);

			if (isOpen.length == 0) {
				$this.parent().addClass("active");
				$this.parent().find(".submenu-wrapper").addClass("open");
				$("header .main-menu").addClass("submenu-open");
				$this
					.parent()
					.find(".submenu-wrapper .submenu")
					.addClass("open");
			}
		});

		$(".js-open-mobile-menu").on("click", function (e) {
			e.preventDefault();
			hideOpenMenus(e);
			$("header .main-menu").toggleClass("open");
		});

		$(".js-toggle-site-sections").on("click", function (e) {
			e.preventDefault();
			$(this).toggleClass("active");
			$(".site-sections-nav").toggleClass("open");
		});

		/* hide open menus */
		$(document).click(function (e) {
			hideOpenMenus(e);
			closeModals(e);
		});

		$("nav, .mega-menu").click(function (e) {
			e.stopPropagation();
		});

		/* Accordion */
		$(".accordion .title").click(function (e) {
			$(this).toggleClass("active");
			$(this).parent().find(".description").toggleClass("active");
		});

		/* TOC */
		$(".toc a").click(function (e) {
			e.preventDefault();
			var panel = $(this).attr("href");

			$([document.documentElement, document.body]).animate(
				{
					scrollTop: $(panel).offset().top,
				},
				700
			);
		});

		/* Management cards */
		$(".js-expand-excerpt").click(function (e) {
			var panel = $(this).parent().parent().parent().attr("id");

			if ($(this).hasClass("has-close-icon")) {
				$(this).parent().parent().parent().removeClass("active");
			} else {
				$(".management-cards .item.active")
					.removeClass("active")
					.find(".has-close-icon")
					.removeClass("has-close-icon")
					.text("Read More")
					.addClass("has-arrow");
				$(this).parent().parent().parent().addClass("active");

				$([document.documentElement, document.body]).animate(
					{
						scrollTop: $("#" + panel).offset().top,
					},
					700
				);
			}

			$(this).toggleClass("has-close-icon has-arrow");
			$(this).text(
				$(this).text() == "Read More" ? "Show Less" : "Read More"
			);
		});

		/* KVL Modal */
		$(".js-modal-open").click(function (e) {
			e.preventDefault();
			var redirectURL = $(this).attr("href");
			var fileName = $(this).data("file-name");
			var modalTitle = $(this).parent().find("h2").html();
			$(".kvl-modal .modal-title").html(modalTitle);
			$(".kvl-modal #kvl-whitepaper-title").val(modalTitle);
			$(".kvl-modal #kvl-modal-redirect").val(redirectURL);
			$(".kvl-modal #kvl-modal-filename").val(fileName);
			$(".kvl-modal").addClass("open");
		});

		$(".js-video-open").click(function (e) {
			e.preventDefault();
			var videoURL = $(this).attr("href");
			var videoID = youtubeParser(videoURL);
			var modalTitle = $(this).parent().parent().find("h2").html();

			$(".kvl-modal").addClass("has-video");
			$(".kvl-modal .modal-title").html(modalTitle);
			$(".kvl-modal .modal-body").html("");
			$(".kvl-modal .modal-body iframe").remove();
			$(
				'<iframe title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; mute; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
			)
				.attr(
					"src",
					"https://www.youtube.com/embed/" + videoID + "?autoplay=1"
				)
				.appendTo(".kvl-modal .modal-body");

			$(".kvl-modal").addClass("open");
		});

		// $(".js-open-image-in-modal").click(function (e) {
		// 	e.preventDefault();
		// 	var imageURL = $(this).attr("href");
		// 	console.log(imageURL);

		// 	$(".kvl-modal").addClass("has-image");
		// 	$(".kvl-modal .modal-title").remove();
		// 	$(".kvl-modal .modal-body").html("");
		// 	$('<img src="">')
		// 		.attr("src", imageURL)
		// 		.appendTo(".kvl-modal .modal-body");

		// 	$(".kvl-modal").addClass("open");
		// });

		$(".js-modal-close").click(function (e) {
			e.preventDefault();
			$(".kvl-modal .modal-body iframe").remove();
			$(".kvl-modal").removeClass("open");
		});

		function youtubeParser(url) {
			var regExp =
				/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
			var match = url.match(regExp);
			return match && match[7].length == 11 ? match[7] : false;
		}

		function closeModals(e) {
			if (
				!(
					$(e.target).closest(".js-video-open").length > 0 ||
					$(e.target).closest(".js-modal-open").length > 0 ||
					$(e.target).closest(".js-open-image-in-modal").length > 0 ||
					$(e.target).closest(".kvl-modal").length > 0
				)
			) {
				$(".kvl-modal").removeClass("open");
				$(".kvl-modal .modal-body iframe").remove();
			}
		}

		function hideOpenMenus(e) {
			// console.log(e);
			/* Hide mega menu */
			// if (!(
			// 	// $(e.target).closest(".js-open-mobile-menu").length > 0 ||
			// 	// $(e.target).closest(".has-mega-menu > a").length > 0
				
			// 	)) {
				// $("header .main-menu.open").removeClass("open");
				$("header .mega-menu").removeClass("open");
				$("header .main-menu").removeClass(
					"mega-menu-open submenu-open"
				);
				$("header .main-menu .active").removeClass("active");
				$("header .submenu-wrapper.open")
					.removeClass("open")
					.find(".submenu")
					.removeClass("open");
				$(".has-mega-menu").parent().removeClass("active");

				/* Hide simple menus */
				$(".main-menu")
					.find(".submenu-wrapper.open")
					.removeClass("open")
					.find(".submenu")
					.removeClass("open");
			// }
			// $("header .main-menu").removeClass("open");
		}
	});
})(jQuery);
