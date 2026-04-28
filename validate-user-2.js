const validateUser = (params) => {
  const parsedParams = JSON.parse(params);

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

  const storiesCardContainer = document.getElementsByClassName(
    storiesCardContainerClass
  );
  const highlightStoryContainer = document.getElementById(
    idHighlightStoryContainer
  );
  const brithdayFrontPageContainer = document.getElementsByClassName(
    birthdayFrontPageContainerClass
  );
  const exploreMoreContainer = document.getElementsByClassName(
    exploreMoreContainerClass
  );
  const myStoriesContainer = document.getElementsByClassName(
    myStoriesContainerClass
  );
  const contentContainer = document.getElementsByClassName(
    contentContainerClass
  );
  const welcomeLoginContainer = document.getElementById(
    idWelcomeLoginContainer
  );
  const welcomeLoginTitleH1 = document.getElementById(idWelcomeLoginTitle);
  const welcomeLoginSignInButton = document.getElementById(
    idWelcomeLoginSignInButton
  );
  let welcomeMessage = "";

  const homeButton = document.getElementById(idHomeButton);
  const storedStoriesButton = document.getElementById(idStoredStoriesButton);
  const activeButtonClass = activeMainLogInBtnCategoryClass;

  const getDisplayType = () => {
    return window.screen.width >= 768 ? "flex" : "block";
  };

  console.log("IS USER PIANO VALID, ", window?.tp?.user?.isUserValid());
  if (window?.tp?.user?.isUserValid()) {
    storiesCardContainer[0].classList.remove(storiesCardContainerHiddenClass);
    highlightStoryContainer.classList.remove(
      highlightStoryContainerHiddenClass
    );
    brithdayFrontPageContainer[0].classList.remove(
      birthdayFrontPageContainerHiddenClass
    );
    exploreMoreContainer[0].classList.remove(exploreMoreContainerHiddenClass);
    myStoriesContainer[0].classList.remove(myStoriesContainerHiddenClass);

    const userData = window.tp.pianoId.getUser() || {};
    const { firstName } = userData || "";
    welcomeMessage = firstName ? "Hola, " + firstName : "Hola";
    welcomeLoginTitleH1.innerHTML = welcomeMessage;

    storedStoriesButton.disabled = false;

    homeButton.addEventListener("click", () => {
      homeButton.classList.add(activeButtonClass);
      storedStoriesButton.classList.remove(activeButtonClass);
      contentContainer[0].style.display = getDisplayType();
    });

    storedStoriesButton.addEventListener("click", () => {
      homeButton.classList.remove(activeButtonClass);
      storedStoriesButton.classList.add(activeButtonClass);
      contentContainer[0].style.display = "none";
    });
  } else {
    welcomeLoginContainer.classList.remove(mainLogInDisplayNoneClass);
    contentContainer[0].style.display = "none";
  }
};
