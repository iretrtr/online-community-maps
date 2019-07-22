**online-community-maps:** Digital cartography and ethnographic survey of online communities.
## Cartografia digitale e indagine etnografica di comunità online.<br>Metodi, approcci e prototipi.
(Università degli Studi della Repubblica di San Marino / Corso di Laurea Magistrale in Design / A.A. 2017 - 2018 / Laureanda: Irene Trotta / Relatore: Daniele Tabellini)

**[launch / open](https://iretrtr.github.io/uncharted_community_map_generator/)** (latest prototype)

*Cartografia digitale e indagine etnografica di comunità online: metodi, approcci e prototipi* esplora il campo della cartografia legata alle online community.

L’idea di delineare mappe di comunità online basate sui dati generati dalle comunità stesse nasce dal desiderio di raccontare i luoghi di aggregazione sul web come luoghi a tutti gli effetti assegnando loro un territorio che si forma ed evolve grazie alle interazioni tra utenti. Per elaborare uno strumento capace di generare cartografie di luoghi non concreti sono state esplorate e approfondite due aree di studio principali: una legata alla cartografia, alla sua storia, ai suoi metodi e alle mappe “fantastiche” prodotte per scopi narrativi o utilizzate per la comunicazione di idee, concetti e credenze; l’altra che si focalizza sulle comunità e sul modo in cui il senso di comunità è cambiato con l’evoluzione tecnologica e la nascita di strumenti, come il web, che permettono di accorciare le distanze fino ad annullarle completamente, creando nuovi luoghi virtuali di aggregazione considerati, da chi li frequenta, totalmente reali.

![mappa della comuunity DnD su Reddit](https://i.imgur.com/VVODlAf.png)
> Mappa della community DnD su Reddit sulla base dei dati raccolti in data 25/02/2019

Visualizzare le community online non è semplice, forse perché sono caratterizzate da una combinazione di fattori materiali e concettuali, non le si può ridurre ad una semplice rete di scambi o ad un accumulo di like e commenti; il loro grado di complessità è ben più elevato, ritengo che possano essere considerate città, città con i propri abitanti (users) che intrattengono scambi e relazioni, con visitatori che vanno e vengono (guests e lurkers), città che crescono rapidamente o in modo lento, che mutano, correndo il pericolo di diventare città fantasma, a volte inaccessibili ma sempre immortali. Cartografare significa visualizzare informazioni geografiche, statistiche, demografiche, economiche, politiche, culturali di un dato luogo, informazioni non solo legate alla fisicità del luogo ma anche alla comunità che lo abita; da qui la scelta di utilizzare il linguaggio cartografico come “traduzione visiva” delle online community.

![evoluzione del prototipo](https://i.imgur.com/PdwSlpH.png)
> Il prototipo per la visualizzazione è scritto in d3.js, utilizza una griglia di Voronoi come base per la suddivisione dello spazio bidimensionale, su di essa viene costruita l'isola assegnando a ogni poligono un'altezza specifica (dipendente dai dati raccolti riguardo alla comunità es. le altezze del territorio possono essere associate a dati numerici quali numero di like o di commenti) e generando così una heightmap. Successivamente vengono visualizzate le città (una per ogni record in tabella dati), create strade (in relazione ad associazione di contenuti con tematiche affini) e regioni. Reddit è la piattaforma scelta per la prototipazione e da cui sono state identificate le comunità e raccolti i dati necessari alla costruzione del territorio.

L’idea di realizzare un tool capace di generare terre, isole, mappe verosimili basate su dati prodotti dagli utenti appartenenti a una determinata comunità online, è frutto della curiosità di concretizzare visivamente quei luoghi di condivisione e scambio che si trovano, allo stesso tempo, ovunque e in nessuno luogo. La mappa di una comunità online non è solo la rappresentazione della comunità stessa, ma anche sua metafora: ogni comunità online è un insediamento frutto degli interessi e degli scambi tra utenti.

La ricerca e gli esperimenti di prototipazione hanno portato a riflettere sui molteplici campi di indagine che la progettazione di uno strumento per la generazione di mappe e terre frutto dei dati di comunità online, apre.

![prototipo numero 09](https://i.imgur.com/zUoec3v.png)
![prototipo numero 04](https://i.imgur.com/xqdMsXS.png)
> Immagini di prototipo.
___

*Displaying online communities is not easy. Maybe it's not easy because online communities are a mix of both material and conceptual elements, they can't be considered just as a simple exchange network or as an accumulation of likes and comments; they're much more complex. I think that online communities can be considered cities, cities with people (users) who entertain exchanges and relationships, cities with tourists (guests and lurkers), cities that can grow quickly or in a slower way, dynamic cities that constantly change with fear of becoming, someday, ghost cities maybe inaccessible but always immortal. Mapping means to display geographical, statistical, demographic, economic, political and cultural information of a given place; all these informations are not only linked to the physicality of the place, but also to the community that lives in it; hence the choice to use cartographic language as a "visual translation" of online communities.*

*The idea is to design a tool that can generate lands, islands, even a whole world; a tool able to create plausible and realistic looking maps based on data produced by a given online community to visually display those places that are anywhere and nowhere at the same time. The map of an online community is not only the representation of the community itself, but also its metaphor: every online community is a settlement that is the result of interests and exchanges between users.*
