const validateUser = (params) => {
  const userData = window.tp.pianoId.getUser() || {};
  const userToken = window?.tp?.pianoId?.getToken() || "";

  const parsedParams = JSON.parse(params);
  console.log(
    "USER DATA DESDE JS EXTERNO: ",
    parsedParams,
    userData,
    userToken
  );

  const {
    idWelcomeLoginContainer,
    idWelcomeLoginTitle,
    idWelcomeLoginSignInButton,
    mainLogInDisplayNoneClass,
    idHomeButton,
    idStoredStoriesButton,
    activeMainLogInBtnCategoryClass,
    storiesCardContainerClass,
    idHighlightStoryContainer,
    birthdayFrontPageContainerClass,
    exploreMoreContainerClass,
    myStoriesContainerClass,
    contentContainerClass,
    storiesCardContainerHiddenClass,
    highlightStoryContainerHiddenClass,
    birthdayFrontPageContainerHiddenClass,
    exploreMoreContainerHiddenClass,
    myStoriesContainerHiddenClass,
  } = parsedParams;

  console.log(
    "PARSED CLASSES AND IDS:",
    idWelcomeLoginContainer,
    idWelcomeLoginTitle,
    idWelcomeLoginSignInButton,
    mainLogInDisplayNoneClass,
    idHomeButton,
    idStoredStoriesButton,
    activeMainLogInBtnCategoryClass,
    storiesCardContainerClass,
    idHighlightStoryContainer,
    birthdayFrontPageContainerClass,
    exploreMoreContainerClass,
    myStoriesContainerClass,
    contentContainerClass,
    storiesCardContainerHiddenClass,
    highlightStoryContainerHiddenClass,
    birthdayFrontPageContainerHiddenClass,
    exploreMoreContainerHiddenClass,
    myStoriesContainerHiddenClass
  );
};
