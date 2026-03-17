/* ========================================================
   QUEST APP — APP.JS
   ======================================================== */

const ACCESS_PASSWORDS   = ["88888888"];
const QUEST_STATE_URL    = "./qstate.json";
const POLL_INTERVAL_MS   = 5000;
const MAP_CENTER         = [49.1218, 55.7873];
const MAP_ZOOM           = 15;

/* ================================================================
   ДАННЫЕ ЗАГАДОК
   ================================================================ */
const QUESTS = [
    {
        id: 1,
        riddleImage: "images/riddle1.jpg",
        ciphers: [
            { label: "Атбаш",  image: "images/atbash.jpeg" },
            { label: "Брайль", image: "images/brail.jpeg" },
            { label: "Все",    image: "images/all.jpeg" },
        ],
        answer: "казань",
        destination: {
            lat:  55.77753419082225,
            lng:  49.115107142701646,
            hint: "Идите к угловому зданию\nна площади Свободы",
            polygon: [
                [49.115107142701646, 55.77753419082225],
                [49.11546328035493,  55.77764132496114],
                [49.115657913722714, 55.77744568848533],
                [49.11541979843216,  55.77737232455388],
                [49.11537838707676,  55.77741308231077],
                [49.115258294147765, 55.77737698258528],
                [49.11510921327016,  55.777536519828345],
                [49.115107142701646, 55.77753419082225]  // закрыть контур
            ],
            radius: 30
        }
    },
    {
        id: 2,
        riddleImage: "images/riddle2.jpg",
        ciphers: [
            { label: "Решётка", image: "images/cipher_grid.jpg" },
        ],
        answer: "петропавловский",
        destination: {
            lat:     55.79336,
            lng:     49.114008,
            hint:    "Петропавловский собор\nул. Мусы Джалиля, 21",
            polygon: null,
            radius:  40
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
   POLLING — cache:no-store чтобы GitHub не кэшировал
   ================================================================ */
function startPolling() {
    pollOnce();
    pollingTimer = setInterval(pollOnce, POLL_INTERVAL_MS);
}

async function pollOnce() {
    try {
        const res = await fetch(QUEST_STATE_URL + "?t=" + Date.now(), {
            cache: "no-store"
        });

        if (!res.ok) {
            console.warn("Poll HTTP error:", res.status);
            return;
        }

        const text = await res.text();
        console.log("qstate raw:", text);          // видим что пришло

        const data = JSON.parse(text);
        const id   = Number(data.current);         // всегда число

        console.log("current:", id, "| lastPolled:", lastPolledId);

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

    if (!quest) {
        showWaiting();
        return;
    }

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
   ДЕШИФРОВЩИКИ
   ================================================================ */
function buildCipherButtons(ciphers) {
    const container = document.getElementById("cipherButtons");
    const empty     = document.getElementById("cipherEmpty");
    const preview   = document.getElementById("cipherPreview");

    container.innerHTML = "";
    preview.innerHTML   = "";

    if (!ciphers || ciphers.length === 0) {
        empty.classList.remove("hidden");
        return;
    }

    empty.classList.add("hidden");
    preview.innerHTML = `<span class="cipher-preview-placeholder">Выберите дешифровщик</span>`;

    ciphers.forEach((c, i) => {
        const btn = document.createElement("button");
        btn.className   = "cipher-btn";
        btn.textContent = c.label;
        btn.onclick     = () => selectCipher(c, btn, preview);
        container.appendChild(btn);
        if (i === 0) setTimeout(() => btn.click(), 100);
    });
}

function selectCipher(cipher, btn, preview) {
    document.querySelectorAll(".cipher-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    preview.classList.remove("empty");
    preview.innerHTML = `
        <img
            class="cipher-preview-img"
            src="${cipher.image}"
            alt="${cipher.label}"
            onclick="openCipherOverlay('${cipher.image}')"
        />
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
   ================================================================ */
function submitAnswer() {
    if (!currentQuestId) return;

    const quest    = QUESTS.find(q => q.id === currentQuestId);
    const input    = document.getElementById("answerInput");
    const feedback = document.getElementById("answerFeedback");
    const val      = normalizeAnswer(input.value);

    if (!quest) return;

    if (val === normalizeAnswer(quest.answer)) {
        feedback.textContent = "";
        feedback.className   = "answer-feedback";

        // Запрашиваем компас прямо здесь — это user gesture, iOS пропустит
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
    return str
        .toLowerCase()
        .trim()
        .replace(/ё/g, "е")
        .replace(/[^а-яa-z0-9]/g, "");
}

/* ================================================================
   УСПЕХ → ОТКРЫТИЕ КАРТЫ
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
    const total = QUESTS.length;
    document.getElementById("mapProgress").textContent = `${idx} / ${total}`;

    if (map) {
        map.flyTo({ center: [dest.lng, dest.lat], zoom: 17, duration: 1200 });

        // Рисуем зону после окончания анимации
        map.once("moveend", () => {
            if (dest.polygon) {
                addPolygonDestination(dest);
            } else {
                addCircleDestination(dest);
            }
        });
    }
}

/* ================================================================
   ЗОНЫ НА КАРТЕ
   ================================================================ */
function addCircleDestination(dest) {
    if (!map) return;

    const geojson = {
        type: "FeatureCollection",
        features: [{ type: "Feature", geometry: { type: "Point", coordinates: [dest.lng, dest.lat] }, properties: {} }]
    };

    if (map.getSource("dest-circle")) {
        map.getSource("dest-circle").setData(geojson);
    } else {
        map.addSource("dest-circle", { type: "geojson", data: geojson });
        map.addLayer({
            id: "dest-circle-layer",
            type: "circle",
            source: "dest-circle",
            paint: {
                "circle-radius": 30,
                "circle-color":  "rgba(255,60,60,0.25)",
                "circle-stroke-color": "#FF3C3C",
                "circle-stroke-width": 2
            }
        });
    }

    function updateRadius() {
        if (!map.getLayer("dest-circle-layer")) return;
        const mpp = 156543.03392 * Math.cos(dest.lat * Math.PI / 180) / Math.pow(2, map.getZoom());
        map.setPaintProperty("dest-circle-layer", "circle-radius", dest.radius / mpp);
    }
    map.on("zoom", updateRadius);
    updateRadius();

    let up = true;
    pulseInterval = setInterval(() => {
        if (!map.getLayer("dest-circle-layer")) return;
        map.setPaintProperty("dest-circle-layer", "circle-color",
            up ? "rgba(255,60,60,0.45)" : "rgba(255,60,60,0.12)");
        up = !up;
    }, 600);
}

function addPolygonDestination(dest) {
    if (!map) return;

    const geojson = {
        type: "FeatureCollection",
        features: [{ type: "Feature", geometry: { type: "Polygon", coordinates: [dest.polygon] }, properties: {} }]
    };

    if (map.getSource("dest-polygon")) {
        map.getSource("dest-polygon").setData(geojson);
    } else {
        map.addSource("dest-polygon", { type: "geojson", data: geojson });
        map.addLayer({
            id: "dest-polygon-fill",
            type: "fill",
            source: "dest-polygon",
            paint: { "fill-color": "rgba(255,60,60,0.25)", "fill-opacity": 1 }
        });
        map.addLayer({
            id: "dest-polygon-line",
            type: "line",
            source: "dest-polygon",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: { "line-color": "#FF3C3C", "line-width": 2.5 }
        });
    }

    let up = true;
    pulseInterval = setInterval(() => {
        if (!map.getLayer("dest-polygon-fill")) return;
        map.setPaintProperty("dest-polygon-fill", "fill-color",
            up ? "rgba(255,60,60,0.45)" : "rgba(255,60,60,0.1)");
        up = !up;
    }, 600);
}

function clearDestination() {
    if (pulseInterval) { clearInterval(pulseInterval); pulseInterval = null; }
    if (!map) return;
    ["dest-circle-layer","dest-polygon-fill","dest-polygon-line"].forEach(id => {
        if (map.getLayer(id)) map.removeLayer(id);
    });
    ["dest-circle","dest-polygon"].forEach(id => {
        if (map.getSource(id)) map.removeSource(id);
    });
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
            sources: { osm: { type: "raster", tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"], tileSize: 256 } },
            layers:  [{ id: "osm-base", type: "raster", source: "osm" }]
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

        map.on("move", () => {
            if (lastCoords) updateArrowPosition(lastCoords);
        });

        startGPS();
        // Компас запускается только после правильного ответа (user gesture)
    });
}

/* ================================================================
   КОМПАС
   Вызывается из submitAnswer() — это user gesture, iOS разрешит
   ================================================================ */
function requestCompassPermission() {
    if (compassActive) return; // уже запущен

    const ua        = navigator.userAgent.toLowerCase();
    const isIOS     = /iphone|ipad|ipod/.test(ua);
    const isAndroid = /android/.test(ua);

    if (isIOS && typeof DeviceOrientationEvent?.requestPermission === "function") {
        DeviceOrientationEvent.requestPermission()
            .then(state => {
                if (state === "granted") {
                    compassActive = true;
                    window.addEventListener("deviceorientation", handleCompass);
                    console.log("Compass: iOS granted");
                } else {
                    console.warn("Compass: iOS denied");
                }
            })
            .catch(e => console.warn("Compass error:", e));
    } else {
        // Android и десктоп — без запроса
        compassActive = true;
        window.addEventListener("deviceorientation", handleCompass);
        console.log("Compass: attached");
    }
}

function handleCompass(e) {
    if (!compassActive || !gpsActive) return;

    let heading = null;

    if (e.webkitCompassHeading != null) {
        heading = e.webkitCompassHeading;
    } else if (e.alpha != null) {
        const r  = Math.PI / 180;
        const a  = e.alpha * r, b = e.beta * r, g = e.gamma * r;
        const sa = Math.sin(a), ca = Math.cos(a);
        const sb = Math.sin(b);
        const sg = Math.sin(g), cg = Math.cos(g);
        const Vx = sa * sg - ca * sb * cg;
        const Vy = ca * sg + sa * sb * cg;
        heading  = ((Math.atan2(Vx, Vy) * 180 / Math.PI) + 360) % 360;
    }

    if (heading == null) return;

    smoothAngle  = (smoothAngle * 0.82 + heading * 0.18 + 360) % 360;
    compassAngle = smoothAngle;

    const bearing  = map ? map.getBearing() : 0;
    const relative = (smoothAngle - bearing + 360) % 360;
    applyArrowRotation(relative);

    if (followMode && lastCoords && map) {
        map.easeTo({ center: [lastCoords[1], lastCoords[0]], bearing: smoothAngle, duration: 300 });
    }
}

/* ================================================================
   GPS
   ================================================================ */
function startGPS() {
    if (!navigator.geolocation) return;
    navigator.geolocation.watchPosition(
        pos => {
            if (!gpsActive) return;
            moveMarker([pos.coords.latitude, pos.coords.longitude]);
        },
        err => console.warn("GPS:", err.message),
        { enableHighAccuracy: true }
    );
}

function moveMarker(coords) {
    const prev = lastCoords;
    lastCoords = coords;
    updateArrowPosition(coords);

    if (prev && !compassAngle) {
        applyArrowRotation(calcAngle(prev, coords));
    }

    if (followMode && map) {
        map.easeTo({ center: [coords[1], coords[0]], duration: 300 });
    }
}

function updateArrowPosition(coords) {
    if (!map || !arrowEl) return;
    const pt = map.project([coords[1], coords[0]]);
    arrowEl.style.left       = pt.x + "px";
    arrowEl.style.top        = pt.y + "px";
    arrowEl.style.visibility = "visible";
}

function applyArrowRotation(angle) {
    if (!arrowEl) return;
    arrowEl.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
}

function calcAngle(from, to) {
    return Math.atan2(to[1] - from[1], to[0] - from[0]) * 180 / Math.PI;
}

/* ================================================================
   DOM-СТРЕЛКА
   ================================================================ */
function createArrow() {
    arrowEl = document.createElement("div");
    arrowEl.id = "navArrow";
    arrowEl.innerHTML = `
        <svg viewBox="0 0 48 48" width="40" height="40" xmlns="http://www.w3.org/2000/svg">
            <polygon points="24,3 42,45 24,36 6,45" fill="currentColor" opacity="0.95"/>
        </svg>`;
    arrowEl.style.cssText = `
        position:absolute; pointer-events:none; z-index:9999;
        transform-origin:center center; color:#00ff88;
        visibility:hidden; left:50%; top:50%;
        transform:translate(-50%,-50%); will-change:transform;`;
    document.getElementById("map").appendChild(arrowEl);
}
