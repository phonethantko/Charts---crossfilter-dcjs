document.getElementById("header").innerHTML = data_ref_header;
document.getElementById("loading_text").innerHTML = data_ref_loading_text;
document.getElementById("footer").innerHTML = data_ref_footer;
document.getElementById("about_source").innerHTML = data_ref_about_source;
document.getElementById("count-info").innerHTML = data_ref_count_info;
document.getElementById("estimateendyear").innerHTML = data_ref_estimateendyear_text;
document.getElementById("startyear").innerHTML = data_ref_startyear_text;
document.getElementById("orgtype").innerHTML = data_ref_orgtype_text;
document.getElementById("footer").innerHTML = data_ref_footer;
document.getElementById("orgs").innerHTML = data_ref_orgs;
document.getElementById("sector").innerHTML = data_ref_text_sector;
document.getElementById("status").innerHTML = data_ref_text_status;
document.getElementById("map_cw").innerHTML = data_ref_text_map_cw;
document.getElementById("map_ts").innerHTML = data_ref_text_map_ts;

var gaon = true;

$('#loading').show();
$('#dashboard').hide();
if (gaon == true) {
    (function(i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function() {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date();
        a = s.createElement(o),
            m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m)
    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

    ga('create', 'UA-93996011-1', 'auto');
    ga('send', 'pageview');
    gasend("send", "event", "load", "start", "Load Started");
}

function gasend(a, b, c, d, e) {
  log("ga - "+a+":"+b+":"+c+":"+d+":"+e)
    if (gaon == true) {
        ga(a, {
            hitType: b,
            eventCategory: c,
            eventAction: d,
            eventLabel: e
        });
    }
}
$('#loading').show();
$('#dashboard').hide();

var statemap;
var pcode;
var pcode_ts;
var my_range_state;
var my_range_township;
var map_chart_value;
var org_chart;
var chart_orgtype;
var map_chart_ts;
var default_lat;
var default_lon;
var default_scale;
var lat;
var long;
var scale;
var sr_location;
var state_select;
var chart_filter_count;
var chart_filters = [{
    "sector": []
}, {
    "state": []
}, {
    "township": []
}, {
    "status": []
}, {
    "orgtype": []
}, {
    "orgname": []
}, {
    "startyear": []
}, {
    "estimateendyear": []
}];
var state_select_all = new Array("MMR010",
    "MMR012",
    "MMR013",
    "MMR001",
    "MMR017",
    "MMR111",
    "MMR009",
    "MMR006",
    "MMR002",
    "MMR003",
    "MMR222",
    "MMR005",
    "MMR004",
    "MMR011",
    "MMR018"
);

var colorcat10 = new Array(
    '#a4cbe7',
    '#84b9df',
    '#65a7d7', //light
    '#378ccb',
    '#2d77ad',
    '#25628e	',
    '#1d4c6f' //Dark
);
var colorcat10with0 = new Array(
    '#AAAAAA', //Blank Color
    '#a4cbe7',
    '#84b9df',
    '#65a7d7', //light
    '#378ccb',
    '#2d77ad',
    '#25628e',
    '#1d4c6f' //Dark
);


init();

function log(msg) {
    console.log((new Date()) + ":" + msg);
}

function resetall() {
    map_ts_reset();
    dc.filterAll();
    dc.redrawAll();
    if (gaon == true) {

    }
    gasend("send", "event", "function", "resetall", "Redraw the chart.")
}

function map_ts_reset() {
    lat = default_lat;
    long = default_lon;
    scale = default_scale;
    map_ts_update();
    log("reset");
}

function set_region_location(ST_PCODE) {
    lat = sr_location[ST_PCODE][0];
    long = sr_location[ST_PCODE][1];
    scale = sr_location[ST_PCODE][2];
    map_ts_update();
}

function map_ts_update() {
    map_chart_ts.projection(d3.geo.mercator().center([lat, long]).scale(scale));
    //console.log("[" + lat + "," + long + "," + scale + "],");
    map_chart_ts.redraw();
}

function mapts_up() {
    long = long - 0.5;
    map_ts_update();
}

function mapts_down() {
    long = long + 0.5;
    map_ts_update();
}

function mapts_left() {
    lat = lat + 0.5;
    map_ts_update();
}

function mapts_right() {
    lat = lat - 0.5;
    map_ts_update();
}

function mapts_zoomin() {
    scale = scale + 100;
    map_ts_update();
}

function mapts_zoomout() {
    scale = scale - 100;
    map_ts_update();
}

function mapts_zoomin_2() {
    scale = scale + 1000;
    map_ts_update();
}

function mapts_zoomout_2() {
    scale = scale - 1000;
    map_ts_update();
}

function init() {
    log("init started.");
    state_select = new Array();
    sr_location = {
        "MMR010": [99, 22, 6500],
        "MMR012": [98, 20, 4400],
        "MMR013": [99, 18, 7100],
        "MMR001": [102, 27, 4400],
        "MMR017": [99, 18, 5200],
        "MMR111": [100, 18, 5200],
        "MMR009": [100, 20, 4400],
        "MMR006": [103, 12, 4500],
        "MMR002": [101, 21, 6000],
        "MMR003": [101, 18, 5800],
        "MMR222": [106, 23, 2800],
        "MMR005": [100, 25, 4400],
        "MMR004": [98, 24, 4400],
        "MMR011": [101, 17, 5800],
        "MMR018": [99, 21, 7000],
    };
    chart_filter_count = new Array();
    chart_filter_count.push({
        "sector": 0
    });
    chart_filter_count.sector = 0;
    chart_filter_count.push({
        "state": 0
    });
    chart_filter_count.state = 0;
    chart_filter_count.push({
        "township": 0
    });
    chart_filter_count.township = 0;
    chart_filter_count.push({
        "orgtype": 0
    });
    chart_filter_count.orgtype = 0;
    chart_filter_count.push({
        "orgname": 0
    });
    chart_filter_count.orgname = 0;
    chart_filter_count.push({
        "startyear": 0
    });
    chart_filter_count.startyear = 0;
    chart_filter_count.push({
        "estimateendyear": 0
    });
    chart_filter_count.estimateendyear = 0;
    chart_filter_count.push({
        "status": 0
    });
    chart_filter_count.status = 0;



    default_lat = 109;
    default_lon = 20.5;
    default_scale = 1600;
    lat = default_lat;
    long = default_lon;
    scale = default_scale;

    try {
        var maplegend = "State : ";
        var maplegend_ts = "Township : ";

        org_chart = dc.rowChart("#orgs");
        chart_filters.orgname = org_chart.filters();
        var string_org_chart = "";

        chart_orgtype = dc.rowChart("#orgtype");
        chart_filters.orgtype = chart_orgtype.filters();
        var string_chart_orgtype = "";

        var sector_chart = dc.rowChart("#sector");
        chart_filters.sector = sector_chart.filters();
        var string_sector_chart = "";

        var map_chart = dc.geoChoroplethChart("#map_cw");
        chart_filters.state = map_chart.filters();
        var string_map_chart = "";

        map_chart_ts = dc.geoChoroplethChart("#map_ts");
        chart_filters.township = map_chart_ts.filters();
        var string_map_chart_ts = "";

        var chart_startyear = dc.rowChart("#startyear");
        chart_filters.startyear = chart_startyear.filters();
        var string_chart_startyear = "";

        var chart_estimateendyear = dc.rowChart("#estimateendyear");
        chart_filters.estimateendyear = chart_estimateendyear.filters();
        var string_chart_estimateendyear = "";

        var status_chart = dc.pieChart("#status");
        chart_filters.status = status_chart.filters();
        var string_status_chart = "";

        log("chart declared");
        document.getElementById('p_bar').style.width = "30%";

        log("cf declare started");
        var cf = crossfilter(decryption());
        log("cf declare finish")
        cf.organisation = cf.dimension(function(d) {
            return d.Organization;
        });
        log("cf organization finish");
        cf.orgtype = cf.dimension(function(d) {
            return d.OrganizationType;
        });
        log("cf orgtype finish");
        cf.sector = cf.dimension(function(d) {
            return d.SectorCluster;
        });
        log("cf sector finish");
        cf.pcode = cf.dimension(function(d) {
            return d.StateRegion;
        });
        log("cf pcode finish");
        cf.pcode_ts = cf.dimension(function(d) {
            return d.Township;
        });
        log("cf pcode_ts finish");
        cf.startyear = cf.dimension(function(d) {
            return d.StartYear;
        });
        log("cf start year finish");
        cf.estimateendyear = cf.dimension(function(d) {
            return d.EstimateEndYear;
        });
        log("cf estimateendyear finish");
        cf.status = cf.dimension(function(d) {
            return d.Status;
        });
        log("cf status finish");
        //cf.status.filter([""]);

        log("cf declare finish")
        document.getElementById('p_bar').style.width = "40%";
        console.log((new Date()) + ':' + 'Putting data...');

        var sector = cf.sector.group();
        var status = cf.status.group();
        var organisation = cf.organisation.group();
        var orgtype = cf.orgtype.group();
        var startyear = cf.startyear.group();
        var estimateendyear = cf.estimateendyear.group();
        pcode = cf.pcode.group();
        pcode_ts = cf.pcode_ts.group();
        var all = cf.groupAll();


        document.getElementById('p_bar').style.width = "50%";
        log("Grouping all data...");

        /*----------------------------------------------------------
        -
        -
        -----------------------------------------------------------*/
        sector_chart.width(300).height(600)
            .dimension(cf.sector)
            .group(sector)
            .elasticX(true)
            .data(function(group) {
                return group.top(150);
            })
            .colors(['#3182bd'])
            .colorDomain([0, 0])
            .colorAccessor(function(d, i) {
                return 1;
            })
            .xAxis().ticks(4);
        log("sector chart declared");

        /*----------------------------------------------------------
        -
        -
        -----------------------------------------------------------*/

        chart_orgtype.width(400).height(300)
            .dimension(cf.orgtype)
            .group(orgtype)
            .elasticX(true)
            .data(function(group) {
                return group.top(150);
            })
            .colors(['#3182bd'])
            .colorDomain([0, 0])
            .colorAccessor(function(d, i) {
                return 1;
            })
            .xAxis().ticks(4);
        log("orgtype chart declared");
        /*----------------------------------------------------------
        -
        -
        -----------------------------------------------------------*/

        chart_startyear.width(200).height(900)
            .dimension(cf.startyear)
            .group(startyear)
            .elasticX(true)
            .data(function(group) {
                return group.top(Infinity);
            })
            .colors(['#3182bd'])
            .colorDomain([0, 0])
            .colorAccessor(function(d, i) {
                return 1;
            })
            .title(function(d) {
                return "Year : " + d.key + "\nNo. of project activities reported per selected location : " + d.value;
            })
            .xAxis().ticks(2);
        log("Start year chart declared");
        /*----------------------------------------------------------
        -
        -
        -----------------------------------------------------------*/

        chart_estimateendyear.width(200).height(900)
            .dimension(cf.estimateendyear)
            .group(estimateendyear)
            .elasticX(true)
            .data(function(group) {
                return group.top(Infinity);
            })
            .colors(['#3182bd'])
            .colorDomain([0, 0])
            .colorAccessor(function(d, i) {
                return 1;
            })
            .title(function(d) {
                return "Year : " + d.key + "\nNo. of project activities reported per selected location : " + d.value;
            })
            .xAxis().ticks(2);
        log("estimate end year chart declared");
        /*----------------------------------------------------------
        -
        -
        -----------------------------------------------------------*/

        status_chart.width(180).height(180)
            .dimension(cf.status)
            .group(status)
            .renderLabel(false)
            .innerRadius(60)
            .colors(['#deebf7', '#9ecae1', '#3182bd'])
            .colorDomain([0, 3])
            .colorAccessor(function(d, i) {
                return i % 4;
            });
        status_chart.legend(dc.legend().x(240).y(0).gap(21));
        log("status chart declared.");
        /*----------------------------------------------------------
        -
        -
        -----------------------------------------------------------*/

        org_chart.width(500).height(6000)
            .dimension(cf.organisation)
            .group(organisation)
            .elasticX(true)
            .data(function(group) {
                return group.top(300);
            })
            .colors(['#3182bd'])
            .colorDomain([0, 0])
            .colorAccessor(function(d, i) {
                return 1;
            });
        log("organization chart declared.");
        /*----------------------------------------------------------
        -
        -
        -----------------------------------------------------------*/

        var map = "data/State.json";
        map_chart_value = new Array();
        $.each(pcode.all(), function(index, value) {
            map_chart_value.push(value.value);
        })
        map_chart_value = map_chart_value.sort(function(a, b) {
            return a - b;
        });
        var o = d3.scale.ordinal()
            .domain(colorcat10)
            .rangePoints([map_chart_value[0], map_chart_value[map_chart_value.length - 1]]);
        my_range_state = o.range();

        map_chart.width(800)
            .height(800)
            .dimension(cf.pcode)
            .group(pcode)
            .colors(colorcat10with0)
            .colorDomain([0, 1, 2, 3, 4, 5, 6, 7])
            .colorAccessor(function(data, index) {
                if (data == 0) {
                    return 0
                } else {
                    var point = closestarray_state(data) + 1;
                    return point;
                }
            })
            .overlayGeoJson(statesJSON.features, "State", function(d) {
                return d.properties.ST_PCODE;
            })
            .projection(d3.geo.mercator().center([109, 20.5]).scale(1600)) //for yangon
            .title(function(d) {
                return maplegend + pcode2state[d.key] + "\nNo. of project activities reported per selected location " + d.value;
            })
            .renderlet(function(mychart) {
                mychart.selectAll('path').on("click", function(d) {

                    state_select = mychart.filters();
                    mychart.filter(state_select)
                        .filter(d.properties.ST_PCODE);
                    state_select = mychart.filters();
                    set_region_location(d.properties.ST_PCODE);
                    map_chart_ts.projection(d3.geo.mercator().center([lat, long]).scale(scale));
                    dc.renderAll();
                });
            })
            .on("postRedraw", function(mychart) {


                map_chart_value = new Array();
                $.each(mychart.group().all(), function(index, value) {
                    map_chart_value.push(value.value);
                })
                map_chart_value = map_chart_value.sort(function(a, b) {
                    return a - b;
                });
                var o = d3.scale.ordinal()
                    .domain(colorcat10)
                    .rangePoints([map_chart_value[0], map_chart_value[map_chart_value.length - 1]]);
                my_range_state = o.range();
                map_chart.render();
            });
        log("map chart declared");
        /*----------------------------------------------------------
        -
        -
        -----------------------------------------------------------*/

        var map_ts = "data/Township.json";

        map_chart_value = new Array();

        $.each(pcode_ts.all(), function(index, value) {
            map_chart_value.push(value.value);
        })
        map_chart_value = map_chart_value.sort(function(a, b) {
            return a - b;
        });
        var o = d3.scale.ordinal()
            .domain(colorcat10)
            .rangePoints([map_chart_value[0], map_chart_value[map_chart_value.length - 1]]);
        my_range_township = o.range();

        map_chart_ts.width(280)
            .height(550)
            .dimension(cf.pcode_ts)
            .group(pcode_ts)
            .colors(colorcat10with0)
            .colorDomain([0, 1, 2, 3, 4, 5, 6, 7])
            .colorAccessor(function(data, index) {
                if (data == 0) {
                    return 0
                } else {
                    var point = closestarray_township(data) + 1;
                    return point;
                }
            })
            .overlayGeoJson(townshipJSON.features, "Township", function(d) {
                return d.properties.TS_PCODE;
            })
            .projection(d3.geo.mercator().center([lat, long]).scale(scale)) //for yangon
            .title(function(d) {
                return maplegend_ts + pcode2state[d.key] + "\nNo. of project activities reported per selected location " + d.value;
            })
            .on("postRedraw", function(mychart) {
                var tempstring = map_chart.filters()[map_chart.filters().length - 1];
                if (typeof map_chart.filters()[map_chart.filters().length - 1] != "undefined" &&
                    tempstring != string_map_chart) {
                    gasend("send", "event", "click", "state", tempstring);
                    string_map_chart = tempstring;
                    //console.log("State click at " + tempstring);
                }

                var tempstring = map_chart_ts.filters()[map_chart_ts.filters().length - 1];
                if (typeof map_chart_ts.filters()[map_chart_ts.filters().length - 1] != "undefined" &&
                    tempstring != string_map_chart_ts) {
                    gasend("send", "event", "click", "township", tempstring);
                    string_map_chart_ts = tempstring;
                    console.log("Township click at " + tempstring);
                }

                var tempstring = org_chart.filters()[org_chart.filters().length - 1];
                if (typeof org_chart.filters()[org_chart.filters().length - 1] != "undefined" &&
                    tempstring != string_org_chart) {
                    gasend("send", "event", "click", "orgname", tempstring);
                    string_org_chart = tempstring;
                    console.log("Organization Name click at " + tempstring);
                }

                var tempstring = chart_orgtype.filters()[chart_orgtype.filters().length - 1];
                if (typeof chart_orgtype.filters()[chart_orgtype.filters().length - 1] != "undefined" &&
                    tempstring != string_chart_orgtype) {
                    gasend("send", "event", "click", "orgtype", tempstring);
                    string_chart_orgtype = tempstring;
                    console.log("Organization Type click at " + tempstring);
                }

                var tempstring = sector_chart.filters()[sector_chart.filters().length - 1];
                if (typeof sector_chart.filters()[sector_chart.filters().length - 1] != "undefined" &&
                    tempstring != string_sector_chart) {
                    gasend("send", "event", "click", "sector", tempstring);
                    string_sector_chart = tempstring;
                    console.log("Sector click at " + tempstring);
                }

                var tempstring = chart_startyear.filters()[chart_startyear.filters().length - 1];
                if (typeof chart_startyear.filters()[chart_startyear.filters().length - 1] != "undefined" &&
                    tempstring != string_chart_startyear) {
                    gasend("send", "event", "click", "startyear", tempstring);
                    string_chart_startyear = tempstring;
                    console.log("Start Year click at " + tempstring);
                }

                var tempstring = chart_estimateendyear.filters()[chart_estimateendyear.filters().length - 1];
                if (typeof chart_estimateendyear.filters()[chart_estimateendyear.filters().length - 1] != "undefined" &&
                    tempstring != string_chart_estimateendyear) {
                    gasend("send", "event", "click", "estimateendyear", tempstring);
                    string_chart_estimateendyear = tempstring;
                    console.log("Estimated End Year click at " + tempstring);
                }

                var tempstring = status_chart.filters()[status_chart.filters().length - 1];
                if (typeof status_chart.filters()[status_chart.filters().length - 1] != "undefined" &&
                    tempstring != string_status_chart) {
                    gasend("send", "event", "click", "status", tempstring);
                    string_status_chart = tempstring;
                    console.log("Status click at " + tempstring);
                }

                map_chart_value = new Array();

                $.each(mychart.group().all(), function(index, value) {
                    map_chart_value.push(value.value);
                })
                map_chart_value = map_chart_value.sort(function(a, b) {
                    return a - b;
                });
                var o = d3.scale.ordinal()
                    .domain(colorcat10)
                    .rangePoints([map_chart_value[0], map_chart_value[map_chart_value.length - 1]]);
                my_range_township = o.range();
                //console.log(my_range_township);
                map_chart_ts.render();
            });

        log("township chart declared.");
        /*----------------------------------------------------------
        -
        -
        -----------------------------------------------------------*/

        document.getElementById('p_bar').style.width = "100%";
        dc.dataCount("#count-info").dimension(cf).group(all);
        dc.renderAll();
        log("render all");
        gasend("send", "event", "load", "finish", "Loaded Successfully");
        log("init done");
    } catch (err) {
        console.log(err);
        console.log(err.message);
    }
}



function closestarray_state(num) {
    var arr = my_range_state;
    var curr = arr[0];
    var diff = Math.abs(num - curr);
    for (var val = 0; val < arr.length; val++) {
        var newdiff = Math.abs(num - arr[val]);
        if (newdiff < diff) {
            diff = newdiff;
            curr = arr[val];
        }
    }
    return $.inArray(curr, arr);
    //return curr
}

function closestarray_township(num) {
    var arr = my_range_township;
    var curr = arr[0];
    var diff = Math.abs(num - curr);
    for (var val = 0; val < arr.length; val++) {
        var newdiff = Math.abs(num - arr[val]);
        if (newdiff < diff) {
            diff = newdiff;
            curr = arr[val];
        }
    }
    return $.inArray(curr, arr);
    //return curr
}

function orgsortall() {
    org_chart.data(function(group) {
        gasend("send", "event", "function", "orgsortall", "Sort by Name");
        return group.all();
    });
    dc.renderAll();
}

function orgsorttop() {
    org_chart.data(function(group) {
        gasend("send", "event", "function", "orgsorttop", "Sort by No. of project activities reported per selected location");
        return group.top(300);
    });
    dc.renderAll();
}

function decryption() {
    console.log((new Date()) + ':' + 'Decryption started...');
    var data_3w_0 = new Array();
    var count_1 = 0;
    var count_2 = 0;

    while (data_3w_multiply[count_1]) {
        var forloop = data_3w_multiply[count_1];
        for (j = 0; j < forloop; j++) {
            data_3w_0[count_2] = data_3w_base[count_1];
            count_2 = count_2 + 1;
        }
        count_1 = count_1 + 1;
    }
    document.getElementById('p_bar').style.width = "10%";
    console.log((new Date()) + ':' + 'First phase decryption finish...');
    var i = 0;
    var k = 0;
    var data_3w_1 = new Array();
    var j = 0;
    var arrayme = new Array();
    var stareg = new Array("MMR010",
        "MMR012",
        "MMR013",
        "MMR001",
        "MMR017",
        "MMR111",
        "MMR009",
        "MMR006",
        "MMR002",
        "MMR003",
        "MMR222",
        "MMR005",
        "MMR004",
        "MMR011",
        "MMR018",
        "Countrywide"
    );
    var total = 0;
    for (var x = 0; x < stareg.length; x++) {
        arrayme[stareg[x]] = 0;
    }

    while (data_3w_0[i]) {

        if (data_ref_stareg[data_3w_0[i][3]] != "Countrywide") {
            //console.log("Normal");
            try {
                var x = new Array();
                x.Organization = data_ref_orgniz[data_3w_0[i][0]];
                x.OrganizationType = data_ref_orgtype[data_3w_0[i][1]];
                x.SectorCluster = data_ref_sector[data_3w_0[i][2]];
                x.StateRegion = data_ref_stareg[data_3w_0[i][3]];
                x.Township = data_ref_ts[data_3w_0[i][4]];
                x.StartYear = data_ref_startyear[data_3w_0[i][5]];
                x.EstimateEndYear = data_ref_estimateendyear[data_3w_0[i][6]];
                x.Status = data_ref_status[data_3w_0[i][7]];
                data_3w_1[k] = x;

                i = i + 1;
                k = k + 1;
                arrayme[x.StateRegion] = arrayme[x.StateRegion] + 1;

            } catch (err) {
                console.log(err.message);
            }
        } else {
            arrayme["Countrywide"] = arrayme["Countrywide"] + 1;
            for (var m = 0; m < 15; m++) {
                var z = new Array();
                z.Organization = data_ref_orgniz[data_3w_0[i][0]];
                z.OrganizationType = data_ref_orgtype[data_3w_0[i][1]];
                z.SectorCluster = data_ref_sector[data_3w_0[i][2]];
                z.StateRegion = data_ref_stareg[m];
                z.Township = data_ref_ts[228];
                z.StartYear = data_ref_startyear[data_3w_0[i][5]];
                z.EstimateEndYear = data_ref_estimateendyear[data_3w_0[i][6]];
                z.Status = data_ref_status[data_3w_0[i][7]];
                //console.log(z);
                data_3w_1[k] = z;
                k = k + 1;
            }
            i = i + 1;
            j = j + 1;
        }
    }
    var total = 0;
    for (var x = 0; x < stareg.length; x++) {
        var va = arrayme[stareg[x]];
        var st = stareg[x];
        total = total + va;
    }
    console.log("Total Count is " + total);
    console.log("Array total count is " + i);
    console.log("Countrywide count is " + j);
    document.getElementById('p_bar').style.width = "20%";
    console.log((new Date()) + ':' + 'Second phase decryption finish...');
    return data_3w_1;
}

function showpage() {
    $('#loading').hide();
    $('#dashboard').show();
}
