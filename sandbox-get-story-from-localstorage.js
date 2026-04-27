console.log("Holaa desde el script de sandbox!!!!!, 4.48pm");

const getStoryFromLocalStorage = (
  localStorageJustSeenStoriesKey,
  maxStoriesFromLs,
  idHighlightStoryForYou,
  strClasses,
  website
) => {
  const classes = JSON.parse(strClasses);
  console.log(
    "NUEVO SCRIPT:",
    localStorageJustSeenStoriesKey,
    maxStoriesFromLs,
    idHighlightStoryForYou,
    classes,
    website
  );
};
