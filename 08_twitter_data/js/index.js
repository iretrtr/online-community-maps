//var num_utenti = numRandom(10000);
var num_utenti = 15000;
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

//function generate(){
  //var input_community = document.getElementById("community").value;
  //console.log(input_community);
  getJSON('lgbt_twitter_15gen.json', function(error, data){
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
//}

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
    c = (c - c_min) / (c_max - c_min) * (0.999 - 0.95) + 0.95; // estensione
    l = (l - l_min) / (l_max - l_min) * (0.999 - 0.25) + 0.25; // altitudine
    // console.log(c);
    mapped_comments.push(c);
    mapped_likes.push(l);
    var c;
    var l;
  }
  console.log(mapped_comments);
  console.log(mapped_likes);
}

function numRandom(n) {
  return Math.floor(Math.random() * Math.floor(n));
}

// DISEGNA GRAFICO
// https://azgaar.wordpress.com/

function draw(){
  d3.select(".celle").remove();
  d3.select(".cerchio").remove();
  var svg = d3.select("svg"),
    celle = svg.append('g').attr('class', 'celle'),
    cerchio = svg.append('g').attr('class', 'cerchio'),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
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
          if (polygons[e].altezza >= 0.05 && polygons[e].altezza <= 0.1){
            //polygons[e].altezza = 0.15;
            costa.push(polygons[e].data);
          }
          coda.push(e);
          used.push(e);
        }
      });
    }
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
        crea_isola(n, x_y);
        blob_principale = n;
      }
    }
    for (n = 0; n < num_commenti.length; n++){
      if(n == blob_principale){
        n = n+1;
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
  document.body.appendChild(svg);
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
  this.location = [];
  this.menzioni = [];
  // this.titleTopic = [];
  // this.nsfw = [];
  this.tagTopic = [];
  // this.downs = [];
  // this.ups = [];
  this.score = [];
  this.numComments = [];
  this.urlTopic = [];
  this.timeOfCreation = [];
  this.textTopic = [];
  // this.numCrossposts = [];
  // this.crosspostable = [];
  // this.tagClassAuthor = [];
  // this.tagAuthor = [];

  //this.subreddit = this.subData.data.children[0].data.subreddit;
  //this.subredditSubscribers = this.subData.data.children[0].data.subreddit_subscribers;
  this.numTopics = this.subData.statuses.length;
  for (var i = 0; i < this.subData.statuses.length; i++) {
    // this.titleTopic[i] = this.subData.statuses[i].data.title;
    this.authorTopic[i] = this.subData.statuses[i].user.screen_name;
    this.location[i] = this.subData.statuses[i].user.location;
    // if (this.subData.statuses[i].entities.user_mentions.length > 0){
    //  for(n=0; this.subData.statuses[i].entities.user_mentions.length; n++){
    //    this.menzioni[i] = this.subData.statuses[i].entities.user_mentions.screen_name;
    //  }
    // }else{
    //   this.menzioni[i] = null;
    // }
    // for(n=0; this.subData.statuses[i].entities.hashtags.length; n++){
    //   this.tagTopic[i].push(this.subData.statuses[i].entities.hashtags[n].text);
    // }
    // this.ups[i] = this.subData.statuses[i].data.ups;
    // this.downs[i] = this.subData.statuses[i].data.downs;
    this.score[i] = this.subData.statuses[i].favorite_count;
    this.numComments[i] = this.subData.statuses[i].retweet_count;
    // this.nsfw[i] = this.subData.statuses[i].data.over_18;
    this.urlTopic[i] = this.subData.statuses[i].entities.urls[0].url;
    this.timeOfCreation[i] = this.subData.statuses[i].created_at;
    this.textTopic[i] = this.subData.statuses[i].text;
    // this.crosspostable[i] = this.subData.statuses[i].data.is_crosspostable;
    // this.numCrossposts[i] = this.subData.statuses[i].data.num_crossposts;
    // this.tagClassAuthor[i] = this.subData.statuses[i].data.author_flair_css_class;
    // this.tagAuthor[i] = this.subData.statuses[i].data.author_flair_text;
  }
}
