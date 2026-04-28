const validateUser = () => {
  const userData = window.tp.pianoId.getUser() || {};
  console.log("USER DATA DESDE JS EXTERNO: ", userData);
};
