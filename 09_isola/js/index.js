// Irene Trotta @iretrtr © 2018 MIT License
// Digital cartography and ethnographic survey of online communities​
// online-community-maps 9 | island + names | Città Sant' Angelo, IT | 2.2019
// Educational purpose, master graduation project prototype
// 
// what if online communities could be real places? how would their map be?
// prototype > create a map from/with subreddit community data

//var num_utenti = numRandom(10000);
var num_utenti = 20000;
var num_topics;
var num_likes = [];
var num_commenti = [];
var mapped_likes = [];
var mapped_comments = [];
var cities_coord = [];
var limite = 0.15;
var timeline = [];
var polygons = [];
var costa = [];
var land =[];
var diagram = [];
var cities = [];

// CARICA FILE JSON
var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};

function generate(){
  var input_community = document.getElementById("community").value;
  console.log(input_community);
  getJSON('https://www.reddit.com/r/' + input_community + '/.json', function(error, data){
    if (error != null){
      console.log('ERRORE ' + error);
    } else {
      console.log(data);
      timeline.shift();
      timeline.push(new sR(data));
      num_topics = timeline[0].numTopics;
      num_likes = [];
      num_commenti = [];
      for (n = 0; n < num_topics ; n++){
        num_likes.push(timeline[0].score[n]);
        num_commenti.push(timeline[0].numComments[n]);
      }
      mapping();
      draw();
    }
  });
}

// CALCOLI PER TRASFORMAZIONE DATI

function minimo(arr){
  var c_min = arr[0];
  for (var i = 0; i < arr.length; i++){
    if (arr[i] < c_min){
      c_min = arr[i];
    } else{
      c_min = c_min;
    }
  }
  return c_min;
}

function massimo(arr){
  var c_max = arr[0];
  for (var i = 0; i < arr.length; i++){
    if (arr[i] > c_max) {
      c_max = arr[i];
    } else {
      c_max = c_max;
    }
  }
  return c_max;
}

function mapping(){
  mapped_likes = [];
  mapped_comments = [];
  var c;
  var l;
  var c_max = massimo(num_commenti);
  var c_min = minimo(num_commenti);
  var l_max = massimo(num_likes);
  var l_min = minimo(num_likes);
  // console.log('val massimo: ' + max);
  // console.log('val minimo: ' + min);
  for (i = 0; i < num_commenti.length; i++){
    c = num_commenti[i];
    l = num_likes[i];
    // console.log(c);
    c = (c - c_min) / (c_max - c_min) * (0.999 - 0.97) + 0.97; // estensione
    l = (l - l_min) / (l_max - l_min) * (1 - 0.25) + 0.25; // altitudine
    // console.log(c);
    mapped_comments.push(c);
    mapped_likes.push(l);
    var c;
    var l;
  }
  //console.log(mapped_comments);
  //console.log(mapped_likes);
}

function numRandom(n) {
  return Math.floor(Math.random() * Math.floor(n));
}

// DISEGNA GRAFICO
// https://azgaar.wordpress.com/

function draw(){
  d3.select(".celle").remove();
  d3.select(".cerchio").remove();
  d3.select(".testo").remove();
  var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    viewbox = svg.append('g').attr('class', 'viewbox'),
    acqua = viewbox.append('g').attr('class', 'acqua'),
    celle = viewbox.append('g').attr('class', 'celle'),
    cerchio = viewbox.append('g').attr('class', 'cerchio'),
    text = viewbox.append('g').attr('class', 'testo'),
    sites = d3.range(num_utenti)
      .map(function(d) {
        return [Math.random() * width, Math.random() * height];
      }),
    voronoi = d3.voronoi()
      .extent([[0, 0],[width, height]]),
    relaxedSites = voronoi(sites).polygons().map(d3.polygonCentroid);
    diagram = voronoi(relaxedSites);
    polygons = diagram.polygons();
    var color = d3.scaleSequential(d3.interpolateSpectral), //sfumatura colore - funziona su una scala da [0,1]
    coda = [];
    costa = [];

  var c_max = massimo(num_commenti);
  trova_celle_vicine();
  heightmap();

  // Add D3 drag and zoom behavior
   var zoom = d3.zoom()
     .scaleExtent([1, 50])
     .translateExtent([
       [-100, -100],
       [width + 100, height + 100]
     ])
     .on("zoom", zoomed);
   svg.call(zoom);
   function zoomed() {
     viewbox.attr("transform", d3.event.transform);
   }
   $("#resetZoom").click(function() {
     svg.transition().duration(1000)
       .call(zoom.transform, d3.zoomIdentity);
   });

  function trova_celle_vicine() {
    // push l'index delle celle vicine in ogni elemento polygon
    polygons.map(function(i, d) {
      i.index = d; //indice di quell'elemento
      i.altezza = 0;
      var vicini = []; //creo array per le celle vicine a quella in questione
      diagram.cells[d].halfedges.forEach(function(e){
        var edge = diagram.edges[e];
        var ea;
        if(edge.left && edge.right){
          ea = edge.left.index;
          if (ea === d){
            ea = edge.right.index;
          }
          vicini.push(ea);
        }
      })
      i.vicini = vicini;
    });
  }

  function crea_isola(n, partenza){
    var altezza = mapped_likes[n],
        estensione = mapped_comments[n],
        sharpness = 0.1;
        coda = [], // poligoni da controllare
        used = []; // poligoni usati
        //costa = [];
    polygons[partenza].altezza += altezza;
    coda.push(partenza);
    used.push(partenza);
    for (i = 0; i < coda.length && altezza > 0.01; i++){
      altezza = altezza * estensione;
      polygons[coda[i]].vicini.forEach(function(e){
        if(used.indexOf(e) < 0){
          var mod = Math.random() * sharpness + 1.1 - sharpness;
          if (sharpness == 0){
            mod = 1;
          }
          polygons[e].altezza += altezza * mod;
          if (polygons[e].altezza > 1){
            polygons[e].altezza = 1;
          }
          //creare un array in cui metto tutti i poligoni che sono "land"
          //considerando quei poligoni di altezza sopra lo 0.1
          if (polygons[e].altezza > 0.1){
            land.push(polygons[e].data);
            land[land.length - 1].altezza = polygons[e].altezza;
            land[land.length - 1].index = polygons[e].index;
            //controllo che il poligono in corso non sia stato precedentemente costa
            //se era precedentemente costa deve essere tolto dall'array costa
            //la costa viene continuamente aggiornata
            for (n = 0; n < costa.length; n++){
              if (polygons[e].index == costa[n].index){
                costa.splice(n, 1);
              }
            }
          }
          //i poligoni sotto una certa altezza sono costa
          //i poligoni costa vengono scelti come punto di partenza per la costruzione di masse di terra (blob)
          if (polygons[e].altezza >= 0.05 && polygons[e].altezza <= 0.1){
            //polygons[e].altezza = 0.15;
            costa.push(polygons[e].data);
            costa[costa.length - 1].altezza = polygons[e].altezza;
            costa[costa.length - 1].index = polygons[e].index;
          }
          coda.push(e);
          used.push(e);
        }
      });
    }
    // console.log("new_isola");
    // console.log(land);
    // console.log(costa);
  }

  function heightmap(){
    //creo un'unica isola
    var blob_principale;
    for (n = 0; n < num_commenti.length; n++){
      if (num_commenti[n] == c_max){
        var punto = [width/2, height/2];
        cities_coord.push(punto);
        //trova l'index della cella corrispondente alle coordinate del punto
        var x_y = diagram.find(punto[0], punto[1]).index;
        //cities_coord[n].site = x_y;
          cerchio.append('circle')
          .attr('r', 2)
          .attr('cx', punto[0])
          .attr('cy', punto[1])
          //.attr('stroke-width', 1)
          //.attr('stroke', 'white')
          .attr('fill', 'black');
          //visualizza nome dell'utente che ha creato il topic
          text.append('text')
          .attr('x', punto[0])
          .attr('y', punto[1])
          .text(timeline[0].authorTopic[n])
          .attr('font-family', 'sans-serif');
        //console.log(n);
        crea_isola(n, x_y);
        blob_principale = n;
        console.log("blob_principale " + blob_principale);
        console.log(land);
      }
    }
    for (n = 0; n < num_commenti.length; n++){
      if(n == blob_principale){
        n = n;
        //console.log("blob_principale " + blob_principale);
      }else{ //resto degli argomenti
        var indice = numRandom(costa.length);
        var punto = costa[indice];
        costa.splice(indice, 1);
        cities_coord.push(punto);
        var x_y = diagram.find(punto[0], punto[1]).index;
        //cities_coord[n].site = x_y;
        cerchio.append('circle')
            .attr('r', 2)
            .attr('cx', punto[0])
            .attr('cy', punto[1])
            //.attr('stroke-width', 1)
            //.attr('stroke', 'white')
            .attr('fill', 'black');
          //console.log(n);
          //visualizza nome dell'utente che ha creato il topic
          text.append('text')
          .attr('x', punto[0])
          .attr('y', punto[1])
          .text(timeline[0].authorTopic[n])
          .attr('font-size', '9')
          .attr('font-family', 'sans-serif');
          crea_isola(n, x_y);
        // }else{
        //   n = n-1;
        // }
      }
    }
    disegna_poligoni();
  }

  function disegna_poligoni(){
      polygons.map(function(i){
        if (i.altezza >= limite){
        celle.append("path")
          .attr("d", "M" + i.join("L") + "Z")
          .attr('class', 'celle')
          .attr('fill', color(1-i.altezza))
          .attr("stroke", color(1 - i.altezza));
        }
    });
  }
}

// SCARICA GRAFICO IN PDF o SVG
//https://stackoverflow.com/questions/53282168/how-to-export-complete-d3-tree-graph-as-png-or-pdf

function download_svg() {
  const svg = document.querySelector('svg').cloneNode(true); // clona svg
  // document.body.appendChild(svg);
  const g = svg.querySelector('g') // select the parent g
  g.setAttribute('transform', '') // clean transform
  svg.setAttribute('width', svg.getBBox().width) // set svg to be the g dimensions
  svg.setAttribute('height', svg.getBBox().height)
  const svgAsXML = (new XMLSerializer).serializeToString(svg);
  const svgData = `data:image/svg+xml,${encodeURIComponent(svgAsXML)}`
  const link = document.createElement("a");
  document.body.appendChild(link);
  link.setAttribute("href", svgData);
  var input_community = document.getElementById("community").value;
  link.setAttribute("download", input_community+"_map.svg");
  link.click();
}

function sR(subData_) {
  this.subData = subData_;
  this.authorTopic = [];
  this.titleTopic = [];
  this.nsfw = [];
  this.tagTopic = [];
  this.downs = [];
  this.ups = [];
  this.score = [];
  this.numComments = [];
  this.urlTopic = [];
  this.timeOfCreation = [];
  this.textTopic = [];
  this.numCrossposts = [];
  this.crosspostable = [];
  this.tagClassAuthor = [];
  this.tagAuthor = [];

  this.subreddit = this.subData.data.children[0].data.subreddit;
  this.subredditSubscribers = this.subData.data.children[0].data.subreddit_subscribers;
  this.numTopics = this.subData.data.dist;
  for (var i = 0; i < this.subData.data.children.length; i++) {
    this.titleTopic[i] = this.subData.data.children[i].data.title;
    this.authorTopic[i] = this.subData.data.children[i].data.author;
    this.tagTopic[i] = this.subData.data.children[i].data.link_flair_text;
    this.ups[i] = this.subData.data.children[i].data.ups;
    this.downs[i] = this.subData.data.children[i].data.downs;
    this.score[i] = this.subData.data.children[i].data.score;
    this.numComments[i] = this.subData.data.children[i].data.num_comments;
    this.nsfw[i] = this.subData.data.children[i].data.over_18;
    this.urlTopic[i] = this.subData.data.children[i].data.permalink;
    this.timeOfCreation[i] = this.subData.data.children[i].data.created_utc;
    this.textTopic[i] = this.subData.data.children[i].data.selftext;
    this.crosspostable[i] = this.subData.data.children[i].data.is_crosspostable;
    this.numCrossposts[i] = this.subData.data.children[i].data.num_crossposts;
    this.tagClassAuthor[i] = this.subData.data.children[i].data.author_flair_css_class;
    this.tagAuthor[i] = this.subData.data.children[i].data.author_flair_text;
  }
}
