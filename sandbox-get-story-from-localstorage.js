console.log("Holaa desde el script de sandbox!!!!!, 5.52pm");

const getStoryFromLocalStorage = async (
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

  const deployment = getDeployment() ? `&d=${getDeployment()}` : "&d=4656";

  console.log("DEPLOYMENT: ", deployment);

  const getPhotoData = async (photoId) => {
    try {
      const imgResponse = await fetch(
        "/pf/api/v3/content/fetch/photo-by-id?query={%22_id%22:%22" +
          photoId +
          "%22}&_website=" +
          website +
          deployment
      );

      if (imgResponse.status === 200) {
        const imgData = await imgResponse.json();
        const {
          caption,
          subtitle: legend,
          resized_urls: { landscape_l, medium } = {},
        } = imgData;
        return { caption, legend, landscape_l, medium };
      }
    } catch (error) {
      console.log("Error", error);
    }
    return null;
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

  const getMostFrequentSectionStories = () => {
    const data =
      JSON.parse(localStorage.getItem(localStorageJustSeenStoriesKey)) || [];

    if (!data.length) return [];

    const sectionCount = data.reduce((acc, item) => {
      const section = item.primarySectionSlug;
      acc[section] = (acc[section] || 0) + 1;
      return acc;
    }, {});

    const mostFrequentSection = Object.entries(sectionCount).reduce(
      (max, current) => (current[1] > max[1] ? current : max),
      ["", 0]
    )[0];

    return data.filter(
      (item) => item.primarySectionSlug === mostFrequentSection
    );
  };

  const stories = getMostFrequentSectionStories();

  let firstStory = null;

  if (stories.length >= 1) {
    firstStory = stories[0];
  }

  const renderStorySafe = async (firstStory, idHighlightStoryForYou) => {
    const container = document.getElementById(idHighlightStoryForYou);

    if (!container) return;

    container.innerHTML = "";

    const figure = document.createElement("figure");
    figure.className = classes.fig;
    container.appendChild(figure);

    const contentContainer = document.createElement("div");
    contentContainer.className = classes.content;
    container.appendChild(contentContainer);

    const {
      photoId,
      isPremium,
      isLive,
      primarySection,
      primarySectionSlug,
      title,
      link,
      subtitle,
      author,
      authorLink,
      pubDate,
    } = firstStory;

    const imgData =
      typeof photoId !== "undefined" ? await getPhotoData(photoId) : null;

    if (imgData) {
      const { caption, legend, landscape_l: landscapeL, medium } = imgData;

      const anchorImg = document.createElement("a");
      anchorImg.href = link;
      anchorImg.target = "_blank";
      anchorImg.className = classes.imgLink;
      anchorImg.setAttribute("rel", "noopener noreferrer");

      const pictureImg = document.createElement("picture");
      const mobileSourceMedia = document.createElement("source");
      const imgMedia = document.createElement("img");

      mobileSourceMedia.media = "(max-width: 639px)";
      mobileSourceMedia.src = medium;
      mobileSourceMedia.srcset = medium;

      imgMedia.src = landscapeL;
      imgMedia.alt = caption || legend || "";
      imgMedia.className = classes.img;

      pictureImg.append(mobileSourceMedia);
      pictureImg.append(imgMedia);
      anchorImg.append(pictureImg);
      figure.append(anchorImg);

      if (isLive) {
        const divLiveTag = document.createElement("div");
        divLiveTag.className = classes.live;
        const divLiveIcon = document.createElement("div");
        divLiveIcon.className = classes.blinkingLive;
        const spanLiveText = document.createElement("span");
        spanLiveText.className = classes.liveText;
        spanLiveText.innerHTML = "EN VIVO";
        divLiveTag.append(divLiveIcon);
        divLiveTag.append(spanLiveText);
        anchorImg.append(divLiveTag);
      }

      if (isPremium) {
        const premiumSpan = document.createElement("span");
        premiumSpan.className = `${classes.tag} ${classes.premiumTag}`;
        const suscriptorSpan = document.createElement("span");
        suscriptorSpan.className = classes.suscriptorIcon;
        const labelPremiumSpan = document.createElement("span");
        labelPremiumSpan.className = classes.label;
        labelPremiumSpan.innerHTML = "Suscriptores";

        premiumSpan.append(suscriptorSpan);
        premiumSpan.append(labelPremiumSpan);

        anchorImg.append(premiumSpan);
      }
    }

    if (primarySection && primarySectionSlug) {
      const pSection = document.createElement("p");
      pSection.className = classes.section;
      contentContainer.appendChild(pSection);

      const anchorSection = document.createElement("a");
      anchorSection.href = primarySectionSlug;
      anchorSection.target = "_blank";
      anchorSection.setAttribute("rel", "noopener noreferrer");
      anchorSection.innerHTML = primarySection;
      pSection.append(anchorSection);
    }

    if (title && link) {
      const h2Title = document.createElement("h2");
      h2Title.className = classes.title;
      const anchorTitle = document.createElement("a");
      anchorTitle.href = link;
      anchorTitle.target = "_blank";
      anchorTitle.setAttribute("rel", "noopener noreferrer");
      anchorTitle.innerHTML = title;
      h2Title.appendChild(anchorTitle);
      contentContainer.appendChild(h2Title);
    }

    if (subtitle) {
      const pSubtitle = document.createElement("p");
      pSubtitle.innerHTML = subtitle;
      pSubtitle.className = classes.subtitle;
      container.appendChild(pSubtitle);
    }

    const footer = document.createElement("div");
    footer.className = classes.footer;
    container.appendChild(footer);

    if (author && authorLink) {
      const addressAuthor = document.createElement("address");
      addressAuthor.className = classes.author;
      const anchorAuthor = document.createElement("a");
      anchorAuthor.className = classes.authorList;
      anchorAuthor.href = authorLink;
      anchorAuthor.target = "_blank";
      anchorAuthor.setAttribute("rel", "noopener noreferrer");
      anchorAuthor.innerHTML = author;
      addressAuthor.appendChild(anchorAuthor);
      footer.appendChild(addressAuthor);
    }

    if (pubDate) {
      const spanDot = document.createElement("span");
      spanDot.className = `${classes.dot} pb-5`;
      spanDot.innerHTML = ".";
      const timeDate = document.createElement("time");
      timeDate.className = classes.date;
      timeDate.dateTime = pubDate.replace("Z", "");
      timeDate.innerHTML = formatDateSmart(pubDate);
      footer.appendChild(spanDot);
      footer.appendChild(timeDate);
    }
  };

  if (firstStory !== null) {
    await renderStorySafe(firstStory, idHighlightStoryForYou);
  }
};
