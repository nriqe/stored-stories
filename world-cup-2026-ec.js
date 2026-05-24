const getWorldCupMatches = async (
  idMatchesContainer,
  idCarouselBtnsContainer,
  idCarouselBtnPrev,
  idCarouselBtnNext,
  idCardCounter,
  round,
  strClasses,
  jsonPath
) => {
  const classes = JSON.parse(strClasses);
  const successfullResponse = 200;

  const matchesContainer = document.getElementById(idMatchesContainer);
  const carouselBtnsContainer = document.getElementById(
    idCarouselBtnsContainer
  );
  const carouselBtnPrev = document.getElementById(idCarouselBtnPrev);
  const carouselBtnNext = document.getElementById(idCarouselBtnNext);
  const cardCounter = document.getElementById(idCardCounter);

  const hiddenArrowsClass = classes.hiddenArrows;

  const roundStage = "fase-de-grupos";

  const nextMatchState = "Próximo";
  const penaltiesState = "Penales";
  const finishedState = "Finalizado";

  const MOBILE_BREAKPOINT = 640; // < 640px
  const TABLET_BREAKPOINT = 1024; // 640px – 1023px
  // desktop                         // >= 1024px

  const MOBILE_STEP = 1;
  const TABLET_STEP = 2;
  const DESKTOP_STEP = 3;

  const MOBILE_VISIBLE = 1;
  const TABLET_VISIBLE = 2;
  const DESKTOP_VISIBLE = 3;

  if (
    !matchesContainer ||
    !carouselBtnPrev ||
    !carouselBtnNext ||
    !cardCounter
  ) {
    throw new Error("No existe uno de los contenedores o botones.");
  }

  let matches = [];
  let currentIndex = 0;

  const getRound = (round) => {
    const rounds = {
      "fase-de-grupos": "Grupo",
      "16vos-final": "16vos de final",
      "8vos-final": "8vos de final",
      "4tos-final": "4tos de final",
      semifinales: "Semifinales",
      "3-4-puesto": "3er y 4to puesto",
      final: "Final",
    };

    return rounds[round] ? rounds[round] : "";
  };

  console.log("FASE:", getRound(round));

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

  const getCardTitle = (round, matchGroup, matchDate) => {
    if (round === roundStage || typeof matchGroup !== "") {
      return `Grupo ${matchGroup} • ${formatDate(matchDate)}`;
    }

    return rounds[round];
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
      "1er Tiempo Extra": "En vivo",
      "2do Tiempo Extra": "En vivo",
      "Medio Tiempo": "En vivo",
      Penales: "En vivo",
      Finalizado: finishedState,
    };
    return statusMap[estado] ?? nextMatchState;
  };

  const isFinished = (estado) => estado === finishedState;
  const isNext = (estado) => estado === nextMatchState;

  const getFlagPath = (slugTeam) =>
    `https://cdna.elcomercio.pe/resources/dist/elcomercio/images/wc-2026-flags/${slugTeam}.png`;

  const getScoreClass = (estado) => (isNext(estado) ? classes.emptyScore : "");
  const getScoreValue = (goles, estado) => (isNext(estado) ? "-" : goles);
  const getCalendarIcon = (estado) =>
    !isFinished(estado) ? `<div class="${classes.calendarIcon}"></div>` : "";
  const getMatchTime = (estado, matchTime) =>
    !isFinished(estado) ? `${matchTime} EST` : "FT";

  const getPenalties = (estado, penales) => {
    let penaltiesScore = "";

    if (
      (estado === penaltiesState || estado === finishedState) &&
      penales !== ""
    ) {
      penaltiesScore = `<span class="${classes.score} ${getScoreClass(estado)}">
             (${penales})
            </span>`;
    }

    return penaltiesScore;
  };

  const renderMatch = (match) => {
    const article = document.createElement("article");
    article.className = `${classes.fixtureCard} ${
      isFinished(match.estado) ? classes.fixturefinishedCard : ""
    }`;
    article.dataset.id = match.iD;

    article.innerHTML = `
      <header class="${classes.fixtureCardTopHeader}">
        <span class="${classes.fixtureCardGroup}">
          ${getCardTitle(match.grupo ?? "", match.fecha)}
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
            <img class="${classes.flag}" src="${getFlagPath(
      match.slugSeleccion1
    )}" alt="${match.seleccion1}" loading="lazy" />
            <span class="${classes.teamName}">${match.seleccion1}</span>
          </div>
          <div class="${classes.teamScore}">
            <span class="${classes.score} ${getScoreClass(match.estado)}">
              ${getScoreValue(match.goles1, match.estado)}
            </span>
            ${getPenalties(match.estado, match.pen1)}
          </div>
        </div>
        <div class="${classes.team}">
          <div class="${classes.teamInfo}">
            <img class="${classes.flag}" src="${getFlagPath(
      match.slugSeleccion2
    )}" alt="${match.seleccion2}" loading="lazy" />
            <span class="${classes.teamName}">${match.seleccion2}</span>
          </div>
          <div class="${classes.teamScore}">
            <span class="${classes.score} ${getScoreClass(match.estado)}">
              ${getScoreValue(match.goles2, match.estado)}
            </span>
            ${getPenalties(match.estado, match.pen2)}
          </div>
        </div>
      </section>
      <footer class="${classes.cardBottom}">
        <div class="${classes.calendarTime}">
          ${getCalendarIcon(match.estado)}
          <span class="${classes.time}">${getMatchTime(
      match.estado,
      match.horaLima
    )}</span>
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

  // ── Breakpoint helpers ────────────────────────────────────────────────────

  const isMobile = () => window.innerWidth < MOBILE_BREAKPOINT;
  const isTablet = () =>
    window.innerWidth >= MOBILE_BREAKPOINT &&
    window.innerWidth < TABLET_BREAKPOINT;
  const isDesktop = () => window.innerWidth >= TABLET_BREAKPOINT;

  const getStep = () => {
    if (isMobile()) return MOBILE_STEP;
    if (isTablet()) return TABLET_STEP;
    return DESKTOP_STEP;
  };

  const getVisibleCount = () => {
    if (isMobile()) return MOBILE_VISIBLE;
    if (isTablet()) return TABLET_VISIBLE;
    return DESKTOP_VISIBLE;
  };

  // ── Carousel ──────────────────────────────────────────────────────────────

  const getCardStride = () => {
    const firstCard = matchesContainer.firstElementChild;
    if (!firstCard) return 0;
    const gap = parseFloat(getComputedStyle(matchesContainer).gap) || 0;
    return firstCard.offsetWidth + gap;
  };

  const updateCarousel = (total) => {
    const stride = getCardStride();
    const visibleCount = getVisibleCount();

    matchesContainer.style.transform = `translateX(-${
      currentIndex * stride
    }px)`;

    carouselBtnPrev.style.display = currentIndex === 0 ? "none" : "";

    carouselBtnNext.style.display =
      currentIndex + visibleCount >= total ? "none" : "";

    // Contador: siempre de 1 en 1
    cardCounter.textContent = `Mostrando ${currentIndex + 1} de ${total}`;
  };

  const initCarousel = (matchList) => {
    const total = matchList.length;

    currentIndex = 0;
    carouselBtnsContainer.classList.remove(hiddenArrowsClass);
    carouselBtnPrev.style.display = "none";

    matchesContainer.style.overflow = "visible";
    matchesContainer.style.transition = "transform 0.35s ease";
    matchesContainer.style.willChange = "transform";

    updateCarousel(total);

    carouselBtnNext.addEventListener("click", () => {
      const visibleCount = getVisibleCount();
      const step = getStep();
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

    window.addEventListener("resize", () => {
      currentIndex = 0;
      updateCarousel(total);
    });
  };

  // ── Init ──────────────────────────────────────────────────────────────────

  matches = await getWorldCupMatchesFromApi();

  if (matches?.length > 0) {
    renderMatches(matches);
    initCarousel(matches);
  }
};
