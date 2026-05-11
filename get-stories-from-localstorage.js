/**
 * Utilizar los svg con comillas dobles con el javascript sin minificar. El código javascript minificado no acepta las comillas dobles.
 * Una vez terminados los cambios, minificar el js y utilizar los svg con comillas simples.
 */

/* const ecSvgIcon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="20" height="20" rx="10" fill="#ffcb05" /><path d="M10.305 14.783c-.61-.097-1.312-.29-1.687-.532a4.5 4.5 0 0 1-1.452-1.16c.515-.386 1.312-1.207 1.733-1.738.235-.242.375-.532.422-.725s.094-.531.094-1.014V5.652l.89-.773zm5.387-1.836-.234.193c-.703.628-1.5 1.015-2.155 1.304-.656.29-1.406.435-2.202.435h-.422V5.217c.75.387 1.125.58 1.921.58 1.124 0 2.155-.821 2.951-2.029l-.328-.145c-.421.532-.89.773-1.452.773-.656 0-1.499-.386-2.483-1.063L7.4 6.667v4.01c0 1.062-.047 1.4-.093 1.594-.094.193-.422.531-.422.531A5.4 5.4 0 0 1 5.714 9.42c0-1.014.28-1.932.796-2.802.422-.676.937-1.352 1.78-1.98l.094-.097L8.15 4.3v.096c-1.312.821-2.343 1.546-2.951 2.416q-1.125 1.665-1.125 3.623c0 1.063.281 2.077.797 3.092a5.3 5.3 0 0 0 2.248 2.319 6.14 6.14 0 0 0 3.045.82c.703 0 1.452-.144 2.202-.386a5.4 5.4 0 0 0 1.874-1.014c.515-.435.983-1.015 1.499-1.836l.187-.29z" fill="#000"/></svg>`
const audioSvgIcon = `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.333 15H1.667q-.688 0-1.177-.49A1.6 1.6 0 0 1 0 13.333V7.5q0-1.562.594-2.927t1.604-2.375A7.6 7.6 0 0 1 4.573.594 7.3 7.3 0 0 1 7.5 0q1.563 0 2.927.594t2.375 1.604a7.6 7.6 0 0 1 1.604 2.375Q15 5.937 15 7.5v5.833q0 .688-.49 1.177-.489.49-1.177.49h-1.666q-.688 0-1.177-.49a1.6 1.6 0 0 1-.49-1.177V10q0-.687.49-1.177.489-.49 1.177-.49h1.666V7.5q0-2.437-1.698-4.135T7.5 1.667 3.365 3.365 1.667 7.5v.833h1.666q.688 0 1.177.49T5 10v3.333q0 .688-.49 1.177-.489.49-1.177.49m0-5H1.667v3.333h1.666zm8.334 0v3.333h1.666V10z" fill="#000"/></svg>` */

const ecSvgIcon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="20" height="20" rx="10" fill="#ffcb05" /><path d="M10.305 14.783c-.61-.097-1.312-.29-1.687-.532a4.5 4.5 0 0 1-1.452-1.16c.515-.386 1.312-1.207 1.733-1.738.235-.242.375-.532.422-.725s.094-.531.094-1.014V5.652l.89-.773zm5.387-1.836-.234.193c-.703.628-1.5 1.015-2.155 1.304-.656.29-1.406.435-2.202.435h-.422V5.217c.75.387 1.125.58 1.921.58 1.124 0 2.155-.821 2.951-2.029l-.328-.145c-.421.532-.89.773-1.452.773-.656 0-1.499-.386-2.483-1.063L7.4 6.667v4.01c0 1.062-.047 1.4-.093 1.594-.094.193-.422.531-.422.531A5.4 5.4 0 0 1 5.714 9.42c0-1.014.28-1.932.796-2.802.422-.676.937-1.352 1.78-1.98l.094-.097L8.15 4.3v.096c-1.312.821-2.343 1.546-2.951 2.416q-1.125 1.665-1.125 3.623c0 1.063.281 2.077.797 3.092a5.3 5.3 0 0 0 2.248 2.319 6.14 6.14 0 0 0 3.045.82c.703 0 1.452-.144 2.202-.386a5.4 5.4 0 0 0 1.874-1.014c.515-.435.983-1.015 1.499-1.836l.187-.29z" fill="#000"/></svg>`;
const audioSvgIcon = `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.333 15H1.667q-.688 0-1.177-.49A1.6 1.6 0 0 1 0 13.333V7.5q0-1.562.594-2.927t1.604-2.375A7.6 7.6 0 0 1 4.573.594 7.3 7.3 0 0 1 7.5 0q1.563 0 2.927.594t2.375 1.604a7.6 7.6 0 0 1 1.604 2.375Q15 5.937 15 7.5v5.833q0 .688-.49 1.177-.489.49-1.177.49h-1.666q-.688 0-1.177-.49a1.6 1.6 0 0 1-.49-1.177V10q0-.687.49-1.177.489-.49 1.177-.49h1.666V7.5q0-2.437-1.698-4.135T7.5 1.667 3.365 3.365 1.667 7.5v.833h1.666q.688 0 1.177.49T5 10v3.333q0 .688-.49 1.177-.489.49-1.177.49m0-5H1.667v3.333h1.666zm8.334 0v3.333h1.666V10z" fill="#000"/></svg>`;

const getStoriesFromLocalStorage = async (
  source,
  queryJson,  
  arcSite,
  localStorageJustSeenStoriesKey,
  storiesQty,
  idJustSeenStories,
  strClasses
) => {
  console.log('DESDE EL SCRIPT:');
  console.log('SOURCE:', source);
  console.log('QUERY: ', JSON.parse(queryJson));
  const query = JSON.parse(queryJson);    
  const classes = JSON.parse(strClasses);

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

  const renderStoriesSafe = (stories, idJustSeenStories) => {
    const container = document.getElementById(idJustSeenStories);
    if (!container) return;

    container.innerHTML = "";

    stories.forEach((story) => {
      const anchor = document.createElement("a");
      anchor.href = story.link;
      anchor.target = "_blank";
      anchor.setAttribute("rel", "noopener noreferrer");
      anchor.className = classes.story;

      let premiumIcon = "";
      let audioIcon = "";

      const title = document.createElement("h3");
      title.className = classes.link;

      const date = document.createElement("time");
      date.className = classes.time;

      title.appendChild(date);
      anchor.appendChild(title);

      if (story.hasAudio) {
        audioIcon = audioSvgIcon;
      }

      date.innerHTML = formatDateSmart(story.pubDate) + audioIcon;

      const divTitle = document.createElement("div");
      divTitle.className = classes.wrapperIconTitle;

      if (story.isPremium) {
        premiumIcon = ecSvgIcon;
      }

      divTitle.innerHTML = premiumIcon + " " + story.title;
      title.appendChild(divTitle);

      container.appendChild(anchor);
    });
  };

  const getLastPublishedStories = async (source, query, arcSite, deployment) => {

    const currentTime = new Date().getTime();
    const fetchQuery = Object.assign(query, {
      size: 4
    });
    
    const url = `/pf/api/v3/content/fetch/${source}?query=${encodeURI(JSON.stringify(fetchQuery))}&d=${deployment}&_website=${arcSite}${deployment}&token=${currentTime}`;   
    
    try {      
      const response = await fetch(url);
      //console.log('RESPONSE:',response.status);
      //if (response.status === 200) {
        const data = await response.json();
        console.log(data);
      //}
    } catch (error) {
      console.log("Error", error);
    }
    return null;
  }

  const stories = getMostFrequentSectionStories();

  console.log('NRO DE NOTAS EN LS:', stories.length, storiesQty);

  await getLastPublishedStories(source, query, arcSite, deployment);

  lastStories = stories.length > 1 ? stories.slice(1, storiesQty + 1) : stories;

  renderStoriesSafe(lastStories, idJustSeenStories);
};
