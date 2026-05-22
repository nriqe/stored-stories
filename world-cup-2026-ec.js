const getWorldCupMatches = async (
  idMatchesContainer,
  idCarouselBtnPrev,
  idCarouselBtnNext,
  idCardCounter,
  strClasses,
  jsonPath
) => {
  const classes = JSON.parse(strClasses);
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
      const response = await fetch(`${jsonPath}}?${currentTime}`,
        {
          method: "GET",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      /*if (
        !response.status ||
        response.status !== successfullResponse ||
        !response.ok
      ) {
        throw new Error("Error al obtener las notas de usuario.");
      }*/

      const result = await response.json();
      console.log('PARTIDOS DESDE EL JSON:',result);
      return result;
    } catch (error) {
      throw new Error("ERROR AL TRAER LOS PARTIDOS: ", error);
    }
  };

  await getWorldCupMatchesFromApi();
};
