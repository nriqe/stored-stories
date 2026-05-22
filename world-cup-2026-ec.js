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

  /**
   * fixtureCard: 'fixture-card',
  fixtureCardSkeleton: 'fixture-card--skeleton',
  fixtureCardTopHeader: 'fixture-card__top',
  fixtureCardGroup: 'fixture-card__group',
  finishedFixtureCardGroup: 'fixture-card__top--finished',
  fixtureCardStatus: 'fixture-card__status',
  liveFixtureCardStatus: 'fixture-card__status--live',
  nextFixtureCardStatus: 'fixture-card__status--next',
  finishedFixtureCardStatus: 'fixture-card__status--finished',
  group: 'fixture-card__group',
  teamsContainer: 'fixture-card__teams',
  team: 'fixture-card__team',
  teamInfo: 'fixture-card__team-info',
  flag: 'fixture-card__flag',
  teamName: 'fixture-card__team-name',
  teamScore: 'fixture-card__team-score',
  score: 'fixture-card__score',
  cardBottom: 'fixture-card__bottom',
  calendarTime: 'fixture-card__calendar-time',
  calendarIcon: 'fixture-card__calendar',
  time: 'fixture-card__time',
  stadium: 'fixture-card__stadium',
   */

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
    return date.toLocaleDateString("es-PE", { day: "numeric", month: "short" });
  };

  const getStatusClass = (estado) => {
    const statusMap = {
      Próximo: classes.nextFixtureCardStatus,
      "En vivo": classes.liveFixtureCardStatus,
      "1er Tiempo": classes.liveFixtureCardStatus,
      "2do Tiempo": classes.liveFixtureCardStatus,
      "Medio Tiempo": classes.liveFixtureCardStatus,
      Finalizado: classes.finishedFixtureCardStatus,
    };
    return statusMap[estado] ?? classes.nextFixtureCardStatus;
  };

  const isFinished = (estado) => estado === "Finalizado";
  const isLive = (estado) =>
    ["En vivo", "1er Tiempo", "2do Tiempo", "Medio Tiempo"].includes(estado);
  const isNext = (estado) => estado === "Próximo";

  const getScoreClass = (estado) =>
    isNext(estado)
      ? "fixture-card__score--empty"
      : "fixture-card__score--filled";

  const getScoreValue = (goles, estado) => (isNext(estado) ? "-" : goles);

  const renderMatch = (match) => {
    const article = document.createElement("article");
    article.className = classes.fixtureCard;
    article.dataset.id = match.iD;

    article.innerHTML = `
      <header class="${classes.fixtureCardTopHeader}">
        <span class="${classes.fixtureCardGroup}">Grupo ${match.grupo} • ${formatDate(match.fecha)}</span>
        <span class="${classes.fixtureCardTopHeader} ${getStatusClass(match.estado)}">
          ${match.estado}
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
        <div class="${classes.teamsContainer}">
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
          <div class="${classes.calendarIcon}"></div>
          <span class="${classes.time}">${match.horaLima} EST</span>
        </div>
        <span class="${classes.stadium}">${match.sede}</span>
      </footer>
    `;

    return article;
  };

  const renderMatches = (matches) => {
    matchesContainer.innerHTML = "";

    const fragment = document.createDocumentFragment();
    matches.forEach((match) => fragment.appendChild(renderMatch(match)));
    matchesContainer.appendChild(fragment);
  };

  matches = await getWorldCupMatchesFromApi();

  if (matches?.length > 0) {
    renderMatches(matches.slice(0, 6));
  }
};
