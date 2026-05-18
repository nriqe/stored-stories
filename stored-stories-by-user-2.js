const getStoriesByUser = async (
  idUserStoriesContainer,
  idEmptyStoriesContainer,
  maxStories,
  minStories,
  website,
  strClasses,
  idShowMoreButton
) => {
  const classes = JSON.parse(strClasses);

  // Validación: maxStories no puede ser mayor a 20
  if (maxStories > 20) {
    throw new Error(`maxStories no puede ser mayor a 20. Valor recibido: ${maxStories}`);
  }

  const getDeployment = () => {
    let deployment = null;
    if (typeof window !== "undefined") {
      const deploymentTag = document.querySelector('meta[name="deployment"]');
      deployment = deploymentTag ? deploymentTag.getAttribute("content") : null;
      if (!deployment || deployment === "$LATEST") {
        return null;
      }
      return deployment;
    }
    return null;
  };

  const deployment = getDeployment() ? `&d=${getDeployment()}` : "";
  const successfullResponse = 200;
  const emptyStoriesContainer = document.getElementById(idEmptyStoriesContainer);
  const emptyContainerHiddenClass = classes.emptyContainerHidden;
  const userStoriesContainer = document.getElementById(idUserStoriesContainer);
  const loadingTitleClass = classes.loading;
  const loadingTitleHiddenClass = classes.loadingHidden;
  const loadingTitle = document.querySelector(`.${loadingTitleClass}`);
  const showMoreButton = document.getElementById(idShowMoreButton);
  const showMoreButtonHiddenClass = classes.showMoreBtnHidden;
  const spinnerClass = classes.spinner;
  const loadingSpinnerClass = classes.loadingSpinner;
  const spinner = document.querySelector(`.${spinnerClass}`);

  // Estado de paginación
  let storedIdsByUser = [];
  let renderedIds = new Set();
  let currentPage = 0;
  
  const getStoriesIdsByUser = async () => {
    const userToken = window?.tp?.pianoId?.getToken() || "";
    const currentTime = new Date().getTime();

    if (userToken === "" || typeof userToken === "undefined") {
      throw new Error("El token de usuario no es válido o no existe.");
    }

    try {
      const response = await fetch(
        `/pf/api/v3/content/fetch/get-stored-ids-by-user?query=${JSON.stringify(
          { userToken, website }
        )}&_website=${website}${deployment}&token=${currentTime}`,
        {
          method: "GET",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (
        !response.status ||
        response.status !== successfullResponse ||
        !response.ok
      ) {
        throw new Error("Error al obtener los ids de usuario.");
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      throw new Error("ERROR DE API DE OBTENER IDS: ", error);
    }
  };

  const getStoriesByUserIds = async (ids) => {
    const currentTime = new Date().getTime();

    try {
      const response = await fetch(
        `/pf/api/v3/content/fetch/get-stories-by-user-ids?query=${JSON.stringify(
          { ids: ids.join(","), website }
        )}&_website=${website}${deployment}&token=${currentTime}`,
        {
          method: "GET",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (
        !response.status ||
        response.status !== successfullResponse ||
        !response.ok
      ) {
        throw new Error("Error al obtener las notas de usuario.");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      throw new Error("ERROR DE API DE NOTAS DE USUARIO: ", error);
    }
  };

  // --- Loading title helper ---
  const hideLoadingTitle = () => {
    if (loadingTitle) loadingTitle.classList.add(loadingTitleHiddenClass);
  };

  // --- Spinner y botón helpers ---
  const setShowMoreLoading = (isLoading) => {
    if (!showMoreButton) return;
    if (isLoading) {
      showMoreButton.disabled = true;
      if (spinner) spinner.classList.add(loadingSpinnerClass);
    } else {
      showMoreButton.disabled = false;
      if (spinner) spinner.classList.remove(loadingSpinnerClass);
    }
  };

  const formatDateSmart = (iso) => {
    const date = new Date(iso);
    const now = new Date();

    const isSameDay =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();

    if (isSameDay) {
      return (
        new Intl.DateTimeFormat("es-PE", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(date) + " hs"
      );
    }

    return new Intl.DateTimeFormat("sv-SE").format(date);
  };

  const handleDeleteStory = async (storyId, articleElement) => {
    const userToken = window?.tp?.pianoId?.getToken() || "";
    const currentTime = new Date().getTime();

    if (userToken === "" || typeof userToken === "undefined") {
      throw new Error("El token de usuario no es válido o no existe.");
    }

    try {
      const response = await fetch(
        `/pf/api/v3/content/fetch/delete-user-stored-id?query=${JSON.stringify({
          storyId,
          userToken,
          website,
        })}&_website=${website}${deployment}&token=${currentTime}`,
        {
          method: "GET",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        console.info(`Nota de id ${storyId} eliminada.`);
        articleElement.remove();
        renderedIds.delete(storyId);
        storedIdsByUser = storedIdsByUser.filter((id) => id !== storyId);

        const nextId = [...storedIdsByUser].find((id) => !renderedIds.has(id));

        if (nextId) {
          const newStories = await getStoriesByUserIds([nextId]);
          if (newStories && newStories.length > 0) {
            renderStorySafe(newStories, true);
          }
        } else if (userStoriesContainer.children.length === 0) {
          emptyStoriesContainer.classList.remove(emptyContainerHiddenClass);
        }

        if (renderedIds.size <= minStories && showMoreButton) {
          showMoreButton.classList.add(showMoreButtonHiddenClass);
        }
      }
    } catch (error) {
      throw new Error("ERROR DE API DE NOTAS DE USUARIO: ", error);
    }
  };

  const renderStorySafe = (storedStoriesByUserIds, atFinalPos) => {
    storedStoriesByUserIds.forEach((story) => {
      renderedIds.add(story._id);

      const articleContainer = document.createElement("article");
      articleContainer.className = classes.storedStory;

      const divStoryContainer = document.createElement("div");
      divStoryContainer.className = classes.storyContainer;

      const h3StorySection = document.createElement("div");
      h3StorySection.className = classes.storySection;

      if (story.section.path && story.section.name) {
        const anchorStorySection = document.createElement("a");
        anchorStorySection.href = story.section.path;
        anchorStorySection.target = "_blank";
        anchorStorySection.setAttribute("rel", "noopener noreferrer");
        anchorStorySection.className = classes.storySectionLink;
        anchorStorySection.innerHTML = story.section.name;

        h3StorySection.append(anchorStorySection);
        divStoryContainer.append(h3StorySection);
      }

      if (story.website_url && story.headline) {
        const h2StoryTitle = document.createElement("div");
        h2StoryTitle.className = classes.storyTitle;

        const anchorStoryTitle = document.createElement("a");
        anchorStoryTitle.href = story.website_url;
        anchorStoryTitle.target = "_blank";
        anchorStoryTitle.setAttribute("rel", "noopener noreferrer");
        anchorStoryTitle.className = classes.storyTitleLink;
        anchorStoryTitle.innerHTML = story.headline;

        h2StoryTitle.append(anchorStoryTitle);
        divStoryContainer.append(h2StoryTitle);
      }

      const divAuthorTimeSection = document.createElement("div");
      divAuthorTimeSection.className = classes.authorTime;

      if (story.author.url && story.author.name) {
        const anchorAuthor = document.createElement("a");
        anchorAuthor.href = story.author.url;
        anchorAuthor.target = "_blank";
        anchorAuthor.setAttribute("itemprop", "url");
        anchorAuthor.setAttribute("rel", "noopener noreferrer");
        anchorAuthor.className = classes.author;
        anchorAuthor.innerHTML = story.author.name;
        divAuthorTimeSection.append(anchorAuthor);
      }

      if (story.display_date) {
        const spanDotSeparator = document.createElement("span");
        spanDotSeparator.className = classes.dotSeparator;
        spanDotSeparator.innerHTML = ".";

        const timeDateTime = document.createElement("time");
        timeDateTime.className = classes.dateTime;
        timeDateTime.innerHTML = formatDateSmart(story.display_date);

        divAuthorTimeSection.append(spanDotSeparator);
        divAuthorTimeSection.append(timeDateTime);
      }

      if (story._id) {
        const btnDeleteStory = document.createElement("button");
        btnDeleteStory.className = classes.btnDeleteStory;

        btnDeleteStory.addEventListener("click", async () => {
          await handleDeleteStory(story._id, articleContainer);
        });

        articleContainer.append(btnDeleteStory);
      }

      divStoryContainer.append(divAuthorTimeSection);
      articleContainer.append(divStoryContainer);

      if (atFinalPos) {
        userStoriesContainer.append(articleContainer);
        return;
      }

      userStoriesContainer.prepend(articleContainer);
      return;
    });
  };

  // --- Paginación ---
  const getIdsForPage = (page) => {
    const start = (page - 1) * maxStories;
    const end = start + maxStories;
    return storedIdsByUser.slice(start, end);
  };

  const hasMorePages = () => {
    return currentPage * maxStories < storedIdsByUser.length;
  };

  const updateShowMoreButtonVisibility = () => {
    if (!showMoreButton) return;
    if (hasMorePages()) {
      showMoreButton.classList.remove(showMoreButtonHiddenClass);
    } else {
      showMoreButton.classList.add(showMoreButtonHiddenClass);
    }
  };

  const loadNextPage = async () => {
    if (!hasMorePages()) return;

    setShowMoreLoading(true);

    try {
      currentPage += 1;
      const idsToFetch = getIdsForPage(currentPage);
      const newStories = await getStoriesByUserIds(idsToFetch);

      if (newStories && newStories.length > 0) {
        renderStorySafe(newStories, true);
      }

      updateShowMoreButtonVisibility();
    } catch (error) {
      console.error('Error al cargar más historias:', error);
    } finally {
      setShowMoreLoading(false);
    }
  };

  // --- Inicialización ---
  if (window?.tp?.user?.isUserValid()) {
    storedIdsByUser = await getStoriesIdsByUser();

    if (!storedIdsByUser || storedIdsByUser.length === 0) {
      emptyStoriesContainer.classList.remove(emptyContainerHiddenClass);
      hideLoadingTitle();
      return;
    }

    // Renderizar primera página
    currentPage = 1;
    const firstPageIds = getIdsForPage(currentPage);
    const firstPageStories = await getStoriesByUserIds(firstPageIds);

    if (!firstPageStories || firstPageStories.length === 0) {
      hideLoadingTitle();
      return;
    }

    renderStorySafe(firstPageStories, true);
    hideLoadingTitle();

    // Configurar botón "Ver más": mostrar sólo si hay más páginas
    if (showMoreButton) {
      updateShowMoreButtonVisibility();
      showMoreButton.addEventListener('click', loadNextPage);
    }
  }
};
