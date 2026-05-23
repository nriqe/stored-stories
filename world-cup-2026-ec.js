const getWorldCupMatches = async (
  idMatchesContainer,
  idCarouselBtnPrev,
  idCarouselBtnNext,
  idCardCounter,
  strClasses,
  jsonPath
) => {
  const classes = JSON.parse(strClasses);
  const successfullResponse = 200;

  const matchesContainer = document.getElementById(idMatchesContainer);
  const carouselBtnPrev = document.getElementById(idCarouselBtnPrev);
  const carouselBtnNext = document.getElementById(idCarouselBtnNext);
  const cardCounter = document.getElementById(idCardCounter);

  const finishedState = "Finalizado";
  const nextMatchState = "Próximo";

  if (
    !matchesContainer ||
    !carouselBtnPrev ||
    !carouselBtnNext ||
    !cardCounter
  ) {
    throw new Error("No existe uno de los contenedores o botones.");
  }

  let matches = [];

  const getWorldCupMatchesFromApi = async () => {
    const currentTime = new Date().getTime();

    try {
      const response = await fetch(`${jsonPath}?${currentTime}`);

      if (
        !response.status ||
        response.status !== successfullResponse ||
        !response.ok
      ) {
        throw new Error("Error al obtener los partidos.");
      }

      const result = await response.json();
      console.log("PARTIDOS DESDE EL JSON:", response, result);
      return result;
    } catch (error) {
      throw new Error("ERROR DE API LOS PARTIDOS: ", error);
    }
  };

  const formatDate = (fechaStr) => {
    const [year, month, day] = fechaStr.split("-");
    const date = new Date(year, month - 1, day);
    return date
      .toLocaleDateString("es-PE", { day: "numeric", month: "short" })
      .replace(".", "");
  };

  const getStatusClass = (estado) => {
    const statusMap = {
      Próximo: classes.nextFixtureCardStatus,
      "En vivo": classes.liveFixtureCardStatus,
      "1er Tiempo": classes.liveFixtureCardStatus,
      "2do Tiempo": classes.liveFixtureCardStatus,
      "1er Tiempo Extra": classes.liveFixtureCardStatus,
      "2do Tiempo Extra": classes.liveFixtureCardStatus,
      "Medio Tiempo": classes.liveFixtureCardStatus,
      Penales: classes.liveFixtureCardStatus,
      Finalizado: classes.finishedFixtureCardStatus,
    };
    return statusMap[estado] ?? classes.nextFixtureCardStatus;
  };

  const getStatus = (estado) => {
    const statusMap = {
      Próximo: nextMatchState,
      "En vivo": "En vivo",
      "1er Tiempo": "En vivo",
      "2do Tiempo": "En vivo",
      "Medio Tiempo": "En vivo",
      Penales: "En vivo",
      Finalizado: finishedState,
    };
    return statusMap[estado] ?? nextMatchState;
  };

  const isFinished = (estado) => estado === finishedState;
  const isNext = (estado) => estado === nextMatchState;

  const getScoreClass = (estado) =>
    isNext(estado) ? "fixture-card__score--empty" : "";

  const getScoreValue = (goles, estado) => (isNext(estado) ? "-" : goles);

  const getCalendarIcon = (estado) =>
    !isFinished(estado) ? `<div class="${classes.calendarIcon}"></div>` : "";

  const getMatchTime = (estado, matchTime) =>
    !isFinished(estado) ? `${matchTime} EST` : "FT";

  const renderMatch = (match) => {
    const article = document.createElement("article");
    article.className = `${classes.fixtureCard} ${
      isFinished(match.estado) ? classes.fixturefinishedCard : ""
    }`;
    article.dataset.id = match.iD;

    article.innerHTML = `
      <header class="${classes.fixtureCardTopHeader}">
        <span class="${classes.fixtureCardGroup}">
          Grupo ${match.grupo} • ${formatDate(match.fecha)}
        </span>
        <span class="${classes.fixtureCardStatus} ${getStatusClass(
      match.estado
    )}">
          ${getStatus(match.estado)}
        </span>
      </header>
      <section class="${classes.teamsContainer}">
        <div class="${classes.team}">
          <div class="${classes.teamInfo}">
            <img
              class="${classes.flag}"
              src="./flags/${match.slugSeleccion1}.png"
              alt="${match.seleccion1}"
            />
            <span class="${classes.teamName}">${match.seleccion1}</span>
          </div>
          <div class="${classes.teamScore}">
            <span class="${classes.score} ${getScoreClass(match.estado)}">
              ${getScoreValue(match.goles1, match.estado)}
            </span>
          </div>
        </div>
        <div class="${classes.team}">
          <div class="${classes.teamInfo}">
            <img
              class="${classes.flag}"
              src="./flags/${match.slugSeleccion2}.png"
              alt="${match.seleccion2}"
            />
            <span class="${classes.teamName}">${match.seleccion2}</span>
          </div>
          <div class="${classes.teamScore}">
            <span class="${classes.score} ${getScoreClass(match.estado)}">
              ${getScoreValue(match.goles2, match.estado)}
            </span>
          </div>
        </div>
      </section>
      <footer class="${classes.cardBottom}">
        <div class="${classes.calendarTime}">
          ${getCalendarIcon(match.estado)}
          <span class="${classes.time}">
            ${getMatchTime(match.estado, match.horaLima)}
          </span>
        </div>
        <span class="${classes.stadium}">${match.sede}</span>
      </footer>
    `;

    return article;
  };

  const renderMatches = (matchList) => {
    matchesContainer.innerHTML = "";
    const fragment = document.createDocumentFragment();
    matchList.forEach((match) => fragment.appendChild(renderMatch(match)));
    matchesContainer.appendChild(fragment);
  };

  // ── Carousel ────────────────────────────────────────────────────────────────

  const CARD_WIDTH = 320; // px — ancho de cada fixture-card
  const DESKTOP_STEP = 3;
  const MOBILE_STEP = 1;
  const DESKTOP_BREAKPOINT = 640; // px

  const isDesktop = () => window.innerWidth >= DESKTOP_BREAKPOINT;
  const getStep = () => (isDesktop() ? DESKTOP_STEP : MOBILE_STEP);

  let currentIndex = 0; // índice de la primera tarjeta visible

  const updateCarousel = (total) => {
    const step = getStep();

    // Desplazamiento: cada tarjeta ocupa CARD_WIDTH px
    const offset = currentIndex * CARD_WIDTH;
    matchesContainer.style.transform = `translateX(-${offset}px)`;

    // Botón prev: oculto en el inicio
    carouselBtnPrev.style.display = currentIndex === 0 ? "none" : "";

    // Botón next: oculto cuando ya no quedan tarjetas por mostrar
    const visibleCount = isDesktop() ? DESKTOP_STEP : MOBILE_STEP;
    carouselBtnNext.style.display =
      currentIndex + visibleCount >= total ? "none" : "";

    // Contador — siempre de 1 en 1 (índice visual = currentIndex + 1)
    cardCounter.textContent = `Mostrando ${currentIndex + 1} de ${total}`;
  };

  const initCarousel = (matchList) => {
    const total = matchList.length;

    // El contenedor debe ser flex y no recortar para que el translate funcione;
    // aseguramos el ancho mínimo para albergar todas las tarjetas.
    matchesContainer.style.display = "flex";
    matchesContainer.style.transition = "transform 0.35s ease";
    matchesContainer.style.willChange = "transform";

    // Estado inicial
    currentIndex = 0;
    carouselBtnPrev.style.display = "none";
    updateCarousel(total);

    carouselBtnNext.addEventListener("click", () => {
      const step = getStep();
      const visibleCount = isDesktop() ? DESKTOP_STEP : MOBILE_STEP;
      if (currentIndex + visibleCount < total) {
        currentIndex = Math.min(currentIndex + step, total - visibleCount);
        updateCarousel(total);
      }
    });

    carouselBtnPrev.addEventListener("click", () => {
      const step = getStep();
      if (currentIndex > 0) {
        currentIndex = Math.max(currentIndex - step, 0);
        updateCarousel(total);
      }
    });

    // Recalcula al cambiar tamaño de ventana (desktop ↔ móvil)
    window.addEventListener("resize", () => {
      currentIndex = 0;
      updateCarousel(total);
    });
  };

  // ── Init ────────────────────────────────────────────────────────────────────

  matches = await getWorldCupMatchesFromApi();

  if (matches?.length > 0) {
    renderMatches(matches);
    initCarousel(matches);
  }
};
