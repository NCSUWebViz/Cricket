function getTeamPerformance()
{
//    if(window.XMLHttpRequest)
//    {
//        xmlhttp=new XMLHttpRequest();
//    }
//    else
//    {
//        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
//    }
//    xmlhttp.onreadystatechange=function f()
//    {
//        if (xmlhttp.readyState==4 && xmlhttp.status==200)
//        {
//            var jSonData =xmlhttp.responseText;
//            alert(jSonData);
//        }
//    }
//    alert("PHP");
//    var temp;
//    xmlhttp.open("GET", "http://localhost/www/cricket/php/getTeamPerformance.php", true);
//    alert(temp);
//    xmlhttp.send();
//}

    var jSonData = { "matchCount": [{ "year": "1932", "total": "1", "wins": 0 }, { "year": "1933", "total": "1", "wins": 0 }, { "year": "1934", "total": "2", "wins": 0 }, { "year": "1936", "total": "3", "wins": 0 }, { "year": "1946", "total": "3", "wins": 0 }, { "year": "1947", "total": "2", "wins": 0 }, { "year": "1948", "total": "6", "wins": 0 }, { "year": "1949", "total": "2", "wins": 0 }, { "year": "1951", "total": "3", "wins": 0 }, { "year": "1952", "total": "11", "wins": "3" }, { "year": "1953", "total": "5", "wins": 0 }, { "year": "1955", "total": "9", "wins": "1" }, { "year": "1956", "total": "4", "wins": "1" }, { "year": "1958", "total": "3", "wins": 0 }, { "year": "1959", "total": "9", "wins": "1" }, { "year": "1960", "total": "6", "wins": 0 }, { "year": "1961", "total": "6", "wins": "1" }, { "year": "1962", "total": "6", "wins": "1" }, { "year": "1964", "total": "8", "wins": "1" }, { "year": "1965", "total": "4", "wins": "1" }, { "year": "1966", "total": "2", "wins": 0 }, { "year": "1967", "total": "6", "wins": 0 }, { "year": "1968", "total": "6", "wins": "3" }, { "year": "1969", "total": "8", "wins": "2" }, { "year": "1971", "total": "8", "wins": "2" }, { "year": "1972", "total": "2", "wins": "1" }, { "year": "1973", "total": "3", "wins": "1" }, { "year": "1974", "total": "8", "wins": "1" }, { "year": "1975", "total": "5", "wins": "2" }, { "year": "1976", "total": "13", "wins": "4" }, { "year": "1977", "total": "7", "wins": "2" }, { "year": "1978", "total": "11", "wins": "2" }, { "year": "1979", "total": "20", "wins": "4" }, { "year": "1980", "total": "8", "wins": "4" }, { "year": "1981", "total": "18", "wins": "3" }, { "year": "1982", "total": "18", "wins": "5" }, { "year": "1983", "total": "37", "wins": "9" }, { "year": "1984", "total": "16", "wins": "3" }, { "year": "1985", "total": "22", "wins": "9" }, { "year": "1986", "total": "36", "wins": "15" }, { "year": "1987", "total": "31", "wins": "13" }, { "year": "1988", "total": "24", "wins": "15" }, { "year": "1989", "total": "26", "wins": "4" }, { "year": "1990", "total": "20", "wins": "7" }, { "year": "1991", "total": "16", "wins": "8" }, { "year": "1992", "total": "28", "wins": "6" }, { "year": "1993", "total": "26", "wins": "16" }, { "year": "1994", "total": "32", "wins": "20" }, { "year": "1995", "total": "15", "wins": "8" }, { "year": "1996", "total": "40", "wins": "16" }, { "year": "1997", "total": "51", "wins": "10" }, { "year": "1998", "total": "45", "wins": "26" }, { "year": "1999", "total": "53", "wins": "23" }, { "year": "2000", "total": "40", "wins": "17" }, { "year": "2001", "total": "37", "wins": "17" }, { "year": "2002", "total": "51", "wins": "25" }, { "year": "2003", "total": "33", "wins": "17" }, { "year": "2004", "total": "44", "wins": "21" }, { "year": "2005", "total": "35", "wins": "20" }, { "year": "2006", "total": "42", "wins": "16" }, { "year": "2007", "total": "47", "wins": "23" }, { "year": "2008", "total": "44", "wins": "25" }, { "year": "2009", "total": "37", "wins": "20" }, { "year": "2010", "total": "41", "wins": "25" }, { "year": "2011", "total": "37", "wins": "18"}] };
    var arrLength = jSonData.matchCount.length;
    var tempArray = new Array(arrLength);
    var k = 0;
    for (i = 0; i < arrLength; i++)
    {
        tempArray[i] = new Array(2);
        tempArray[i][0] = Number(jSonData.matchCount[k].year);
        tempArray[i][1] = Math.ceil((Number(jSonData.matchCount[k].wins) / Number(jSonData.matchCount[k].total)) * 100);
        k++;
    }

    var myData = tempArray;
    var myChart = new JSChart('graph', 'line');

    myChart.setDataArray(myData);
    myChart.setAxisNameFontSize(10);
    myChart.setAxisNameX('Years');
    myChart.setAxisNameY('Performance Units');
    myChart.setAxisNameColor('#787878');
    myChart.setAxisValuesNumberX(10);
    myChart.setAxisValuesNumberY(10);
    myChart.setAxisValuesColor('#38a4d9');
    myChart.setAxisColor('#38a4d9');
    myChart.setLineColor('#C71112');
    myChart.setTitle('Performance of India');
    myChart.setTitleColor('#383838');
    myChart.setGraphExtend(true);
    myChart.setGrid(false);
    //myChart.setGridColor('#38a4d9');
    myChart.setSize(900, 321);
    myChart.setAxisPaddingLeft(140);
    myChart.setAxisPaddingRight(140);
    myChart.setAxisPaddingTop(60);
    myChart.setAxisPaddingBottom(45);
    myChart.setTextPaddingLeft(105);
    myChart.setTextPaddingBottom(12);
    myChart.setBackgroundImage('../images/chart_bg.jpg');
    myChart.draw();
}