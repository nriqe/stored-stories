const getWorldCupMatches = async (
  idMatchesContainer,
  isLive,
  round,
  strClasses,
  jsonPath,
  arcSite,
  SITE_DEPOR,
  SITE_ELCOMERCIO,
) => {
  console.log("Live de marcadores activado:", isLive);
  const timeInterval = 60000;
  const classes = JSON.parse(strClasses);
  const successfullResponse = 200;

  const matchesContainer = document.getElementById(idMatchesContainer);

  const roundStage = "fase-de-grupos";

  const nextMatchState = "Próximo";
  const penaltiesState = "Penales";
  const finishedState = "Finalizado";

  if (!matchesContainer) {
    throw new Error("No existe el contenedor de partidos.");
  }

  let matches = [];

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

  const getCardTitle = (matchGroup, matchDate) => {
    const title =
      round === roundStage && matchGroup
        ? `Grupo ${matchGroup}`
        : getRound(round);
    return `${title} • ${formatDate(matchDate)}`;
  };

  const getStatusClass = (estado) => {
    const statusMap = {
      Próximo: classes.nextFixtureCardStatus,
      "En vivo": classes.liveFixtureCardStatus,
      "1er Tiempo": classes.liveFixtureCardStatus,
      Entretiempo: classes.liveFixtureCardStatus,
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
      Entretiempo: "En vivo",
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

  const getScoreValue = (goles, estado) =>
    `<div class="${classes.wrapScore}">
        <span>
          ${isNext(estado) ? "-" : goles}
        </span>
      </div>`;

  const getCalendarIcon = (estado) =>
    !isFinished(estado) ? `<div class="${classes.calendarIcon}"></div>` : "";

  const getMatchTime = (estado, matchTime) => {
    if (isNext(estado)) return `${matchTime} EST`;
    if (isFinished(estado)) return "Finalizado";
    return estado;
  };

  const getPenalties = (estado, penales) => {
    if (
      (estado === penaltiesState || estado === finishedState) &&
      penales !== ""
    ) {
      return `<span class="${classes.score}">(${penales})</span>`;
    }
    return "";
  };

  const getMatchLink = (
    arcSite,
    notaElComercio,
    notaDepor,
    SITE_ELCOMERCIO,
    SITE_DEPOR,
  ) => {
    if (arcSite === SITE_ELCOMERCIO && notaElComercio) return notaElComercio;
    if (arcSite === SITE_DEPOR && notaDepor) return notaDepor;
    return null;
  };

  const wrapWithLink = (content, url) => {
    if (!url) return content;
    return `<a href="${url}" class="${classes.matchLink}" target="_blank" rel="noopener noreferrer">${content}</a>`;
  };

  const getTeamInfo = (slugSeleccion, seleccion) => `
    <img
      class="${classes.flag}"
      alt="${seleccion}"
      src="${getFlagPath(slugSeleccion)}"
      width="18"
      height="18"
      loading="lazy"
    />
    <span class="${classes.teamName}">${seleccion}</span>`;

  const renderMatch = (match) => {
    const article = document.createElement("article");
    article.className = classes.wrapTeam;
    article.dataset.id = match.iD;

    const matchUrl = getMatchLink(
      arcSite,
      match.notaElComercio,
      match.notaDepor,
      SITE_ELCOMERCIO,
      SITE_DEPOR,
    );

    article.innerHTML = `
      <div class="${classes.team}">
        ${wrapWithLink(
          getTeamInfo(match.slugSeleccion1, match.seleccion1),
          matchUrl,
        ).trim()}        
        <div class="${classes.wrapScore}">
          ${getScoreValue(match.goles1, match.estado)}
          ${getPenalties(match.estado, match.pen1 ?? "")}
        </div>
      </div>
      <div class="${classes.team}">
        ${wrapWithLink(
          getTeamInfo(match.slugSeleccion2, match.seleccion2),
          matchUrl,
        ).trim()}        
        <div class="${classes.wrapScore}">
          ${getScoreValue(match.goles2, match.estado)}
          ${getPenalties(match.estado, match.pen2 ?? "")}
        </div>
      </div>
      <span class="${classes.time}">${getMatchTime(
        match.estado,
        match.horaLima,
      )}</span>
    `;
    return article;
  };

  const renderMatches = (matchList) => {
    matchesContainer.innerHTML = "";
    const fragment = document.createDocumentFragment();
    matchList.forEach((match) => fragment.appendChild(renderMatch(match)));
    matchesContainer.appendChild(fragment);
  };

  // ── Init ──────────────────────────────────────────────────────────────────

  matches = await getWorldCupMatchesFromApi();

  if (matches?.length > 0) {
    renderMatches(matches);
  }

  if (isLive) {
    setInterval(async () => {
      console.log("Refetching de partidos...");
      try {
        const updatedMatches = await getWorldCupMatchesFromApi();
        if (!updatedMatches?.length) return;
        renderMatches(updatedMatches);
      } catch (error) {
        console.error("Error al actualizar los partidos en vivo:", error);
      }
    }, timeInterval);
  }
};
