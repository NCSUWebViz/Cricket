var VIS = VIS || {};

/*
 * Current acceptable menus:
 * 'teamClick'
 * 'teamHover'
 * 'matchTypeClick'
 * 'venueClick'
 */


VIS.vizMenuEnum = {
    teamClick: 1,
    teamHover: 2,
    teamMulti: 3,
    matchTypeClick: 4,
    groundsClick: 5,
    playersClick: 6,
    playersMulti: 7,
    yearVenueOpponent: 8,
    venueClick:9
}

VIS.Menu = function(outsideContainer) {
    var MAX_MENU_HEIGHT = 350;
    //var loadedMenus = {};
    var loadedMenus = [];
    var menuCache = {};
    var $mainContainer = $(outsideContainer);

    VIS.vizMenuEnum = {
        teamClick: loadTeamClickMenu,
        teamHover: loadTeamHoverMenu,
        //teamMulti: 3,
        matchTypeClick: loadMatchTypeMenu,
        //groundsClick: 5,
        //playersClick: 6,
        //playersMulti: 7,
        //yearVenueOpponent: 8,
        venueClick: loadVenueClickMenu,
    }

    //var $menuPos1 = $("<div class='menu menuPos0'>").appendTo($mainContainer);
    //var $menuPos2 = $("<div class='menu menuPos1'>").appendTo($mainContainer);
    //var $menuPos3 = $("<div class='menu menuPos2'>").appendTo($mainContainer);
    //var $menuPos4 = $("<div class='menu menuPos3'>").appendTo($mainContainer);

    //var menuPositions = [
        //$menuPos1,
        //$menuPos2,
        //$menuPos3,
        //$menuPos4
    //];

    /*var menuHierarchy = [
        VIS.vizMenuEnum.teamClick,
        VIS.vizMenuEnum.teamHover,
        VIS.vizMenuEnum.teamMulti,
        VIS.vizMenuEnum.groundsClick,
        VIS.vizMenuEnum.playersClick,
        VIS.vizMenuEnum.playersMulti,
        VIS.vizMenuEnum.matchTypeClick,
        VIS.vizMenuEnum.yearVenueOpponent,
        VIS.vizMenuEnum.venueClick
    ];*/

    // TODO: Remove this clever, but misguided attempt to
    // enforce a menu hierarchy for all visualizations.  Rely
    // on that vis to order its menus correctly.
    /*this.setupMenus = function(requiredMenus) {
        hideNonrequiredMenus(requiredMenus);
        var pos = 0;
        $.each(menuHierarchy, function(index, menuId) {
            if ($.inArray(menuId, requiredMenus) != -1) {
                setupMenu(menuId, pos);
                pos++;
            }
        });
    }*/

    this.setupMenus = function(requiredMenus) {
        if (requiredMenus == null && VIS.currentViz != null) {
            requiredMenus = VIS.currentViz.requiredMenus
        }

        hideNonrequiredMenus(requiredMenus);
        $.each(requiredMenus, function(index, menuId) {
            setupMenu(menuId, index);
        });
    }

    // TODO: This version allows for specified callbacks,
    /*this.setupMenus = function(requiredMenus) {
        if (requiredMenus == null && VIS.currentViz != null) {
            requiredMenus = VIS.currentViz.requiredMenus
        }

        hideNonrequiredMenus(requiredMenus);
        var pos = 0;
        $.each(requiredMenus, function(menuName, callback) {
            VIS.vizMenuEnum[menuName](pos, callback);
            pos++;
        });
    }*/

    function setupMenu(menuId, pos) {
        switch(menuId) {
            case VIS.vizMenuEnum.teamClick:
                loadTeamClickMenu(pos);
                break;
            case VIS.vizMenuEnum.teamHover:
                loadTeamHoverMenu(pos);
                break;
            case VIS.vizMenuEnum.matchTypeClick:
                loadMatchTypeMenu(pos);
                break;
            case VIS.vizMenuEnum.venueClick:
                loadVenueClickMenu(pos);
                break;
        }
    }

    function fillMenuPosition(pos, $content, label) {
        var $menuNode;
        //if (pos < menuPositions.length - 1) {
            //$menuNode = menuPositions[pos];
        //} else {
            $menuNode = $("<div class='menu menuPos" + pos + "'>");
            $menuNode.appendTo($mainContainer);
        //}

        var height;

        if (pos < 4) {
            height = MAX_MENU_HEIGHT - pos * 25;
        } else {
            height = 5.5;
        }
        //console.log("Height calc", pos, MAX_MENU_HEIGHT, height,
                //$content.children().length);

        $menuNode.css('height', height.toString() + "px");
        $("<span class='menuLabel menuPosLabel" + pos + "'>")
            .text(label)
            .appendTo($menuNode);

        $content.css({
            'height': height-25,
            'overflow': 'scroll'
        }).appendTo($menuNode);
        $content.show();
        loadedMenus.push($menuNode);
    }

    function hideNonrequiredMenus(requiredMenus) {
        //$.each(menuPositions, function(key, val) {
        $.each(loadedMenus, function(key, val) {
            val.children().detach();
            val.css('height', 0);
            delete val;
        });
    }

    function highlightItem($listItem) {
        $listItem.siblings().removeClass('selected');
        $listItem.addClass('selected');
    }

    function findSelected($list) {
        var $selectedItems = [];
        $.each($list.children(), function(idx, li) {
            var $li = $(li);
            if ($li.hasClass('selected'))
                $selectedItems.push($li);
        });
        return $selectedItems;
    }

    function loadTeamHoverMenu(pos) {
        if (alreadyLoaded(pos, menuCache.teamHoverMenu,
                    "Selected Team", VIS.currentViz.teamSelected))
            return;

        $.getJSON('php/getTeams.php', function (teamData) {
            var $ul = $('<ul/>', {
                'class': 'teamList',
            });
            $.each(teamData, function(key, val) {
                var $team = $('<li id="' + val.id + '" code="' + val.code + '">' + val.name + '</li>')
                    .appendTo($ul);
                if (val.code == 'ENG')
                    $team.addClass('selected');
                $team.addClass('team');
                $team.data('lat', val.latitude);
                $team.data('lng', val.longitude);
                $team.hover(function() {
                    var $this = $(this);
                    highlightItem($this);
                    VIS.currentViz.teamSelected($this);
                });
            });
            menuCache.teamHoverMenu = $ul;
            fillMenuPosition(pos, $ul, "Select Team");
        });
    }

    function loadTeamClickMenu(pos) {
        if (alreadyLoaded(pos, menuCache.teamClickMenu,
                    "Selected Team", VIS.currentViz.teamSelected))
            return;

        $.getJSON('php/getTeams.php', function (teamData) {
            var $ul = $('<ul/>', {
                'class': 'teamList',
            });
            $.each(teamData, function(key, val) {
                var $team = $('<li id="' + val.id + '" code="' + val.code + '">' + val.name + '</li>')
                    .appendTo($ul);
                if (val.code == 'ENG')
                    $team.addClass('selected');
                $team.addClass('team');
                $team.data('lat', val.latitude);
                $team.data('lng', val.longitude);
                $team.click(function() {
                    var $this = $(this);
                    highlightItem($this);
                    VIS.currentViz.teamSelected($this);
                });
            });
            menuCache.teamClickMenu = $ul;
            fillMenuPosition(pos, $ul, "Select Team");
        });
    }

    function loadVenueClickMenu(pos) {
        if (alreadyLoaded(pos, menuCache.venueClickMenu,
                    "Selected Venue", VIS.currentViz.venueSelected))
            return;

        function venuesLoaded(venueData) {
            var $ul = $('<ul/>', {
                'class': 'teamList',
            });
            $.each(venueData, function(key, val) {
                var $venue = $('<li id="' + val.id + '">' + val.ground_name + '</li>')
                    .appendTo($ul);
                if (key == 1) {
                    $venue.addClass('selected');
                    VIS.currentViz.venueSelected($venue);
                }
                $venue.addClass('team');
                $venue.click(function() {
                    var $this = $(this);
                    highlightItem($this);
                    VIS.currentViz.venueSelected($this);
                });
            });
            menuCache.venueClickMenu = $ul;
            fillMenuPosition(pos, $ul, "Select Venue");
            /*if (VIS.currentViz != null) {
                VIS.currentViz.menuLoaded(VIS.vizMenuEnum.teamHover);
            }*/
        }
        $.getJSON('php/getVenues.php', function(data) {
            venuesLoaded(data);
        });
    }

    // TODO: Consider adding caching to try to preserve current selected
    // match type to propogate to different vis that needs this menu.
    function loadMatchTypeMenu(pos) {
        if (alreadyLoaded(pos, menuCache.matchTypeMenu,
                    "Match Type", VIS.currentViz.matchTypeSelected))
            return;

        var $selectedItem = null;
        var $ul = $('<ul/>', {
            'class': 'teamList',
        });
        $.each(["All Types", "Test", "ODI", "T20"], function(index, val) {
            var $matchType = $('<li id="' + val + '">' + val + '</li>')
                .appendTo($ul);
            if (index == 0) {
                $matchType.addClass('selected');
                $selectedItem = $matchType;
            }
            $matchType.click(function() {
                var $this = $(this);
                highlightItem($this);
                VIS.currentViz.matchTypeSelected($this);
            });
        });
        fillMenuPosition(pos, $ul, "Match Type");
        menuCache.matchTypeMenu = $ul;
        if (VIS.currentViz)
            VIS.currentViz.matchTypeSelected($selectedItem);
    }

    function alreadyLoaded(pos, $menu, label, updateMethod) {
        if ($menu != null) {
            fillMenuPosition(pos, $menu, label);
            var $selectedItems = findSelected($menu);
            if ($selectedItems.length > 0 && updateMethod) {
                updateMethod($selectedItems[0]);
            }
            return true;
        }
        return false;
    }
}
