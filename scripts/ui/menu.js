var VIS = VIS || {};

VIS.Menu = function(outsideContainer) {
    var MAX_MENU_HEIGHT = 350;
    var loadedMenus = {};
    var menuCache = {};
    var $mainContainer = $(outsideContainer);

    var $menuPos1 = $("<div class='menu menuPos0'>").appendTo($mainContainer);
    var $menuPos2 = $("<div class='menu menuPos1'>").appendTo($mainContainer);
    var $menuPos3 = $("<div class='menu menuPos2'>").appendTo($mainContainer);
    var $menuPos4 = $("<div class='menu menuPos3'>").appendTo($mainContainer);

    var menuPositions = [
        $menuPos1,
        $menuPos2,
        $menuPos3,
        $menuPos4
    ];

    var menuHierarchy = [
        VIS.vizMenuEnum.teamClick,
        VIS.vizMenuEnum.teamHover,
        VIS.vizMenuEnum.teamMulti,
        VIS.vizMenuEnum.groundsClick,
        VIS.vizMenuEnum.playersClick,
        VIS.vizMenuEnum.playersMulti,
        VIS.vizMenuEnum.matchTypeClick,
        VIS.vizMenuEnum.yearVenueOpponent,
    ];

    this.setupMenus = function(requiredMenus) {
        //hideNonrequiredMenus(requiredMenus);
        var pos = 0;
        $.each(menuHierarchy, function(index, menuId) {
            if ($.inArray(menuId, requiredMenus) != -1) {
                console.log('Required menu:', menuId);
                setupMenu(menuId, pos);
                pos++;
            }
        });
    }

    function setupMenu(menuId, pos) {
        switch(menuId) {
            case VIS.vizMenuEnum.teamClick:
                loadTeamClickMenu(pos);
                break;
            case VIS.vizMenuEnum.teamHover:
                loadTeamHoverMenu(pos);
                break;
            case VIS.vizMenuEnum.teamMulti:
                loadTeamPerfGraph();
                break;
            case VIS.vizMenuEnum.matchTypeClick:
                loadMatchTypeMenu(pos);
                break;
            case VIS.vizMenuEnum.vizTeamGroundPerf:
                break;
        }
    }

    function fillMenuPosition(pos, $content, label) {
        var $menuNode;
        if (pos < menuPositions.length - 1) {
            $menuNode = menuPositions[pos];
        } else {
            $menuNode = $("<div class='menu menuPos" + pos + "'>");
        }

        var height;

        if (pos < 4) {
            height = MAX_MENU_HEIGHT - pos * 25;
        } else {
            height = 5.5;
        }
        console.log("Height calc", pos, MAX_MENU_HEIGHT, height,
                $content.children().length);

        $menuNode.css('height', height.toString() + "px");
        $("<span class='menuLabel menuPosLabel" + pos + "'>")
            .text(label)
            .appendTo($menuNode);

        $content.css({
            'height': height-25,
            'overflow': 'scroll'
        }).appendTo($menuNode);
        $menuNode.appendTo($mainContainer);
    }

    function hideNonrequiredMenus(requiredMenus) {

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
        console.log("Found selected:", $selectedItems);
        return $selectedItems;
    }

    function cacheTeams(teamData) {
        VIS.Data.teamHash = {};

        $.each(teamData, function (key, val) {
            // Note, could just assign val here instead of obj hash
            VIS.Data.teamHash[val.code] = {
                id: val.id,
                lng: val.longitude,
                lat: val.latitude,
                name: val.name,
                code: val.code
            };
        });
    }

    function loadTeamHoverMenu(pos) {
        if (menuCache.teamHoverMenu != null) {
            fillMenuPosition(pos, menuCache.teamHoverMenu, "Select Team");
            var $selectedItems = findSelected(menuCache.teamHoverMenu);
            if ($selectedItems.length > 0) {
                VIS.currentViz.teamSelected($selectedItems[0]);
            }
            return;
        }

        function teamsLoaded(teamData) {
            cacheTeams(teamData);
            var $ul = $('<ul/>', {
                'class': 'teamList',
            });
            $.each(teamData, function(key, val) {
                var $team = $('<li id="' + val.id + '" code="' + val.code + '">' + val.name + '</li>')
                    .appendTo($ul);
                $team.addClass('team');
                $team.data('lat', val.lat);
                $team.data('lng', val.lng);
                $team.hover(function() {
                    var $this = $(this);
                    highlightItem($this);
                    VIS.currentViz.teamSelected($this);
                });
            });
            menuCache.teamHoverMenu = $ul;
            fillMenuPosition(pos, $ul, "Select Team");
            /*if (VIS.currentViz != null) {
                VIS.currentViz.menuLoaded(VIS.vizMenuEnum.teamHover);
            }*/
        }

        if (VIS.Data.teamHash != null) {
            teamsLoaded(VIS.Data.teamHash);
        } else {
            $.getJSON('php/getTeams.php', function(data) {
                cacheTeams(data);
                teamsLoaded(VIS.Data.teamHash);
            });
        }
    }

    function loadTeamClickMenu(pos) {
        if (menuCache.teamClickMenu != null) {
            fillMenuPosition(pos, menuCache.teamClickMenu, "Select Team");
            var $selectedItems = findSelected(menuCache.teamClickMenu);
            if ($selectedItems.length > 0) {
                VIS.currentViz.teamSelected($selectedItems[0]);
            }
            return;
        }

        function teamsLoaded(teamData) {
            cacheTeams(teamData);
            var $ul = $('<ul/>', {
                'class': 'teamList',
            });
            $.each(teamData, function(key, val) {
                var $team = $('<li id="' + val.id + '" code="' + val.code + '">' + val.name + '</li>')
                    .appendTo($ul);
                $team.addClass('team');
                $team.data('lat', val.lat);
                $team.data('lng', val.lng);
                console.log("Team list item:", $team, val);
                $team.click(function() {
                    var $this = $(this);
                    highlightItem($this);
                    VIS.currentViz.teamSelected($this);
                });
            });
            menuCache.teamClickMenu = $ul;
            console.log("menu list:", $ul);
            fillMenuPosition(pos, $ul, "Select Team");
            /*if (VIS.currentViz != null) {
                VIS.currentViz.menuLoaded(VIS.vizMenuEnum.teamHover);
            }*/
        }

        if (VIS.Data.teamHash != null) {
            teamsLoaded(VIS.Data.teamHash);
        } else {
            $.getJSON('php/getTeams.php', function(data) {
                cacheTeams(data);
                teamsLoaded(VIS.Data.teamHash);
            });
        }
    }

    // TODO: Consider adding caching to try to preserve current selected
    // match type to propogate to different vis that needs this menu.
    function loadMatchTypeMenu(pos) {
            var $ul = $('<ul/>', {
                'class': 'teamList',
            });
            $.each(["Test", "ODI", "T20"], function(index, val) {
                var $matchType = $('<li id="' + val + '">' + val + '</li>')
                    .appendTo($ul);
                $matchType.click(function() {
                    var $this = $(this);
                    highlightItem($this);
                    VIS.currentViz.matchTypeSelected($this);
                });
            });
            fillMenuPosition(pos, $ul, "Match Type");
    }
}
