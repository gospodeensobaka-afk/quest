/* ========================================================
   QUEST APP — APP.JS
   ======================================================== */

const ACCESS_PASSWORDS = ["88888888"];

const JSONBIN_ID  = "69ba4f6daa77b81da9f55118";
const JSONBIN_KEY = "$2a$10$lPoCXFWL4UcrxKEPIIww0um/CPiwfXALbgpoSVrvGdFd94qJFrk6m";
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_ID}/latest`;

const POLL_INTERVAL_MS = 2000;
const MAP_CENTER       = [49.1155, 55.7785];
const MAP_ZOOM         = 16;

/* ================================================================
   ДЕШИФРОВЩИКИ — общий список, подключаем к загадкам по ключам
   Путь: images/shifrs/
   ================================================================ */
const CIPHERS = {
    atbash:   { label: "Атбаш",            image: "images/shifrs/atbash.jpeg" },
    brail:    { label: "Брайль",            image: "images/shifrs/brail.jpeg" },
    caesar:   { label: "Цезарь",            image: "images/shifrs/caesar.jpeg" },
    engalph:  { label: "Англ. алфавит",     image: "images/shifrs/engalph.jpeg" },
    klavanouta:{ label: "Клавиатура (ПК)",  image: "images/shifrs/klavanouta.jpeg" },
    klavatelef:{ label: "Клавиатура (тел)", image: "images/shifrs/klavatelef.jpeg" },
    kvadrat:  { label: "Квадрат Полибия",   image: "images/shifrs/kvadratpolibiya.jpeg" },
    morze:    { label: "Морзе",             image: "images/shifrs/morze.jpeg" },
    pigpen:   { label: "Свиной хлев",       image: "images/shifrs/pigpen.jpeg" },
    polybiy:  { label: "Полибий",           image: "images/shifrs/polybiy.jpeg" },
    rot13:    { label: "ROT13",             image: "images/shifrs/rot13.jpeg" },
    rusalph:  { label: "Рус. алфавит",      image: "images/shifrs/rusalph.jpeg" },
    tablmend: { label: "Табл. Менделеева",  image: "images/shifrs/tablmend.jpeg" },
    all:      { label: "Все шифры",         image: "images/shifrs/all.jpeg" },
};

// Удобная функция: берём нужные ключи из CIPHERS
function C(...keys) { return keys.map(k => CIPHERS[k]); }

/* ================================================================
   ЗАГАДКИ
   Путь к картинкам: images/riddles/
   ciphers: null или [] → кнопки не показываются совсем
   ================================================================ */
const QUESTS = [
    {
        id: 1,
        riddleImage: "images/deshi/1.jpeg",
        ciphers: [
            { label: "Атбаш",             image: "images/shifrs/atbash.jpeg" },
            { label: "Брайль",            image: "images/shifrs/brail.jpeg" },
            { label: "Цезарь",            image: "images/shifrs/caesar.jpeg" },
            { label: "Англ. алфавит",     image: "images/shifrs/engalph.jpeg" },
            { label: "Клав. (ноут)",      image: "images/shifrs/klavanouta.jpeg" },
            { label: "Клав. (телефон)",   image: "images/shifrs/klavatelef.jpeg" },
            { label: "Квадрат Полибия",   image: "images/shifrs/kvadratpolibiya.jpeg" },
            { label: "Морзе",             image: "images/shifrs/morze.jpeg" },
            { label: "Пигпен",            image: "images/shifrs/pigpen.jpeg" },
            { label: "Квадрат Полибия 2", image: "images/shifrs/polybiy.jpeg" },
            { label: "ROT13",             image: "images/shifrs/rot13.jpeg" },
            { label: "Рус. алфавит",      image: "images/shifrs/rusalph.jpeg" },
            { label: "Табл. Менделеева",  image: "images/shifrs/tablmend.jpeg" },
        ],
        answer: "площадь",
        destination: {
            lat: 55.77819113050887, lng: 49.114996341041206,
            hint: "Площадь",
            polygon: [
                [49.114996341041206, 55.77819113050887],
                [49.115109200961854, 55.77806771212528],
                [49.11530200332612,  55.778117961085826],
                [49.11518914340547,  55.77823608996613],
                [49.114996341041206, 55.77819113050887],
            ],
            radius: 30
        }
    },
    {
        id: 2,
        riddleImage: "images/deshi/2.jpeg",
        ciphers: [
            { label: "Атбаш",             image: "images/shifrs/atbash.jpeg" },
            { label: "Брайль",            image: "images/shifrs/brail.jpeg" },
            { label: "Цезарь",            image: "images/shifrs/caesar.jpeg" },
            { label: "Англ. алфавит",     image: "images/shifrs/engalph.jpeg" },
            { label: "Клав. (ноут)",      image: "images/shifrs/klavanouta.jpeg" },
            { label: "Клав. (телефон)",   image: "images/shifrs/klavatelef.jpeg" },
            { label: "Квадрат Полибия",   image: "images/shifrs/kvadratpolibiya.jpeg" },
            { label: "Морзе",             image: "images/shifrs/morze.jpeg" },
            { label: "Пигпен",            image: "images/shifrs/pigpen.jpeg" },
            { label: "Квадрат Полибия 2", image: "images/shifrs/polybiy.jpeg" },
            { label: "ROT13",             image: "images/shifrs/rot13.jpeg" },
            { label: "Рус. алфавит",      image: "images/shifrs/rusalph.jpeg" },
            { label: "Табл. Менделеева",  image: "images/shifrs/tablmend.jpeg" },
        ],
        answer: "сад слёз",
        destination: {
            lat: 55.77793339938111, lng: 49.114370579958404,
            hint: "Сад слёз",
            polygon: [
                [49.114370579958404, 55.77793339938111],
                [49.11480488763681,  55.777484841627825],
                [49.114970611244274, 55.77755258672718],
                [49.11541025007162,  55.77768627201593],
                [49.11537652788425,  55.777722191132],
                [49.11542811103595,  55.77774395336186],
                [49.1150613106164,   55.778126630549394],
                [49.1149997083362,   55.77810701085889],
                [49.114370579958404, 55.77793339938111],
            ],
            radius: 30
        }
    },
    {
        id: 3,
        riddleImage: "images/deshi/3.jpeg",
        ciphers: [
            { label: "Атбаш",             image: "images/shifrs/atbash.jpeg" },
            { label: "Брайль",            image: "images/shifrs/brail.jpeg" },
            { label: "Цезарь",            image: "images/shifrs/caesar.jpeg" },
            { label: "Англ. алфавит",     image: "images/shifrs/engalph.jpeg" },
            { label: "Клав. (ноут)",      image: "images/shifrs/klavanouta.jpeg" },
            { label: "Клав. (телефон)",   image: "images/shifrs/klavatelef.jpeg" },
            { label: "Квадрат Полибия",   image: "images/shifrs/kvadratpolibiya.jpeg" },
            { label: "Морзе",             image: "images/shifrs/morze.jpeg" },
            { label: "Пигпен",            image: "images/shifrs/pigpen.jpeg" },
            { label: "Квадрат Полибия 2", image: "images/shifrs/polybiy.jpeg" },
            { label: "ROT13",             image: "images/shifrs/rot13.jpeg" },
            { label: "Рус. алфавит",      image: "images/shifrs/rusalph.jpeg" },
            { label: "Табл. Менделеева",  image: "images/shifrs/tablmend.jpeg" },
        ],
        answer: "дом шамиля",
        destination: {
            lat: 55.77753686331749, lng: 49.11510408207437,
            hint: "Дом Шамиля",
            polygon: [
                [49.11510408207437,  55.77753686331749],
                [49.11546113119152,  55.77764485536568],
                [49.115650064205,    55.77744647455344],
                [49.11541178996055,  55.77737416671607],
                [49.115372732161234, 55.777416049537266],
                [49.11525776644686,  55.77737887694289],
                [49.11510408207437,  55.77753686331749],
            ],
            radius: 30
        }
    },
    {
        id: 4,
        riddleImage: "images/deshi/4.jpeg",
        ciphers: [
            { label: "Атбаш",             image: "images/shifrs/atbash.jpeg" },
            { label: "Брайль",            image: "images/shifrs/brail.jpeg" },
            { label: "Цезарь",            image: "images/shifrs/caesar.jpeg" },
            { label: "Англ. алфавит",     image: "images/shifrs/engalph.jpeg" },
            { label: "Клав. (ноут)",      image: "images/shifrs/klavanouta.jpeg" },
            { label: "Клав. (телефон)",   image: "images/shifrs/klavatelef.jpeg" },
            { label: "Квадрат Полибия",   image: "images/shifrs/kvadratpolibiya.jpeg" },
            { label: "Морзе",             image: "images/shifrs/morze.jpeg" },
            { label: "Пигпен",            image: "images/shifrs/pigpen.jpeg" },
            { label: "Квадрат Полибия 2", image: "images/shifrs/polybiy.jpeg" },
            { label: "ROT13",             image: "images/shifrs/rot13.jpeg" },
            { label: "Рус. алфавит",      image: "images/shifrs/rusalph.jpeg" },
            { label: "Табл. Менделеева",  image: "images/shifrs/tablmend.jpeg" },
        ],
        answer: "розовый дом",
        destination: {
            lat: 55.7775440400238, lng: 49.11437735070788,
            hint: "Розовый дом",
            polygon: [
                [49.11437735070788,   55.7775440400238],
                [49.114569453489025,  55.77760324086978],
                [49.1147085620068,    55.77745273683598],
                [49.114521384506986,  55.77739464188261],
                [49.11437735070788,   55.7775440400238],
            ],
            radius: 30
        }
    },
    {
        id: 5,
        riddleImage: "images/deshi/5.jpeg",
        ciphers: [
            { label: "Атбаш",             image: "images/shifrs/atbash.jpeg" },
            { label: "Брайль",            image: "images/shifrs/brail.jpeg" },
            { label: "Цезарь",            image: "images/shifrs/caesar.jpeg" },
            { label: "Англ. алфавит",     image: "images/shifrs/engalph.jpeg" },
            { label: "Клав. (ноут)",      image: "images/shifrs/klavanouta.jpeg" },
            { label: "Клав. (телефон)",   image: "images/shifrs/klavatelef.jpeg" },
            { label: "Квадрат Полибия",   image: "images/shifrs/kvadratpolibiya.jpeg" },
            { label: "Морзе",             image: "images/shifrs/morze.jpeg" },
            { label: "Пигпен",            image: "images/shifrs/pigpen.jpeg" },
            { label: "Квадрат Полибия 2", image: "images/shifrs/polybiy.jpeg" },
            { label: "ROT13",             image: "images/shifrs/rot13.jpeg" },
            { label: "Рус. алфавит",      image: "images/shifrs/rusalph.jpeg" },
            { label: "Табл. Менделеева",  image: "images/shifrs/tablmend.jpeg" },
        ],
        answer: "седьмая поликлиника",
        destination: {
            lat: 55.77849196760809, lng: 49.115961143709654,
            hint: "Седьмая поликлиника",
            polygon: [
                [49.115961143709654, 55.77849196760809],
                [49.117231095489814, 55.77885515601059],
                [49.117115471849445, 55.77898160100989],
                [49.11659085321509,  55.778833244208954],
                [49.116524807075194, 55.778903981837686],
                [49.116401997607625, 55.77886906707732],
                [49.11646430759939,  55.77879921570869],
                [49.11633116726426,  55.77876257241482],
                [49.11630201698458,  55.7787950235421],
                [49.11603241778539,  55.77871897282736],
                [49.11598754419248,  55.778769936802746],
                [49.11576309204514,  55.77870720332098],
                [49.115961143709654, 55.77849196760809],
            ],
            radius: 40
        }
    },
    {
        id: 6,
        riddleImage: "images/deshi/6.jpeg",
        ciphers: [
            { label: "Атбаш",             image: "images/shifrs/atbash.jpeg" },
            { label: "Брайль",            image: "images/shifrs/brail.jpeg" },
            { label: "Цезарь",            image: "images/shifrs/caesar.jpeg" },
            { label: "Англ. алфавит",     image: "images/shifrs/engalph.jpeg" },
            { label: "Клав. (ноут)",      image: "images/shifrs/klavanouta.jpeg" },
            { label: "Клав. (телефон)",   image: "images/shifrs/klavatelef.jpeg" },
            { label: "Квадрат Полибия",   image: "images/shifrs/kvadratpolibiya.jpeg" },
            { label: "Морзе",             image: "images/shifrs/morze.jpeg" },
            { label: "Пигпен",            image: "images/shifrs/pigpen.jpeg" },
            { label: "Квадрат Полибия 2", image: "images/shifrs/polybiy.jpeg" },
            { label: "ROT13",             image: "images/shifrs/rot13.jpeg" },
            { label: "Рус. алфавит",      image: "images/shifrs/rusalph.jpeg" },
            { label: "Табл. Менделеева",  image: "images/shifrs/tablmend.jpeg" },
        ],
        answer: "синий дом напротив",
        destination: {
            lat: 55.77833035789749, lng: 49.116154646810855,
            hint: "Синий дом напротив",
            polygon: [
                [49.116154646810855, 55.77833035789749],
                [49.11634689974906,  55.778115738601116],
                [49.1164648600618,   55.77814846547966],
                [49.11642083616729,  55.77819782602887],
                [49.11647923122848,  55.77821395899568],
                [49.11640148220931,  55.778294862557345],
                [49.11643853932301,  55.77830535718252],
                [49.11636006671975,  55.77839082401053],
                [49.116154646810855, 55.77833035789749],
            ],
            radius: 30
        }
    },
    {
        id: 7,
        riddleImage: "images/deshi/7.jpeg",
        ciphers: [
            { label: "Атбаш",             image: "images/shifrs/atbash.jpeg" },
            { label: "Брайль",            image: "images/shifrs/brail.jpeg" },
            { label: "Цезарь",            image: "images/shifrs/caesar.jpeg" },
            { label: "Англ. алфавит",     image: "images/shifrs/engalph.jpeg" },
            { label: "Клав. (ноут)",      image: "images/shifrs/klavanouta.jpeg" },
            { label: "Клав. (телефон)",   image: "images/shifrs/klavatelef.jpeg" },
            { label: "Квадрат Полибия",   image: "images/shifrs/kvadratpolibiya.jpeg" },
            { label: "Морзе",             image: "images/shifrs/morze.jpeg" },
            { label: "Пигпен",            image: "images/shifrs/pigpen.jpeg" },
            { label: "Квадрат Полибия 2", image: "images/shifrs/polybiy.jpeg" },
            { label: "ROT13",             image: "images/shifrs/rot13.jpeg" },
            { label: "Рус. алфавит",      image: "images/shifrs/rusalph.jpeg" },
            { label: "Табл. Менделеева",  image: "images/shifrs/tablmend.jpeg" },
        ],
        answer: "дом каушчи",
        destination: {
            lat: 55.7786341846971, lng: 49.11722348685598,
            hint: "Дом Каушчи",
            polygon: [
                [49.11722348685598,   55.7786341846971],
                [49.117388987484816,  55.77867389139848],
                [49.117539348057676,  55.778478264488456],
                [49.117247694470166,  55.77840684297033],
                [49.1171867045104,    55.77848287207985],
                [49.11731412342027,   55.778513921645185],
                [49.11722348685598,   55.7786341846971],
            ],
            radius: 30
        }
    },
    {
        id: 8,
        riddleImage: "images/deshi/8.jpeg",
        ciphers: [
            { label: "Атбаш",             image: "images/shifrs/atbash.jpeg" },
            { label: "Брайль",            image: "images/shifrs/brail.jpeg" },
            { label: "Цезарь",            image: "images/shifrs/caesar.jpeg" },
            { label: "Англ. алфавит",     image: "images/shifrs/engalph.jpeg" },
            { label: "Клав. (ноут)",      image: "images/shifrs/klavanouta.jpeg" },
            { label: "Клав. (телефон)",   image: "images/shifrs/klavatelef.jpeg" },
            { label: "Квадрат Полибия",   image: "images/shifrs/kvadratpolibiya.jpeg" },
            { label: "Морзе",             image: "images/shifrs/morze.jpeg" },
            { label: "Пигпен",            image: "images/shifrs/pigpen.jpeg" },
            { label: "Квадрат Полибия 2", image: "images/shifrs/polybiy.jpeg" },
            { label: "ROT13",             image: "images/shifrs/rot13.jpeg" },
            { label: "Рус. алфавит",      image: "images/shifrs/rusalph.jpeg" },
            { label: "Табл. Менделеева",  image: "images/shifrs/tablmend.jpeg" },
        ],
        answer: "апанаевская мечеть",
        destination: {
            lat: 55.77783082969208, lng: 49.11911249003285,
            hint: "Апанаевская мечеть",
            polygon: [
                [49.11911249003285,  55.77783082969208],
                [49.11923690847311,  55.777765472839974],
                [49.11957698620466,  55.777959098206],
                [49.1194489441838,   55.77802783879588],
                [49.11911249003285,  55.77783082969208],
            ],
            radius: 30
        }
    },
    {
        id: 9,
        riddleImage: "images/deshi/9.jpeg",
        ciphers: [
            { label: "Атбаш",             image: "images/shifrs/atbash.jpeg" },
            { label: "Брайль",            image: "images/shifrs/brail.jpeg" },
            { label: "Цезарь",            image: "images/shifrs/caesar.jpeg" },
            { label: "Англ. алфавит",     image: "images/shifrs/engalph.jpeg" },
            { label: "Клав. (ноут)",      image: "images/shifrs/klavanouta.jpeg" },
            { label: "Клав. (телефон)",   image: "images/shifrs/klavatelef.jpeg" },
            { label: "Квадрат Полибия",   image: "images/shifrs/kvadratpolibiya.jpeg" },
            { label: "Морзе",             image: "images/shifrs/morze.jpeg" },
            { label: "Пигпен",            image: "images/shifrs/pigpen.jpeg" },
            { label: "Квадрат Полибия 2", image: "images/shifrs/polybiy.jpeg" },
            { label: "ROT13",             image: "images/shifrs/rot13.jpeg" },
            { label: "Рус. алфавит",      image: "images/shifrs/rusalph.jpeg" },
            { label: "Табл. Менделеева",  image: "images/shifrs/tablmend.jpeg" },
        ],
        answer: "озеро кабан",
        destination: {
            lat: 55.78174145618698, lng: 49.11722731740201,
            hint: "Озеро Кабан",
            polygon: null,
            radius: 60
        }
    },
    {
        id: 10,
        riddleImage: "images/deshi/10.jpeg",
        ciphers: [
            { label: "Атбаш",             image: "images/shifrs/atbash.jpeg" },
            { label: "Брайль",            image: "images/shifrs/brail.jpeg" },
            { label: "Цезарь",            image: "images/shifrs/caesar.jpeg" },
            { label: "Англ. алфавит",     image: "images/shifrs/engalph.jpeg" },
            { label: "Клав. (ноут)",      image: "images/shifrs/klavanouta.jpeg" },
            { label: "Клав. (телефон)",   image: "images/shifrs/klavatelef.jpeg" },
            { label: "Квадрат Полибия",   image: "images/shifrs/kvadratpolibiya.jpeg" },
            { label: "Морзе",             image: "images/shifrs/morze.jpeg" },
            { label: "Пигпен",            image: "images/shifrs/pigpen.jpeg" },
            { label: "Квадрат Полибия 2", image: "images/shifrs/polybiy.jpeg" },
            { label: "ROT13",             image: "images/shifrs/rot13.jpeg" },
            { label: "Рус. алфавит",      image: "images/shifrs/rusalph.jpeg" },
            { label: "Табл. Менделеева",  image: "images/shifrs/tablmend.jpeg" },
        ],
        answer: "памятник марджани",
        destination: {
            lat: 55.780347545120605, lng: 49.11865784913121,
            hint: "Памятник Марджани",
            polygon: [
                [49.11865784913121, 55.780347545120605],
                [49.11868551305221, 55.78034707532004],
                [49.11868729446786, 55.780372455732646],
                [49.11865713865444, 55.780372944428336],
                [49.11865784913121, 55.780347545120605],
            ],
            radius: 20
        }
    },
    {
        id: 11,
        riddleImage: "images/deshi/11.jpeg",
        ciphers: [
            { label: "Атбаш",             image: "images/shifrs/atbash.jpeg" },
            { label: "Брайль",            image: "images/shifrs/brail.jpeg" },
            { label: "Цезарь",            image: "images/shifrs/caesar.jpeg" },
            { label: "Англ. алфавит",     image: "images/shifrs/engalph.jpeg" },
            { label: "Клав. (ноут)",      image: "images/shifrs/klavanouta.jpeg" },
            { label: "Клав. (телефон)",   image: "images/shifrs/klavatelef.jpeg" },
            { label: "Квадрат Полибия",   image: "images/shifrs/kvadratpolibiya.jpeg" },
            { label: "Морзе",             image: "images/shifrs/morze.jpeg" },
            { label: "Пигпен",            image: "images/shifrs/pigpen.jpeg" },
            { label: "Квадрат Полибия 2", image: "images/shifrs/polybiy.jpeg" },
            { label: "ROT13",             image: "images/shifrs/rot13.jpeg" },
            { label: "Рус. алфавит",      image: "images/shifrs/rusalph.jpeg" },
            { label: "Табл. Менделеева",  image: "images/shifrs/tablmend.jpeg" },
        ],
        answer: "мечеть",
        destination: {
            lat: 55.77954988161301, lng: 49.117888543561435,
            hint: "Мечеть",
            polygon: [
                [49.117888543561435, 55.77954988161301],
                [49.11803102261021,  55.779490252902804],
                [49.118256098160714, 55.7796664877842],
                [49.11800365662532,  55.779996335555666],
                [49.11787261101992,  55.779966292637965],
                [49.11783073355471,  55.78001436706674],
                [49.117788870704885, 55.77997985511993],
                [49.117607069453925, 55.78005389958804],
                [49.117558119560954, 55.780020937156934],
                [49.117603941718215, 55.780006647254794],
                [49.1173047211463,   55.779784607965865],
                [49.117454355317335, 55.779722307792724],
                [49.117744765471315, 55.77994136934123],
                [49.117826839799136, 55.77990586409658],
                [49.1177337948659,   55.779833819256595],
                [49.11806400647359,  55.77968829182146],
                [49.117888543561435, 55.77954988161301],
            ],
            radius: 30
        }
    },
    {
        id: 12,
        riddleImage: "images/deshi/12.jpeg",
        ciphers: [
            { label: "Атбаш",             image: "images/shifrs/atbash.jpeg" },
            { label: "Брайль",            image: "images/shifrs/brail.jpeg" },
            { label: "Цезарь",            image: "images/shifrs/caesar.jpeg" },
            { label: "Англ. алфавит",     image: "images/shifrs/engalph.jpeg" },
            { label: "Клав. (ноут)",      image: "images/shifrs/klavanouta.jpeg" },
            { label: "Клав. (телефон)",   image: "images/shifrs/klavatelef.jpeg" },
            { label: "Квадрат Полибия",   image: "images/shifrs/kvadratpolibiya.jpeg" },
            { label: "Морзе",             image: "images/shifrs/morze.jpeg" },
            { label: "Пигпен",            image: "images/shifrs/pigpen.jpeg" },
            { label: "Квадрат Полибия 2", image: "images/shifrs/polybiy.jpeg" },
            { label: "ROT13",             image: "images/shifrs/rot13.jpeg" },
            { label: "Рус. алфавит",      image: "images/shifrs/rusalph.jpeg" },
            { label: "Табл. Менделеева",  image: "images/shifrs/tablmend.jpeg" },
        ],
        answer: "исламский колледж",
        destination: {
            lat: 55.780176336376, lng: 49.11682810880731,
            hint: "Исламский колледж",
            polygon: [
                [49.11682810880731, 55.780176336376],
                [49.1172520725579,  55.78024455938578],
                [49.11718824863783, 55.78036476598206],
                [49.11676720775796, 55.78029663923414],
                [49.11682810880731, 55.780176336376],
            ],
            radius: 30
        }
    },
    {
        id: 13,
        riddleImage: "images/deshi/13.jpeg",
        ciphers: [
            { label: "Атбаш",             image: "images/shifrs/atbash.jpeg" },
            { label: "Брайль",            image: "images/shifrs/brail.jpeg" },
            { label: "Цезарь",            image: "images/shifrs/caesar.jpeg" },
            { label: "Англ. алфавит",     image: "images/shifrs/engalph.jpeg" },
            { label: "Клав. (ноут)",      image: "images/shifrs/klavanouta.jpeg" },
            { label: "Клав. (телефон)",   image: "images/shifrs/klavatelef.jpeg" },
            { label: "Квадрат Полибия",   image: "images/shifrs/kvadratpolibiya.jpeg" },
            { label: "Морзе",             image: "images/shifrs/morze.jpeg" },
            { label: "Пигпен",            image: "images/shifrs/pigpen.jpeg" },
            { label: "Квадрат Полибия 2", image: "images/shifrs/polybiy.jpeg" },
            { label: "ROT13",             image: "images/shifrs/rot13.jpeg" },
            { label: "Рус. алфавит",      image: "images/shifrs/rusalph.jpeg" },
            { label: "Табл. Менделеева",  image: "images/shifrs/tablmend.jpeg" },
        ],
        answer: "55.780616, 49.116170",
        destination: {
            lat: 55.7805843720208, lng: 49.116199516591706,
            hint: "Точка на карте",
            polygon: [
                [49.116199516591706, 55.7805843720208],
                [49.11612849809879,  55.78064689552181],
                [49.11621073118596,  55.7806754197598],
                [49.11628198415167,  55.78061383640164],
                [49.116199516591706, 55.7805843720208],
            ],
            radius: 20
        }
    },
    {
        id: 14,
        riddleImage: "images/deshi/14.jpeg",
        ciphers: [
            { label: "Атбаш",             image: "images/shifrs/atbash.jpeg" },
            { label: "Брайль",            image: "images/shifrs/brail.jpeg" },
            { label: "Цезарь",            image: "images/shifrs/caesar.jpeg" },
            { label: "Англ. алфавит",     image: "images/shifrs/engalph.jpeg" },
            { label: "Клав. (ноут)",      image: "images/shifrs/klavanouta.jpeg" },
            { label: "Клав. (телефон)",   image: "images/shifrs/klavatelef.jpeg" },
            { label: "Квадрат Полибия",   image: "images/shifrs/kvadratpolibiya.jpeg" },
            { label: "Морзе",             image: "images/shifrs/morze.jpeg" },
            { label: "Пигпен",            image: "images/shifrs/pigpen.jpeg" },
            { label: "Квадрат Полибия 2", image: "images/shifrs/polybiy.jpeg" },
            { label: "ROT13",             image: "images/shifrs/rot13.jpeg" },
            { label: "Рус. алфавит",      image: "images/shifrs/rusalph.jpeg" },
            { label: "Табл. Менделеева",  image: "images/shifrs/tablmend.jpeg" },
        ],
        answer: "спросите бумажки",
        destination: {
            lat: 55.7805843720208, lng: 49.116199516591706,
            hint: "Спросите бумажки",
            polygon: [
                [49.116199516591706, 55.7805843720208],
                [49.11612849809879,  55.78064689552181],
                [49.11621073118596,  55.7806754197598],
                [49.11628198415167,  55.78061383640164],
                [49.116199516591706, 55.7805843720208],
            ],
            radius: 20
        }
    },
];


/* ================================================================
   ГЛОБАЛЬНОЕ СОСТОЯНИЕ
   ================================================================ */
let map            = null;
let arrowEl        = null;
let lastCoords     = null;
let compassActive  = false;
let compassAngle   = 0;
let gpsActive      = false;
let followMode     = true;
let followTimeout  = null;
let smoothAngle    = 0;
let currentQuestId = null;
let lastPolledId   = null;
let pollingTimer   = null;
let pulseInterval  = null;

/* ================================================================
   ТОЧКА ВХОДА
   ================================================================ */
document.addEventListener("DOMContentLoaded", () => {
    if (window.Telegram?.WebApp) {
        Telegram.WebApp.ready();
        Telegram.WebApp.expand();
    }
    document.getElementById("passwordInput").addEventListener("keydown", e => {
        if (e.key === "Enter") submitPassword();
    });
    document.getElementById("answerInput").addEventListener("keydown", e => {
        if (e.key === "Enter") submitAnswer();
    });
});

/* ================================================================
   PRELOAD — все картинки фоном сразу после входа
   ================================================================ */
function preloadAllImages() {
    const srcs = new Set();
    QUESTS.forEach(q => {
        if (q.riddleImage) srcs.add(q.riddleImage);
        (q.ciphers || []).forEach(c => { if (c.image) srcs.add(c.image); });
    });
    srcs.forEach(src => { const img = new Image(); img.src = src; });
    console.log(`Preloading ${srcs.size} images…`);
}

/* ================================================================
   ЭКРАН ПАРОЛЯ
   ================================================================ */
function submitPassword() {
    const input = document.getElementById("passwordInput");
    const error = document.getElementById("passwordError");
    const val   = input.value.trim().toLowerCase();

    if (ACCESS_PASSWORDS.map(p => p.toLowerCase()).includes(val)) {
        error.classList.remove("show");
        showScreen("questScreen");
        initMap();
        startPolling();
        preloadAllImages();
    } else {
        error.classList.add("show");
        input.classList.add("shake");
        input.value = "";
        setTimeout(() => {
            input.classList.remove("shake");
            error.classList.remove("show");
        }, 2500);
    }
}

/* ================================================================
   ПЕРЕКЛЮЧЕНИЕ ЭКРАНОВ
   ================================================================ */
function showScreen(id) {
    document.querySelectorAll(".screen").forEach(s => {
        s.classList.remove("active");
        s.style.display = "";
    });
    document.getElementById(id).classList.add("active");
}

function backToQuest() {
    showScreen("questScreen");
}

/* ================================================================
   POLLING — JSONBin, интервал 2 сек
   ================================================================ */
function startPolling() {
    pollOnce();
    pollingTimer = setInterval(pollOnce, POLL_INTERVAL_MS);
}

async function pollOnce() {
    try {
        const res = await fetch(JSONBIN_URL, {
            headers: { "X-Master-Key": JSONBIN_KEY }
        });
        if (!res.ok) { console.warn("JSONBin error:", res.status); return; }

        const data = await res.json();
        const id   = Number(data.record.current);

        if (id !== lastPolledId) {
            lastPolledId = id;
            loadQuest(id);
        }
    } catch (e) {
        console.warn("Poll failed:", e);
    }
}

/* ================================================================
   ЗАГРУЗКА ЗАГАДКИ
   ================================================================ */
function loadQuest(id) {
    const quest = QUESTS.find(q => q.id === id);
    if (!quest) { showWaiting(); return; }

    currentQuestId = id;

    document.getElementById("riddleWaiting").classList.add("hidden");
    const img = document.getElementById("riddleImage");
    img.classList.remove("hidden");
    img.src = quest.riddleImage;
    document.getElementById("riddleNumber").textContent = `ЗАГАДКА ${quest.id}`;

    buildCipherButtons(quest.ciphers);

    document.getElementById("answerInput").value = "";
    const fb = document.getElementById("answerFeedback");
    fb.textContent = "";
    fb.className   = "answer-feedback";
}

function showWaiting() {
    document.getElementById("riddleImage").classList.add("hidden");
    document.getElementById("riddleWaiting").classList.remove("hidden");
    document.getElementById("riddleNumber").textContent = "";
    document.getElementById("cipherButtons").innerHTML  = "";
    document.getElementById("cipherPreview").innerHTML  = "";
    document.getElementById("cipherEmpty").classList.remove("hidden");
    currentQuestId = null;
}

/* ================================================================
   ДЕШИФРОВЩИКИ — горизонтальный скролл + рандомный порядок
   ciphers = null → панель скрыта совсем
   ciphers = []   → панель скрыта совсем
   ================================================================ */
function buildCipherButtons(ciphers) {
    const panel     = document.getElementById("cipherPanel");
    const container = document.getElementById("cipherButtons");
    const empty     = document.getElementById("cipherEmpty");
    const preview   = document.getElementById("cipherPreview");

    container.innerHTML = "";
    preview.innerHTML   = "";

    // Нет дешифровщиков — скрываем всю нижнюю панель
    if (!ciphers || ciphers.length === 0) {
        panel.style.display = "none";
        return;
    }

    panel.style.display = "";
    empty.classList.add("hidden");
    preview.innerHTML = `<span class="cipher-preview-placeholder">Выберите дешифровщик</span>`;

    // Перемешиваем случайно
    const shuffled = [...ciphers].sort(() => Math.random() - 0.5);

    // Горизонтальный скролл
    container.style.cssText = `
        display:flex; flex-direction:row; flex-wrap:nowrap;
        overflow-x:auto; gap:8px; padding-bottom:4px;
        -webkit-overflow-scrolling:touch; scrollbar-width:none;
    `;

    shuffled.forEach((c, i) => {
        const btn = document.createElement("button");
        btn.className        = "cipher-btn";
        btn.textContent      = c.label;
        btn.style.flexShrink = "0";
        btn.onclick          = () => selectCipher(c, btn, preview);
        container.appendChild(btn);
        if (i === 0) setTimeout(() => btn.click(), 100);
    });  // end shuffled.forEach
}

function selectCipher(cipher, btn, preview) {
    document.querySelectorAll(".cipher-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    preview.classList.remove("empty");
    preview.innerHTML = `
        <img class="cipher-preview-img"
             src="${cipher.image}" alt="${cipher.label}"
             onclick="openCipherOverlay('${cipher.image}')" />
    `;
}

function openCipherOverlay(src) {
    document.getElementById("cipherOverlayImg").src = src;
    document.getElementById("cipherOverlay").classList.remove("hidden");
}
function closeCipherOverlay() {
    document.getElementById("cipherOverlay").classList.add("hidden");
}

/* ================================================================
   ПРОВЕРКА ОТВЕТА
   Регистр не важен, ё=е, пробелы по краям убираем
   ================================================================ */
function submitAnswer() {
    if (!currentQuestId) return;
    const quest    = QUESTS.find(q => q.id === currentQuestId);
    const input    = document.getElementById("answerInput");
    const feedback = document.getElementById("answerFeedback");
    if (!quest) return;

    if (normalizeAnswer(input.value) === normalizeAnswer(quest.answer)) {
        feedback.textContent = "";
        feedback.className   = "answer-feedback";
        requestCompassPermission();
        showSuccessAndOpenMap(quest);
    } else {
        feedback.textContent = "Неверно, попробуйте ещё раз";
        feedback.className   = "answer-feedback wrong";
        input.classList.add("shake");
        setTimeout(() => {
            input.classList.remove("shake");
            feedback.textContent = "";
            feedback.className   = "answer-feedback";
        }, 2000);
    }
}

function normalizeAnswer(str) {
    return str.toLowerCase().trim()
        .replace(/ё/g, "е")
        .replace(/[^а-яa-z0-9,. ]/g, "")
        .replace(/\s+/g, " ");
}

/* ================================================================
   УСПЕХ → КАРТА
   ================================================================ */
function showSuccessAndOpenMap(quest) {
    const overlay = document.getElementById("successOverlay");
    overlay.classList.remove("hidden");
    document.getElementById("successText").textContent = "Открываю карту…";
    setTimeout(() => {
        overlay.classList.add("hidden");
        openMapWithDestination(quest);
    }, 1800);
}

function openMapWithDestination(quest) {
    showScreen("mapScreen");
    gpsActive = true;

    const dest = quest.destination;
    clearDestination();

    document.getElementById("mapHint").textContent = dest.hint || "";
    const idx   = QUESTS.findIndex(q => q.id === quest.id) + 1;
    document.getElementById("mapProgress").textContent = `${idx} / ${QUESTS.length}`;

    if (map) {
        map.flyTo({ center: [dest.lng, dest.lat], zoom: 18, duration: 1200 });
        map.once("moveend", () => {
            if (dest.polygon) addPolygonDestination(dest);
            else addCircleDestination(dest);
        });
    }
}

/* ================================================================
   ЗОНЫ НА КАРТЕ
   ================================================================ */
function addCircleDestination(dest) {
    if (!map) return;
    const geojson = { type:"FeatureCollection", features:[{ type:"Feature", geometry:{ type:"Point", coordinates:[dest.lng, dest.lat] }, properties:{} }] };

    if (map.getSource("dest-circle")) {
        map.getSource("dest-circle").setData(geojson);
    } else {
        map.addSource("dest-circle", { type:"geojson", data:geojson });
        map.addLayer({ id:"dest-circle-layer", type:"circle", source:"dest-circle",
            paint:{ "circle-radius":30, "circle-color":"rgba(255,60,60,0.25)", "circle-stroke-color":"#FF3C3C", "circle-stroke-width":2 } });
    }

    function updateRadius() {
        if (!map.getLayer("dest-circle-layer")) return;
        const mpp = 156543.03392 * Math.cos(dest.lat * Math.PI/180) / Math.pow(2, map.getZoom());
        map.setPaintProperty("dest-circle-layer", "circle-radius", (dest.radius||40)/mpp);
    }
    map.on("zoom", updateRadius);
    updateRadius();

    let up = true;
    pulseInterval = setInterval(() => {
        if (!map.getLayer("dest-circle-layer")) return;
        map.setPaintProperty("dest-circle-layer", "circle-color", up ? "rgba(255,60,60,0.45)" : "rgba(255,60,60,0.12)");
        up = !up;
    }, 600);
}

function addPolygonDestination(dest) {
    if (!map) return;
    const geojson = { type:"FeatureCollection", features:[{ type:"Feature", geometry:{ type:"Polygon", coordinates:[dest.polygon] }, properties:{} }] };

    if (map.getSource("dest-polygon")) {
        map.getSource("dest-polygon").setData(geojson);
    } else {
        map.addSource("dest-polygon", { type:"geojson", data:geojson });
        map.addLayer({ id:"dest-polygon-fill", type:"fill", source:"dest-polygon",
            paint:{ "fill-color":"rgba(255,60,60,0.25)", "fill-opacity":1 } });
        map.addLayer({ id:"dest-polygon-line", type:"line", source:"dest-polygon",
            layout:{ "line-join":"round", "line-cap":"round" },
            paint:{ "line-color":"#FF3C3C", "line-width":2.5 } });
    }

    let up = true;
    pulseInterval = setInterval(() => {
        if (!map.getLayer("dest-polygon-fill")) return;
        map.setPaintProperty("dest-polygon-fill", "fill-color", up ? "rgba(255,60,60,0.45)" : "rgba(255,60,60,0.1)");
        up = !up;
    }, 600);
}

function clearDestination() {
    if (pulseInterval) { clearInterval(pulseInterval); pulseInterval = null; }
    if (!map) return;
    ["dest-circle-layer","dest-polygon-fill","dest-polygon-line"].forEach(id => { if (map.getLayer(id)) map.removeLayer(id); });
    ["dest-circle","dest-polygon"].forEach(id => { if (map.getSource(id)) map.removeSource(id); });
}

/* ================================================================
   КАРТА
   ================================================================ */
function initMap() {
    if (map) return;
    map = new maplibregl.Map({
        container: "map",
        style: {
            version: 8,
            sources: { osm: { type:"raster", tiles:["https://tile.openstreetmap.org/{z}/{x}/{y}.png"], tileSize:256 } },
            layers:  [{ id:"osm-base", type:"raster", source:"osm" }]
        },
        center: MAP_CENTER,
        zoom:   MAP_ZOOM
    });

    map.on("load", () => {
        createArrow();
        map.getCanvas().addEventListener("pointerdown", () => {
            followMode = false;
            if (followTimeout) clearTimeout(followTimeout);
        });
        map.getCanvas().addEventListener("pointerup", () => {
            if (followTimeout) clearTimeout(followTimeout);
            followTimeout = setTimeout(() => followMode = true, 3000);
        });
        map.on("move", () => { if (lastCoords) updateArrowPosition(lastCoords); });
        startGPS();
    });
}

/* ================================================================
   КОМПАС
   ================================================================ */
function requestCompassPermission() {
    if (compassActive) return;
    const ua = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);

    if (isIOS && typeof DeviceOrientationEvent?.requestPermission === "function") {
        DeviceOrientationEvent.requestPermission()
            .then(state => {
                if (state === "granted") {
                    compassActive = true;
                    window.addEventListener("deviceorientation", handleCompass);
                }
            }).catch(() => {});
    } else {
        compassActive = true;
        window.addEventListener("deviceorientation", handleCompass);
    }
}

function handleCompass(e) {
    if (!compassActive || !gpsActive) return;
    let heading = null;
    if (e.webkitCompassHeading != null) {
        heading = e.webkitCompassHeading;
    } else if (e.alpha != null) {
        const r=Math.PI/180, a=e.alpha*r, b=e.beta*r, g=e.gamma*r;
        const sa=Math.sin(a),ca=Math.cos(a),sb=Math.sin(b),sg=Math.sin(g),cg=Math.cos(g);
        heading = ((Math.atan2(sa*sg-ca*sb*cg, ca*sg+sa*sb*cg)*180/Math.PI)+360)%360;
    }
    if (heading==null) return;
    smoothAngle  = (smoothAngle*0.82 + heading*0.18 + 360) % 360;
    compassAngle = smoothAngle;
    const relative = (smoothAngle - (map?map.getBearing():0) + 360) % 360;
    applyArrowRotation(relative);
    if (followMode && lastCoords && map) {
        map.easeTo({ center:[lastCoords[1],lastCoords[0]], bearing:smoothAngle, duration:300 });
    }
}

/* ================================================================
   GPS
   ================================================================ */
function startGPS() {
    if (!navigator.geolocation) return;
    navigator.geolocation.watchPosition(
        pos => { if (gpsActive) moveMarker([pos.coords.latitude, pos.coords.longitude]); },
        err => console.warn("GPS:", err.message),
        { enableHighAccuracy: true }
    );
}

function moveMarker(coords) {
    const prev = lastCoords;
    lastCoords = coords;
    updateArrowPosition(coords);
    if (prev && !compassAngle) applyArrowRotation(calcAngle(prev, coords));
    if (followMode && map) map.easeTo({ center:[coords[1],coords[0]], duration:300 });
}

function updateArrowPosition(coords) {
    if (!map || !arrowEl) return;
    const pt = map.project([coords[1], coords[0]]);
    arrowEl.style.left = pt.x + "px";
    arrowEl.style.top  = pt.y + "px";
    arrowEl.style.visibility = "visible";
}

function applyArrowRotation(angle) {
    if (!arrowEl) return;
    arrowEl.style.transform = `translate(-50%,-50%) rotate(${angle}deg)`;
}

function calcAngle(from, to) {
    return Math.atan2(to[1]-from[1], to[0]-from[0]) * 180/Math.PI;
}

/* ================================================================
   DOM-СТРЕЛКА
   ================================================================ */
function createArrow() {
    arrowEl = document.createElement("div");
    arrowEl.id = "navArrow";
    arrowEl.innerHTML = `<svg viewBox="0 0 48 48" width="40" height="40" xmlns="http://www.w3.org/2000/svg">
        <polygon points="24,3 42,45 24,36 6,45" fill="currentColor" opacity="0.95"/></svg>`;
    arrowEl.style.cssText = `position:absolute;pointer-events:none;z-index:9999;
        transform-origin:center center;color:#00ff88;visibility:hidden;
        left:50%;top:50%;transform:translate(-50%,-50%);will-change:transform;`;
    document.getElementById("map").appendChild(arrowEl);
}
