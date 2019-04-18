// Irene Trotta @iretrtr © 2018 MIT License
// Digital cartography and ethnographic survey of online communities
// online-community-maps 2 | voronoi | Città San't Angelo, IT | 12.2018
// Educational purpose, master graduation project prototype
//
// what if online communities could be real places? how would their map be?
// prototype > create a map from/with subreddit community data

var num_utenti = numRandom(10000);
var num_likes = [];
var num_commenti = [];
var mapped_likes = [];
var mapped_comments = [];
var max;

// CONTI PER I DATI

function num_commenti_min(){
  min = num_commenti[0];
  for(i = 0; i < num_commenti.length; i++){
    if(num_commenti[i] < min){
      min = num_commenti[i];
    } else {
      min = min;
    }
  }
  return min;
}

function num_commenti_max(){
  max = num_commenti[0];
  for(i = 0; i < num_commenti.length; i++){
    if(num_commenti[i] > max){
      max = num_commenti[i];
    } else {
      max = max;
    }
  }
  return max;
}

function mapping(){
  var c;
  max = num_commenti_max();
  min = num_commenti_min();
  // console.log('val massimo: ' + max);
  // console.log('val minimo: ' + min);
  for (i = 0; i < num_commenti.length; i++){
    c = num_commenti[i];
    // console.log(c);
    c = (c - min) / (max - min) * (1 - 0) + 0;
    // console.log(c);
    mapped_comments.push(c)
    var c;
  }
  console.log(mapped_comments);
}

for (n=0; n<=25; n++){
  var likes = Math.random();
  var commenti = Math.random();
  num_likes.push(likes);
  num_commenti.push(commenti);
}

// mapping();

function numRandom(n) {
  return Math.floor(Math.random() * Math.floor(n));
}

// VISUALIZZAZIONE GRAFICO

d3.select('.celle').remove();
var svg = d3.select("svg"),
  celle = svg.append('g').attr('class', 'celle')
  width = +svg.attr("width"),
  height = +svg.attr("height"),
  sites = d3.range(num_utenti)
    .map(function(d) {
      return [Math.random() * width, Math.random() * height];
    }),
  voronoi = d3.voronoi()
    .extent([[0, 0],[width, height]]),
  relaxedSites = voronoi(sites).polygons().map(d3.polygonCentroid),
  diagram = voronoi(relaxedSites),
  polygons = diagram.polygons(),
  color = d3.scaleSequential(d3.interpolateSpectral), //sfumatura colore - funziona su una scala da [0,1]
  coda = [];

trova_celle_vicine();
heightmap();

function trova_celle_vicine() {
  // push l'index delle celle vicine in ogni elemento polygon
  polygons.map(function(i, d) {
    i.index = d; //indice di quell'elemento
    i.high = 0;
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
    svg.append("path")
      .attr("d", "M" + i.join("L") + "Z")
      .attr('id', d)
      .attr('class', 'mapCell')
      .attr('fill', color(1-i.high));
  });
}

function heightmap(){
  //creo un "monte" per ogni "post"
  for (n = 0; n < num_likes.length; n++){
    var punto = [(width/4) +n*20, (height/4)+n*20];
    //trova l'index della cella corrispondente alle coordinate del punto
    var partenza = diagram.find(punto[0], punto[1]).index,
      altezza = num_likes[n],
      estensione = num_commenti[n],
      sharpness = 0.2,
      coda = []; // poligoni da controllare
      used = []; // poligoni usati
    polygons[partenza].high += altezza;
    polygons[partenza].used = 1;
    coda.push(partenza);
    used.push(partenza);
    for (i = 0; i < coda.length && altezza > 0.01; i++){
      altezza *= estensione;
      polygons[coda[i]].vicini.forEach(function(e){
        if(used.indexOf(e) < 0){
          var mod = Math.random() * sharpness + 1.1 - sharpness;
          if (sharpness == 0){
            mod = 1;
          }
          polygons[e].high += altezza * mod;
          if (polygons[e].height > 1){
            polygons[e].height = 1;
          }
          coda.push(e);
          used.push(e);
        }
      });
      //ricolora i poligoni utilizzati
      var limite = 0.2;
      polygons.map(function(i) {
        $("#" + i.index)
        .attr("fill", color(1-i.high));
        i.used = undefined; // rimuovi l'attr "used"
      });
    }
  }
}
