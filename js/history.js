
var continents = []

// Ranges
var continentRange = [3, 3],
    nationRange = [3, 5],
    settlementsRange = [1, 3],
    settlementPopulationRange = [20, 10000];

var governments = ["Unitary State", "Federation", "Confederation", "Direct Democracy", "Liberal Democracy", "Social Democracy", "Representative Democracy", "Totalitarian Democracy", "Demarchy", "Aristocracy", "Plutocracy", "Kraterocracy", "Stratocracy", "Timocracy", "Meritocracy", "Technocracy", "Geniocracy", "Noocracy", "Theocracy", "Kritarchy", "Particracy", "Ergatocracy", "Netocracy", "Civilian Dictatorship", "Military Dictatorship", "Bankocracy", "Corporatocracy", "Nepotocracy", "Kleptocracy", "Ochlocracy", "Anocracy", "Adhocracy", "Bureaucracy", "Cybersynacy", "Nomocracy", "Band Society", "Absolute Monarchy", "Constitutional Monarchy", "Crowned Republic", "Constitutional Republic", "Democratic Republic", "Parliamentary Republic", "Presidential Republic", "Federal Republic", "People's Republic", "Tribalism", "Despotism", "Feudalism", "Colonialism", "Capitalism", "Minarchism", "Distributism", "Socialism", "Communism", "Totalitarianism", "Matriarchy", "Empire", "Vassal State", "Puppet State", "Protectorate", "Colony", "Corporate Republic", "Magocracy", "Uniocracy"]
var races = ["Human", "Wood Elf", "High Elf", "Hill Dwarf", "Mountain Dwarf", "Halfling", "Dragonborn", "Forest Gnome", "Rock Gnome", "Firbolg", "Kenku", "Goliath", "Tabaxi"]
var monsterRaces = ["Orc", "Goblin", "Hobgoblin", "Lizardfolk", "Gnoll", "Giant", "Drow", "Duergar"]

var currentYear = 0;
var endYear = 1000;
var yearIncrement = 200;


/*
 * Get random number between a and b
 * TODO - right now: if a = b, then always returns a
 */
function getRandom (a, b) {
    if (a > b) {
        return Math.floor(Math.random() * (a - b + 1) + b);
    } else {
        return Math.floor(Math.random() * (b - a + 1) + a);
    }
}

/*
 * Convert str to title case. i.e. united states -> United States
 */ 
function titleCase(str) {
    return str.toLowerCase().split(' ').map(function(word) {
        return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
}

// Random words used to create nation names
var adjectives = ["adamant", "adroit", "amatory", "animistic", "antic", "arcadian", "baleful", "bellicose", "bilious", "boorish", "calamitous", "caustic", "cerulean", "comely", "concomitant", "contumacious", "corpulent", "crapulous", "defamatory", "didactic", "dilatory", "dowdy", "efficacious", "effulgent", "egregious", "endemic", "equanimous", "execrable", "fastidious", "feckless", "fecund", "friable", "fulsome", "garrulous", "guileless", "gustatory", "heuristic", "histrionic", "hubristic", "incendiary", "insidious", "insolent", "intransigent", "inveterate", "invidious", "irksome", "jejune", "jocular", "judicious", "lachrymose", "limpid", "loquacious", "luminous", "mannered", "mendacious", "meretricious", "minatory", "mordant", "munificent", "nefarious", "noxious", "obtuse", "parsimonious", "pendulous", "pernicious", "pervasive", "petulant", "platitudinous", "precipitate", "propitious", "puckish", "querulous", "quiescent", "rebarbative", "recalcitant", "redolent", "rhadamanthine", "risible", "ruminative", "sagacious", "salubrious", "sartorial", "sclerotic", "serpentine", "spasmodic", "strident", "taciturn", "tenacious", "tremulous", "trenchant", "turbulent", "turgid", "ubiquitous", "uxorious", "verdant", "voluble", "voracious", "wheedling", "withering", "zealous"]
var nouns = ["ninja", "chair", "pancake", "statue", "unicorn", "rainbows", "laser", "senor", "bunny", "captain", "nibblets", "cupcake", "carrot", "gnomes", "glitter", "potato", "salad", "toejam", "curtains", "beets", "toilet", "exorcism", "stick figures", "mermaid eggs", "sea barnacles", "dragons", "jellybeans", "snakes", "dolls", "bushes", "cookies", "apples", "ice cream", "ukulele", "kazoo", "banjo", "opera singer", "circus", "trampoline", "carousel", "carnival", "locomotive", "hot air balloon", "praying mantis", "animator", "artisan", "artist", "colorist", "inker", "coppersmith", "director", "designer", "flatter", "stylist", "leadman", "limner", "make-up artist", "model", "musician", "penciller", "producer", "scenographer", "set decorator", "silversmith", "teacher", "auto mechanic", "beader", "bobbin boy", "clerk of the chapel", "filling station attendant", "foreman", "maintenance engineering", "mechanic", "miller", "moldmaker", "panel beater", "patternmaker", "plant operator", "plumber", "sawfiler", "shop foreman", "soaper", "stationary engineer", "wheelwright", "woodworkers"]

/*
 * Get random element from input list
 */ 
function randomEl (list) {
    var i = Math.floor(Math.random() * list.length);
    return list[i];
}

/*
 * Create a fake name with an adjective + a noun
 */ 
function getName () {
    return titleCase(randomEl(adjectives) + ' ' + randomEl(nouns))
}

function getContinentName() {
    return getName()
}

function getNationName() {
    return getName()
}

function getSettlementName() {
    return getName()
}

function Continent () {
    this.name = getContinentName()
    this.nations = []
}

function Nation (race, year, c, g) {
    this.name = getNationName()
    this.government = g
    this.race = race
    this.population = 0
    this.continent = c
    this.founded = year
    this.settlements = []
    // functions
}

/*
    Create a settlement with the given input population

    Fortress            20 - 80         100
    Citadel             81 - 400        200
    Village            401 - 900        800
    Small Town         901 - 2,000      3,000
    Large Town       2,001 - 5,000      15,000
    Small City       5,001 - 12,000     40,000
    Large City      12,001 - 25,000     100,000
    Metropolis      25,001 or more      150,000
*/
function Settlement ( pop, idx ) {
    this.name = getSettlementName();
    this.index = idx;
    this.population = pop;
    if (pop < 80) {
        this.type = "Outpost"
    } else if (pop < 900) {
        this.type = "Village"
    } else if (pop < 2000) {
        this.type = "Small Town"
    } else if (pop < 5000) {
        this.type = "Large Town"
    } else if (pop < 12000) {
        this.type = "Small City"
    } else if (pop < 25000) {
        this.type = "Large City"
    } else if (pop < 40000) {
        this.type = "Metropolis"
    }
}

function getLowLean(min, max, bias) {
    var rand = Math.floor( Math.random() * (max - min + 1)) + min;
    var mix = Math.random() * 0.7;
    var value = rand * (1 * mix) + bias * mix;
    return Math.floor(value);
}


$(document).ready(function () {
    races = races.concat(monsterRaces);

    // ------
    // Create the continents, nations, and settlements
    // ------
    
    var numContinents = getRandom(continentRange[0], continentRange[1]);

    for (var i = 0; i < numContinents; i++) {
        var c = new Continent()
        continents.push(c)
    }
    
    var settlementIdx = 0;
    // for each continent create nations
    for (var i = 0; i < continents.length; i++) {
        // create nations within each continent
        var numNations = getRandom(nationRange[0], nationRange[1])
        for (var j = 0; j < numNations; j++) {
            var n = new Nation(races[getRandom(0, races.length - 1)], currentYear, continents[i].name, governments[getRandom(0, governments.length-1)])

            // create settlements within each nation
            var numSettlements = getRandom(settlementsRange[0], settlementsRange[1])
            for (var k = 0; k < numSettlements; k++) {
                var max = settlementPopulationRange[1]
                var min = settlementPopulationRange[0]
                var pop = getLowLean(min, max, 100)
                var s = new Settlement(pop, settlementIdx);
                n.settlements.push(s);
                n.population += pop;
                settlementIdx += 1;
            }

            continents[i].nations.push(n)
        }
    }


    // ------
    // Display details about continents and nations in HTML
    // ------

    for (var i = continents.length - 1; i >= 0; i--) {
        // console.log(continents[i].name);
        // console.log("----------------------------------------------------");

        $('#planet').append(
            '<div class="col-sm-4">'
            + '<button data-toggle="collapse" href="#cont' + i + '" role="button" aria-expanded="false" aria-controls="cont' + i + '">'
                + continents[i].name 
            + '</button>'
            + '<div class="continent collapse mt-1" id="cont' + i + '"></div>'
            + '</div>'
        );     
        
        for (var j = 0; j < continents[i].nations.length; j++) {
            var nation = continents[i].nations[j]
            // console.log("    " + nation.name + " (" + nation.race + "), founded: " + nation.founded);
            // console.log("    ------------------------------------------------");
            $('#cont' + i).append('<h6 data-toggle="collapse" href="#divnat' + j + 'con' + i + '" role="button" aria-expanded="false" aria-controls="divnat' + j + 'con' + i + '">' + nation.name + ' (' + nation.race + ')</h6>'
                + '<div class="nation collapse mt-1" id="divnat' + j + 'con' + i + '">' 
                + 'Government: <a href="https://en.wikipedia.org/wiki/' + nation.government.replace(' ', '_') + '">' + nation.government + '</a><br>' 
                + 'Founded: ' + nation.founded + '<br>' 
                + 'Population: ' + nation.population + '<br>' 
                + 'Settlements:<ul id="nat' + j + 'con' + i + '"></ul></div>')

            for (var k = 0; k < nation.settlements.length; k++) {
                var settlement = nation.settlements[k]
                // console.log("        " + settlement.name + ", " + settlement.type + ": " + settlement.population)
                $('#nat' + j + 'con' + i).append('<li class="settlement">' + settlement.name + ', ' + settlement.type + ': ' + settlement.population + '</li>')
            }
        }
    }

    /*
        Future Ideas:
         * Fix founded year so it's not always 0
         * Add new fields:
            * overlords, 
            * encounters, 
            * kingdom details; 
               * population, 
               * ruler class and level, 
               * governments, 
               * guilds, 
               * armies, 
               * economies
    */

})
