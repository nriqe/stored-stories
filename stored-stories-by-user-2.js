const getStoriesByUser = async (
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
  const emptyStoriesContainer = document.getElementById(
    idEmptyStoriesContainer
  );
  const emptyContainerHiddenClass = classes.emptyContainerHidden;
  const userStoriesContainer = document.getElementById(idUserStoriesContainer);

  let storedIdsByUser = [];
  let storedStoriesByUserIds = [];
  let renderedIds = new Set();

  const getStoriesIdsByUser = async () => {
    let storedIdsByUser = [];
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
      storedIdsByUser = result.data;
      return storedIdsByUser;
    } catch (error) {
      throw new Error("ERROR DE API DE OBTENER IDS: ", error);
    }
  };

  const getStoriesByUserIds = async (storedIdsByUser) => {
    let storedStoriesByUserIds = [];
    const currentTime = new Date().getTime();

    try {
      const response = await fetch(
        `/pf/api/v3/content/fetch/get-stories-by-user-ids?query=${JSON.stringify(
          { ids: storedIdsByUser.join(","), website }
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
      storedStoriesByUserIds = result;
      return storedStoriesByUserIds;
    } catch (error) {
      throw new Error("ERROR DE API DE NOTAS DE USUARIO: ", error);
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

        const nextId = [...storedIdsByUser]
          .reverse()
          .find((id) => !renderedIds.has(id));

        if (nextId) {
          const newStories = await getStoriesByUserIds([nextId]);
          if (newStories && newStories.length > 0) {
            renderStorySafe(newStories, false);
          }
        } else if (userStoriesContainer.children.length === 0) {
          emptyStoriesContainer.classList.remove(emptyContainerHiddenClass);
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

  if (window?.tp?.user?.isUserValid()) {
    storedIdsByUser = await getStoriesIdsByUser();

    if (!storedIdsByUser || storedIdsByUser.length === 0) {
      emptyStoriesContainer.classList.remove(emptyContainerHiddenClass);
      return;
    }

    storedStoriesByUserIds = await getStoriesByUserIds(
      storedIdsByUser.slice(maxStories)
    );

    if (!storedStoriesByUserIds || storedStoriesByUserIds.length === 0) {      
      return;
    }
    
    renderStorySafe(storedStoriesByUserIds, true);
  }
};
