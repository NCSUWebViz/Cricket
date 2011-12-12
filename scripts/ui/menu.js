var VIS = VIS || {};

/*
 * Current acceptable menus:
 * 'teamClick'
 * 'teamHover'
 * 'matchTypeClick'
 * 'venueClick'
 */

VIS.Menu = function(outsideContainer) {
    var MAX_MENU_HEIGHT = 300;
    var loadedMenus = {};
    var menuCache = {};
    var $mainContainer = $(outsideContainer);

    VIS.vizMenuEnum = {
        teamClick: loadTeamClickMenu,
        teamHover: loadTeamHoverMenu,
        matchTypeClick: loadMatchTypeMenu,
        playerClick: loadPlayerClickMenu,
        xAxis: loadXAxisMenu,
        yAxis: loadYAxisMenu,
        venueClick: loadVenueClickMenu,
    }

    this.setupMenus = function(requiredMenus) {
        if (requiredMenus == null && VIS.currentViz != null) {
            requiredMenus = VIS.currentViz.requiredMenus
        }

        hideNonrequiredMenus(requiredMenus);
        var pos = 0;
        $.each(requiredMenus, function(menuName, callback) {
            var menuType = menuName.split('_')[0];
            if (VIS.vizMenuEnum[menuType] == undefined){
                console.log("Cannot build menu yet:", menuType, menuName, pos);
                return;
            }
            VIS.vizMenuEnum[menuType](pos, menuName, callback);
            pos++;
        });
    }

    function fillMenuPosition(pos, $content, label, cacheTag) {
        var $menuNode;
        $menuNode = $("<div class='menu menuPos" + pos + "'>");
        $menuNode.appendTo($mainContainer);

        var height = MAX_MENU_HEIGHT;
        var left = 10 * pos;

        $menuNode.css({
            'height': height.toString() + "px",
            'left': left + "em"
        });
        $("<span class='menuLabel menuPosLabel" + pos + "'>")
            .text(label)
            .appendTo($menuNode);

        $content.css({
            'height': height-25,
            'overflow': 'scroll'
        }).appendTo($menuNode);
        $content.show();
        loadedMenus[cacheTag] = $menuNode;
    }

    function hideNonrequiredMenus(requiredMenus) {
        $.each(loadedMenus, function(key, val) {
            val.children().children().unbind();
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

    function loadTeamHoverMenu(pos, cacheTag, callback) {
        var cacheTag = cacheTag || 'teamHover';
        var callback = callback || VIS.currentViz.teamSelected;

        function hover() {
            var $this = $(this);
            highlightItem($this);
            callback($this);
        }

        if (alreadyLoaded(pos, cacheTag, "Selected Team", callback)) {
            menuCache[cacheTag].children().hover(hover);
            return;
        }

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
                $team.hover(hover);
            });
            menuCache[cacheTag] = $ul;
            fillMenuPosition(pos, $ul, "Select Team", cacheTag);
        });
    }

    function loadTeamClickMenu(pos, cacheTag, callback) {
        var cacheTag = cacheTag || 'teamClick';
        var callback = callback || VIS.currentViz.teamSelected;

        function clicked() {
            var $this = $(this);
            highlightItem($this);
            callback($this);
        }

        if (alreadyLoaded(pos, cacheTag, "Selected Team", callback)) {
                menuCache[cacheTag].children().click(clicked);
                return;
        }

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
                $team.click(clicked);
            });
            menuCache[cacheTag] = $ul;
            fillMenuPosition(pos, $ul, "Select Team", cacheTag);
        });
    }

    function loadVenueClickMenu(pos, cacheTag, callback) {
        var cacheTag = cacheTag || 'venueClick';
        var callback = callback || VIS.currentViz.venueSelected;

        function clicked() {
            var $this = $(this);
            highlightItem($this);
            callback($this);
        }

        if (alreadyLoaded(pos, cacheTag, "Selected Venue", callback)) {
            menuCache[cacheTag].children().click(clicked);
            return;
        }

        $.getJSON('php/getVenues.php', function (venueData) {
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
            menuCache[cacheTag] = $ul;
            fillMenuPosition(pos, $ul, "Select Venue", cacheTag);
        });
    }

    function loadPlayerClickMenu(pos, cacheTag, callback) {
        var cacheTag = cacheTag || 'playerClick';
        var callback = callback || VIS.currentViz.playerSelected;

        function clicked() {
            var $this = $(this);
            highlightItem($this);
            callback($this);
        }

        if (alreadyLoaded(pos, cacheTag, "Selected Player", callback)) {
            menuCache[cacheTag].children().click(clicked);
            return;
        }

        return;
    }

    function updatePlayerClick(pos, cacheTag, callback, data) {
        var countryName = data['countryName'];

        function clicked() {
            var $this = $(this);
            highlightItem($this);
            callback($this);
        }

        var $menu = menuCache[cacheTag];
        if ($menu != undefined) {
            $menu.children().remove();
            $menu.parent().remove();
            $menu.parent().css('height', 0);
            delete $menu.parent();
        }

        $.getJSON('php/getPlayerList.php?team='+countryName, function (data) {
           var $ul = $menu || $('<ul/>', {
                'class': 'teamList',
            });
            $.each(data.data, function(key, val) {
                var $player = $('<li id="' + val.id + '">' + val.name + '</li>')
                    .appendTo($ul);
                if (key == 1) {
                    $player.addClass('selected');
                    callback($player);
                }
                $player.addClass('team');
                $player.click(clicked);
            });
            menuCache[cacheTag] = $ul;
            fillMenuPosition(pos, $ul, "Select Player", cacheTag);
        });
    }

    // TODO: This needs to be rolled into a generic menu update system,
    // but just make it public for now.  This whole menu system needs
    // redoing anyway (with an MVC framework).
    this.updatePlayerClick = updatePlayerClick;

    function loadMatchTypeMenu(pos, cacheTag, callback) {
        var cacheTag = cacheTag || 'matchType';
        var callback = callback || VIS.currentViz.matchTypeSelected;

        function clicked() {
            var $this = $(this);
            highlightItem($this);
            callback($this);
        }

        if (alreadyLoaded(pos, cacheTag, "Match Type", callback)) {
            menuCache[cacheTag].children().click(clicked);
            return;
        }

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
            $matchType.click(clicked);
        });
        fillMenuPosition(pos, $ul, "Match Type", cacheTag);
        menuCache[cacheTag] = $ul;
        if (VIS.currentViz) {
            callback($selectedItem);
        }
    }

    function loadXAxisMenu(pos, cacheTag, callback) {
        var cacheTag = cacheTag || 'xAxis';
        var callback = callback || VIS.currentViz.matchTypeSelected;

        function clicked() {
            var $this = $(this);
            highlightItem($this);
            callback($this);
        }

        if (alreadyLoaded(pos, cacheTag, "X - Axis", callback)) {
            menuCache[cacheTag].children().click(clicked);
            return;
        }

        var $selectedItem = null;
        var $ul = $('<ul/>', {
            'class': 'teamList',
        });
        $.each([["Year", "year"],
                ["Opponent", "vsTeam_id"],
                ["Venue", "venue_id"]], function(index, val) {
            var $matchType = $('<li id="' + val[1] + '">' + val[0] + '</li>')
                .appendTo($ul);
            if (index == 0) {
                $matchType.addClass('selected');
                $selectedItem = $matchType;
            }
            $matchType.click(clicked);
        });
        fillMenuPosition(pos, $ul, "X - Axis", cacheTag);
        menuCache[cacheTag] = $ul;
        if (VIS.currentViz)
            callback($selectedItem);
    }

    function loadYAxisMenu(pos, cacheTag, callback) {
        var cacheTag = cacheTag || 'yAxis';
        var callback = callback || VIS.currentViz.matchTypeSelected;

        function clicked() {
            var $this = $(this);
            highlightItem($this);
            callback($this);
        }

        if (alreadyLoaded(pos, cacheTag, "Y - Axis", callback)) {
            menuCache[cacheTag].children().click(clicked);
            return;
        }

        var $selectedItem = null;
        var $ul = $('<ul/>', {
            'class': 'teamList',
        });
        $.each([["Total Runs", "scored_runs"],
                ["Average", "average"],
                ["Matches Played", "id"],
                ["Strike Rate", "strike_rate"],
                ["Number of Centuries", "centuries"]], function(index, val) {
            var $matchType = $('<li id="' + val[1] + '">' + val[0] + '</li>')
                .appendTo($ul);
            if (index == 0) {
                $matchType.addClass('selected');
                $selectedItem = $matchType;
            }
            $matchType.click(clicked);
        });
        fillMenuPosition(pos, $ul, "Y - Axis", cacheTag);
        menuCache[cacheTag] = $ul;
        if (VIS.currentViz)
            callback($selectedItem);
    }

    function alreadyLoaded(pos, cacheTag, label, updateMethod) {
        var $menu = menuCache[cacheTag]
        if ($menu != null) {
            fillMenuPosition(pos, $menu, label, cacheTag);
            var $selectedItems = findSelected($menu);
            if ($selectedItems.length > 0 && updateMethod) {
                updateMethod($selectedItems[0]);
            }
            return true;
        }
        return false;
    }
}
