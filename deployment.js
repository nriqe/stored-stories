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

const deployment = getDeployment() ? `&d=${getDeployment()}` : "&d=1234";

console.log('DEPLOYMENT DESDE GHP', deployment)
