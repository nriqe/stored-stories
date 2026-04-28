const validateUser = () => {
  const userData = window.tp.pianoId.getUser() || {};
  const userToken = window?.tp?.pianoId?.getToken() || "";
  console.log("USER DATA DESDE JS EXTERNO: ", userData, userToken);
};
