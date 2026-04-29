const getDeployment = () => {
    let deployment = null;
    if (typeof window !== "undefined") {
      const deploymentTag = document.querySelector('meta[name="deployment"]');
      deployment = deploymentTag ? deploymentTag.getAttribute("content") : "1";
      if (!deployment || deployment === "$LATEST") {
        return "2";
      }
      return deployment;
    }
    return "3";
  };

const deployment = getDeployment() ? `&d=${getDeployment()}` : "&d=1234";

console.log('DEPLOYMENT DESDE GHP', deployment)
