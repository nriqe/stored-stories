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
};
