loadData("ny");

function loadData(region){
// document.getElementById("field").style.font-weight = "bold";
var eriemap = {};
eriemap["id"] = "erie"
eriemap["filename"] = "ErieCountyMainCSV.topojson";
eriemap["scale"] = 33;
eriemap["tarns1"] = -23600;
eriemap["tarns2"] = -4750;
eriemap["stroke"] = 0.04;

var nymap = {};
nymap["id"] = "ny"
nymap["filename"] = "CountyDataWithCrimeRateCSVMerge.topojson";
nymap["scale"] = 6.5;
nymap["tarns1"] = -4600;
nymap["tarns2"] = -620;
nymap["stroke"] = 0.15;

var allmaps = {};
allmaps["erie"] = eriemap;
allmaps["ny"] = nymap;
// //console.log(allmaps["erie"]);

var datamap = allmaps[region];
var width = "30%",
    height = 590;

if(datamap.id=="ny"){
  document.getElementById("portfolio").innerHTML = "New York Distorted Map"
  document.getElementById("top").style.display='none';
  width = "45%"
  // document.getElementsByClassName('path.state')[0].style.stroke-width = 0.08;
} else{
  document.getElementById("portfolio").innerHTML = "Erie County Distorted Map"
    document.getElementById("top").style.display='block';
}

// //console.log(datamap);

var mapid = document.getElementById("mapc")
if(mapid != undefined)
  mapid.innerHTML = "";
var svg1 = d3.select("#mapc").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "map")
    .attr("style","margin-left:auto; margin-right:auto; display:block;");//background-color:#E0E0E0;

// hide the form if the browser doesn't do SVG,
// (then just let everything else fail)
if (!document.createElementNS) {
  document.getElementsByTagName("form")[0].style.display = "none";
}

// field definitions from:
// <http://www.census.gov/popest/data/national/totals/2011/files/NST-EST2011-alldata.pdf>
var percent = (function() {
      var fmt = d3.format(".2f");
      return function(n) { return fmt(n) + "%"; };
    })(),
    fields = [
      {name: "Default (Area (sq mi))", id: "default", key: "Muni Area (sq mi)", ratio:"none", ny:false, erie:true},
      {name: "Default", id: "none", ny:true, erie:false},
      {name: "Population", id: "Population", key: "Population", ratio:"none", ny:true,erie:true},
      {name: "Population Per Square Mile", id: "Population Per Square Mile", key: "Population Per Square Mile", ratio:"none", ny:false,erie:true},
/*      {name: "Area (sq mi)", id: "Muni Area (sq mi)", key: "Muni Area (sq mi)", ratio:"none"},
*/      {name: "Households With Cable (%)", id: "%_HH_With_Cable", key: "%_HH_With_Cable", ratio:"none", ny:false,erie:true},
      {name: "Households With Fiber (%)", id: "%_HH_With_Fiber", key: "%_HH_With_Fiber", ratio:"none", ny:false,erie:true},
      {name: "Residential Market Value Ratio", id: "Residential Market Value Ratio", key: "Residential Market Value Ratio", ratio:"none", ny:false,erie:true},
      {name: "Households per square miles", id: "HH", key: "HH", ratio: "Muni Area (sq mi)", ny:false,erie:true},
      {name: "Family Households per sq mi", id: "HH_fam", key: "HH_fam", ratio: "Muni Area (sq mi)", ny:true,erie:true},
      {name: "Married Couple Families (%)", id: "Married", key: "Married", ratio:"Population", ny:false,erie:true},
      {name: "Male Population(%)", id: "Male", key: "Male", ratio:"Population", ny:true,erie:true},
      {name: "Female Population(%)", id: "Female", key: "Female", ratio:"Population", ny:true,erie:true},
      {name: "One Race (%)", id: "One_Race", key: "One_Race", ratio:"Population", ny:false,erie:true},
      {name: "Black or African Americans (%)", id: "Black or AA", key: "Black or AA", ratio:"Population", ny:true,erie:true},
      {name: "Whites (%)", id: "White", key: "White", ratio:"Population", ny:true,erie:true},
      {name: "Asians (%)", id: "Asian", key: "Asian", ratio:"Population", ny:true,erie:true},
      {name: "High School Grads (%)", id: "HSgrad", key: "HSgrad", ratio:"Population", ny:false,erie:true},
      {name: "College (%)", id: "SomeCollege", key: "SomeCollege", format: "+,", ratio:"Population", ny:false,erie:true},
      {name: "Associate Degree (%)", id: "Assoc_Degree", key: "Assoc_Degree", ratio:"Population", ny:false,erie:true},
      {name: "Bachelor Degree (%)", id: "Bach_Degree", key: "Bach_Degree", ratio:"Population", ny:false,erie:true},
      {name: "Graduate Professional Degree (%)", id: "Grad_Prof_degree", key: "Grad_Prof_degree", ratio:"Population", ny:false,erie:true},
      {name: "Per HS grad Higher (%)", id: "Per_HSgradHigher", key: "Per_HSgradHigher", ratio:"none", ny:false,erie:true},
      {name: "Per Bachelor Higher (%)", id: "PerBachorHigher", key: "PerBachorHigher", ratio:"none", ny:false,erie:true},
      {name: "Index Crime Rate", id: "Index Crime Rate", key: "Index Crime Rate", ratio:"none", ny:true,erie:false},
      {name: "Violent Crime Rate", id: "Violent Crime Rate", key: "Violent Crime Rate", ratio:"none", ny:true,erie:false},
      {name: "Property Crime Rate", id: "Property Crime Rate", key: "Property Crime Rate", ratio:"none", ny:true,erie:false},
    ],
    years = [2010, 2011],
    fieldsById = d3.nest()
      .key(function(d) { return d.id; })
      .rollup(function(d) { return d[0]; })
      .map(fields),
    field = fields[0],
    year = years[0],
    colors = colorbrewer.RdYlBu[3]
      .reverse()
      .map(function(rgb) { return d3.hsl(rgb); });

var body = d3.select("body"),
    stat = d3.select("#status");

var fieldSelect = d3.select("#feild")
 
var filid = document.getElementById("field")
if(filid != undefined)
  filid.innerHTML = "";

  ftable = document.getElementById("field");
  var i=0;
 for(var f in fields){
    if(fields[f][datamap.id]){
      var ele = document.createElement("a");
      ele.setAttribute('href', "#"+fields[f].id);
      ele.setAttribute('text', fields[f].id);
      ele.setAttribute('class', "fieldele");
      ele.innerHTML = fields[f].name;
      var r = ftable.insertRow(i);
      var c = r.insertCell(0);
      c.appendChild(ele);
      i++;
    }
 }

var yearSelect = d3.select("#year")
  .on("change", function(e) {
    year = years[this.selectedIndex];
    location.hash = "#" + [field.id, year].join("/");
  });

yearSelect.selectAll("option")
  .data(years)
  .enter()
  .append("option")
    .attr("value", function(y) { return y; })
    .text(function(y) { return y; })

var map = d3.select("#map"),
    zoom = d3.behavior.zoom()
      .translate([datamap.tarns1, datamap.tarns2 ])
      .scale(datamap.scale) 
      .scaleExtent([0.5, 10.0])
      .on("zoom", updateZoom),
    layer = map.append("g")
      .attr("id", "layer"),
    states = layer.append("g")
      .attr("id", "states")
      .selectAll("path");

// map.call(zoom);
updateZoom();

function updateZoom() {
  var scale = zoom.scale();
  layer.attr("transform",
    "translate(" + zoom.translate() + ") " +
    "scale(" + [scale, scale] + ")");
}
var proj = d3.geo.albersUsa();
   var topology,
    geometries,
    rawData,
    dataById = {},
    carto = d3.cartogram()
      .projection(proj)
      .properties(function(d) {
        return dataById[d.id];
      })
      .value(function(d) {
        return +d.properties[field];
      });

window.onhashchange = function() {
  parseHash();
};

var segmentized = location.search === "?segmentized",
/*          url = ["data","erienewcsv.topojson"].join("/");
*/          url = ["http://localhost/data",datamap.filename].join("/");
d3.json(url, function(topo) {
  topology = topo;
  geometries = topology.objects.states.geometries;
  d3.csv("data/wny.csv", function(data) {
    rawData = data;
    dataById = d3.nest()
      .key(function(d) { return d.NAME; })
      .rollup(function(d) { return d[0]; })
      .map(data);
    init();
  });
});

function init() {
  var features = carto.features(topology, geometries),
      path = d3.geo.path()
        .projection(proj);

  states = states.data(features)
    .enter()
    .append("path")
      .attr("class", "state")
      .attr("id", function(d) {
        return d.properties.NAME;
      })
      .attr("stroke-width",datamap["stroke"])
      .attr("fill", "#fafafa")
      .attr("d", path);

  
  states.append("title");

  parseHash();
}

function addTexts(){
  var list = document.getElementsByClassName("state-label");
   for(var i = list.length - 1; 0 <= i; i--)
   if(list[i] && list[i].parentElement)
   list[i].parentElement.removeChild(list[i]);

  var paths = document.querySelectorAll("path");

  for (var p in paths)
  {
      addText(paths[p])
  }
}

function addText(p)
{
    var t = document.createElementNS("http://www.w3.org/2000/svg", "text");
    var b = p.getBBox();
    t.setAttribute("transform", "translate(" + (b.x + b.width/2 ) + " " + (b.y + b.height/2) + ")");
    t.textContent = p.id;
    t.setAttribute("fill", "#777");
    t.setAttribute("font-size", ".3");
    t.setAttribute("class","state-label");
    p.parentNode.insertBefore(t, p.nextSibling);
}

function reset() {
  stat.text("");
  body.classed("updating", false);

  var features = carto.features(topology, geometries),
      path = d3.geo.path()
        .projection(proj);

  states.data(features)
    .transition()
      .duration(1050)
      .ease("linear")
      .attr("fill", "#fafafa")
      .attr("d", path);

  states.select("title")
    .text(function(d) {
      return d.properties.NAME;
    });
}

  function valueWithRatio(key, ratio, d){
    if(ratio!="none")
      return +parseFloat((+d.properties[key])/(+d.properties[ratio])).toFixed(3);
    else
      return +d.properties[key];
  }


function update() {
  var tuples = [];


  var start = Date.now();
  body.classed("updating", true);
  var formatter = d3.format(".2f");
  var ratio = field.ratio;
  var feildname = field.name;
  var key = field.key.replace("%d", year),
      fmt = (typeof field.format === "function")
        ? field.format
        : d3.format(field.format || ","),
      value = function(d) {
        tuples.push([d.id, valueWithRatio(key,ratio,d)]);
        return valueWithRatio(key,ratio,d);
      },
      values = states.data()
        .map(value)
        .filter(function(n) {
          return !isNaN(n);
        })
        .sort(d3.ascending),
      lo = values[0],
      hi = values[values.length - 1];
      //console.log(values);

  tuples.sort(function(a, b) {
      a = a[1];
      b = b[1];
      return a < b ? 1 : (a > b ? -1 : 0);
  });

  toptable = document.getElementById("toptable");
  toptable.innerHTML = "";
  var r = toptable.insertRow(0);
  var c = r.insertCell(0);
  c.innerHTML = "<b>Top 10 in <span style='color:#339BEB;'>" + feildname + "</span></b>";

  for (var i = 0; i < tuples.length && i<10; i++) {
      //console.log(tuples[i][0]+"  "+tuples[i][1]);
      var r = toptable.insertRow(i+1);
      var c = r.insertCell(0);
      c.innerHTML = (i+1)+". "+tuples[i][0]+ ": "+tuples[i][1];
  }

  var color = d3.scale.linear()
    .range(colors)
    .domain(lo < 0
      ? [lo, 0, hi]
      : [lo, d3.mean(values), hi]);

  // normalize the scale to positive numbers
  var scale = d3.scale.linear()
    .domain([lo, hi])
    .range([1, 1000]);

  // tell the cartogram to use the scaled values
  carto.value(function(d) {
    return scale(value(d));
  });

  // generate the new features, pre-projected
  var features = carto(topology, geometries).features;

  // update the data
  states.data(features)
    .select("title")
      .text(function(d) {
        return [d.properties.NAME, fmt(value(d))].join(": ");
      });

  states.transition()
    .duration(750)
    .ease("linear")
    .attr("fill", function(d) {
      return color(value(d));
    })
    .attr("d", carto.path);

  var delta = (Date.now() - start) / 1000;
/*        stat.text(["calculated in", delta.toFixed(1), "seconds"].join(" "));
*/        body.classed("updating", false);

  //addTexts();
  }

var deferredUpdate = (function() {
  var timeout;
  return function() {
    var args = arguments;
    clearTimeout(timeout);
/*          stat.text("calculating...");
*/          return timeout = setTimeout(function() {
      update.apply(null, arguments);
    }, 10);
  };
})();

var hashish = d3.selectAll("a.hashish")
  .datum(function() {
    return this.href;
  });

function parseHash() {
  var parts = location.hash.substr(1).split("/"),
      desiredFieldId = parts[0],
      desiredYear = +parts[1];

  field = fieldsById[desiredFieldId] || fields[0];
  year = (years.indexOf(desiredYear) > -1) ? desiredYear : years[0];

  fieldSelect.property("selectedIndex", fields.indexOf(field));

  if (field.id === "none") {
    toptable = document.getElementById("toptable");
    toptable.innerHTML = "";
    yearSelect.attr("disabled", "disabled");
    reset();

  } else {

    if (field.years) {
      if (field.years.indexOf(year) === -1) {
        year = field.years[0];
      }
      yearSelect.selectAll("option")
        .attr("disabled", function(y) {
          return (field.years.indexOf(y) === -1) ? "disabled" : null;
        });
    } else {
      yearSelect.selectAll("option")
        .attr("disabled", null);
    }

    yearSelect
      .property("selectedIndex", years.indexOf(year))
      .attr("disabled", null);

    deferredUpdate();
    location.replace("#" + [field.id, year].join("/"));

    hashish.attr("href", function(href) {
      return href + location.hash;
    });
  }
}  
}
