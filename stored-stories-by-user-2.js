const getStoriesByUser = (
  idUserStoriesContainer,
  idEmptyStoriesContainer,
  maxStories,
  website,
  strClasses
) => {
  const classes = JSON.parse(strClasses);
  console.log(
    "DESDE SCRIPT EXTERNO",
    window?.tp?.user?.isUserValid(),
    idUserStoriesContainer,
    idEmptyStoriesContainer,
    maxStories,
    website,
    classes
  );
};
