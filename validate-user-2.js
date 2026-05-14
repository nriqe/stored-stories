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
  const birthdayFrontPageContainer = document.getElementsByClassName(
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

   const getDisplayType = () => window.screen.width >= 768 ? "flex" : "block";

  if (window?.tp?.user?.isUserValid()) {
    if (storiesCardContainer[0]){
      storiesCardContainer[0].classList.remove(storiesCardContainerHiddenClass);    
    }

    if (highlightStoryContainer) {
      highlightStoryContainer.classList.remove(highlightStoryContainerHiddenClass);
    }

    if (birthdayFrontPageContainer[0]){
      birthdayFrontPageContainer[0].classList.remove(birthdayFrontPageContainerHiddenClass);  
    }

    if (exploreMoreContainer[0]) {
      exploreMoreContainer[0].classList.remove(exploreMoreContainerHiddenClass);  
    }

    if (myStoriesContainer[0]) {
      myStoriesContainer[0].classList.remove(myStoriesContainerHiddenClass);  
    }       

    const userData = window.tp.pianoId.getUser() || {};

    if (userData === {}){
      throw new Error("Usuario no válido.");
    }
    
    const { firstName } = userData || "";
    welcomeMessage = firstName ? `Hola, ${firstName}` : "Hola";
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
