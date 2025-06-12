const axios = require('axios');

const ressources = [
   
    {
        nom_ressource: "Amphi 1",
        type_ressource: "salle",
        code_ressource: "16",
        details_ressource: "info"
    },
    {
        nom_ressource: "Amphi 2",
        type_ressource: "salle",
        code_ressource: "17",
        details_ressource: "info"
    },
    {
        nom_ressource: "H20",
        type_ressource: "salle",
        code_ressource: "114",
        details_ressource: "ds"
    },
    {
        nom_ressource: "H21",
        type_ressource: "salle",
        code_ressource: "115",
        details_ressource: "ds"
    },
    {
        nom_ressource: "S01",
        type_ressource: "salle",
        code_ressource: "118",
        details_ressource: "info"
    },
    {
        nom_ressource: "S03",
        type_ressource: "salle",
        code_ressource: "119",
        details_ressource: "info"
    },
    {
        nom_ressource: "S04",
        type_ressource: "salle",
        code_ressource: "9113",
        details_ressource: "info"
    },
    {
        nom_ressource: "S10",
        type_ressource: "salle",
        code_ressource: "127",
        details_ressource: "td"
    },
    {
        nom_ressource: "S11",
        type_ressource: "salle",
        code_ressource: "128",
        details_ressource: "td"
    },
    {
        nom_ressource: "S12",
        type_ressource: "salle",
        code_ressource: "129",
        details_ressource: "td"
    },
    {
        nom_ressource: "S13",
        type_ressource: "salle",
        code_ressource: "120",
        details_ressource: "info"
    },
    {
        nom_ressource: "S14",
        type_ressource: "salle",
        code_ressource: "121",
        details_ressource: "info"
    },
    {
        nom_ressource: "S15",
        type_ressource: "salle",
        code_ressource: "130",
        details_ressource: "td"
    },
    {
        nom_ressource: "S16",
        type_ressource: "salle",
        code_ressource: "122",
        details_ressource: "info"
    },
    {
        nom_ressource: "S17",
        type_ressource: "salle",
        code_ressource: "123",
        details_ressource: "info"
    },
    {
        nom_ressource: "S18",
        type_ressource: "salle",
        code_ressource: "126",
        details_ressource: "td"
    },
    {
        nom_ressource: "S21",
        type_ressource: "salle",
        code_ressource: "134",
        details_ressource: "info"
    },
    {
        nom_ressource: "S22",
        type_ressource: "salle",
        code_ressource: "135",
        details_ressource: "info"
    },
    {
        nom_ressource: "S23",
        type_ressource: "salle",
        code_ressource: "132",
        details_ressource: "info"
    },
    {
        nom_ressource: "S24",
        type_ressource: "salle",
        code_ressource: "136",
        details_ressource: "info"
    },
    {
        nom_ressource: "S25",
        type_ressource: "salle",
        code_ressource: "131",
        details_ressource: "ds"
    },
    {
        nom_ressource: "S26",
        type_ressource: "salle",
        code_ressource: "133",
        details_ressource: "info"
    },
    {
        nom_ressource: "S27",
        type_ressource: "salle",
        code_ressource: "9188",
        details_ressource: "info"
    },

    {
        nom_ressource: "40",
        type_ressource: "salle",
        code_ressource: "344",
        details_ressource: "td"
    },
    {
        nom_ressource: "nicolas.adellan",
        type_ressource: "enseignant",
        code_ressource: "7569",
        details_ressource: ""
    },
    {
        nom_ressource: "osman.aidel",
        type_ressource: "enseignant",
        code_ressource: "5931",
        details_ressource: ""
    },
    {
        nom_ressource: "aba.ait",
        type_ressource: "enseignant",
        code_ressource: "75768",
        details_ressource: ""
    },
    {
        nom_ressource: "jahson.babel",
        type_ressource: "enseignant",
        code_ressource: "62522",
        details_ressource: ""
    },
    {
        nom_ressource: "thierno.balde",
        type_ressource: "enseignant",
        code_ressource: "6185",
        details_ressource: ""
    },
    {
        nom_ressource: "ariane.baron",
        type_ressource: "enseignant",
        code_ressource: "5794",
        details_ressource: ""
    },
    {
        nom_ressource: "clement.battard",
        type_ressource: "enseignant",
        code_ressource: "20838",
        details_ressource: ""
    },
    {
        nom_ressource: "mohammed.belkhatir",
        type_ressource: "enseignant",
        code_ressource: "21122",
        details_ressource: ""
    },
    {
        nom_ressource: "amira.ben-hadid",
        type_ressource: "enseignant",
        code_ressource: "5922",
        details_ressource: ""
    },
    {
        nom_ressource: "djamal.benslimane",
        type_ressource: "enseignant",
        code_ressource: "2911",
        details_ressource: ""
    },
    {
        nom_ressource: "auday.berro",
        type_ressource: "enseignant",
        code_ressource: "1667",
        details_ressource: ""
    },
    {
        nom_ressource: "mariette.bessac",
        type_ressource: "enseignant",
        code_ressource: "16076",
        details_ressource: ""
    },
    {
        nom_ressource: "rafaele.bondaz",
        type_ressource: "enseignant",
        code_ressource: "6972",
        details_ressource: ""
    },
    {
        nom_ressource: "celine.bonnefoy",
        type_ressource: "enseignant",
        code_ressource: "19917",
        details_ressource: ""
    },
    {
        nom_ressource: "faycal.braiki",
        type_ressource: "enseignant",
        code_ressource: "6913",
        details_ressource: ""
    },
    {
        nom_ressource: "anthony.busson",
        type_ressource: "enseignant",
        code_ressource: "23073",
        details_ressource: ""
    },
    {
        nom_ressource: "yves.caniou",
        type_ressource: "enseignant",
        code_ressource: "27062",
        details_ressource: ""
    },
    {
        nom_ressource: "florence.canque",
        type_ressource: "enseignant",
        code_ressource: "7096",
        details_ressource: ""
    },
    {
        nom_ressource: "olivier.cellier",
        type_ressource: "enseignant",
        code_ressource: "9674",
        details_ressource: ""
    },
    {
        nom_ressource: "adrien.chambade",
        type_ressource: "enseignant",
        code_ressource: "20377",
        details_ressource: ""
    },
    {
        nom_ressource: "carlos.chastagnier",
        type_ressource: "enseignant",
        code_ressource: "2316",
        details_ressource: ""
    },
    {
        nom_ressource: "karim.chekari",
        type_ressource: "enseignant",
        code_ressource: "17655",
        details_ressource: ""
    },
    {
        nom_ressource: "jocelyne.deboute",
        type_ressource: "enseignant",
        code_ressource: "13619",
        details_ressource: ""
    },
    {
        nom_ressource: "eric.duchene",
        type_ressource: "enseignant",
        code_ressource: "3374",
        details_ressource: ""
    },
    {
        nom_ressource: "karline.dufour",
        type_ressource: "enseignant",
        code_ressource: "26334",
        details_ressource: ""
    },
    {
        nom_ressource: "noura.faci",
        type_ressource: "enseignant",
        code_ressource: "8457",
        details_ressource: ""
    },
    {
        nom_ressource: "guewen.faivre",
        type_ressource: "enseignant",
        code_ressource: "12640",
        details_ressource: ""
    },
    {
        nom_ressource: "lucas.foulon",
        type_ressource: "enseignant",
        code_ressource: "62556",
        details_ressource: ""
    },
    {
        nom_ressource: "nicolas.germinagni",
        type_ressource: "enseignant",
        code_ressource: "19783",
        details_ressource: ""
    },
    {
        nom_ressource: "theo.gianella",
        type_ressource: "enseignant",
        code_ressource: "4561",
        details_ressource: ""
    },
    {
        nom_ressource: "isabelle.goncalves",
        type_ressource: "enseignant",
        code_ressource: "2813",
        details_ressource: ""
    },
    {
        nom_ressource: "patrick.jalaguier",
        type_ressource: "enseignant",
        code_ressource: "4423",
        details_ressource: ""
    },
    {
        nom_ressource: "christophe.jaloux",
        type_ressource: "enseignant",
        code_ressource: "25677",
        details_ressource: ""
    },
    {
        nom_ressource: "aude.joubert",
        type_ressource: "enseignant",
        code_ressource: "18821",
        details_ressource: ""
    },
    {
        nom_ressource: "hamamache.kheddouci",
        type_ressource: "enseignant",
        code_ressource: "6130",
        details_ressource: ""
    },
    {
        nom_ressource: "alexandra.lagache",
        type_ressource: "enseignant",
        code_ressource: "21055",
        details_ressource: ""
    },
    {
        nom_ressource: "clement.lefaure",
        type_ressource: "enseignant",
        code_ressource: "5877",
        details_ressource: ""
    },
    {
        nom_ressource: "stephane.leroux",
        type_ressource: "enseignant",
        code_ressource: "5674",
        details_ressource: ""
    }, {
        nom_ressource: "timothee.marchand",
        type_ressource: "enseignant",
        code_ressource: "27029",
        details_ressource: ""
    },
    {
        nom_ressource: "olivier.mbarek",
        type_ressource: "enseignant",
        code_ressource: "26612",
        details_ressource: ""
    },
    {
        nom_ressource: "xavier.merrheim",
        type_ressource: "enseignant",
        code_ressource: "6806",
        details_ressource: ""
    },
    {
        nom_ressource: "cyprien.moll",
        type_ressource: "enseignant",
        code_ressource: "96510",
        details_ressource: ""
    },
    {
        nom_ressource: "martin.mommey",
        type_ressource: "enseignant",
        code_ressource: "16847",
        details_ressource: ""
    },
    {
        nom_ressource: "samba.ndiaye",
        type_ressource: "enseignant",
        code_ressource: "12101",
        details_ressource: ""
    },
    {
        nom_ressource: "aurelie.olivesi",
        type_ressource: "enseignant",
        code_ressource: "2297",
        details_ressource: ""
    },
    {
        nom_ressource: "aline.parreau",
        type_ressource: "enseignant",
        code_ressource: "26422",
        details_ressource: ""
    },
    {
        nom_ressource: "philippe.pernelle",
        type_ressource: "enseignant",
        code_ressource: "18049",
        details_ressource: ""
    },
    {
        nom_ressource: "yoann.perret",
        type_ressource: "enseignant",
        code_ressource: "4425",
        details_ressource: ""
    },
    {
        nom_ressource: "adrien.peytavie",
        type_ressource: "enseignant",
        code_ressource: "18072",
        details_ressource: ""
    },
    {
        nom_ressource: "theo.rabut",
        type_ressource: "enseignant",
        code_ressource: "4477",
        details_ressource: ""
    },
    {
        nom_ressource: "julien.roux-dit-roche",
        type_ressource: "enseignant",
        code_ressource: "22458",
        details_ressource: ""
    },
    {
        nom_ressource: "lynda.saoudi",
        type_ressource: "enseignant",
        code_ressource: "28207",
        details_ressource: ""
    },
    {
        nom_ressource: "camille.schneider",
        type_ressource: "enseignant",
        code_ressource: "96165",
        details_ressource: ""
    },
    {
        nom_ressource: "nassim.tabchiche",
        type_ressource: "enseignant",
        code_ressource: "84306",
        details_ressource: ""
    },
    {
        nom_ressource: "loic.tortay",
        type_ressource: "enseignant",
        code_ressource: "15558",
        details_ressource: ""
    },
    {
        nom_ressource: "vincent.vidal",
        type_ressource: "enseignant",
        code_ressource: "15752",
        details_ressource: ""
    },
    {
        nom_ressource: "remi.watrigant",
        type_ressource: "enseignant",
        code_ressource: "1035",
        details_ressource: ""
    },
    {
        nom_ressource: "nadia.yacoubi-ayadi",
        type_ressource: "enseignant",
        code_ressource: "61793",
        details_ressource: ""
    },
    {
        nom_ressource: "G1S1A",
        type_ressource: "groupe",
        code_ressource: "12096",
        details_ressource: ""
    },
    {
        nom_ressource: "G1S1B",
        type_ressource: "groupe",
        code_ressource: "12102",
        details_ressource: ""
    },
    {
        nom_ressource: "G2S1A",
        type_ressource: "groupe",
        code_ressource: "12403",
        details_ressource: ""
    },
    {
        nom_ressource: "G2S1B",
        type_ressource: "groupe",
        code_ressource: "12406",
        details_ressource: ""
    },
    {
        nom_ressource: "G3S1A",
        type_ressource: "groupe",
        code_ressource: "12419",
        details_ressource: ""
    },
    {
        nom_ressource: "G3S1B",
        type_ressource: "groupe",
        code_ressource: "12425",
        details_ressource: ""
    },
    {
        nom_ressource: "G4S1A",
        type_ressource: "groupe",
        code_ressource: "12424",
        details_ressource: ""
    },
    {
        nom_ressource: "G4S1B",
        type_ressource: "groupe",
        code_ressource: "12444",
        details_ressource: ""
    },
    {
        nom_ressource: "G5S1A",
        type_ressource: "groupe",
        code_ressource: "12460",
        details_ressource: ""
    },
    {
        nom_ressource: "G5S1B",
        type_ressource: "groupe",
        code_ressource: "12461",
        details_ressource: ""
    },
    {
        nom_ressource: "G1S2A",
        type_ressource: "groupe",
        code_ressource: "51542",
        details_ressource: ""
    },
    {
        nom_ressource: "G1S2B",
        type_ressource: "groupe",
        code_ressource: "51543",
        details_ressource: ""
    },
    {
        nom_ressource: "G2S2A",
        type_ressource: "groupe",
        code_ressource: "51545",
        details_ressource: ""
    },
    {
        nom_ressource: "G2S2B",
        type_ressource: "groupe",
        code_ressource: "51546",
        details_ressource: ""
    },
    {
        nom_ressource: "G3S2A",
        type_ressource: "groupe",
        code_ressource: "51548",
        details_ressource: ""
    },
    {
        nom_ressource: "G3S2B",
        type_ressource: "groupe",
        code_ressource: "51549",
        details_ressource: ""
    },
    {
        nom_ressource: "G4S2A",
        type_ressource: "groupe",
        code_ressource: "51551",
        details_ressource: ""
    },
    {
        nom_ressource: "G4S2B",
        type_ressource: "groupe",
        code_ressource: "51552",
        details_ressource: ""
    },
    {
        nom_ressource: "G5S2A",
        type_ressource: "groupe",
        code_ressource: "51554",
        details_ressource: ""
    },
    {
        nom_ressource: "G5S2B",
        type_ressource: "groupe",
        code_ressource: "51555",
        details_ressource: ""
    },
    {
        nom_ressource: "G1S3A",
        type_ressource: "groupe",
        code_ressource: "35708",
        details_ressource: ""
    },
    {
        nom_ressource: "G1S3B",
        type_ressource: "groupe",
        code_ressource: "35709",
        details_ressource: ""
    },
    {
        nom_ressource: "G1S4A",
        type_ressource: "groupe",
        code_ressource: "85875",
        details_ressource: ""
    },
    {
        nom_ressource: "G1S4B",
        type_ressource: "groupe",
        code_ressource: "85876",
        details_ressource: ""
    },
    {
        nom_ressource: "G2S3A",
        type_ressource: "groupe",
        code_ressource: "35710",
        details_ressource: ""
    },
    {
        nom_ressource: "G2S3B",
        type_ressource: "groupe",
        code_ressource: "35713",
        details_ressource: ""
    },
    {
        nom_ressource: "G2S4A",
        type_ressource: "groupe",
        code_ressource: "85873",
        details_ressource: ""
    },
    {
        nom_ressource: "G2S4B",
        type_ressource: "groupe",
        code_ressource: "85874",
        details_ressource: ""
    },
    {
        nom_ressource: "G3S3S4",
        type_ressource: "groupe",
        code_ressource: "35714",
        details_ressource: ""
    },
    {
        nom_ressource: "G4S3A",
        type_ressource: "groupe",
        code_ressource: "35717",
        details_ressource: ""
    },
    {
        nom_ressource: "G4S3B",
        type_ressource: "groupe",
        code_ressource: "35718",
        details_ressource: ""
    },
    {
        nom_ressource: "G4S4A",
        type_ressource: "groupe",
        code_ressource: "85877",
        details_ressource: ""
    },
    {
        nom_ressource: "G4S4B",
        type_ressource: "groupe",
        code_ressource: "85878",
        details_ressource: ""
    },
    {
        nom_ressource: "ASPE_A",
        type_ressource: "groupe",
        code_ressource: "9272",
        details_ressource: ""
    },
    {
        nom_ressource: "ASPE_B",
        type_ressource: "groupe",
        code_ressource: "18783",
        details_ressource: ""
    },
    {
        nom_ressource: "BUT3 AGED",
        type_ressource: "groupe",
        code_ressource: "6048",
        details_ressource: ""
    },
    {
        nom_ressource: "BUT3 DACS",
        type_ressource: "groupe",
        code_ressource: "6136",
        details_ressource: ""
    },
    {
        nom_ressource: "BUT3 RA1A",
        type_ressource: "groupe",
        code_ressource: "6161",
        details_ressource: ""
    },
    {
        nom_ressource: "BUT3 RA1B",
        type_ressource: "groupe",
        code_ressource: "6163",
        details_ressource: ""
    },
    {
        nom_ressource: "BUT3 RA2A",
        type_ressource: "groupe",
        code_ressource: "6165",
        details_ressource: ""
    },
    {
        nom_ressource: "BUT3 RA2B",
        type_ressource: "groupe",
        code_ressource: "6168",
        details_ressource: ""
    },
    {
        nom_ressource: "BUT3 RA3A",
        type_ressource: "groupe",
        code_ressource: "14059",
        details_ressource: ""
    },
    {
        nom_ressource: "BUT3 RA3B",
        type_ressource: "groupe",
        code_ressource: "14064",
        details_ressource: ""
    },
    {
        nom_ressource: "macky.tall",
        type_ressource: "admin",
        code_ressource: "00",
        details_ressource: ""
      }
];

const API_URL = 'http://localhost:3000/api/ressources';

async function seedRessources() {
  for (const ressource of ressources) {
    try {
      const res = await axios.post(API_URL, ressource);
      console.log(` Reesource ${ressource.nom_ressource} ajouté :`, res.data);
    } catch (err) {
      console.error(`Erreur pour ${ressource.nom_ressource} :`, err.response?.data || err.message);
    }
  }
}

seedRessources();
