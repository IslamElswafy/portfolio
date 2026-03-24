(function() {
    var data = window.PORTFOLIO_DATA;
    var MOBILE_BREAKPOINT = 768;
    var CHAPTER_LABELS = {
        about: "About",
        portfolios: "Projects",
        blog: "Experience",
        contact: "Contact",
        elements: "Approach"
    };
    var mobileBookState = {
        root: null,
        track: null,
        pages: [],
        pageMap: {},
        currentIndex: 0,
        isOpen: false,
        drawerOpen: false,
        globalEventsBound: false,
        hashLocked: false,
        filter: "*",
        touchStartX: 0,
        touchStartY: 0
    };
    var initialMobileHash = "";

    if (isMobileBookViewport() && window.location.hash && window.location.hash !== "#") {
        initialMobileHash = window.location.hash;

        if (window.history && typeof window.history.replaceState === "function") {
            window.history.replaceState(null, "", window.location.pathname + window.location.search);
        }
    }

    if (!data) {
        return;
    }

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function encodeAsset(path) {
        return encodeURI(path || "");
    }

    function specialtyMap() {
        return data.cvs.reduce(function(map, cv) {
            map[cv.slug] = cv;
            return map;
        }, {});
    }

    function isMobileBookViewport() {
        return window.matchMedia("(max-width: " + MOBILE_BREAKPOINT + "px)").matches;
    }

    function titleFromSlug(slug) {
        var project;

        if (!slug) {
            return "Page";
        }

        if (CHAPTER_LABELS[slug]) {
            return CHAPTER_LABELS[slug];
        }

        if (slug.indexOf("project-") === 0) {
            project = data.projects.find(function(item) {
                return "project-" + item.slug === slug;
            });

            if (project) {
                return project.title;
            }
        }

        return slug
            .replace(/^project-/, "")
            .replace(/-page-\d+$/, "")
            .replace(/-/g, " ")
            .replace(/\b\w/g, function(character) {
                return character.toUpperCase();
            });
    }

    function subtitleFromSlug(baseSlug, position) {
        if (baseSlug === "about") {
            return position === 0 ? "Opening Spread" : "Profile";
        }

        if (baseSlug === "portfolios") {
            return position === 0 ? "Projects" : "Testimonials";
        }

        if (baseSlug === "blog") {
            return position === 0 ? "Experience" : "Role Tracks";
        }

        if (baseSlug === "elements") {
            return position === 0 ? "Approach" : "Key Achievements";
        }

        if (baseSlug === "contact") {
            return position === 0 ? "Contact" : "Map";
        }

        if (baseSlug.indexOf("project-") === 0) {
            return position === 0 ? titleFromSlug(baseSlug) : "Build Notes";
        }

        return position === 0 ? titleFromSlug(baseSlug) : "More";
    }

    function setLeadingText(node, text) {
        if (!node) {
            return;
        }

        if (node.firstChild && node.firstChild.nodeType === 3) {
            node.firstChild.nodeValue = text;
            return;
        }

        node.insertBefore(document.createTextNode(text), node.firstChild || null);
    }

    function renderSectionHeader(title, centered) {
        var alignClass = centered ? "vc_separator_align_center" : "vc_separator_align_left";

        return '<div class="vc_separator wpb_content_element big ' + alignClass + ' vc_sep_width_100 vc_sep_double vc_sep_pos_align_center vc_sep_color_black medium vc_separator-has-text">' +
            '<span class="vc_sep_holder vc_sep_holder_l"><span class="vc_sep_line"></span></span>' +
            "<h4>" + escapeHtml(title) + "</h4>" +
            '<span class="vc_sep_holder vc_sep_holder_r"><span class="vc_sep_line"></span></span>' +
            "</div>";
    }

    function renderTagList(items, className) {
        return (items || []).map(function(item) {
            return '<span class="' + className + '">' + escapeHtml(item) + "</span>";
        }).join("");
    }

    function renderList(items, className) {
        return "<ul class=\"" + className + "\">" +
            (items || []).map(function(item) {
                return "<li>" + escapeHtml(item) + "</li>";
            }).join("") +
            "</ul>";
    }

    function renderMedia(media, altText, className) {
        if (media && media.type === "image" && media.src) {
            return '<img class="' + className + '" src="' + escapeHtml(encodeAsset(media.src)) + '" alt="' + escapeHtml(altText) + '" />';
        }

        if (media && media.type === "placeholder") {
            return '<div class="' + className + ' project-media-placeholder">' +
                '<span class="project-placeholder-eyebrow">' + escapeHtml(media.eyebrow || "Private Case Study") + "</span>" +
                '<strong class="project-placeholder-title">' + escapeHtml(media.title || altText) + "</strong>" +
                '<p class="project-placeholder-body">' + escapeHtml(media.body || "") + "</p>" +
                "</div>";
        }

        return '<div class="' + className + ' project-media-placeholder">' +
            '<strong class="project-placeholder-title">' + escapeHtml(altText) + "</strong>" +
            "</div>";
    }

    function renderProjectLink(link, className) {
        if (!link || !link.url) {
            return "";
        }

        return '<a class="' + className + '" href="' + escapeHtml(link.url) + '" target="_blank" rel="noopener noreferrer">' +
            escapeHtml(link.label || "Open Link") +
            "</a>";
    }

    function renderProjectCard(project) {
        var track = specialties[project.specialty];
        var demoLink = project.links && project.links.demo ? renderProjectLink(project.links.demo, "portfolio-card-link secondary") : "";

        return '<article class="portfolio-card ' + escapeHtml(track.filterClass) + '">' +
            '<div class="portfolio-card-media-wrap">' +
            renderMedia(project.cover, project.title, "portfolio-card-media") +
            "</div>" +
            '<div class="portfolio-card-body">' +
            '<div class="portfolio-card-topline">' +
            '<span class="portfolio-track-badge">' + escapeHtml(track.shortLabel) + "</span>" +
            '<span class="portfolio-timeframe">' + escapeHtml(project.timeframe) + "</span>" +
            "</div>" +
            '<h5 class="portfolio-card-title">' + escapeHtml(project.title) + "</h5>" +
            '<p class="portfolio-card-category">' + escapeHtml(project.category) + "</p>" +
            '<p class="portfolio-card-summary">' + escapeHtml(project.summary) + "</p>" +
            '<div class="portfolio-impact-list">' + renderTagList(project.impact, "impact-chip") + "</div>" +
            '<div class="portfolio-card-actions">' +
            '<a class="portfolio-card-link primary flipover" href="#project-' + escapeHtml(project.slug) + '">Open Spread</a>' +
            demoLink +
            "</div>" +
            "</div>" +
            "</article>";
    }

    function renderProjectSpread(project, index) {
        var track = specialties[project.specialty];
        var previousProject = index === 0 ? null : data.projects[index - 1];
        var nextProject = index === data.projects.length - 1 ? null : data.projects[index + 1];
        var galleryHtml = project.gallery && project.gallery.length ? project.gallery.map(function(image, imageIndex) {
            return '<a class="project-gallery-item" href="' + escapeHtml(encodeAsset(image)) + '" target="_blank" rel="noopener noreferrer">' +
                '<img src="' + escapeHtml(encodeAsset(image)) + '" alt="' + escapeHtml(project.title + " screen " + (imageIndex + 1)) + '" />' +
                "</a>";
        }).join("") : '<div class="project-gallery-empty">Private product work. Additional visuals can be shared on request.</div>';
        var details = [{
                label: "Company",
                value: project.company
            },
            {
                label: "Role",
                value: project.role
            },
            {
                label: "Timeline",
                value: project.timeframe
            },
            {
                label: "Track",
                value: track.roleTitle
            }
        ];
        var detailHtml = details.map(function(item) {
            return '<div class="project-meta-item">' +
                '<span class="project-meta-label">' + escapeHtml(item.label) + "</span>" +
                '<strong class="project-meta-value">' + escapeHtml(item.value) + "</strong>" +
                "</div>";
        }).join("");

        return '<div class="bb-item project-spread" data-generated="project" data-slug="project-' + escapeHtml(project.slug) + '">' +
            '<div class="vc_col-sm-6 bb-custom-side">' +
            '<div class="content-wrapper">' +
            '<div class="container">' +
            renderSectionHeader(project.title, true) +
            '<div class="project-spread-copy">' +
            '<span class="project-track-label">' + escapeHtml(track.shortLabel) + " Case Study</span>" +
            '<p class="project-spread-category">' + escapeHtml(project.category) + "</p>" +
            '<p class="project-spread-summary">' + escapeHtml(project.summary) + "</p>" +
            "</div>" +
            '<div class="project-media-block">' +
            renderMedia(project.cover, project.title, "project-cover-media") +
            "</div>" +
            '<div class="project-impact-block">' + renderTagList(project.impact, "impact-chip") + "</div>" +
            '<div class="project-action-row">' +
            '<a class="project-inline-link flipover" href="#portfolios">All Projects</a>' +
            renderProjectLink(project.links && project.links.demo, "project-inline-link external") +
            '<a class="project-inline-link external" href="' + escapeHtml(track.file) + '" download="' + escapeHtml(track.file.split("/").pop()) + '">Download ' + escapeHtml(track.shortLabel) + " CV</a>" +
            "</div>" +
            '<div class="project-meta-grid">' + detailHtml + "</div>" +
            "</div>" +
            "</div>" +
            "</div>" +
            '<div class="vc_col-sm-6 bb-custom-side">' +
            '<div class="content-wrapper">' +
            '<div class="container">' +
            renderSectionHeader("Build Notes", true) +
            '<div class="project-story-grid">' +
            '<section class="project-story-panel">' +
            '<h5>Challenge</h5>' +
            '<p>' + escapeHtml(project.challenge) + "</p>" +
            "</section>" +
            '<section class="project-story-panel">' +
            '<h5>Solution</h5>' +
            '<p>' + escapeHtml(project.solution) + "</p>" +
            "</section>" +
            '<section class="project-story-panel">' +
            '<h5>Responsibilities</h5>' +
            renderList(project.responsibilities, "project-bullet-list") +
            "</section>" +
            '<section class="project-story-panel">' +
            '<h5>Tech Stack</h5>' +
            '<div class="tag-cloud">' + renderTagList(project.techStack, "tech-tag") + "</div>" +
            "</section>" +
            '<section class="project-story-panel">' +
            '<h5>Core Features</h5>' +
            renderList(project.features, "project-bullet-list") +
            "</section>" +
            '<section class="project-story-panel full-width">' +
            '<h5>Gallery</h5>' +
            '<div class="project-gallery-grid">' + galleryHtml + "</div>" +
            "</section>" +
            "</div>" +
            '<div class="project-spread-nav">' +
            (previousProject ? '<a class="project-inline-link flipover" href="#project-' + escapeHtml(previousProject.slug) + '">Previous Project</a>' : '<a class="project-inline-link flipover" href="#portfolios">Back to Overview</a>') +
            '<a class="project-inline-link flipover" href="#portfolios">Overview</a>' +
            (nextProject ? '<a class="project-inline-link flipover" href="#project-' + escapeHtml(nextProject.slug) + '">Next Project</a>' : '<a class="project-inline-link flipover" href="#contact">Contact</a>') +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>";
    }

    function renderExperienceItem(item) {
        return '<article class="experience-card">' +
            '<div class="experience-card-topline">' +
            '<strong>' + escapeHtml(item.company) + "</strong>" +
            '<span>' + escapeHtml(item.timeframe) + "</span>" +
            "</div>" +
            '<p class="experience-role">' + escapeHtml(item.role) + "</p>" +
            '<p class="experience-summary">' + escapeHtml(item.summary) + "</p>" +
            '<div class="experience-highlights">' + renderTagList(item.highlights, "impact-chip") + "</div>" +
            "</article>";
    }

    function renderTrackCard(track) {
        return '<article class="track-card">' +
            '<div class="track-card-header">' +
            '<span class="portfolio-track-badge">' + escapeHtml(track.shortLabel) + "</span>" +
            '<strong>' + escapeHtml(track.roleTitle) + "</strong>" +
            "</div>" +
            '<p class="track-summary">' + escapeHtml(track.summary) + "</p>" +
            '<div class="track-skills">' + renderTagList(track.skills, "tech-tag") + "</div>" +
            '<div class="track-highlights">' + renderTagList(track.highlights, "impact-chip") + "</div>" +
            '<a class="project-inline-link external" href="' + escapeHtml(track.file) + '" download="' + escapeHtml(track.file.split("/").pop()) + '">Download CV</a>' +
            "</article>";
    }

    function syncMenuLabels() {
        document.querySelectorAll('a[href="#portfolios"]').forEach(function(link) {
            link.textContent = "Projects";
        });

        document.querySelectorAll('a[href="#blog"]').forEach(function(link) {
            link.textContent = "Experience";
        });

        document.querySelectorAll('a[href="#elements"]').forEach(function(link) {
            link.textContent = "Approach";
        });
    }

    function syncHeroAndAbout() {
        var heroTitle = document.querySelector(".intro-content h1");
        var heroCopy = document.querySelector(".intro-content p");
        var aboutCopy = document.querySelector('.bb-item[data-slug="about"] .wpb_text_column .wpb_wrapper p');

        if (heroTitle) {
            heroTitle.textContent = data.profile.name;
        }

        if (heroCopy) {
            heroCopy.textContent = data.profile.headline;
        }

        if (aboutCopy) {
            aboutCopy.textContent = data.profile.about;
        }

        document.title = data.profile.name;
    }

    function insertProjectMenuItems() {
        ["#menu-primary-menu", "#menu-primary-menu-1"].forEach(function(selector) {
            var menu = document.querySelector(selector);
            var blogItem;

            if (!menu) {
                return;
            }

            menu.querySelectorAll(".dynamic-project-link").forEach(function(item) {
                item.remove();
            });

            blogItem = Array.prototype.find.call(menu.children, function(item) {
                var anchor = item.querySelector("a");
                return anchor && anchor.getAttribute("href") === "#blog";
            });

            data.projects.forEach(function(project) {
                var item = document.createElement("li");
                item.className = "hide menu-item menu-item-type-post_type menu-item-object-page dynamic-project-link";
                item.innerHTML = '<a href="#project-' + escapeHtml(project.slug) + '">' + escapeHtml(project.title) + "</a>";

                if (blogItem) {
                    menu.insertBefore(item, blogItem);
                } else {
                    menu.appendChild(item);
                }
            });
        });
    }

    function renderPortfolioOverview() {
        var portfolioItem = document.querySelector('.bb-item[data-slug="portfolios"]');
        var containers;
        var intro;
        var filterItems;
        var cards;

        if (!portfolioItem) {
            return;
        }

        containers = portfolioItem.querySelectorAll(".container");

        if (!containers[0]) {
            return;
        }

        intro = '<p class="portfolio-lead">Each project opens as its own spread with the matching CV track, impact summary, and build notes.</p>';
        filterItems = ['<li class="active" data-filter="*">All</li>'].concat(data.cvs.map(function(cv) {
            return '<li data-filter=".' + escapeHtml(cv.filterClass) + '">' + escapeHtml(cv.shortLabel) + "</li>";
        })).join("");
        cards = data.projects.map(renderProjectCard).join("");

        containers[0].innerHTML = renderSectionHeader("Projects", true) +
            intro +
            '<ul class="portfolio-filters portfolio-filter-list">' + filterItems + "</ul>" +
            '<div id="projectOverviewGrid" class="portfolio-grid">' + cards + "</div>";
    }

    function renderProjectSpreads() {
        var insertionPoint = document.querySelector('.bb-item[data-slug="blog"]');
        var markup;

        document.querySelectorAll('.bb-item[data-generated="project"]').forEach(function(item) {
            item.remove();
        });

        if (!insertionPoint) {
            return;
        }

        markup = data.projects.map(function(project, index) {
            return renderProjectSpread(project, index);
        }).join("");

        insertionPoint.insertAdjacentHTML("beforebegin", markup);
    }

    function renderExperienceSpread() {
        var experienceItem = document.querySelector('.bb-item[data-slug="blog"]');
        var containers;

        if (!experienceItem) {
            return;
        }

        containers = experienceItem.querySelectorAll(".container");

        if (!containers[0] || !containers[1]) {
            return;
        }

        containers[0].innerHTML = renderSectionHeader("Experience", true) +
            '<p class="portfolio-lead">The experience below pulls from the role focus already covered across the mobile, front-end, and full-stack CV tracks.</p>' +
            '<div class="experience-grid">' + data.experience.map(renderExperienceItem).join("") + "</div>";

        containers[1].innerHTML = renderSectionHeader("Role Tracks", true) +
            '<p class="portfolio-lead">Choose the CV that best matches the role you are hiring for.</p>' +
            '<div class="track-grid">' + data.cvs.map(renderTrackCard).join("") + "</div>";
    }

    function renderContactSpread() {
        var contactItem = document.querySelector('.bb-item[data-slug="contact"]');
        var containers;
        var contactLinks;
        var cvButtons;
        var workStyle;

        if (!contactItem) {
            return;
        }

        containers = contactItem.querySelectorAll(".container");

        if (!containers[1]) {
            return;
        }

        contactLinks = '<div class="contact-link-list">' +
            '<a class="contact-link" href="mailto:' + escapeHtml(data.profile.email) + '">' + escapeHtml(data.profile.email) + "</a>" +
            '<a class="contact-link" href="' + escapeHtml(data.profile.linkedin) + '" target="_blank" rel="noopener noreferrer">LinkedIn</a>' +
            '<a class="contact-link" href="' + escapeHtml(data.profile.github) + '" target="_blank" rel="noopener noreferrer">GitHub</a>' +
            "</div>";
        cvButtons = '<div class="cv-download-grid">' + data.cvs.map(function(cv) {
            return '<a class="cv-download-card" href="' + escapeHtml(cv.file) + '" download="' + escapeHtml(cv.file.split("/").pop()) + '">' +
                '<span class="portfolio-track-badge">' + escapeHtml(cv.shortLabel) + "</span>" +
                '<strong>' + escapeHtml(cv.label) + "</strong>" +
                '<small>' + escapeHtml(cv.roleTitle) + "</small>" +
                "</a>";
        }).join("") + "</div>";
        workStyle = '<div class="contact-workstyle">' +
            data.workingStyle.map(function(item) {
                return '<div class="contact-workstyle-item">' + escapeHtml(item) + "</div>";
            }).join("") +
            "</div>";

        containers[1].innerHTML = renderSectionHeader("Contact", true) +
            '<div class="contact-panel">' +
            '<p class="contact-summary">Location: ' + escapeHtml(data.profile.location) + "<br />Available for: " + escapeHtml(data.profile.availability) + "<br />Phone: " + escapeHtml(data.profile.phone) + "</p>" +
            '<p class="contact-note">' + escapeHtml(data.profile.contactNote) + "</p>" +
            contactLinks +
            '<div class="project-action-row">' +
            '<a class="project-inline-link external" href="mailto:' + escapeHtml(data.profile.email) + '">Send Email</a>' +
            '<a class="project-inline-link external" href="' + escapeHtml(data.profile.linkedin) + '" target="_blank" rel="noopener noreferrer">Message on LinkedIn</a>' +
            "</div>" +
            "</div>" +
            renderSectionHeader("Download CVs", false) +
            cvButtons +
            renderSectionHeader("How I Work", false) +
            workStyle;
    }

    function setupFilters() {
        var filterButtons = document.querySelectorAll(".portfolio-filter-list li");
        var cards = document.querySelectorAll(".portfolio-card");

        filterButtons.forEach(function(button) {
            button.addEventListener("click", function() {
                var filter = button.getAttribute("data-filter");

                filterButtons.forEach(function(item) {
                    item.classList.remove("active");
                });

                button.classList.add("active");

                cards.forEach(function(card) {
                    var shouldShow = filter === "*" || card.classList.contains(filter.replace(".", ""));
                    card.classList.toggle("is-hidden", !shouldShow);
                });
            });
        });
    }

    function getTextContent(node) {
        return node ? node.textContent.replace(/\s+/g, " ").trim() : "";
    }

    function normalizeHash(value) {
        return String(value || "")
            .replace(/^[^#]*#/, "")
            .trim();
    }

    function getMobileHashTarget(value) {
        var target = normalizeHash(value);

        if (!target) {
            return "";
        }

        if (mobileBookState.pageMap[target] !== undefined) {
            return target;
        }

        if (CHAPTER_LABELS[target]) {
            return target;
        }

        if (target.indexOf("project-") === 0) {
            return target;
        }

        return "";
    }

    function replaceLocationHash(hash) {
        var url = window.location.pathname + window.location.search + (hash ? "#" + hash : "");

        if (window.history && typeof window.history.replaceState === "function") {
            window.history.replaceState(null, "", url);
            return;
        }

        if (hash) {
            window.location.hash = hash;
        } else if (window.location.hash) {
            window.location.hash = "";
        }
    }

    function setMobileHash(hash) {
        mobileBookState.hashLocked = true;
        replaceLocationHash(hash);
        window.setTimeout(function() {
            mobileBookState.hashLocked = false;
        }, 0);
    }

    function showMobileCover() {
        var topPerspective = document.querySelector("#top-perspective");
        var scrollWrap = document.querySelector("#scroll-wrap");
        var introWrapper = document.querySelector(".intro-wrapper");
        var phoneMenuDefault = document.querySelector("#phone-menu-default");

        if (topPerspective) {
            topPerspective.classList.remove("animate");
            topPerspective.style.display = "none";
        }

        if (scrollWrap) {
            scrollWrap.style.display = "block";
            scrollWrap.style.opacity = "1";
        }

        if (introWrapper) {
            introWrapper.style.display = "block";
            introWrapper.style.opacity = "1";
        }

        if (phoneMenuDefault) {
            phoneMenuDefault.style.display = "block";
        }
    }

    function extractMobileSource() {
        var aboutItem = document.querySelector('.bb-item[data-slug="about"]');
        var portfolioItem = document.querySelector('.bb-item[data-slug="portfolios"]');
        var elementsItem = document.querySelector('.bb-item[data-slug="elements"]');

        return {
            aboutImage: (function() {
                var image = aboutItem ? aboutItem.querySelector(".vc_single_image-img") : null;
                return image ? image.getAttribute("src") : "";
            })(),
            skills: Array.from(document.querySelectorAll('.bb-item[data-slug="about"] .vc_progress_bar .vc_general')).map(function(item) {
                var bar = item.querySelector(".vc_bar");
                return {
                    label: getTextContent(item.querySelector(".vc_label")),
                    value: parseInt((bar && (bar.getAttribute("data-value") || bar.getAttribute("data-percentage-value"))) || "0", 10) || 0
                };
            }).filter(function(item) {
                return item.label;
            }),
            services: Array.from(document.querySelectorAll('.bb-item[data-slug="about"] .services-item')).map(function(item) {
                var heading = item.querySelector("span");
                var title = getTextContent(heading).replace(/\s*:\s*$/, "");
                var body = getTextContent(item.querySelector("p")).replace(getTextContent(heading), "").replace(/^:\s*/, "").trim();
                var image = item.querySelector("img");

                return {
                    title: title,
                    body: body,
                    image: image ? image.getAttribute("src") : ""
                };
            }).filter(function(item) {
                return item.title;
            }),
            testimonials: Array.from(document.querySelectorAll('.bb-item[data-slug="portfolios"] .testimonials-item')).map(function(item) {
                var image = item.querySelector("img");
                var author = getTextContent(item.querySelector("h4, h5, strong")) || (image ? image.getAttribute("alt") : "");
                var role = getTextContent(item.querySelector("small, em, span"));
                var quote = getTextContent(item.querySelector("p"));

                return {
                    author: author || "Client",
                    role: role,
                    quote: quote,
                    image: image ? image.getAttribute("src") : ""
                };
            }).filter(function(item) {
                return item.quote;
            }),
            approach: Array.from(document.querySelectorAll('.bb-item[data-slug="elements"] .wpb_tabs_nav a')).map(function(link) {
                var selector = link.getAttribute("href");
                var panel = selector ? elementsItem.querySelector(selector) : null;

                return {
                    title: getTextContent(link),
                    body: getTextContent(panel)
                };
            }).filter(function(item) {
                return item.title && item.body;
            }),
            faqs: Array.from(document.querySelectorAll('.bb-item[data-slug="elements"] .vc_toggle')).map(function(item) {
                return {
                    question: getTextContent(item.querySelector(".vc_toggle_title h4")),
                    answer: getTextContent(item.querySelector(".vc_toggle_content"))
                };
            }).filter(function(item) {
                return item.question && item.answer;
            }),
            achievements: Array.from(document.querySelectorAll('.bb-item[data-slug="elements"] .vc_message_box p')).map(function(item) {
                return getTextContent(item);
            }).filter(Boolean),
            expertise: Array.from(document.querySelectorAll('.bb-item[data-slug="elements"] .vc_progress_bar .vc_general')).map(function(item) {
                var bar = item.querySelector(".vc_bar");
                return {
                    label: getTextContent(item.querySelector(".vc_label")),
                    value: parseInt((bar && (bar.getAttribute("data-value") || bar.getAttribute("data-percentage-value"))) || "0", 10) || 0
                };
            }).filter(function(item) {
                return item.label;
            }),
            portfolioIntro: getTextContent(portfolioItem && portfolioItem.querySelector(".portfolio-lead"))
        };
    }

    function renderMobileMetric(label, value) {
        return '<div class="mobile-stat-pill"><span>' + escapeHtml(label) + '</span><strong>' + escapeHtml(value) + "</strong></div>";
    }

    function renderMobileMeter(item) {
        return '<div class="mobile-meter">' +
            '<div class="mobile-meter-head"><strong>' + escapeHtml(item.label) + '</strong><span>' + escapeHtml(item.value + "%") + "</span></div>" +
            '<span class="mobile-meter-bar"><span style="width:' + escapeHtml(String(item.value)) + '%"></span></span>' +
            "</div>";
    }

    function renderMobileService(service) {
        var image = service.image ? '<img class="mobile-service-icon" src="' + escapeHtml(encodeAsset(service.image)) + '" alt="' + escapeHtml(service.title) + '" />' : '<span class="mobile-service-icon mobile-service-icon--placeholder"></span>';

        return '<article class="mobile-service-card">' +
            image +
            '<div class="mobile-service-copy">' +
            '<h4>' + escapeHtml(service.title) + "</h4>" +
            '<p>' + escapeHtml(service.body) + "</p>" +
            "</div>" +
            "</article>";
    }

    function renderMobileOverviewCard(project) {
        var track = specialties[project.specialty];
        var external = project.links && project.links.demo ? renderProjectLink(project.links.demo, "mobile-text-link external") : "";

        return '<article class="mobile-project-card" data-track="' + escapeHtml(track.filterClass) + '">' +
            '<div class="mobile-project-media">' + renderMedia(project.cover, project.title, "mobile-project-cover") + "</div>" +
            '<div class="mobile-project-copy">' +
            '<div class="mobile-project-topline">' +
            '<span class="mobile-track-pill">' + escapeHtml(track.shortLabel) + "</span>" +
            '<span class="mobile-project-time">' + escapeHtml(project.timeframe) + "</span>" +
            "</div>" +
            '<h4>' + escapeHtml(project.title) + "</h4>" +
            '<p class="mobile-project-category">' + escapeHtml(project.category) + "</p>" +
            '<p>' + escapeHtml(project.summary) + "</p>" +
            '<div class="mobile-chip-row">' + renderTagList(project.impact.slice(0, 3), "impact-chip") + "</div>" +
            '<div class="mobile-inline-actions">' +
            '<a class="mobile-text-link" href="#project-' + escapeHtml(project.slug) + '">Open case</a>' +
            external +
            "</div>" +
            "</div>" +
            "</article>";
    }

    function renderMobileAboutPage(source) {
        var portrait = source.aboutImage ? '<img class="mobile-portrait-image" src="' + escapeHtml(encodeAsset(source.aboutImage)) + '" alt="' + escapeHtml(data.profile.name) + '" />' : '<div class="mobile-portrait-image mobile-portrait-image--placeholder"></div>';
        var metrics = [
            renderMobileMetric("Projects", String(data.projects.length)),
            renderMobileMetric("Tracks", String(data.cvs.length)),
            renderMobileMetric("Based In", data.profile.location)
        ].join("");

        return '<article class="mobile-paper">' +
            '<div class="mobile-page-scroll">' +
            '<section class="mobile-hero-sheet">' +
            '<div class="mobile-portrait-shell">' + portrait + "</div>" +
            '<div class="mobile-hero-copy">' +
            '<span class="mobile-kicker">Pocket Edition</span>' +
            '<h2>' + escapeHtml(data.profile.name) + "</h2>" +
            '<p class="mobile-deck">' + escapeHtml(data.profile.headline) + "</p>" +
            '<div class="mobile-stat-grid">' + metrics + "</div>" +
            '<p class="mobile-body-copy">' + escapeHtml(data.profile.about) + "</p>" +
            '<div class="mobile-chip-row">' + renderTagList(data.cvs.map(function(cv) {
                return cv.shortLabel;
            }), "mobile-chip") + "</div>" +
            '<div class="mobile-inline-actions">' +
            '<a class="mobile-text-link external" href="mailto:' + escapeHtml(data.profile.email) + '">Email</a>' +
            '<a class="mobile-text-link external" href="' + escapeHtml(data.profile.linkedin) + '" target="_blank" rel="noopener noreferrer">LinkedIn</a>' +
            "</div>" +
            "</div>" +
            "</section>" +
            "</div>" +
            "</article>";
    }

    function renderMobileCapabilitiesPage(source) {
        return '<article class="mobile-paper">' +
            '<div class="mobile-page-scroll">' +
            '<section class="mobile-section-card">' +
            '<div class="mobile-section-heading">' +
            '<span class="mobile-kicker">Capabilities</span>' +
            '<h3>Tools and systems I ship with</h3>' +
            '<p>Everything here is inherited from the desktop book, but condensed into a cleaner mobile reading flow.</p>' +
            "</div>" +
            '<div class="mobile-meter-stack">' + source.skills.map(renderMobileMeter).join("") + "</div>" +
            "</section>" +
            '<section class="mobile-section-card">' +
            '<div class="mobile-section-heading">' +
            '<span class="mobile-kicker">Services</span>' +
            '<h3>What I can build end to end</h3>' +
            "</div>" +
            '<div class="mobile-service-stack">' + source.services.map(renderMobileService).join("") + "</div>" +
            "</section>" +
            "</div>" +
            "</article>";
    }

    function renderMobileOverviewPage(source) {
        var filterButtons = ['<button type="button" class="mobile-filter-chip is-active" data-mobile-filter="*">All</button>'].concat(data.cvs.map(function(cv) {
            return '<button type="button" class="mobile-filter-chip" data-mobile-filter="' + escapeHtml(cv.filterClass) + '">' + escapeHtml(cv.shortLabel) + "</button>";
        })).join("");

        return '<article class="mobile-paper">' +
            '<div class="mobile-page-scroll">' +
            '<section class="mobile-section-card">' +
            '<div class="mobile-section-heading">' +
            '<span class="mobile-kicker">Projects</span>' +
            '<h3>Case studies built for fast mobile browsing</h3>' +
            '<p>' + escapeHtml(source.portfolioIntro || "Open any project to move through the work one case study at a time.") + "</p>" +
            "</div>" +
            '<div class="mobile-filter-row">' + filterButtons + "</div>" +
            '<div class="mobile-project-grid">' + data.projects.map(renderMobileOverviewCard).join("") + "</div>" +
            "</section>" +
            "</div>" +
            "</article>";
    }

    function renderMobileMetaItem(label, value) {
        return '<div class="mobile-meta-card"><span>' + escapeHtml(label) + '</span><strong>' + escapeHtml(value) + "</strong></div>";
    }

    function renderMobileProjectPage(project, index) {
        var track = specialties[project.specialty];
        var gallery = project.gallery && project.gallery.length ? project.gallery.map(function(item, imageIndex) {
            return '<a class="mobile-gallery-card" href="' + escapeHtml(encodeAsset(item)) + '" target="_blank" rel="noopener noreferrer">' +
                '<img src="' + escapeHtml(encodeAsset(item)) + '" alt="' + escapeHtml(project.title + " screen " + (imageIndex + 1)) + '" />' +
                "</a>";
        }).join("") : '<div class="mobile-gallery-empty">Private product work. More visuals can be shared during a call.</div>';
        var previous = index > 0 ? data.projects[index - 1] : null;
        var next = index < data.projects.length - 1 ? data.projects[index + 1] : null;
        var external = project.links && project.links.demo ? renderProjectLink(project.links.demo, "mobile-text-link external") : "";

        return '<article class="mobile-paper mobile-paper--project">' +
            '<div class="mobile-page-scroll">' +
            '<section class="mobile-project-hero">' +
            '<div class="mobile-project-visual">' + renderMedia(project.cover, project.title, "mobile-project-cover mobile-project-cover--hero") + "</div>" +
            '<div class="mobile-project-summary">' +
            '<span class="mobile-kicker">' + escapeHtml(track.shortLabel + " Case Study") + "</span>" +
            '<h2>' + escapeHtml(project.title) + "</h2>" +
            '<p class="mobile-project-category">' + escapeHtml(project.category) + "</p>" +
            '<p class="mobile-deck">' + escapeHtml(project.summary) + "</p>" +
            '<div class="mobile-meta-grid">' +
            renderMobileMetaItem("Company", project.company) +
            renderMobileMetaItem("Role", project.role) +
            renderMobileMetaItem("Timeline", project.timeframe) +
            renderMobileMetaItem("Track", track.shortLabel) +
            "</div>" +
            '<div class="mobile-chip-row">' + renderTagList(project.impact, "impact-chip") + "</div>" +
            '<div class="mobile-inline-actions">' +
            '<a class="mobile-text-link" href="#portfolios">Overview</a>' +
            external +
            '<a class="mobile-text-link external" href="' + escapeHtml(track.file) + '" download="' + escapeHtml(track.file.split("/").pop()) + '">Download CV</a>' +
            "</div>" +
            "</div>" +
            "</section>" +
            '<section class="mobile-section-card">' +
            '<div class="mobile-story-card"><span class="mobile-kicker">Challenge</span><p>' + escapeHtml(project.challenge) + "</p></div>" +
            '<div class="mobile-story-card"><span class="mobile-kicker">Solution</span><p>' + escapeHtml(project.solution) + "</p></div>" +
            "</section>" +
            '<section class="mobile-section-card">' +
            '<div class="mobile-section-heading"><span class="mobile-kicker">Execution</span><h3>Responsibilities and outcomes</h3></div>' +
            renderList(project.responsibilities, "mobile-bullet-list") +
            '<div class="mobile-chip-row">' + renderTagList(project.techStack, "tech-tag") + "</div>" +
            "</section>" +
            '<section class="mobile-section-card">' +
            '<div class="mobile-section-heading"><span class="mobile-kicker">Feature Set</span><h3>What shipped</h3></div>' +
            renderList(project.features, "mobile-bullet-list") +
            "</section>" +
            '<section class="mobile-section-card">' +
            '<div class="mobile-section-heading"><span class="mobile-kicker">Gallery</span><h3>Selected screens</h3></div>' +
            '<div class="mobile-gallery-strip">' + gallery + "</div>" +
            "</section>" +
            '<div class="mobile-inline-actions mobile-inline-actions--footer">' +
            (previous ? '<a class="mobile-text-link" href="#project-' + escapeHtml(previous.slug) + '">Previous project</a>' : '<a class="mobile-text-link" href="#about-capabilities">Capabilities</a>') +
            '<a class="mobile-text-link" href="#portfolios">All projects</a>' +
            (next ? '<a class="mobile-text-link" href="#project-' + escapeHtml(next.slug) + '">Next project</a>' : '<a class="mobile-text-link" href="#contact">Contact</a>') +
            "</div>" +
            "</div>" +
            "</article>";
    }

    function renderMobileExperiencePage(source) {
        return '<article class="mobile-paper">' +
            '<div class="mobile-page-scroll">' +
            '<section class="mobile-section-card">' +
            '<div class="mobile-section-heading">' +
            '<span class="mobile-kicker">Experience</span>' +
            '<h3>Roles, delivery, and trust signals</h3>' +
            "</div>" +
            '<div class="mobile-card-stack">' + data.experience.map(function(item) {
                return '<article class="mobile-role-card">' +
                    '<div class="mobile-role-topline"><strong>' + escapeHtml(item.company) + '</strong><span>' + escapeHtml(item.timeframe) + "</span></div>" +
                    '<p class="mobile-role-title">' + escapeHtml(item.role) + "</p>" +
                    '<p>' + escapeHtml(item.summary) + "</p>" +
                    '<div class="mobile-chip-row">' + renderTagList(item.highlights, "impact-chip") + "</div>" +
                    "</article>";
            }).join("") + "</div>" +
            "</section>" +
            '<section class="mobile-section-card">' +
            '<div class="mobile-section-heading">' +
            '<span class="mobile-kicker">Tracks</span>' +
            '<h3>CVs matched to the role</h3>' +
            "</div>" +
            '<div class="mobile-card-stack">' + data.cvs.map(function(cv) {
                return '<article class="mobile-role-card">' +
                    '<div class="mobile-role-topline"><strong>' + escapeHtml(cv.label) + '</strong><span>' + escapeHtml(cv.shortLabel) + "</span></div>" +
                    '<p>' + escapeHtml(cv.summary) + "</p>" +
                    '<div class="mobile-chip-row">' + renderTagList(cv.skills, "tech-tag") + "</div>" +
                    '<a class="mobile-text-link external" href="' + escapeHtml(cv.file) + '" download="' + escapeHtml(cv.file.split("/").pop()) + '">Download CV</a>' +
                    "</article>";
            }).join("") + "</div>" +
            "</section>" +
            (source.testimonials.length ? '<section class="mobile-section-card">' +
                '<div class="mobile-section-heading">' +
                '<span class="mobile-kicker">Testimonials</span>' +
                '<h3>Feedback carried over from the desktop book</h3>' +
                "</div>" +
                '<div class="mobile-card-stack">' + source.testimonials.map(function(item) {
                    return '<article class="mobile-quote-card">' +
                        (item.image ? '<img class="mobile-quote-avatar" src="' + escapeHtml(encodeAsset(item.image)) + '" alt="' + escapeHtml(item.author) + '" />' : "") +
                        '<p>"' + escapeHtml(item.quote) + '"</p>' +
                        '<strong>' + escapeHtml(item.author) + "</strong>" +
                        (item.role ? '<span>' + escapeHtml(item.role) + "</span>" : "") +
                        "</article>";
                }).join("") + "</div>" +
                "</section>" : "") +
            "</div>" +
            "</article>";
    }

    function renderMobileApproachPage(source) {
        return '<article class="mobile-paper">' +
            '<div class="mobile-page-scroll">' +
            '<section class="mobile-section-card">' +
            '<div class="mobile-section-heading">' +
            '<span class="mobile-kicker">Approach</span>' +
            '<h3>How the work is structured</h3>' +
            "</div>" +
            '<div class="mobile-card-stack">' + source.approach.map(function(item) {
                return '<article class="mobile-story-card">' +
                    '<strong>' + escapeHtml(item.title) + "</strong>" +
                    '<p>' + escapeHtml(item.body) + "</p>" +
                    "</article>";
            }).join("") + "</div>" +
            "</section>" +
            '<section class="mobile-section-card">' +
            '<div class="mobile-section-heading">' +
            '<span class="mobile-kicker">FAQ</span>' +
            '<h3>Common project questions</h3>' +
            "</div>" +
            '<div class="mobile-card-stack">' + source.faqs.map(function(item) {
                return '<article class="mobile-faq-card">' +
                    '<strong>' + escapeHtml(item.question) + "</strong>" +
                    '<p>' + escapeHtml(item.answer) + "</p>" +
                    "</article>";
            }).join("") + "</div>" +
            "</section>" +
            '<section class="mobile-section-card">' +
            '<div class="mobile-section-heading">' +
            '<span class="mobile-kicker">Achievements</span>' +
            '<h3>Operational outcomes</h3>' +
            "</div>" +
            '<div class="mobile-card-stack">' + source.achievements.map(function(item) {
                return '<article class="mobile-story-card"><p>' + escapeHtml(item) + "</p></article>";
            }).join("") + "</div>" +
            '<div class="mobile-meter-stack">' + source.expertise.map(renderMobileMeter).join("") + "</div>" +
            "</section>" +
            "</div>" +
            "</article>";
    }

    function renderMobileContactPage() {
        return '<article class="mobile-paper">' +
            '<div class="mobile-page-scroll">' +
            '<section class="mobile-section-card">' +
            '<div class="mobile-section-heading">' +
            '<span class="mobile-kicker">Contact</span>' +
            '<h3>Best ways to start a project conversation</h3>' +
            '<p>' + escapeHtml(data.profile.contactNote) + "</p>" +
            "</div>" +
            '<div class="mobile-contact-grid">' +
            renderMobileMetaItem("Email", data.profile.email) +
            renderMobileMetaItem("Phone", data.profile.phone) +
            renderMobileMetaItem("Location", data.profile.location) +
            renderMobileMetaItem("Availability", data.profile.availability) +
            "</div>" +
            '<div class="mobile-inline-actions">' +
            '<a class="mobile-text-link external" href="mailto:' + escapeHtml(data.profile.email) + '">Send email</a>' +
            '<a class="mobile-text-link external" href="' + escapeHtml(data.profile.linkedin) + '" target="_blank" rel="noopener noreferrer">LinkedIn</a>' +
            '<a class="mobile-text-link external" href="' + escapeHtml(data.profile.github) + '" target="_blank" rel="noopener noreferrer">GitHub</a>' +
            "</div>" +
            "</section>" +
            '<section class="mobile-section-card">' +
            '<div class="mobile-section-heading">' +
            '<span class="mobile-kicker">Downloads</span>' +
            '<h3>Choose the CV that matches the role</h3>' +
            "</div>" +
            '<div class="mobile-card-stack">' + data.cvs.map(function(cv) {
                return '<a class="mobile-download-card" href="' + escapeHtml(cv.file) + '" download="' + escapeHtml(cv.file.split("/").pop()) + '">' +
                    '<span class="mobile-track-pill">' + escapeHtml(cv.shortLabel) + "</span>" +
                    '<strong>' + escapeHtml(cv.label) + "</strong>" +
                    '<p>' + escapeHtml(cv.roleTitle) + "</p>" +
                    "</a>";
            }).join("") + "</div>" +
            "</section>" +
            '<section class="mobile-section-card">' +
            '<div class="mobile-section-heading">' +
            '<span class="mobile-kicker">Working Style</span>' +
            '<h3>How delivery is handled</h3>' +
            "</div>" +
            '<div class="mobile-card-stack">' + data.workingStyle.map(function(item) {
                return '<article class="mobile-story-card"><p>' + escapeHtml(item) + "</p></article>";
            }).join("") + "</div>" +
            "</section>" +
            "</div>" +
            "</article>";
    }

    function createMobilePages(source) {
        var pages = [{
                id: "about",
                chapter: "About",
                navLabel: "Profile",
                title: "Profile",
                html: renderMobileAboutPage(source)
            },
            {
                id: "about-capabilities",
                chapter: "About",
                navLabel: "Capabilities",
                title: "Capabilities",
                html: renderMobileCapabilitiesPage(source)
            },
            {
                id: "portfolios",
                chapter: "Projects",
                navLabel: "Overview",
                title: "Selected Work",
                html: renderMobileOverviewPage(source)
            }
        ];

        data.projects.forEach(function(project, index) {
            pages.push({
                id: "project-" + project.slug,
                chapter: "Projects",
                navLabel: project.title,
                title: project.title,
                html: renderMobileProjectPage(project, index)
            });
        });

        pages.push({
            id: "blog",
            chapter: "Experience",
            navLabel: "Experience",
            title: "Experience",
            html: renderMobileExperiencePage(source)
        });

        pages.push({
            id: "elements",
            chapter: "Approach",
            navLabel: "Approach",
            title: "Approach",
            html: renderMobileApproachPage(source)
        });

        pages.push({
            id: "contact",
            chapter: "Contact",
            navLabel: "Contact",
            title: "Contact",
            html: renderMobileContactPage()
        });

        return pages;
    }

    function renderDrawerGroups(pages) {
        var groups = pages.reduce(function(map, page) {
            map[page.chapter] = map[page.chapter] || [];
            map[page.chapter].push(page);
            return map;
        }, {});

        return Object.keys(groups).map(function(group) {
            return '<section class="mobile-drawer-group">' +
                '<span class="mobile-drawer-label">' + escapeHtml(group) + "</span>" +
                '<div class="mobile-drawer-links">' + groups[group].map(function(page) {
                    return '<button type="button" class="mobile-drawer-link" data-page="' + escapeHtml(page.id) + '">' +
                        '<span>' + escapeHtml(page.navLabel) + "</span>" +
                        "</button>";
                }).join("") + "</div>" +
                "</section>";
        }).join("");
    }

    function renderMobileBookApp() {
        var source = extractMobileSource();
        var pages = createMobilePages(source);
        var root = mobileBookState.root || document.createElement("div");

        root.id = "mobile-book-app";
        root.innerHTML = '<div class="mobile-book-shell">' +
            '<button type="button" class="mobile-book-backdrop" data-mobile-action="close-drawer" aria-hidden="true"></button>' +
            '<aside class="mobile-book-drawer" aria-label="Mobile book chapters">' +
            '<div class="mobile-drawer-header">' +
            '<span class="mobile-kicker">Chapters</span>' +
            '<button type="button" class="mobile-chrome-button mobile-chrome-button--quiet" data-mobile-action="close-drawer">Close</button>' +
            "</div>" +
            '<div class="mobile-drawer-body">' + renderDrawerGroups(pages) + "</div>" +
            "</aside>" +
            '<section class="mobile-book-frame">' +
            '<header class="mobile-book-chrome">' +
            '<button type="button" class="mobile-chrome-button" data-mobile-action="drawer">Index</button>' +
            '<div class="mobile-book-meta">' +
            '<span class="mobile-book-meta-chapter"></span>' +
            '<strong class="mobile-book-meta-title"></strong>' +
            "</div>" +
            '<div class="mobile-book-meta-side">' +
            '<span class="mobile-book-counter"></span>' +
            '<button type="button" class="mobile-chrome-button mobile-chrome-button--quiet" data-mobile-action="close">Cover</button>' +
            "</div>" +
            "</header>" +
            '<div class="mobile-book-stage">' +
            '<div class="mobile-book-track">' + pages.map(function(page) {
                return '<section class="mobile-book-page" data-page-id="' + escapeHtml(page.id) + '" data-page-chapter="' + escapeHtml(page.chapter) + '" data-page-title="' + escapeHtml(page.title) + '">' + page.html + "</section>";
            }).join("") + "</div>" +
            "</div>" +
            '<nav class="mobile-book-actions" aria-label="Page controls">' +
            '<button type="button" class="mobile-action-button" data-mobile-action="prev">Previous</button>' +
            '<button type="button" class="mobile-action-button mobile-action-button--quiet" data-mobile-action="close">Cover</button>' +
            '<button type="button" class="mobile-action-button" data-mobile-action="next">Next</button>' +
            "</nav>" +
            "</section>" +
            "</div>";

        if (!mobileBookState.root) {
            document.body.appendChild(root);
        }

        mobileBookState.root = root;
        mobileBookState.track = root.querySelector(".mobile-book-track");
        mobileBookState.pages = Array.from(root.querySelectorAll(".mobile-book-page"));
        mobileBookState.pageMap = {};
        pages.forEach(function(page, index) {
            mobileBookState.pageMap[page.id] = index;
        });

        bindMobileBookAppEvents();
        syncMobileProjectFilter(mobileBookState.filter);
        syncMobileBookState();
    }

    function syncMobileProjectFilter(filter) {
        var root = mobileBookState.root;

        mobileBookState.filter = filter || "*";

        if (!root) {
            return;
        }

        root.querySelectorAll(".mobile-filter-chip").forEach(function(button) {
            button.classList.toggle("is-active", button.getAttribute("data-mobile-filter") === mobileBookState.filter);
        });

        root.querySelectorAll(".mobile-project-card").forEach(function(card) {
            var shouldShow = mobileBookState.filter === "*" || card.getAttribute("data-track") === mobileBookState.filter;
            card.classList.toggle("is-hidden", !shouldShow);
        });
    }

    function syncMobileBookState() {
        var root = mobileBookState.root;
        var currentPage;
        var chapter;
        var title;
        var counter;
        var prevButton;
        var nextButton;

        if (!root || !mobileBookState.track) {
            return;
        }

        currentPage = mobileBookState.pages[mobileBookState.currentIndex] || mobileBookState.pages[0] || null;
        chapter = currentPage ? currentPage.getAttribute("data-page-chapter") : "";
        title = currentPage ? currentPage.getAttribute("data-page-title") : "";
        counter = root.querySelector(".mobile-book-counter");
        prevButton = root.querySelector('[data-mobile-action="prev"]');
        nextButton = root.querySelector('[data-mobile-action="next"]');

        root.classList.toggle("is-open", mobileBookState.isOpen);
        root.classList.toggle("is-drawer-open", mobileBookState.drawerOpen);
        root.setAttribute("aria-hidden", mobileBookState.isOpen ? "false" : "true");
        document.body.classList.toggle("mobile-book-app-open", mobileBookState.isOpen);
        mobileBookState.track.style.transform = "translateX(-" + (mobileBookState.currentIndex * 100) + "%)";

        root.querySelector(".mobile-book-meta-chapter").textContent = chapter;
        root.querySelector(".mobile-book-meta-title").textContent = title;

        if (counter) {
            counter.textContent = mobileBookState.pages.length ? (mobileBookState.currentIndex + 1) + " / " + mobileBookState.pages.length : "";
        }

        if (prevButton) {
            prevButton.disabled = mobileBookState.currentIndex <= 0;
        }

        if (nextButton) {
            nextButton.disabled = mobileBookState.currentIndex >= mobileBookState.pages.length - 1;
        }

        mobileBookState.pages.forEach(function(page, index) {
            page.classList.toggle("is-active", index === mobileBookState.currentIndex);
        });

        root.querySelectorAll(".mobile-drawer-link").forEach(function(button) {
            button.classList.toggle("is-active", button.getAttribute("data-page") === (currentPage ? currentPage.getAttribute("data-page-id") : ""));
        });
    }

    function ensurePageInRange(index) {
        if (!mobileBookState.pages.length) {
            return 0;
        }

        if (index < 0) {
            return 0;
        }

        if (index > mobileBookState.pages.length - 1) {
            return mobileBookState.pages.length - 1;
        }

        return index;
    }

    function goToMobilePage(pageId, options) {
        var targetId = pageId && mobileBookState.pageMap[pageId] !== undefined ? pageId : "about";
        var nextIndex = ensurePageInRange(mobileBookState.pageMap[targetId] || 0);
        var currentPage = mobileBookState.pages[nextIndex];
        var scroller = currentPage ? currentPage.querySelector(".mobile-page-scroll") : null;

        mobileBookState.currentIndex = nextIndex;
        mobileBookState.isOpen = true;

        if (!options || options.closeDrawer !== false) {
            mobileBookState.drawerOpen = false;
        }

        syncMobileBookState();

        if (scroller && (!options || options.resetScroll !== false)) {
            scroller.scrollTop = 0;
        }

        if (!options || options.updateHash !== false) {
            setMobileHash(targetId);
        }
    }

    function openMobileBook(pageId, options) {
        renderMobileBookApp();
        updateMobileThemeVisibility();
        showMobileCover();
        mobileBookState.isOpen = true;
        goToMobilePage(pageId || getMobileHashTarget(window.location.hash) || "about", {
            updateHash: !options || options.updateHash !== false,
            closeDrawer: !options || options.closeDrawer !== false
        });
    }

    function closeMobileBook(options) {
        mobileBookState.isOpen = false;
        mobileBookState.drawerOpen = false;
        syncMobileBookState();
        showMobileCover();

        if (!options || options.updateHash !== false) {
            setMobileHash("");
        }
    }

    function toggleMobileDrawer(force) {
        if (!mobileBookState.isOpen) {
            return;
        }

        mobileBookState.drawerOpen = typeof force === "boolean" ? force : !mobileBookState.drawerOpen;
        syncMobileBookState();
    }

    function bindMobileBookAppEvents() {
        if (!mobileBookState.root || mobileBookState.root.dataset.bound === "true") {
            return;
        }

        mobileBookState.root.addEventListener("click", function(event) {
            var action = event.target.closest("[data-mobile-action]");
            var routeLink = event.target.closest('a[href^="#"]');
            var drawerLink = event.target.closest(".mobile-drawer-link");
            var filterButton = event.target.closest(".mobile-filter-chip");

            if (action) {
                event.preventDefault();

                if (action.getAttribute("data-mobile-action") === "drawer") {
                    toggleMobileDrawer();
                    return;
                }

                if (action.getAttribute("data-mobile-action") === "close-drawer") {
                    toggleMobileDrawer(false);
                    return;
                }

                if (action.getAttribute("data-mobile-action") === "close") {
                    closeMobileBook();
                    return;
                }

                if (action.getAttribute("data-mobile-action") === "prev") {
                    if (mobileBookState.currentIndex > 0) {
                        goToMobilePage(mobileBookState.pages[mobileBookState.currentIndex - 1].getAttribute("data-page-id"));
                    }
                    return;
                }

                if (action.getAttribute("data-mobile-action") === "next") {
                    if (mobileBookState.currentIndex < mobileBookState.pages.length - 1) {
                        goToMobilePage(mobileBookState.pages[mobileBookState.currentIndex + 1].getAttribute("data-page-id"));
                    }
                    return;
                }
            }

            if (filterButton) {
                event.preventDefault();
                syncMobileProjectFilter(filterButton.getAttribute("data-mobile-filter"));
                return;
            }

            if (drawerLink) {
                event.preventDefault();
                goToMobilePage(drawerLink.getAttribute("data-page"));
                return;
            }

            if (routeLink) {
                var target = getMobileHashTarget(routeLink.getAttribute("href"));

                if (!target) {
                    return;
                }

                event.preventDefault();
                goToMobilePage(target);
            }
        });

        mobileBookState.root.addEventListener("touchstart", function(event) {
            var touch = event.changedTouches && event.changedTouches[0];

            if (!touch || !event.target.closest(".mobile-book-stage")) {
                return;
            }

            mobileBookState.touchStartX = touch.clientX;
            mobileBookState.touchStartY = touch.clientY;
        }, {
            passive: true
        });

        mobileBookState.root.addEventListener("touchend", function(event) {
            var touch = event.changedTouches && event.changedTouches[0];
            var deltaX;
            var deltaY;

            if (!touch || !event.target.closest(".mobile-book-stage")) {
                return;
            }

            deltaX = touch.clientX - mobileBookState.touchStartX;
            deltaY = touch.clientY - mobileBookState.touchStartY;

            if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY)) {
                return;
            }

            if (deltaX < 0 && mobileBookState.currentIndex < mobileBookState.pages.length - 1) {
                goToMobilePage(mobileBookState.pages[mobileBookState.currentIndex + 1].getAttribute("data-page-id"));
            } else if (deltaX > 0 && mobileBookState.currentIndex > 0) {
                goToMobilePage(mobileBookState.pages[mobileBookState.currentIndex - 1].getAttribute("data-page-id"));
            }
        }, {
            passive: true
        });

        mobileBookState.root.dataset.bound = "true";
    }

    function updateMobileThemeVisibility() {
        var openButton = document.querySelector("#open-it");
        var coverMenuButton = document.querySelector("#phone-menu-default .menu-button-default");
        var topPerspective = document.querySelector("#top-perspective");
        var scrollWrap = document.querySelector("#scroll-wrap");
        var introWrapper = document.querySelector(".intro-wrapper");
        var phoneMenuDefault = document.querySelector("#phone-menu-default");

        if (!isMobileBookViewport()) {
            document.body.classList.remove("mobile-book-app-mode", "mobile-book-app-open");

            if (topPerspective) {
                topPerspective.style.display = "";
            }

            if (scrollWrap) {
                scrollWrap.style.display = "";
                scrollWrap.style.opacity = "";
            }

            if (introWrapper) {
                introWrapper.style.display = "";
                introWrapper.style.opacity = "";
            }

            if (phoneMenuDefault) {
                phoneMenuDefault.style.display = "";
            }

            return;
        }

        document.body.classList.add("mobile-book-app-mode");

        if (openButton) {
            openButton.textContent = "Open book";
        }

        setLeadingText(coverMenuButton, "Index");

        showMobileCover();
    }

    function bindGlobalMobileRouting() {
        if (mobileBookState.globalEventsBound) {
            return;
        }

        ["click", "touchstart"].forEach(function(eventName) {
            document.addEventListener(eventName, function(event) {
                var actionTarget;
                var link;
                var targetPage;

                if (!isMobileBookViewport()) {
                    return;
                }

                actionTarget = event.target.closest("#open-it, #page-corner, #phone-menu-default .menu-button-default");

                if (actionTarget) {
                    event.preventDefault();
                    event.stopImmediatePropagation();

                    if (actionTarget.closest("#phone-menu-default")) {
                        openMobileBook(getMobileHashTarget(window.location.hash) || "about", {
                            updateHash: Boolean(getMobileHashTarget(window.location.hash)),
                            closeDrawer: false
                        });
                        toggleMobileDrawer(true);
                        return;
                    }

                    openMobileBook(getMobileHashTarget(window.location.hash) || "about");
                    return;
                }

                link = event.target.closest('a[href^="#"]');

                if (!link) {
                    return;
                }

                targetPage = getMobileHashTarget(link.getAttribute("href"));

                if (!targetPage) {
                    return;
                }

                event.preventDefault();
                event.stopImmediatePropagation();
                openMobileBook(targetPage);
            }, true);
        });

        window.addEventListener("hashchange", function() {
            var target;

            if (!isMobileBookViewport() || mobileBookState.hashLocked) {
                return;
            }

            target = getMobileHashTarget(window.location.hash);

            if (!target) {
                closeMobileBook({
                    updateHash: false
                });
                return;
            }

            openMobileBook(target, {
                updateHash: false
            });
        });

        mobileBookState.globalEventsBound = true;
    }

    function syncMapHeight() {
        var wrapper = document.querySelector("#top-wrapper");
        var map = document.querySelector("#my-map");

        if (!map || document.body.classList.contains("mobile-book-app-mode")) {
            return;
        }

        if (!wrapper) {
            return;
        }

        map.style.height = Math.max(wrapper.offsetHeight - 11, 360) + "px";
    }

    function preRender() {
        syncMenuLabels();
        syncHeroAndAbout();
        insertProjectMenuItems();
        renderPortfolioOverview();
        renderProjectSpreads();
        renderExperienceSpread();
        renderContactSpread();
    }

    function init() {
        var initialTarget = getMobileHashTarget(initialMobileHash || window.location.hash);

        setupFilters();
        bindGlobalMobileRouting();
        updateMobileThemeVisibility();
        syncMapHeight();

        if (isMobileBookViewport()) {
            renderMobileBookApp();

            if (initialTarget) {
                openMobileBook(initialTarget, {
                    updateHash: false
                });
                window.setTimeout(function() {
                    setMobileHash(initialTarget);
                    showMobileCover();
                }, 180);
            } else {
                closeMobileBook({
                    updateHash: false
                });
            }
        }

        window.addEventListener("resize", function() {
            updateMobileThemeVisibility();
            syncMapHeight();

            if (isMobileBookViewport()) {
                renderMobileBookApp();
                syncMobileBookState();
            }
        });
    }

    var specialties = specialtyMap();

    preRender();

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, {
            once: true
        });
    } else {
        init();
    }
})();
