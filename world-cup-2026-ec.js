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

  if(!matchesContainer || !carouselBtnPrev || !carouselBtnNext || !cardCounter){
    throw new Error("No existe uno de los contenedores.");
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
      console.log('PARTIDOS DESDE EL JSON:',response,result);
      return result;
    } catch (error) {
      throw new Error("ERROR DE API LOS PARTIDOS: ", error);
    }
  };

  matches = await getWorldCupMatchesFromApi();
};
