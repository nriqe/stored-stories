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

  console.log(
    "PROBANDO JS MUNDIAL:",
    idMatchesContainer,
    classes,
    idCarouselBtnPrev,
    idCarouselBtnNext,
    idCardCounter,
    jsonPath
  );

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

  await getWorldCupMatchesFromApi();
};
