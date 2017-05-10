(function () {
    "use strict";

    angular.module("AdsbApp")
           .controller("SideMenuController", SideMenuController);


    SideMenuController.$inject = ["$rootScope", "$scope", "$state", "$stateParams", "$timeout"];

    function SideMenuController($rootScope, $scope, $state, $stateParams, $timeout) {

        $scope.sections = [
             {
                id: 0,
                title: "Dashboard",
                icon: "mdi mdi-table fa-fw",                
                link: "auth.rowlot-dasboarh"
            },
            {
                id: 1,
                title: "Ranking",
                icon: "mdi mdi-table fa-fw",
                link: "auth.rowlow-listtask"
            },
            {
                id: 2,
                title: "Tareas",
                icon: "mdi mdi-table fa-fw",                
                submenu: [
                    {
                        title: "KRDU",
                        link: "auth.aircraft-livetraffic-01"
                    },
                    {
                        title: "KLZU",
                        link: "auth.aircraft-livetraffic-02"
                    }
                ]
            },
            {
                id: 3,
                title: "NMACs",
                icon: "fa fa-paper-plane-o first_level_icon",
                link: "auth.aircraft-nmacs"
            },
           
        ];

        // accordion menu
        $(document).off("click", ".side_menu_expanded #main_menu .has_submenu > a").on("click", ".side_menu_expanded #main_menu .has_submenu > a", function () {
            if ($(this).parent(".has_submenu").hasClass("first_level")) {
                var $this_parent = $(this).parent(".has_submenu"),
                    panel_active = $this_parent.hasClass("section_active");

                if (!panel_active) {
                    $this_parent.siblings().removeClass("section_active").children("ul").slideUp("200");
                    $this_parent.addClass("section_active").children("ul").slideDown("200");
                } else {
                    $this_parent.removeClass("section_active").children("ul").slideUp("200");
                }
            } else {
                var $submenu_parent = $(this).parent(".has_submenu"),
                    submenu_active = $submenu_parent.hasClass("submenu_active");

                if (!submenu_active) {
                    $submenu_parent.siblings().removeClass("submenu_active").children("ul").slideUp("200");
                    $submenu_parent.addClass("submenu_active").children("ul").slideDown("200");
                } else {
                    $submenu_parent.removeClass("submenu_active").children("ul").slideUp("200");
                }
            }
        });

        $rootScope.createScrollbar = function () {
            $("#main_menu .menu_wrapper").mCustomScrollbar({
                theme: "minimal-dark",
                scrollbarPosition: "outside"
            });
        };

        $rootScope.destroyScrollbar = function () {
            $("#main_menu .menu_wrapper").mCustomScrollbar("destroy");
        };

        $timeout(function () {
            if (!$rootScope.sideNavCollapsed && !$rootScope.topMenuAct) {
                if (!$("#main_menu .has_submenu").hasClass("section_active")) {
                    $("#main_menu .has_submenu .act_nav").closest(".has_submenu").children("a").click();
                } else {
                    $("#main_menu .has_submenu.section_active").children("ul").show();
                }
                // init scrollbar
                $rootScope.createScrollbar();
            }
        });


    }
})();
