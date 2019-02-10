//var num_utenti = numRandom(10000);
var num_utenti = 20000;
var num_likes = [];
var num_commenti = [];
var mapped_likes = [];
var mapped_comments = [];
var punti = [];
var limite = 0.15;


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
    c = (c - c_min) / (c_max - c_min) * (0.999 - 0.9) + 0.9;
    l = (l - l_min) / (l_max - l_min) * (1 - 0.2) + 0.2;
    // console.log(c);
    mapped_comments.push(c);
    mapped_likes.push(l);
    var c;
    var l;
  }
  console.log(mapped_comments);
  console.log(mapped_likes);
}

for (n = 0; n <= 25; n++){
  var likes = Math.random();
  var commenti = Math.random();
  num_likes.push(likes);
  num_commenti.push(commenti);
}

 mapping();

function numRandom(n) {
  return Math.floor(Math.random() * Math.floor(n));
}

// VISUALIZZAZIONE GRAFICO

var svg = d3.select("svg"),
  celle = svg.append('g').attr('class', 'celle'),
  cerchio = svg.append('g').attr('class', 'cerchio'),
  costa = svg.append('g').attr('class', 'costa'),
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
      sharpness = Math.random();
      coda = [], // poligoni da controllare
      used = []; // poligoni usati
  if (altezza <= 0.25){
    altezza = 0.25;
  }
  polygons[partenza].altezza += altezza;
  coda.push(partenza);
  used.push(partenza);
  for (i = 0; i < coda.length && altezza > 0.01; i++){
    altezza *= estensione;
    polygons[coda[i]].vicini.forEach(function(e){
      if(used.indexOf(e) < 0){
        var mod = Math.random() * sharpness + 1.1-sharpness;
        if (sharpness == 0 || sharpness > 0.5){
          mod = 1;
        }
        polygons[e].altezza += altezza * mod;
        if (polygons[e].altezza > 1){
          polygons[e].altezza = 1;
        }
        // if (polygons[e].altezza < 0.17){
        //   polygons[e].altezza = 0.17;
        // }
        coda.push(e);
        used.push(e);
      }
    });
  }
}

function heightmap(){
  //creo un'unica isola
  for (n = 0; n < num_commenti.length; n++){
    //l'argomento con maggior estensione al centro
    if(num_commenti[n] == c_max) {
      var punto = [width/2, height/2];
      punti.push(punto);
      //trova l'index della cella corrispondente alle coordinate del punto
      var x_y = diagram.find(punto[0], punto[1]).index;
      cerchio.append('circle')
        .attr('r', 2)
        .attr('cx', punto[0])
        .attr('cy', punto[1])
        //.attr('stroke-width', 1)
        //.attr('stroke', 'white')
        .attr('fill', 'black');
      crea_isola(n, x_y);
    }else{ //resto degli argomenti
      var punto = [Math.random() * width, Math.random() * height];
      if (punto[0] > width * 0.20 &&
          punto[0] < width * 0.80 &&
          punto[1] > height * 0.20 &&
          punto[1] < height * 0.80){
        punti.push(punto);
        //trova l'index della cella corrispondente alle coordinate del punto
        var x_y = diagram.find(punto[0], punto[1]).index;
        cerchio.append('circle')
          .attr('r', 2)
          .attr('cx', punto[0])
          .attr('cy', punto[1])
          //.attr('stroke-width', 1)
          //.attr('stroke', 'white')
          .attr('fill', 'black');
        crea_isola(n, x_y);
      }else{
        n = n-1;
      }
    }
  }
  disegna_poligoni();
  disegna_costa();
}

function disegna_strada(){

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
