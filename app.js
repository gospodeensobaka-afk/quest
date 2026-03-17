/* =======================================================
   QUEST APP — APP.JS
   Казанский городской квест
   ======================================================== */

/* ================================================================
   НАСТРОЙКИ — СЮДА ВНОСИШЬ СВОИ ДАННЫЕ
   ================================================================ */

// Пароли для входа (можно добавить сколько угодно)
const ACCESS_PASSWORDS = ["88888888"];
// ↑ ЗАМЕНИ на свои пароли перед деплоем

// URL файла текущего состояния квеста (лежит на GitHub Pages)
// Этот файл ты будешь обновлять через Telegram бота
const QUEST_STATE_URL = "./qstate.json";
// Пример quest-state.json:
// { "current": 1, "updated_at": 1710000000 }

// Интервал опроса quest-state.json (мс)
const POLL_INTERVAL_MS = 5000;

// Начальный центр карты (Казань)
const MAP_CENTER = [49.1218, 55.7873];
const MAP_ZOOM   = 15;

/* ================================================================
   ДАННЫЕ ЗАГАДОК
   Заполняй сам — images/ должны лежать рядом с index.html
   ================================================================ */
const QUESTS = [
    // Загадка 1
    {
        id: 1,
        riddleImage:  "images/riddle1.jpg",  // картинка загадки
        ciphers: [
            { label: "Атбаш",   image: "images/atbash.jpeg" },
            { label: "Браиль;",  image: "brail.jpeg" },
           { label: "Все;",  image: "images/all.jpeg" },
            // добавляй сколько угодно дешифровщиков
        ],
        answer: "казань",                    // правильный ответ (нижний регистр)
        destination: {
            lat:    55.796357,
            lng:    49.124353,
            hint:   "Идите к угловому зданию\nна площади Свободы",
            // polygon — массив [lng, lat] по часовой стрелке для подсветки здания
            // оставь null если хочешь просто точку-кружок
            polygon: null,
            // radius — радиус кружка в метрах (если polygon = null)
            radius: 30
        }
    },

    // Загадка 2
    {
        id: 2,
        riddleImage:  "images/riddle2.jpg",
        ciphers: [
            { label: "Решётка", image: "images/cipher_grid.jpg" },
        ],
        answer: "петропавловский",
        destination: {
            lat:    55.79336,
            lng:    49.114008,
            hint:   "Петропавловский собор\nул. Мусы Джалиля, 21",
            polygon: null,
            radius: 40
        }
    },

    // ДОБАВЛЯЙ загадки по аналогии:
    // {
    //   id: 3,
    //   riddleImage: "images/riddle3.jpg",
    //   ciphers: [...],
    //   answer: "ответ",
    //   destination: { lat:..., lng:..., hint:"...", polygon: null, radius: 30 }
    // },
];

/* ================================================================
   ГЛОБАЛЬНОЕ СОСТОЯНИЕ
   ================================================================ */
let map            = null;
let arrowEl        = null;
let lastCoords     = null;
let compassAngle   = 0;
let gpsActive      = false;
let followMode     = true;
let followTimeout  = null;
let smoothAngle    = 0;
let currentQuestId = null;    // текущая активная загадка
let lastPolledId   = null;    // последнее загруженное состояние
let pollingTimer   = null;
let destMarker     = null;    // маркер/зона на карте
let pulseInterval  = null;    // анимация пульсации зоны

/* ================================================================
   ТОЧКА ВХОДА
   ================================================================ */
document.addEventListener("DOMContentLoaded", () => {
    if (window.Telegram?.WebApp) {
        Telegram.WebApp.ready();
        Telegram.WebApp.expand();
    }

    // Enter в поле пароля
    document.getElementById("passwordInput").addEventListener("keydown", e => {
        if (e.key === "Enter") submitPassword();
    });

    // Enter в поле ответа
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
        // Успешный вход
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
    const el = document.getElementById(id);
    el.classList.add("active");
}

function backToQuest() {
    showScreen("questScreen");
}

/* ================================================================
   POLLING — опрашиваем quest-state.json каждые N секунд
   ================================================================ */
function startPolling() {
    pollOnce();
    pollingTimer = setInterval(pollOnce, POLL_INTERVAL_MS);
}

async function pollOnce() {
    try {
        const res  = await fetch(QUEST_STATE_URL + "?t=" + Date.now());
        const data = await res.json();
        const id   = data.current;

        if (id !== lastPolledId) {
            lastPolledId = id;
            loadQuest(id);
        }
    } catch (e) {
        // сервер недоступен или файл не найден — молча игнорируем
        console.warn("Poll failed:", e);
    }
}

/* ================================================================
   ЗАГРУЗКА ЗАГАДКИ
   ================================================================ */
function loadQuest(id) {
    const quest = QUESTS.find(q => q.id === id);
    if (!quest) {
        // Нет такой загадки — показываем "ожидание"
        showWaiting();
        return;
    }

    currentQuestId = id;

    // Показываем картинку загадки
    const riddleImg = document.getElementById("riddleImage");
    const waiting   = document.getElementById("riddleWaiting");
    const numEl     = document.getElementById("riddleNumber");

    waiting.classList.add("hidden");
    riddleImg.classList.remove("hidden");
    riddleImg.src = quest.riddleImage;
    numEl.textContent = `ЗАГАДКА ${quest.id}`;

    // Заполняем дешифровщики
    buildCipherButtons(quest.ciphers);

    // Сбрасываем поле ответа
    const input    = document.getElementById("answerInput");
    const feedback = document.getElementById("answerFeedback");
    input.value    = "";
    feedback.textContent = "";
    feedback.className = "answer-feedback";
}

function showWaiting() {
    document.getElementById("riddleImage").classList.add("hidden");
    document.getElementById("riddleWaiting").classList.remove("hidden");
    document.getElementById("riddleNumber").textContent = "";
    document.getElementById("cipherButtons").innerHTML = "";
    document.getElementById("cipherPreview").innerHTML = "";
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
    preview.classList.add("empty");
    preview.innerHTML = `<span class="cipher-preview-placeholder">Выберите дешифровщик</span>`;

    ciphers.forEach((c, i) => {
        const btn = document.createElement("button");
        btn.className   = "cipher-btn";
        btn.textContent = c.label;
        btn.onclick     = () => selectCipher(c, btn, preview);
        container.appendChild(btn);

        // Автоматически выбираем первый
        if (i === 0) setTimeout(() => btn.click(), 100);
    });
}

function selectCipher(cipher, btn, preview) {
    // Снимаем active со всех
    document.querySelectorAll(".cipher-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // Показываем картинку дешифровщика
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
    const overlay = document.getElementById("cipherOverlay");
    const img     = document.getElementById("cipherOverlayImg");
    img.src = src;
    overlay.classList.remove("hidden");
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
        // ВЕРНО!
        feedback.textContent = "";
        feedback.className   = "answer-feedback";
        showSuccessAndOpenMap(quest);
    } else {
        // Неверно
        feedback.textContent = "Неверно, попробуйте ещё раз";
        feedback.className   = "answer-feedback wrong";
        input.classList.add("shake");
        setTimeout(() => {
            input.classList.remove("shake");
            feedback.textContent = "";
            feedback.className = "answer-feedback";
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
    const overlay   = document.getElementById("successOverlay");
    const successTx = document.getElementById("successText");

    overlay.classList.remove("hidden");
    successTx.textContent = "Открываю карту…";

    setTimeout(() => {
        overlay.classList.add("hidden");
        openMapWithDestination(quest);
    }, 1800);
}

function openMapWithDestination(quest) {
    showScreen("mapScreen");

    const dest = quest.destination;

    // Убираем старый маркер/зону
    clearDestination();

    // Показываем подсказку
    document.getElementById("mapHint").textContent = dest.hint || "";

    // Обновляем прогресс
    const idx   = QUESTS.findIndex(q => q.id === quest.id) + 1;
    const total = QUESTS.length;
    document.getElementById("mapProgress").textContent = `${idx} / ${total}`;

    // Центрируем карту на цель
    if (map) {
        map.flyTo({
            center: [dest.lng, dest.lat],
            zoom: 17,
            duration: 1200
        });

        // Рисуем зону или точку
        if (dest.polygon) {
            addPolygonDestination(dest);
        } else {
            addCircleDestination(dest);
        }
    }

    // Включаем GPS
    gpsActive = true;
}

/* ================================================================
   ЗОНА НАЗНАЧЕНИЯ НА КАРТЕ
   ================================================================ */
function addCircleDestination(dest) {
    if (!map) return;

    // Если источник уже есть — обновляем данные
    if (map.getSource("dest-circle")) {
        map.getSource("dest-circle").setData({
            type: "FeatureCollection",
            features: [{ type: "Feature", geometry: { type: "Point", coordinates: [dest.lng, dest.lat] }, properties: {} }]
        });
    } else {
        map.addSource("dest-circle", {
            type: "geojson",
            data: {
                type: "FeatureCollection",
                features: [{ type: "Feature", geometry: { type: "Point", coordinates: [dest.lng, dest.lat] }, properties: {} }]
            }
        });

        map.addLayer({
            id: "dest-circle-layer",
            type: "circle",
            source: "dest-circle",
            paint: {
                "circle-radius": 0,          // обновляется через zoom
                "circle-color":  "rgba(255,60,60,0.2)",
                "circle-stroke-color": "#FF3C3C",
                "circle-stroke-width": 2
            }
        });
    }

    // Пересчитываем радиус при зуме
    function updateRadius() {
        if (!map.getLayer("dest-circle-layer")) return;
        const zoom = map.getZoom();
        const lat  = dest.lat;
        const mpp  = 156543.03392 * Math.cos(lat * Math.PI / 180) / Math.pow(2, zoom);
        const px   = dest.radius / mpp;
        map.setPaintProperty("dest-circle-layer", "circle-radius", px);
    }

    map.on("zoom", updateRadius);
    updateRadius();

    // Пульсация: меняем opacity
    let pulse = true;
    let up    = true;
    pulseInterval = setInterval(() => {
        if (!pulse || !map.getLayer("dest-circle-layer")) return;
        const val = up ? 0.45 : 0.15;
        up = !up;
        map.setPaintProperty("dest-circle-layer", "circle-color", up ? "rgba(255,60,60,0.15)" : "rgba(255,60,60,0.4)");
    }, 600);
}

function addPolygonDestination(dest) {
    if (!map) return;

    const data = {
        type: "FeatureCollection",
        features: [{ type: "Feature", geometry: { type: "Polygon", coordinates: [dest.polygon] }, properties: {} }]
    };

    if (map.getSource("dest-polygon")) {
        map.getSource("dest-polygon").setData(data);
    } else {
        map.addSource("dest-polygon", { type: "geojson", data });
        map.addLayer({
            id: "dest-polygon-fill",
            type: "fill",
            source: "dest-polygon",
            paint: { "fill-color": "rgba(255,60,60,0.2)", "fill-opacity": 1 }
        });
        map.addLayer({
            id: "dest-polygon-line",
            type: "line",
            source: "dest-polygon",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: { "line-color": "#FF3C3C", "line-width": 2.5 }
        });
    }

    // Пульсация fill
    let up = true;
    pulseInterval = setInterval(() => {
        if (!map.getLayer("dest-polygon-fill")) return;
        map.setPaintProperty("dest-polygon-fill", "fill-color", up ? "rgba(255,60,60,0.35)" : "rgba(255,60,60,0.12)");
        up = !up;
    }, 600);
}

function clearDestination() {
    if (pulseInterval) { clearInterval(pulseInterval); pulseInterval = null; }

    if (map) {
        ["dest-circle-layer", "dest-polygon-fill", "dest-polygon-line"].forEach(id => {
            if (map.getLayer(id)) map.removeLayer(id);
        });
        ["dest-circle", "dest-polygon"].forEach(id => {
            if (map.getSource(id)) map.removeSource(id);
        });
    }
}

/* ================================================================
   ИНИЦИАЛИЗАЦИЯ КАРТЫ
   ================================================================ */
function initMap() {
    if (map) return; // уже инициализирована

    map = new maplibregl.Map({
        container: "map",
        style: {
            version: 8,
            sources: {
                osm: {
                    type: "raster",
                    tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
                    tileSize: 256
                }
            },
            layers: [{ id: "osm-base", type: "raster", source: "osm" }]
        },
        center: MAP_CENTER,
        zoom: MAP_ZOOM
    });

    map.on("load", () => {
        // Создаём DOM-стрелку
        createArrow();

        // Обработка касаний карты (выключаем follow на 3 сек)
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

        // Запускаем GPS
        startGPS();
        startCompass();
    });
}

/* ================================================================
   GPS
   ================================================================ */
function startGPS() {
    if (!navigator.geolocation) return;

    navigator.geolocation.watchPosition(
        pos => {
            if (!gpsActive) return;
            const coords = [pos.coords.latitude, pos.coords.longitude];
            moveMarker(coords);
        },
        err => console.warn("GPS error:", err.message),
        { enableHighAccuracy: true }
    );
}

function moveMarker(coords) {
    const prev = lastCoords;
    lastCoords = coords;

    updateArrowPosition(coords);

    // Поворот стрелки по движению
    if (prev && !compassAngle) {
        const angle = calcAngle(prev, coords);
        applyArrowRotation(angle);
    }

    // Следование
    if (followMode && map) {
        map.easeTo({
            center: [coords[1], coords[0]],
            duration: 300
        });
    }
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
    arrowEl.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
}

function calcAngle(from, to) {
    const dx = to[1] - from[1];
    const dy = to[0] - from[0];
    return Math.atan2(dx, dy) * 180 / Math.PI;
}

/* ================================================================
   КОМПАС
   ================================================================ */
function startCompass() {
    const ua        = navigator.userAgent.toLowerCase();
    const isIOS     = /iphone|ipad|ipod/.test(ua);
    const isAndroid = /android/.test(ua);

    if (isIOS && typeof DeviceOrientationEvent?.requestPermission === "function") {
        DeviceOrientationEvent.requestPermission()
            .then(state => {
                if (state === "granted") window.addEventListener("deviceorientation", handleCompass);
            })
            .catch(() => {});
    } else if (isAndroid || !isIOS) {
        window.addEventListener("deviceorientation", handleCompass);
    }
}

function handleCompass(e) {
    if (!gpsActive) return;

    let heading = null;

    if (e.webkitCompassHeading != null) {
        // iOS
        heading = e.webkitCompassHeading;
    } else if (e.alpha != null) {
        // Android
        const toRad = Math.PI / 180;
        const a = e.alpha * toRad, b = e.beta * toRad, g = e.gamma * toRad;
        const sa = Math.sin(a), ca = Math.cos(a);
        const sb = Math.sin(b), cb = Math.cos(b);
        const sg = Math.sin(g), cg = Math.cos(g);
        const Vx = sa * sg - ca * sb * cg;
        const Vy = ca * sg + sa * sb * cg;
        heading  = ((Math.atan2(Vx, Vy) * 180 / Math.PI) + 360) % 360;
    }

    if (heading == null) return;

    smoothAngle = (smoothAngle * 0.82 + heading * 0.18 + 360) % 360;
    compassAngle = smoothAngle;

    const bearing  = map ? map.getBearing() : 0;
    const relative = (smoothAngle - bearing + 360) % 360;
    applyArrowRotation(relative);

    if (followMode && lastCoords && map) {
        map.easeTo({
            center: [lastCoords[1], lastCoords[0]],
            bearing: smoothAngle,
            duration: 300
        });
    }
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
        </svg>
    `;
    arrowEl.style.cssText = `
        position: absolute;
        pointer-events: none;
        z-index: 9999;
        transform-origin: center center;
        color: #00ff88;
        visibility: hidden;
        left: 50%; top: 50%;
        transform: translate(-50%, -50%);
        will-change: transform;
    `;

    const container = document.getElementById("map");
    if (container) container.appendChild(arrowEl);
}

/* ================================================================
   QUEST-STATE.JSON — ШАБЛОН ДЛЯ ГИТХАБА
   ================================================================

   Создай файл quest-state.json рядом с index.html:

   {
     "current": 0,
     "updated_at": 0
   }

   current = 0 → никакой загадки (состояние ожидания)
   current = 1 → загадка #1
   current = 2 → загадка #2
   и т.д.

   Через бота ты просто меняешь это число.

   ================================================================ */
